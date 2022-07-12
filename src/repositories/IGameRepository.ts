import { CreateGameRequest, IGame } from "../models/Game";

export interface IGameRepository {
  create(game: IGame): Promise<IGame>;
  findAll(): Promise<IGame[]>;
  findById(id: string): Promise<IGame>;
}
