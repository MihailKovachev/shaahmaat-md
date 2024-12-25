export class ShaahMaatHeader {
    name: string;
    val: string;

    constructor(name: string, val: string) {
        this.name = name;
        this.val = val;
    }
}

export class ParsedShaahMaat {

    headers: ShaahMaatHeader[];
    gameNotation: string;

    constructor(headers: ShaahMaatHeader[], gameNotation: string) {
        this.headers = headers;
        this.gameNotation = gameNotation;
    }
}

export class ShaahMaatParser {

    public static parseShaahMaat(source: string): ParsedShaahMaat {
        let lines = source.split('\n');

        let headers: ShaahMaatHeader[] = new Array<ShaahMaatHeader>();
        let gameNotation = "";
        let formatFound = false;
        let orientationFound = false;

        let firstHeaderFound = false;

        for (let i = 0; i < lines.length; ++i) {

            if (lines[i] !== "") {
                firstHeaderFound = true;
                headers.push(this.parseHeader(lines[i]));

                let lastHeaderIndex = headers.length - 1;

                // Check if the headers are correct
                if (headers[lastHeaderIndex].name === "orientation") {
                    if (orientationFound) {
                        throw new Error("Only one orientation header is allowed!");
                    }

                    if (headers[lastHeaderIndex].val !== "white" && headers[lastHeaderIndex].val !== "black") {
                        throw new Error("Invalid orientation. Expected white or black!");
                    }

                    orientationFound = true;
                }

                if (headers[headers.length - 1].name === "format") {
                    if (formatFound) {
                        throw new Error("Only one format header is allowed!");
                    }

                    if (headers[lastHeaderIndex].val !== "fen" && headers[lastHeaderIndex].val !== "pgn") {
                        throw new Error("Invalid format. Expected fen or pgn!");
                    }

                    formatFound = true;
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

        if (!orientationFound) {
            throw new Error("Missing orientation header!");
        }

        if (!formatFound) {
            throw new Error("Missing format header!");
        }

        return new ParsedShaahMaat(headers, gameNotation);
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