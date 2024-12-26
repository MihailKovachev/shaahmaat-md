import { Chess, Color, PAWN, PieceSymbol, Square } from 'chess.js';

import { App } from 'obsidian';

export enum BoardOrientation {
    Black,
    White
}

const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ROWS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export default class ShaahMaat {

    app: App;

    lightSquareColor: string;
    darkSquareColor: string;
    chessSet: string;

    pieces: Map<string, string>;

    constructor(app: App, lightSquareColor: string, darkSquareColor: string, chessSet: string) {
        this.app = app;

        this.lightSquareColor = lightSquareColor;
        this.darkSquareColor = darkSquareColor;
        this.chessSet = chessSet;

        this.pieces = new Map();
    }

    public emptyBoard(orientation: BoardOrientation = BoardOrientation.White, size: number = 256): HTMLDivElement {

        let squareSide = size / 8;

        let chessboardDiv = createDiv({ cls: "shaahmaat-chessboard", attr: { "style": "width: " + size + "px; height: " + size + "px;" } });

        for (let i = 0; i < 8; ++i) {

            let row = chessboardDiv.createDiv({ cls: "shaahmaat-chessboard-row" });

            for (let j = 0; j < 8; ++j) {

                let backgroundColor = (i + j) % 2 == 0 ? this.lightSquareColor : this.darkSquareColor;
                let columnCoord = orientation === BoardOrientation.Black ? COLUMNS[7 - j] : COLUMNS[j];
                let rowCoord = orientation === BoardOrientation.Black ? ROWS[i] : ROWS[7 - i];

                let square = row.createDiv(
                    {
                        cls: "shaahmaat-chessboard-square",
                        attr: {
                            "data-square-coordinates": columnCoord + rowCoord,
                        }
                    });
                    
                square.style.setProperty("--square-background-color", backgroundColor);
            }
        }

        return chessboardDiv;
    }

    public boardWithPosition(position: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][], orientation = BoardOrientation.White, size: number = 256): HTMLDivElement {
        let chessboard = this.emptyBoard(orientation, size);

        if (position === null) {
            return chessboard;
        }

        let domParser = new DOMParser();

        let rows = chessboard.getElementsByClassName('shaahmaat-chessboard-row');

        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                if (position[i][j] === null) {
                    continue;
                }
                let column = position[i][j]?.square.charAt(0);
                let row = position[i][j]?.square.charAt(1);

                let color = position[i][j]?.color === 'w' ? "white" : "black";
                let piece = "";

                switch (position[i][j]?.type) {
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

                switch (orientation) {
                    case BoardOrientation.White: {

                        let squares = rows[8 - parseInt(row!)].getElementsByClassName("shaahmaat-chessboard-square");
                        for (let k = 0; k < squares.length; ++k) {
                            if (squares[k].getAttribute('data-square-coordinates') === position[i][j]?.square) {
                                squares[k].addClass("shaahmaat-chess-piece");
                                squares[k].addClass(this.chessSet + "-chess-set");
                                squares[k].addClass(piece);
                                squares[k].addClass(color);
                            }
                        }

                        break;
                    }

                    case BoardOrientation.Black: {

                        let squares = rows[parseInt(row!) - 1].getElementsByClassName('shaahmaat-chessboard-square');
                        for (let k = 0; k < squares.length; ++k) {
                            if (squares[k].getAttribute('data-square-coordinates') === position[i][j]?.square) {
                                squares[k].addClass("shaahmaat-chess-piece");
                                squares[k].addClass(this.chessSet + "-chess-set");
                                squares[k].addClass(piece);
                                squares[k].addClass(color);
                            }
                        }

                        break;
                    }
                }
            }
        }
        return chessboard;
    }

    public renderError(err: Error): HTMLElement {
        return createEl('p', { cls: "shaahmaat-error", text: "Error: " + err.stack + " " + err.message });
    }
}