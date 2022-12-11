import { Model, Schema, model } from "mongoose";
import { GamePlay, CHESS_BOARD } from "./GamePlay";

interface IGame {
  board: string[][];
}

// Put all user instance methods in this interface:
interface IGameMethods {
  fullName(): string;
}

// Create a new Model type that knows about IGameMethods...
interface GameModel extends Model<IGame, {}, IGameMethods> {
  createNewGame(): number;
}

// And a schema that knows about IGameMethods
const schema = new Schema<IGame, GameModel, IGameMethods>({
  board: { type: [[String]], required: true },
});

schema.statics.createNewGame = () => {
  return Game.create({ board: CHESS_BOARD });
};

schema.methods.gamePlay = function (): GamePlay {
  return new GamePlay(this.board, this.turn);
};

export const Game = model<IGame, GameModel>("Game", schema);
