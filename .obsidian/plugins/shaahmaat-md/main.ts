import { Chess } from 'chess.js';
import { App, Editor, HexString, MarkdownPostProcessorContext, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import ShaahMaat, { BoardOrientation } from 'ShaahMaat';
import { DEFAULT_SETTINGS, ShaahMaatSettings, ShaahMaatSettingTab } from 'ShaahMaatSettings';

const HEADERS = ["orientation", "format"];

export default class ShaahMaatPlugin extends Plugin {
	settings: ShaahMaatSettings;
	renderer: ShaahMaat;

	async onload() {

		console.log('ShaahMaat is loading...');

		await this.loadSettings();

		let chessSetsFolder = (this.app.vault.configDir.normalize() + '/plugins/shaahmaat-md/res/chess_sets').normalize();
		let chessSets = (await this.app.vault.adapter.list(chessSetsFolder)).
			folders.map((path: string, index: number, arr: string[]) => { return path.substring(path.lastIndexOf('/') + 1) });

		this.addSettingTab(new ShaahMaatSettingTab(this.app, this, chessSets));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

		this.renderer = new ShaahMaat(this.app, this.settings.lightSquareColor, this.settings.darkSquareColor);
		this.renderer.init(this.settings.chessSet);

		this.registerMarkdownCodeBlockProcessor('shaahmaat', this.postProcessShaahMaat.bind(this));
		//this.registerMarkdownCodeBlockProcessor('chess-fen', this.postProcessFEN.bind(this));
		//this.registerMarkdownCodeBlockProcessor('chess-pgn', this.postProcessPGN.bind(this));

	}

	postProcessShaahMaat(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {

		let lines = source.split('\n');

		let orientation = BoardOrientation.White;

		try {
			for (let i = 0; i < lines.length; ++i) {

				let { property, val } = this.parseShaahMaatHeader(lines[i]);

				if (property === "orientation") {
					switch (val) {
						case "white": {
							orientation = BoardOrientation.White;
							break;
						}
						case "black": {
							orientation = BoardOrientation.Black;
						}
						default:
							break;
					}
				}

				if (property === "format") {

					let notation = "";

					for (let j = i + 2; j < lines.length; ++j) {
						notation += lines[j] + "\n";
					}
					notation = notation.substring(0, notation.length - 1);

					switch (val) {
						case "fen": {
							let chess = new Chess();

							try {
								chess.load(notation);
							} catch (err) {
								el.createEl('p', { text: err, cls: "shaahmaat-error" });
							}

							el.appendChild(this.renderer.boardWithPosition(chess.board(), orientation));

							break;
						}

						case "pgn": {
							let chess = new Chess();

							try {
								chess.loadPgn(notation);
							} catch (err) {
								el.createEl('p', { text: err, cls: "shaahmaat-error" });
							}

							el.appendChild(this.renderer.boardWithPosition(chess.board(), orientation));

							break;
						}
					}

					return;
				}
			}
		}
		catch (err) {
			el.appendChild(this.renderer.renderError(err));
			return;
		}

		el.appendChild(this.renderer.renderError(new Error("Missing format header!")));
	}

	parseShaahMaatHeader(header: string): Record<string, string> {
		let parts = header.split(':');

		if (parts.length > 2) {
			throw new Error("Invalid ShaahMaat notation!");
		}

		let property = parts[0].trim();
		let val = parts[1].trim();

		let formatFound = false;

		if (!HEADERS.contains(property)) {
			throw new Error("Unrecognised ShaahMaat header!");
		}

		if (property === "orientation" && val !== "white" && val !== "black") {
			throw new Error("Invalid orientation. Expected white or black!");
		}

		if (property === "format" && val !== "fen" && val != "pgn") {
			throw new Error("Invalid format. Expected fen or pgn!");
		}

		return { property, val };
	}

	postProcessFEN(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {

		let chess = new Chess();

		try {
			chess.load(source);
		} catch (err) {
			el.createEl('p', { text: err, cls: "shaahmaat-error" });
		}

		el.appendChild(this.renderer.boardWithPosition(chess.board(), BoardOrientation.White));
	}

	postProcessPGN(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {

		let chess = new Chess();

		try {
			chess.loadPgn(source);
		} catch (err) {
			el.createEl('p', { text: err, cls: "shaahmaat-error" });
		}

		el.appendChild(this.renderer.boardWithPosition(chess.board(), BoardOrientation.White));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

