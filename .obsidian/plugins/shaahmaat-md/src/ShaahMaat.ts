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

    public createChessBoardEl(boardInfo: ShaahMaatBoardInfo): HTMLDivElement {

        let squareSide = boardInfo.size / 8;

        let board = boardInfo.board;

        // Generate the board
        let chessboardDiv = createDiv({ cls: "shaahmaat-chessboard", attr: { "style": `width: ${boardInfo.size}px; height: ${boardInfo.size}px;` } });

        let squaresWithPieces = new Array<{ row: number, column: number }>();

        for (let i = 0; i < 8; ++i) {

            let row = chessboardDiv.createDiv({ cls: "shaahmaat-chessboard-row" });

            // Generate the board
            for (let j = 0; j < 8; ++j) {

                let backgroundColor = (i + j) % 2 == 0 ? this.lightSquareColor : this.darkSquareColor;

                let columnCoord = boardInfo.orientation === BoardOrientation.White ? COLUMNS[j] : COLUMNS[7 - j];
                let rowCoord = boardInfo.orientation === BoardOrientation.White ? ROWS[7 - i] : ROWS[i];

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
                    if (sq.charAt(0) === columnCoord && sq.charAt(1) == rowCoord) {
                        isSquareHighlighted = true;
                        break;
                    }
                }

                square.style.setProperty("--square-background-color", isSquareHighlighted ? this.highlightedSquareColor : backgroundColor);

                if (board !== null && board[i][j] !== null) {
                    squaresWithPieces.push({ row: i, column: j });
                }
            }
        }

        // No need to render pieces if the board does not have any
        if (board === null) {
            return chessboardDiv;
        }

        // Render the pieces
        for (let squareIndices of squaresWithPieces) {
            let color = board[squareIndices.row][squareIndices.column].color === 'w' ? "white" : "black";
            let piece = "";

            switch (board[squareIndices.row][squareIndices.column].type) {
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

            let square = chessboardDiv.querySelector("[data-square-coordinates='" + board[squareIndices.row][squareIndices.column].square + "'");

            square!.addClass("shaahmaat-chess-piece");
            square!.addClass(`${this.chessSet}-chess-set`);
            square!.addClass(piece);
            square!.addClass(color);
        }

        return chessboardDiv;
    }

    public renderError(err: Error): HTMLElement {
        return createEl('p', { cls: "shaahmaat-error", text: `Error: ${err.stack} ${err.message}` });
    }
}