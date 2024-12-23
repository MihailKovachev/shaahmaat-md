import { Element, Svg, SVG } from '@svgdotjs/svg.js'
import { Chess, PAWN } from 'chess.js';

import { App } from 'obsidian';

export default class Renderer {
    app: App;

    lightSquareColor: string;
    darkSquareColor: string;

    kingLight: Element;
    kingDark: Element;

    queenLight: Element;
    queenDark: Element;

    bishopLight: Element;
    bishopDark: Element;

    knightLight: Element;
    knightDark: Element;

    rookLight: Element;
    rookDark: Element;

    pawnLight: Element;
    pawnDark: Element;

    constructor(app: App, lightSquareColor: string, darkSquareColor: string) {
        this.app = app;
        this.lightSquareColor = lightSquareColor;
        this.darkSquareColor = darkSquareColor;
    }

    public async init(chessSet: string) {

        let chessSetFolder = (this.app.vault.configDir.normalize() + '/plugins/shaahmaat-md/res/chess_sets/' + chessSet + '/').normalize();

        this.kingLight = SVG((await this.app.vault.adapter.read(chessSetFolder + 'king_light.svg')));
        this.kingDark = SVG((await this.app.vault.adapter.read(chessSetFolder + 'king_dark.svg')));

        this.queenLight = SVG((await this.app.vault.adapter.read(chessSetFolder + 'queen_light.svg')));
        this.queenDark = SVG((await this.app.vault.adapter.read(chessSetFolder + 'queen_dark.svg')));

        this.bishopLight = SVG((await this.app.vault.adapter.read(chessSetFolder + 'bishop_light.svg')));
        this.bishopDark = SVG((await this.app.vault.adapter.read(chessSetFolder + 'bishop_dark.svg')));

        this.knightLight = SVG((await this.app.vault.adapter.read(chessSetFolder + 'knight_light.svg')));
        this.knightDark = SVG((await this.app.vault.adapter.read(chessSetFolder + 'knight_dark.svg')));

        this.rookLight = SVG((await this.app.vault.adapter.read(chessSetFolder + 'rook_light.svg')));
        this.rookDark = SVG((await this.app.vault.adapter.read(chessSetFolder + 'rook_dark.svg')));

        this.pawnLight = SVG((await this.app.vault.adapter.read(chessSetFolder + 'rook_light.svg')));
        this.pawnDark = SVG((await this.app.vault.adapter.read(chessSetFolder + 'rook_dark.svg')));

    }

    /**
     * Constructs an SVG image of a chess board.
     * @param {number} size - the length (in pixels) of the board's side.
     * @param {string} lightSquareColor - the colour (in hex format '#rrggbb') used for light squares.
     * @param {string} darkSquareColor - the colour (in hex format '#rrggbb') used for dark squares.
     */
    public emptyBoard(size: number = 256): HTMLDivElement {

        let squareSide = size / 8;

        let chessboardDiv = createDiv({ cls: 'shaahmaat-chessboard-div', attr: {"style": "width: " + size + "px; height: " + size + "px;"} });
        let chessboardTable = chessboardDiv.createEl('table', { cls: 'shaahmaat-chessboard-table' })

        for (let i = 0; i < 8; ++i) {

            let row = chessboardTable.createEl('tr', { cls: 'shaahmaat-chessboard-row' });

            for (let j = 0; j < 8; ++j) {

                if ((i + j) % 2 == 0) {
                    row.createEl('td', { cls: 'shaahmaat-chessboard-square', attr: { "style": "background-color:" + this.lightSquareColor } });
                }
                else {
                    row.createEl('td', { cls: 'shaahmaat-chessboard-square', attr: { "style": "background-color:" + this.darkSquareColor } });
                }
            }
        }

        return chessboardDiv;
    }


}