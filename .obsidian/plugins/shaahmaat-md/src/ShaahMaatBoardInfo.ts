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


    board: Chessboard;
    orientation: BoardOrientation;
    size: number;
    highlightedSquares: Square[];

    constructor(board: Chessboard, orientation: BoardOrientation, size:number, highlightedSquares: Square[]) {
        this.board = board;
        this.orientation = orientation;
        this.size = size;
        this.highlightedSquares = highlightedSquares;
    }



}