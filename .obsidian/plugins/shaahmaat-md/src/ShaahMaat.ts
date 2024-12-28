import { Chess, Color, PAWN, PieceSymbol, Square } from 'chess.js';

import { App } from 'obsidian';

import { BoardOrientation, Chessboard, ShaahMaatBoardInfo } from './ShaahMaatBoardInfo';

export const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ROWS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export default class ShaahMaat {

    app: App;

    lightSquareColor: string;
    darkSquareColor: string;
    highlightedSquareColor: string;
    chessSet: string;

    pieces: Map<string, string>;

    constructor(app: App, lightSquareColor: string, darkSquareColor: string, highlightedSquareColor: string, chessSet: string) {
        this.app = app;

        this.lightSquareColor = lightSquareColor;
        this.darkSquareColor = darkSquareColor;
        this.highlightedSquareColor = highlightedSquareColor;
        this.chessSet = chessSet;

        this.pieces = new Map();
    }

    public createChessBoardEl(boardInfo: ShaahMaatBoardInfo, size: number = 256): HTMLDivElement {

        let squareSide = size / 8;

        let board = boardInfo.board;

        // Generate the board
        let chessboardDiv = createDiv({ cls: "shaahmaat-chessboard", attr: { "style": `width: ${size}px; height: ${size}px;` } });

        for (let i = 0; i < 8; ++i) {

            let row = chessboardDiv.createDiv({ cls: "shaahmaat-chessboard-row" });

            for (let j = 0; j < 8; ++j) {
                // Generate the board
                let backgroundColor = (i + j) % 2 == 0 ? this.lightSquareColor : this.darkSquareColor;

                let columnCoord = boardInfo.orientation === BoardOrientation.Black ? COLUMNS[7 - j] : COLUMNS[j];
                let rowCoord = boardInfo.orientation === BoardOrientation.Black ? ROWS[i] : ROWS[7 - i];

                let square = row.createDiv(
                {
                    cls: "shaahmaat-chessboard-square",
                    attr: {
                        "data-square-coordinates": `${columnCoord}${rowCoord}`
                    }
                });

                // Check if the square is highlighted
                let isSquareHighlighted = false;
                for (let sq of boardInfo.highlightedSquares) {
                    if(sq.charAt(0) === columnCoord && sq.charAt(1) == rowCoord) {
                        isSquareHighlighted = true;
                        break;
                    }
                }

                square.style.setProperty("--square-background-color", isSquareHighlighted ? this.highlightedSquareColor : backgroundColor);

                // Place the pieces

                if (board === null || board[i][j] === null) {
                    continue; // Skip the piece placement if the board contains no pieces or the current square is empty.
                }

                let color = board[i][j].color === 'w' ? "white" : "black";
                let piece = "";

                switch (board[i][j].type) {
                    case 'b': {
                        piece = "bishop";
                        break;
                    }
                    case 'k': {
                        piece = "king";
                        break;
                    }
                    case 'n': {
                        piece = "knight";
                        break;
                    }
                    case 'p': {
                        piece = "pawn";
                        break;
                    }
                    case 'q': {
                        piece = "queen";
                        break;
                    }
                    case 'r': {
                        piece = "rook";
                        break;
                    }
                }

                if (board[i][j] !== null) {
                    square.addClass("shaahmaat-chess-piece");
                    square.addClass(`${this.chessSet}-chess-set`);
                    square.addClass(piece);
                    square.addClass(color);
                }
            }

        }

        return chessboardDiv;
    }

    public renderError(err: Error): HTMLElement {
        return createEl('p', { cls: "shaahmaat-error", text: `Error: ${err.stack} ${err.message}` });
    }
}