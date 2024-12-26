import { Chess, Square } from "chess.js";
import { BoardOrientation, Chessboard, ShaahMaatBoardInfo } from "./ShaahMaatBoardInfo";
import { COLUMNS, ROWS } from "./ShaahMaat";

export class ShaahMaatHeader {
    name: string;
    val: string;

    constructor(name: string, val: string) {
        this.name = name;
        this.val = val;
    }
}

export class ParsedShaahMaat {
    orientation: BoardOrientation;
    format: string;
    gameNotation: string;

    constructor(orientation: BoardOrientation, format: string, gameNotation: string) {
        this.orientation = orientation;
        this.format = format;
        this.gameNotation = gameNotation;
    }
}

export class ShaahMaatParser {

    public static parseShaahMaat(source: string): ShaahMaatBoardInfo {
        let lines = source.split('\n');
        let gameNotation = "";

        let board = undefined;
        let orientation = undefined;
        let highlightedSquares = new Array<Square>();
        let format = undefined;

        let firstHeaderFound = false;

        for (let i = 0; i < lines.length; ++i) {

            if (lines[i] !== "") {
                firstHeaderFound = true;
                let header = this.parseHeader(lines[i]);

                // Check if the headers are correct
                if (header.name === "orientation") {
                    if (orientation !== undefined) {
                        throw new Error("Only one orientation header is allowed!");
                    }

                    switch (header.val) {
                        case "white": {
                            orientation = BoardOrientation.White;
                            break;
                        }
                        case "black": {
                            orientation = BoardOrientation.Black;
                            break;
                        }
                        default:
                            throw new Error("Invalid orientation. Expected white or black!");
                    }
                }

                if (header.name === "format") {
                    if (format !== undefined) {
                        throw new Error("Only one format header is allowed!");
                    }

                    if (header.val !== "fen" && header.val !== "pgn") {
                        throw new Error("Invalid format. Expected fen or pgn!");
                    }

                    format = header.val;
                }

                if (header.name === "highlight") {
                    if (highlightedSquares.length > 0) {
                        throw new Error("Only one highlight header is allowed!");
                    }

                    let squares = header.val.trim().split(' ');

                    for (let square of squares) {
                        if (square.length !== 2 || !COLUMNS.contains(square.charAt(0)) || !ROWS.contains(square.charAt(1)))
                        {
                            throw new Error("Invalid hightlight header!");
                        }

                        highlightedSquares.push(square  as Square);
                    }
                }
            }

            // We have found the line which separates headers from notation
            if (firstHeaderFound && lines[i] === "") {
                for (let j = i + 1; j < lines.length; ++j) {
                    gameNotation += lines[j] + "\n";
                }
                gameNotation = gameNotation.substring(0, gameNotation.length - 1); // Remove the trailing new line because it breaks the chessjs parser
                break;
            }
        }

        if (orientation === undefined) {
            throw new Error("Missing orientation header!");
        }

        let chess = new Chess();
        if(format === "fen") {
            chess.load(gameNotation);
        }
        else if(format === "pgn"){
            chess.loadPgn(gameNotation);
        }
        else if (format === undefined) {
            throw new Error("Missing format header!");
        }

        board = chess.board()!;

        return new ShaahMaatBoardInfo(board as Chessboard, orientation, highlightedSquares);
    }

    public static parseHeader(header: string): ShaahMaatHeader {

        let delimiterPosition = header.indexOf(':');

        if (delimiterPosition === -1) {
            throw new Error("Invalid ShaahMaat header");
        }

        // The delimiter cannot be at the first position, since the header won't have a name.
        if (delimiterPosition === 0) {
            throw new Error("ShaahMaat header must have a name");
        }
        // The delimiter cannot be at the last position, since the header won't have a value. 
        if (delimiterPosition === header.length - 1) {
            throw new Error("ShaahMaat header must have a value");
        }

        return new ShaahMaatHeader(header.substring(0, delimiterPosition).trim(), header.substring(delimiterPosition + 1).trim());
    }
}