export interface IGame {
  gameID: string;
  name: string;
  note: number;
  category: string;
}

export type CreateGameRequest = Omit<IGame, "gameID">;
