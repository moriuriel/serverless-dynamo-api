import { IGame } from "../models/Game";
import { IGameRepository } from "../repositories/IGameRepository";

export class FindGameByIdService {
  private readonly gameRepository: IGameRepository;

  constructor(gameRepository: IGameRepository) {
    this.gameRepository = gameRepository;
  }

  public async execute(id: string): Promise<IGame> {
    return this.gameRepository.findById(id);
  }
}
