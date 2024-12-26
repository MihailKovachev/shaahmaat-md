import { Color, PieceSymbol, Square } from "chess.js";

export type Chessboard = {
    square: Square;
    type: PieceSymbol;
    color: Color;
}[][] | null;

export enum BoardOrientation {
    Black,
    White
}

export class ShaahMaatBoardInfo {

    orientation: BoardOrientation;
    highlightedSquares: Square[];

    board: Chessboard;

    constructor(board: Chessboard, orientation: BoardOrientation, highlightedSquares: Square[]) {
        this.board = board;
        this.orientation = orientation;
        this.highlightedSquares = highlightedSquares;
    }



}