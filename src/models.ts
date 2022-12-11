import { Model, Schema, HydratedDocument, model } from "mongoose";
import { GamePlay, CHESS_BOARD } from "./GamePlay";

// This code is an adaptation of this docs: https://mongoosejs.com/docs/typescript/statics-and-methods.html

interface IGame {
  board: string[][];
  turn: "W" | "B";
}

interface IGameMethods {
  gamePlay(): GamePlay;
}

interface GameModel extends Model<IGame, {}, IGameMethods> {
  createNewGame(): Promise<HydratedDocument<IGame, IGameMethods>>;
}

const schema = new Schema<IGame, GameModel, IGameMethods>(
  {
    board: { type: [[String]], required: true },
    turn: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

class GameClass {
  static createNewGame() {
    return Game.create({ board: CHESS_BOARD, turn: "W" });
  }

  gamePlay(this: IGame): GamePlay {
    return new GamePlay(this.board, this.turn);
  }
}
schema.loadClass(GameClass);

export const Game = model<IGame, GameModel>("Game", schema);
