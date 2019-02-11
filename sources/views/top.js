import { JetView, plugins } from "webix-jet";

export default class TopView extends JetView {
	config() {
		const menu = {
			view: "menu", id: "top:menu",
			css: "app_menu",
			width: 180, layout: "y", select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{ value: "Contacts", id: "start", icon: "wxi-drag" },
				{ value: "Activities", id: "data", icon: "wxi-calendar" },
				{ value: "Settings", id: "settings", icon: "wxi-pencil" }
			]
		};

		const ui = {
			rows: [
				{ template: "Contacts", type: "header" },
				{
					cols: [
						{ rows: [menu] },
						{ $subview: true },
					]
				},
			]
		};

		return ui;
	}
	init() {
		this.use(plugins.Menu, "top:menu");
	}
}