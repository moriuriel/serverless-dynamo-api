import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 } from "uuid";
import { handleError, HttpError } from "../errors";
import { CreateGameRequest, IGame } from "../models/Game";
import { GameRepository } from "../repositories/Game.repository";
import { CreateGameService } from "../services/CreateGameService";

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "games";

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

  const data: CreateGameRequest = { ...body, gameID: v4() };

  const gameRepository = new GameRepository();

  const createGameService = new CreateGameService(gameRepository);

  const game = await createGameService.execute(data);

  return {
    statusCode: 201,
    body: JSON.stringify(game),
  };
};

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

      body: JSON.stringify(product),
    };
  } catch (e) {
    return handleError(e);
  }
};
