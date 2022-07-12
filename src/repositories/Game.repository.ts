import { DynamoDB } from "aws-sdk";
import { DynamoClient } from "../database/dynamo.client";
import { HttpError } from "../errors";
import { IGame } from "../models/Game";
import { IGameRepository } from "./IGameRepository";

export class GameRepository implements IGameRepository {
  private readonly conn: DynamoDB.DocumentClient = {} as DynamoDB.DocumentClient;
  private readonly tableName = "games";
  constructor() {
    this.conn = DynamoClient.getInstance();
  }

  async create(game: IGame): Promise<IGame> {
    await this.conn.put({ TableName: this.tableName, Item: game }).promise();

    return game;
  }

  async findAll(): Promise<IGame[]> {
    const outPut = await this.conn.scan({ TableName: this.tableName }).promise();

    return outPut.Items as IGame[];
  }

  async findById(id: string): Promise<IGame> {
    const output = await this.conn
      .get({
        TableName: this.tableName,
        Key: {
          gameID: id,
        },
      })
      .promise();

    if (!output.Item) {
      throw new HttpError(404, { error: "not found" });
    }

    return output.Item as IGame;
  }
}
