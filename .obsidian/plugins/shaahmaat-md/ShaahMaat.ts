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

    pieces: Map<string, string>;

    constructor(app: App, lightSquareColor: string, darkSquareColor: string) {
        this.app = app;

        this.lightSquareColor = lightSquareColor;
        this.darkSquareColor = darkSquareColor;

        this.pieces = new Map();
    }

    public async init(chessSet: string) {

        let chessSetFolder = (this.app.vault.configDir.normalize() + '/plugins/shaahmaat-md/res/chess_sets/' + chessSet + '/').normalize();

        this.pieces.set("king_light", (await this.app.vault.adapter.read(chessSetFolder + 'king_light.svg')));
        this.pieces.set("king_dark", (await this.app.vault.adapter.read(chessSetFolder + 'king_dark.svg')));

        this.pieces.set("queen_light", (await this.app.vault.adapter.read(chessSetFolder + 'queen_light.svg')));
        this.pieces.set("queen_dark", (await this.app.vault.adapter.read(chessSetFolder + 'queen_dark.svg')));

        this.pieces.set("bishop_light", (await this.app.vault.adapter.read(chessSetFolder + 'bishop_light.svg')));
        this.pieces.set("bishop_dark", (await this.app.vault.adapter.read(chessSetFolder + 'bishop_dark.svg')));

        this.pieces.set("knight_light", (await this.app.vault.adapter.read(chessSetFolder + 'knight_light.svg')));
        this.pieces.set("knight_dark", (await this.app.vault.adapter.read(chessSetFolder + 'knight_dark.svg')));

        this.pieces.set("rook_light", (await this.app.vault.adapter.read(chessSetFolder + 'rook_light.svg')));
        this.pieces.set("rook_dark", (await this.app.vault.adapter.read(chessSetFolder + 'rook_dark.svg')));

        this.pieces.set("pawn_light", (await this.app.vault.adapter.read(chessSetFolder + 'pawn_light.svg')))
        this.pieces.set("pawn_dark", (await this.app.vault.adapter.read(chessSetFolder + 'pawn_dark.svg')));

    }

    public emptyBoard(orientation: BoardOrientation = BoardOrientation.White, size: number = 256): HTMLDivElement {

        let squareSide = size / 8;

        let chessboardDiv = createDiv({ cls: 'shaahmaat-chessboard', attr: { "style": "width: " + size + "px; height: " + size + "px;" } });

        for (let i = 0; i < 8; ++i) {

            let row = chessboardDiv.createDiv({ cls: 'shaahmaat-chessboard-row' });

            for (let j = 0; j < 8; ++j) {

                let backgroundColor = (i + j) % 2 == 0 ? this.lightSquareColor : this.darkSquareColor;
                let columnCoord = orientation === BoardOrientation.Black ? COLUMNS[7 - j] : COLUMNS[j];
                let rowCoord = orientation === BoardOrientation.Black ? ROWS[i] : ROWS[7 - i];

                row.createDiv(
                    {
                        cls: 'shaahmaat-chessboard-square',
                        attr: {
                            "style": "background-color:" + backgroundColor,
                            "data-square-coordinates": columnCoord + rowCoord,
                        }
                    });
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

                let color = position[i][j]?.color === 'w' ? "light" : "dark";
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

                        let squares = rows[8 - parseInt(row!)].getElementsByClassName('shaahmaat-chessboard-square');
                        for (let k = 0; k < squares.length; ++k) {
                            if (squares[k].getAttribute('data-square-coordinates') === position[i][j]?.square) {
                                let pieceSvg = this.pieces.get(piece + "_" + color);

                                let svgEl = domParser.parseFromString(pieceSvg!, "image/svg+xml").documentElement;
                                svgEl.setAttribute("width", "100%");
                                svgEl.setAttribute("height", "100%");
                                svgEl.setAttribute("viewBox", "0 0 45 45");

                                squares[k].appendChild(svgEl);
                            }
                        }

                        break;
                    }

                    case BoardOrientation.Black: {

                        let squares = rows[parseInt(row!) - 1].getElementsByClassName('shaahmaat-chessboard-square');
                        for (let k = 0; k < squares.length; ++k) {
                            if (squares[k].getAttribute('data-square-coordinates') === position[i][j]?.square) {
                                let pieceSvg = this.pieces.get(piece + "_" + color);

                                let svgEl = domParser.parseFromString(pieceSvg!, "image/svg+xml").documentElement;
                                svgEl.setAttribute("width", "100%");
                                svgEl.setAttribute("height", "100%");
                                svgEl.setAttribute("viewBox", "0 0 45 45");

                                squares[k].appendChild(svgEl);
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