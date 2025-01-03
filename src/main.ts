import { MarkdownPostProcessorContext, Plugin} from 'obsidian';

import ShaahMaat from './ShaahMaat';
import { ShaahMaatParser } from './ShaahMaatParser';
import { DEFAULT_SETTINGS, ShaahMaatSettings } from './ShaahMaatSettings';
import { ShaahMaatSettingTab } from './ShaahMaatSettingTab';

const CHESS_SETS = ["cburnett"];

export default class ShaahMaatPlugin extends Plugin {
	settings: ShaahMaatSettings;

	async onload() {

		await this.loadSettings();

		this.addSettingTab(new ShaahMaatSettingTab(this.app, this, CHESS_SETS));

		this.registerMarkdownCodeBlockProcessor('shaahmaat', this.postProcessShaahMaat.bind(this));

	}

	postProcessShaahMaat(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {

		try {
			let parsedShaahMaat = ShaahMaatParser.parseShaahMaat(source);

			el.appendChild(ShaahMaat.createChessBoardElement(parsedShaahMaat, this.settings));
		}
		catch (err) {
			el.appendChild(ShaahMaat.renderError(err));
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

