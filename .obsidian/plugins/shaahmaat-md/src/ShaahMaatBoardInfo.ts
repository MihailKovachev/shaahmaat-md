import { Color, PieceSymbol, Square } from "chess.js";

export type Chessboard = {
    square: Square;
    type: PieceSymbol;
    color: Color;
}[][] | null;

export type Annotation = { from: Square, to: Square };

export enum BoardOrientation {
    Black,
    White
}

export class ShaahMaatBoardInfo {


    board: Chessboard;
    orientation: BoardOrientation;
    size: number;
    highlightedSquares: Square[];
    annotations: Annotation[];

    constructor(board: Chessboard, orientation: BoardOrientation, size: number, highlightedSquares: Square[], annotations: Annotation[]) {
        this.board = board;
        this.orientation = orientation;
        this.size = size;
        this.highlightedSquares = highlightedSquares;
        this.annotations = annotations;
    }

}