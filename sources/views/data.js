import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
import { userActivity } from "models/userActivity";
import { userActivityType } from "models/userActivityType";
import UserInfoFormView from "views/userInfoWindowForm";

export default class ActiveView extends JetView {
	config() {

		const buttonAdd = "Add";
		const buttonSave = "Save";
		const headEdit = "Edit";
		const headAdd = "Add";

		return {
			rows: [
				{
					cols: [
						{},
						{
							view: "button",
							label: "Add activity",
							type: "iconButton",
							icon: "wxi-plus-square",
							width: 200,
							click: () => {
								this.window.showWindow("", "adding", buttonAdd, headAdd);
							}
						},
					],
				},
				{
					view: "datatable",
					select: true,
					localId: "active-table",
					columns: [
						{ id: "State", header: "", template: "{common.checkbox()}", checkValue: "Open", uncheckValue: "Close", sort: "text", width: 36 },
						{ id: "TypeID", header: ["Active type", { content: "selectFilter" }], collection: userActivityType, sort: "text", width: 100 },
						{ id: "DueDate", header: ["Due date", { content: "datepickerFilter" }], width: 150, format: webix.Date.dateToStr("%d-%m-%Y %H:%i"), sort: "date" },
						{ id: "Details", header: ["Details", { content: "textFilter" }], width: 300, fillspace: true, sort: "text" },
						{ id: "ContactID", header: ["Contact", { content: "selectFilter" }], width: 200, collection: userContacts, sort: "text" },
						{ template: "<span class='webix_icon wxi-pencil editElement'></span>", width: 50 },
						{ template: "<span class='webix_icon wxi-trash deleteElement'></span>", width: 50 },
					],
					onClick: {
						"editElement": function (e, id) {
							let tableElem = this.getItem(id);
							this.$scope.window.showWindow(tableElem, "editing", buttonSave, headEdit);
						},
						"deleteElement": function (e, id) {
							webix.confirm({
								title: "Delete",
								text: "Do You want to delete this activity?",
								type: "confirm-warning",
								callback: function (result) {
									if (result) {
										userActivity.remove(id);
									}
								}
							});
						}
					},
				},
			]
		};
	}

	init() {
		userActivity.waitData.then(() => {
			this.$$("active-table").sync(userActivity);
			this.window = this.ui(UserInfoFormView);
		});
	}
}