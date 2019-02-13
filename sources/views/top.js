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
			],
			on: {
				onAfterSelect: (id) => {
					if (id === "start") {
						this.$$("header").define({ template: "Contacts" });
						this.$$("header").refresh();
					} else if (id === "data") {
						this.$$("header").define({ template: "Activities" });
						this.$$("header").refresh();
					} else {
						this.$$("header").define({ template: "Settings" });
						this.$$("header").refresh();
					}
				}
			},
		};

		const ui = {
			rows: [
				{ localId: "header", template: "Contacts", type: "header" },
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