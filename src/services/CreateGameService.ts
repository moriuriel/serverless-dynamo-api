import { v4 } from "uuid";
import { CreateGameRequest, IGame } from "../models/Game";
import { IGameRepository } from "../repositories/IGameRepository";

export class CreateGameService {
  private readonly gameRepository: IGameRepository;

  constructor(gameRepository: IGameRepository) {
    this.gameRepository = gameRepository;
  }

  public async execute({ category, name, note }: CreateGameRequest): Promise<IGame> {
    const game = { category, name, note, gameID: v4() };

    return this.gameRepository.create(game);
  }
}
