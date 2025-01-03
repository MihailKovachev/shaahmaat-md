import ShaahMaatPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class ShaahMaatSettingTab extends PluginSettingTab {
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
			.setName('Highlighted square colour')
			.setDesc('The colour used for highlighted squares on the board.')
			.addColorPicker(colorPicker => colorPicker
				.setValue(this.plugin.settings.highlightedSquareColor)
				.onChange(async (value) => {
					this.plugin.settings.highlightedSquareColor = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Arrow colour')
			.setDesc('The colour used for annotation arrows.')
			.addColorPicker(colorPicker => colorPicker
				.setValue(this.plugin.settings.arrowColor)
				.onChange(async (value) => {
					this.plugin.settings.arrowColor = value;
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