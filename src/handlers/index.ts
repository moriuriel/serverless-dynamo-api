import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 } from "uuid";

interface IGame {
  gameID: string;
  name: string;
  note: number;
  category: string;
}

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "games";

const headers = {
  "content-type": "application/json",
};
export const listAllGames = async (): Promise<APIGatewayProxyResult> => {
  const response = await docClient.scan({ TableName: tableName }).promise();

  const games = response.Items as IGame[];

  return {
    statusCode: 200,
    body: JSON.stringify({ games }),
  };
};

export const createGame = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body as string);

  const game = { ...body, gameID: v4() };

  await docClient.put({ TableName: tableName, Item: game }).promise();

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(game),
  };
};

class HttpError extends Error {
  constructor(public statusCode: number, body: Record<string, unknown> = {}) {
    super(JSON.stringify(body));
  }
}

const fetchGameById = async (id: string) => {
  const output = await docClient
    .get({
      TableName: tableName,
      Key: {
        gameID: id,
      },
    })
    .promise();

  if (!output.Item) {
    throw new HttpError(404, { error: "not found" });
  }

  return output.Item;
};

export const listGameById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const product = await fetchGameById(event.pathParameters?.id as string);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return handleError(e);
  }
};

const handleError = (e: unknown) => {
  if (e instanceof SyntaxError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `invalid request body format : "${e.message}"` }),
    };
  }

  if (e instanceof HttpError) {
    return {
      statusCode: e.statusCode,
      headers,
      body: e.message,
    };
  }

  throw e;
};
