# ShaahMaat-md

An [Obsidian](https://obsidian.md/) plugin for rendering chess positions inside your notes.

## Features
- Supports board flipping.
- Supports both [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) and [PGN](https://en.wikipedia.org/wiki/Portable_Game_Notation).
- Supports square highlighting in order to underline key squares in a given position.

![](res/Square%20Highlighting.png)

- Supports arrows in order to visualise the main ideas in a given position.

![](res/Arrow%20Annotations.png)

- High customisability - set custom colours for squares, highlights and arrows and add your own chess sets. You can also set the size of each board individually.

## Installation

Install the plugin via the community plugins tab in Obsidian.

## Usage

To render a chess position using ShaahMaat, you need to create a code block with the language `shaahmaat` in accordance with the following syntax:

~~~
```shaahmaat
headers

position
```
~~~

The code block has to contain two sections separated by a single empty line. 

The `headers` section contains information about how to render the position. Each header is placed on its own line and has the format `name:value`. There should be no empty lines between headers, though. The `orientation` and `format` headers must always be present. The order of the headers is irrelevant, but at most one instance of each header may be present.

The `position` section contains either the FEN or the PGN of the chess position you want to display, depending on what format you specify in the `format` header.

### Board Orientation

The orientation of the board is controlled via the `orientation` header. If set to `white`, the board will be displayed as seen from the perspective of the player who is playing with the white pieces. If set to `black`, the board will be displayed as seen from the perspective of the player who is playing with the black pieces.

~~~
```shaahmaat
format: fen
orientation: white

rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2
```
~~~

![](res/Fool's%20Mate%20from%20White's%20Perspective.png)

~~~
```shaahmaat
format: fen
orientation: black

rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2
```
~~~

![](res/Fool's%20Mate%20from%20Black's%20Perspective.png)

### Format

The plugin supports both both [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) and [PGN](https://en.wikipedia.org/wiki/Portable_Game_Notation). To specify the correct format, set the `format` header to either `fen` or `pgn`. Then, after the last header, put a single empty line and then place the notation for your position.

~~~
```shaahmaat
orientation: white
format: fen

rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2
```
~~~

![](res/Fool's%20Mate%20from%20White's%20Perspective.png)

If using FEN, you should *not* place any empty lines after the notation for the position.

~~~
```shaahmaat
format: pgn
orientation: white

[Event "F/S Return Match"]
[Site "Belgrade, Serbia JUG"]
[Date "1992.11.04"]
[Round "29"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1/2-1/2"]

1.e4 e5 2.Nf3 Nc6 3.Bb5 {This opening is called the Ruy Lopez.} 3...a6
4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7
11.c4 c6 12.cxb5 axb5 13.Nc3 Bb7 14.Bg5 b4 15.Nb1 h6 16.Bh4 c5 17.dxe5
Nxe4 18.Bxe7 Qxe7 19.exd6 Qf6 20.Nbd2 Nxd6 21.Nc4 Nxc4 22.Bxc4 Nb6
23.Ne5 Rae8 24.Bxf7+ Rxf7 25.Nxf7 Rxe1+ 26.Qxe1 Kxf7 27.Qe3 Qg5 28.Qxg5
hxg5 29.b3 Ke6 30.a3 Kd6 31.axb4 cxb4 32.Ra5 Nd5 33.f3 Bc8 34.Kf2 Bf5
35.Ra7 g6 36.Ra6+ Kc5 37.Ke1 Nf4 38.g3 Nxh3 39.Kd2 Kb5 40.Rd6 Kc5 41.Ra6
Nf2 42.g4 Bd3 43.Re6 1/2-1/2
```
~~~

![](res/PGN%20Example.png)

### Size

The size of the rendered board is specified with the `size` header. Its value is the board's side length given in pixels. By default, it is set to `256`, making the `size` header optional.

~~~
```shaahmaat
orientation: white
format: fen
size: 160

rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2
```
~~~

### Highlights

The `highlights` header is used to specify which squares should be highlighted. Its value must be a space-separated list containing the coordinates (in algebraic notation) of the squares which are to be highlighted.

~~~
```shaahmaat
orientation: black
format: fen
highlights: c8 a2 b1 b8 e4

rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1
```
~~~

![](res/Highlights%20Example.png)

This header is optional.

### Arrows

You can also draw arrows between squares to illustrate the main ideas in a given position. This is done by specifying a space-separated list of arrows in the `arrows` header. Each arrow is represented by the coordinates (in algebraic notation) of the squares it connects. First is the start square, followed by `->` and then by the end square.

~~~
```shaahmaat
orientation: black
format: fen
arrows: e4->d5 e4->f5 b8->c6

rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1
```
~~~

![](res/Arrows%20Example.png)

This header is optional.

## Customisation

In the settings tab of the plugin, you can customise the colours used for board squares, highlights and arrows. You can also select what chess set should be used for the pieces.

Adding custom chess sets is possible by modifying the `styles.css` file. You need to add each of the set's pieces in the following way:

```css
.shaahmaat-chess-piece.SETNAME-chess-set.PIECE.COLOR {background-image:url('data:image/svg+xml;base64,PIECEDATA')}
```

`SETNAME` should be the name of your chess set. `PIECE` is the name of the piece - one of `king`, `queen`, `bishop`, `knight`, `rook`, `pawn`. `COLOR` is the color of the piece - either `white` or `black`. `PIECEDATA` is the [base64](https://en.wikipedia.org/wiki/Base64)-encoded [SVG](https://en.wikipedia.org/wiki/SVG) image you want to use for your piece. Take a look at `styles.css` for a clearer example.

## Roadmap

- [ ] Customisable background image for chess boards.
- [ ] Customisable arrow size.
- [ ] Browsing through PGN move history.
- [ ] Display board coordinates.

# Support

If you encounter any bugs, open an issue on the [Github repository](https://github.com/MihailKovachev/shaahmaat-md). Other contributions are also welcome.