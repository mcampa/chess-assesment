import express, { Request, Response, NextFunction } from "express";
import { Game } from "./models";
import { CHESS_BOARD } from "./GamePlay";
import { positionToLocation } from "./helpers";

export const Api = express.Router();

class GameNotFound extends Error {}
class InvalidMove extends Error {}
class NotImplemented extends Error {}

/**
 * Creates a new chess game
 */
Api.post("/games", async (req, res, next) => {
  try {
    const model = await Game.createNewGame();
    res.json(model);
  } catch (error) {
    next(error);
  }
});

/**
 * Fetches a game’s current state
 */
Api.get("/games/:gameId", async (req, res, next) => {
  const model = await Game.findById(req.params.gameId);
  if (!model) {
    return next(new GameNotFound());
  }
  res.json(model);
});

/**
 * Fetch potential, valid spaces to which a piece could move from its current position
 */
Api.get("/games/:gameId/moves/:position", async (req, res, next) => {
  const model = await Game.findById(req.params.gameId);
  if (!model) {
    return next(new GameNotFound());
  }

  const location = positionToLocation(req.params.position);
  if (!location) {
    return next(new InvalidMove());
  }

  const gamePlay = model.gamePlay();
  const piece = gamePlay.getPiece(location);
  const possibleMoves = gamePlay.getPossibleMoves(piece);

  res.json({ possibleMoves });
});

/**
 * Update the game-state with a new move
 */
Api.post("/games/:gameId/moves", async (req, res, next) => {
  const model = await Game.findById(req.params.gameId);
  if (!model) {
    return next(new GameNotFound());
  }

  const gamePlay = model.gamePlay();

  // convert input positions strings to coordinates
  const origin = positionToLocation(req.body.origin);
  const destination = positionToLocation(req.body.destination);
  if (!origin || !destination) {
    return next(new InvalidMove());
  }

  // get the piease in the origin position
  const piece = gamePlay.getPiece(origin);
  if (!piece) {
    return next(new InvalidMove());
  }

  // Move the piece in the board
  const validMove = gamePlay.movePiece(piece, destination);
  if (!validMove) {
    return next(new InvalidMove());
  }

  // Update the model and save changes to the DB
  model.board = gamePlay.getBoard();
  model.turn = gamePlay.turn;
  await model.save();

  res.json(model);
});

/**
 * Fetch the history of all moves in a game
 * (NOT IMPLEMENTED)
 */
Api.get("/games/:gameId/history", (req, res) => {
  res.json({ history: [] });
});

Api.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof GameNotFound) {
    return res.status(404).json({ eror: "Game not found." });
  }
  if (error instanceof InvalidMove) {
    return res.status(400).json({ eror: "Invalid move." });
  }
  if (error instanceof NotImplemented) {
    return res.status(501).json({ eror: "Not implemented." });
  }
  console.error(error.stack);
  res.status(500).send({ error: "Something broke!" });
});
