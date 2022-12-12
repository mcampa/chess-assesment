export const CHESS_BOARD = Object.freeze([
  ["BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR"],
  ["BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP"],
  ["WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR"],
]);

// Define constants for chess piece ranks
const KING = "K";
const QUEEN = "Q";
const BISHOP = "B";
const KNIGHT = "N";
const ROOK = "R";
const PAWN = "P";

type Board = string[][];
type Location = [number, number];
type Rank = "P" | "R" | "N" | "B" | "Q" | "K";
type Color = "W" | "B";

type Piece = {
  location: Location;
  isEmpty: boolean;
  color: Color;
  rank: Rank;
};

type Move = {
  origin: Location;
  destination: Location;
  capture: Rank;
};

export class GamePlay {
  board: Board = [];
  turn: Color;

  constructor(board: Board = null, turn: Color = "W") {
    // Create a copy of the CHESS_BOARD to use as the game board
    this.board = [...(board ?? CHESS_BOARD).map((row) => [...row])];
    this.turn = turn;
  }

  getBoard() {
    return [...this.board.map((row) => [...row])];
  }

  /**
   * Get information about the chess piece at a given location
   **/
  getPiece(location: Location): Piece {
    const [rIndex, cIndex] = location;

    if (rIndex < 0 || rIndex > 7) {
      return null;
    }

    if (cIndex < 0 || cIndex > 7) {
      return null;
    }

    const key = this.board[rIndex][cIndex];

    return {
      location: [rIndex, cIndex],
      isEmpty: key === "",
      color: key?.[0] as Color,
      rank: key?.[1] as Rank,
    };
  }

  /**
   * Get all possible moves for a piece at a given location
   */
  getPossibleMoves(piece: Piece): Move[] {
    if (!piece) {
      return;
    }

    // Depending on the piece, call the corresponding method to get its possible moves
    switch (piece.rank) {
      case PAWN:
        return this.getPawnPossibleMoves(piece);

      case KING:
      case QUEEN:
      case BISHOP:
      case KNIGHT:
      case ROOK:
      default:
        // Not implemented
        return [];
    }
  }

  movePiece(piece: Piece, destination: Location): Move {
    const { location: origin } = piece;
    const [rOriginIndex, cOriginIndex] = origin;
    const [rDestIndex, cDestIndex] = destination;

    // Make sure the piece has the turn
    if (piece.color !== this.turn) {
      return null;
    }

    // Check if it's a valid move looking at all possible moves
    const isValidMove = this.getPossibleMoves(piece).find(
      (move) =>
        rDestIndex === move.destination[0] && cDestIndex === move.destination[1]
    );
    if (!isValidMove) {
      return null;
    }

    const destPiece = this.getPiece(destination);

    this.board[rOriginIndex][cOriginIndex] = "";
    this.board[rDestIndex][cDestIndex] = `${piece.color}${piece.rank}`;
    this.turn = piece.color === "W" ? "B" : "W";

    return {
      origin,
      destination,
      capture: destPiece.rank,
    };
  }

  getPawnPossibleMoves(pawn: Piece): Move[] {
    const { color, location: origin } = pawn;
    const [rIndex, cIndex] = origin;

    const direction = color === "B" ? 1 : -1;
    const startRow = color === "B" ? 1 : 6;
    const oponentColor = color === "B" ? "W" : "B";

    let moves: Move[] = [];
    let destination: Location;

    // One step forward
    destination = [rIndex + direction, cIndex];
    if (this.getPiece(destination)?.isEmpty) {
      moves.push({ origin, destination, capture: null });
    }

    // If the pawn is in the initial positon check if it can move two steps forward
    if (startRow === rIndex && moves.length === 1) {
      destination = [rIndex + direction * 2, cIndex];
      if (this.getPiece(destination)?.isEmpty) {
        moves.push({ origin, destination, capture: null });
      }
    }

    // Check if the pawn can attack diagonally
    destination = [rIndex + direction, cIndex + 1];
    let oponent = this.getPiece(destination);
    if (oponent?.color === oponentColor) {
      moves.push({ origin, destination, capture: oponent.rank });
    }
    destination = [rIndex + direction, cIndex - 1];
    oponent = this.getPiece(destination);
    if (oponent?.color === oponentColor) {
      moves.push({ origin, destination, capture: oponent.rank });
    }

    return moves;
  }
}
