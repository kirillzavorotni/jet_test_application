import { JetView, plugins } from "webix-jet";

export default class TopView extends JetView {
	config() {
		const menu = {
			view: "menu", id: "top:menu",
			css: "app_menu",
			width: 180, layout: "y", select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{ value: "Contacts", id: "contacts", icon: "wxi-drag" },
				{ value: "Activities", id: "activities", icon: "wxi-calendar" },
				{ value: "Settings", id: "settings", icon: "wxi-pencil" }
			],
			on: {
				onAfterSelect: (id) => {
					const header = id[0].toUpperCase() + id.slice(1);
					this.$$("header").define({ template: header });
					this.$$("header").refresh();
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