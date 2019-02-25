import { JetView, plugins } from "webix-jet";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const menu = {
			view: "menu", id: "top:menu",
			css: "app_menu",
			width: 180, layout: "y", select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{ value: _("Contacts"), id: "contacts", icon: "wxi-drag" },
				{ value: _("Activities"), id: "activities", icon: "wxi-calendar" },
				{ value: _("Settings"), id: "settings", icon: "wxi-pencil" }
			],
			on: {
				onAfterSelect: function (id) {
					const header = this.$scope.$$("header");
					header.define({ template: this.getItem(id).value });
					header.refresh();
				}
			},
		};

		const ui = {
			rows: [
				{ localId: "header", template: "Contacts", type: "header", css: "header-app" },
				{
					cols: [
						menu,
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