import { CreateGameRequest, IGame } from "../models/Game";
import { IGameRepository } from "../repositories/IGameRepository";

export class FindAllGamesService {
  private readonly gameRepository: IGameRepository;

  constructor(gameRepository: IGameRepository) {
    this.gameRepository = gameRepository;
  }

  public async execute(): Promise<IGame[]> {
    return this.gameRepository.findAll();
  }
}
