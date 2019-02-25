import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
import { userActivityType } from "models/userActivityType";
import { userStatuses } from "models/userStatuses";
import { userActivity } from "models/userActivity";
import { myUserStatusesType } from "models/myUserStatusesType";
import { myUserStatuses } from "models/myUserStatuses";

export default class SettingsView extends JetView {
	config() {
		const lang = this.app.getService("locale").getLang();
		const _ = this.app.getService("locale")._;
		return {
			cols: [
				{
					rows: [
						{ template: _("Activities Types"), type: "header", css: "settings-cols-header-text" },
						{
							view: "datatable",
							localId: "activityTypeTable",
							editable: true,
							scrollX: false,
							columns: [
								{ id: "Value", header: _("Activity Type"), editor: "text", fillspace: true },
								{
									id: "Icon", template: "<span class='fas fa-#Icon#'></span>", header: _("Icon"), editor: "richselect",
									options: myUserStatusesType,
									suggest: {
										body: {
											template: "<span class='fas fa-#Icon#'></span>",
										}
									},
									width: 100,
								},
								{ template: "<span class='webix_icon wxi-trash deleteElement'></span>", width: 50 },
							],
							onClick: {
								"deleteElement": function (e, id) {
									webix.confirm({
										title: _("Delete"),
										text: _("Are you shure?"),
										type: "confirm-warning",
										callback: function (result) {
											if (result) {
												userActivityType.remove(id);
											}
										}
									});
									return false;
								}
							}
						},
						{
							view: "button",
							label: _("Add activity"),
							type: "form",
							click: () => {
								this.addActivityType();
							}
						},
					],
				},
				{
					rows: [
						{ template: _("Statuses Types"), type: "header", css: "settings-cols-header-text" },
						{
							view: "datatable",
							scrollX: false,
							localId: "userStatusesTable",
							editable: true,
							columns: [
								{ id: "Value", header: _("Status"), editor: "text", fillspace: true },
								{
									id: "Icon", header: _("Icon"), template: "<span class='fas fa-#Icon#'></span>", editor: "richselect", width: 100,
									options: myUserStatuses,
									suggest: {
										body: {
											template: "<span class='fas fa-#Icon#'></span>",
										}
									},
								},
								{ template: "<span class='webix_icon wxi-trash deleteElement'></span>", width: 50 },
							],
							onClick: {
								"deleteElement": function (e, id) {
									webix.confirm({
										title: _("Delete"),
										text: _("Are you shure?"),
										type: "confirm-warning",
										callback: function (result) {
											if (result) {
												userStatuses.remove(id);
											}
										}
									});
									return false;
								}
							}
						},
						{
							view: "button",
							label: _("Add status"),
							type: "form",
							click: () => {
								this.addStatus();
							}
						},
					],
				},
				{
					width: 280,
					rows: [
						{ template: _("Change Language"), type: "header", css: "settings-cols-header-text" },
						{
							view: "segmented",
							localId: "localizationSegm",
							options: [
								{ id: "ru", value: "RU" },
								{ id: "en", value: "ENG" },
							],
							value: lang,
							click: () => {
								this.toggleLanguage();
							},
						},
						{ view: "spacer" },
					],
				}
			],
		};
	}

	init() {
		webix.promise.all([
			userContacts.waitData,
			userStatuses.waitData,
			userActivity.waitData,
			userActivityType.waitData,
		]).then(() => {
			this.$$("activityTypeTable").sync(userActivityType);
			this.$$("userStatusesTable").sync(userStatuses);
		});
	}

	urlChange() {
		userContacts.waitData.then(() => {
			userContacts.filter();
		});
	}

	addActivityType() {
		userActivityType.waitData.then(() => {
			const elem = {
				Value: "Type name...",
				Icon: "ban"
			};
			userActivityType.add(elem);
		});
	}

	addStatus() {
		userStatuses.waitData.then(() => {
			const elem = {
				Value: "Type name...",
				Icon: "ban"
			};
			userStatuses.add(elem);
		});
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("localizationSegm").getValue();
		langs.setLang(value);
	}
}