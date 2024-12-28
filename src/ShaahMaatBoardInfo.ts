import { Color, PieceSymbol, Square } from "chess.js";

export type Chessboard = {
    square: Square;
    type: PieceSymbol;
    color: Color;
}[][] | null;

export type Arrow = { from: Square, to: Square };

export enum BoardOrientation {
    Black,
    White
}

export class ShaahMaatBoardInfo {


    board: Chessboard;
    orientation: BoardOrientation;
    size: number;
    highlightedSquares: Square[];
    arrows: Arrow[];

    constructor(board: Chessboard, orientation: BoardOrientation, size: number, highlightedSquares: Square[], arrows: Arrow[]) {
        this.board = board;
        this.orientation = orientation;
        this.size = size;
        this.highlightedSquares = highlightedSquares;
        this.arrows = arrows;
    }

}