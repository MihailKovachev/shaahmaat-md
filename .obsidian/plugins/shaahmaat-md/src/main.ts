import { Chess } from 'chess.js';
import { App, Editor, HexString, MarkdownPostProcessorContext, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import ShaahMaat, { BoardOrientation } from './ShaahMaat';
import { ShaahMaatParser } from './ShaahMaatParser';
import { DEFAULT_SETTINGS, ShaahMaatSettings, ShaahMaatSettingTab } from './ShaahMaatSettings';

const HEADERS = ["orientation", "format"];

export default class ShaahMaatPlugin extends Plugin {
	settings: ShaahMaatSettings;
	shaahmaat: ShaahMaat;

	async onload() {

		await this.loadSettings();

		let chessSetsFolder = (this.app.vault.configDir.normalize() + '/plugins/shaahmaat-md/assets/chess_sets').normalize();
		let chessSets = (await this.app.vault.adapter.list(chessSetsFolder)).
			folders.map((path: string, index: number, arr: string[]) => { return path.substring(path.lastIndexOf('/') + 1) });

		this.addSettingTab(new ShaahMaatSettingTab(this.app, this, chessSets));

		this.shaahmaat = new ShaahMaat(this.app, this.settings.lightSquareColor, this.settings.darkSquareColor);
		this.shaahmaat.init(this.settings.chessSet);

		this.registerMarkdownCodeBlockProcessor('shaahmaat', this.postProcessShaahMaat.bind(this));

	}

	postProcessShaahMaat(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {

		try {
			let parsedShaahMaat = ShaahMaatParser.parseShaahMaat(source);

			let chess = new Chess();

			switch (parsedShaahMaat.format) {
				case "fen": {
					chess.load(parsedShaahMaat.gameNotation);
					break;
				}
				case "pgn": {
					chess.loadPgn(parsedShaahMaat.gameNotation);
					break;
				}
				default:
					break; // This should never happen
			}
			el.appendChild(this.shaahmaat.boardWithPosition(chess.board(), parsedShaahMaat.orientation));
		}
		catch (err) {
			el.appendChild(this.shaahmaat.renderError(err));
		}
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

