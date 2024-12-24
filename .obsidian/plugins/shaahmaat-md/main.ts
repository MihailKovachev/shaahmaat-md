import { Chess } from 'chess.js';
import { App, Editor, HexString, MarkdownPostProcessorContext, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import ShaahMaat, { BoardOrientation } from 'ShaahMaat';
import { DEFAULT_SETTINGS, ShaahMaatSettings, ShaahMaatSettingTab } from 'ShaahMaatSettings';

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

		this.registerMarkdownCodeBlockProcessor('chess-fen', this.postProcessFEN.bind(this));
		this.registerMarkdownCodeBlockProcessor('chess-pgn', this.postProcessPGN.bind(this));

	}

	postProcessFEN(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {

		let chess = new Chess();

		try {
			chess.load(source);
		} catch(err){
			el.createEl('p', { text: err, cls: "shaahmaat-error"} );
		}

		el.appendChild(this.renderer.boardWithPosition(chess.board(), BoardOrientation.White));
	}

	postProcessPGN(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {

		let chess = new Chess();

		try {
			chess.loadPgn(source);
		} catch(err){
			el.createEl('p', { text: err, cls: "shaahmaat-error"} );
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

