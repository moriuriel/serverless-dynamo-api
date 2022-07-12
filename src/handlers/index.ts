import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 } from "uuid";
import { handleError, HttpError } from "../errors";
import { CreateGameRequest, IGame } from "../models/Game";
import { GameRepository } from "../repositories/Game.repository";
import { CreateGameService, FindAllGamesService, FindGameByIdService } from "../services";

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "games";

export const listAllGames = async (): Promise<APIGatewayProxyResult> => {
  const gameRepository = new GameRepository();

  const findAllGameService = new FindAllGamesService(gameRepository);

  const games = await findAllGameService.execute();

  return {
    statusCode: 200,
    body: JSON.stringify({ games }),
  };
};

export const createGame = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body as string);

    const data: CreateGameRequest = { ...body, gameID: v4() };

    const gameRepository = new GameRepository();

    const createGameService = new CreateGameService(gameRepository);

    const game = await createGameService.execute(data);

    return {
      statusCode: 201,
      body: JSON.stringify(game),
    };
  } catch (e) {
    return handleError(e);
  }
};

export const listGameById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;

    const gameRepository = new GameRepository();

    const findGameByIdService = new FindGameByIdService(gameRepository);

    const game = await findGameByIdService.execute(id);
    return {
      statusCode: 200,

      body: JSON.stringify(game),
    };
  } catch (e) {
    return handleError(e);
  }
};
