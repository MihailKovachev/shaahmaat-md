import { Chess } from 'chess.js';
import { App, Editor, HexString, MarkdownPostProcessorContext, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import Renderer, { BoardOrientation } from 'renderer';

// Remember to rename these classes and interfaces!

interface ShaahMaatSettings {
	lightSquareColor: string,
	darkSquareColor: string,
	chessSet: string
}

const DEFAULT_SETTINGS: ShaahMaatSettings = {
	lightSquareColor: '#ffffff',
	darkSquareColor: '#000000',
	chessSet: 'Cburnett'
}

export default class ShaahMaatPlugin extends Plugin {
	settings: ShaahMaatSettings;
	renderer: Renderer;

	async onload() {

		console.log('ShaahMaat is loading...');

		await this.loadSettings();

		let chessSetsFolder = (this.app.vault.configDir.normalize() + '/plugins/shaahmaat-md/res/chess_sets').normalize();
		let chessSets = (await this.app.vault.adapter.list(chessSetsFolder)).
		folders.map((path: string, index: number, arr: string[]) => { return path.substring(path.lastIndexOf('/') + 1) });

		this.addSettingTab(new ShaahMaatSettingTab(this.app, this, chessSets));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

		this.renderer = new Renderer(this.app, this.settings.lightSquareColor, this.settings.darkSquareColor);
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

		el.appendChild(this.renderer.emptyBoard(BoardOrientation.Black, 256));
		el.appendChild(this.renderer.emptyBoard(BoardOrientation.White, 256));
	}

	postProcessPGN(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {

		let chess = new Chess();

		try {
			chess.loadPgn(source);
		} catch(err){
			el.createEl('p', { text: err, cls: "shaahmaat-error"} );
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

class ShaahMaatSettingTab extends PluginSettingTab {
	plugin: ShaahMaatPlugin;
	availableChessSets: string[];

	constructor(app: App, plugin: ShaahMaatPlugin, availableChessSets: string[]) {
		super(app, plugin);
		this.plugin = plugin;
		this.availableChessSets = availableChessSets;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Light square colour')
			.setDesc('The colour used for light squares on the board.')
			.addColorPicker(colorPicker => colorPicker
				.setValue(this.plugin.settings.lightSquareColor)
				.onChange(async (value) => {
					this.plugin.settings.lightSquareColor = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Dark square colour')
			.setDesc('The colour used for dark squares on the board.')
			.addColorPicker(colorPicker => colorPicker
				.setValue(this.plugin.settings.darkSquareColor)
				.onChange(async (value) => {
					this.plugin.settings.darkSquareColor = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Chess set')
			.setDesc('The chess set to use for the pieces.')
			.addDropdown(dropDown => {

				this.availableChessSets.forEach(function (chessSet) {
					dropDown.addOption(chessSet, chessSet);
				});

				dropDown
					.setValue(this.plugin.settings.chessSet)
					.onChange(async (value) => {
						this.plugin.settings.chessSet = value;
						await this.plugin.saveSettings();
					});

				return dropDown;
			});

	}
}
