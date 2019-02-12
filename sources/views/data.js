import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
// import { userStatuses } from "models/userStatuses";
import { userActivity } from "models/userActivity";
// import { userActivityType } from "models/userActivityType";

export default class ActiveView extends JetView {
	config() {

		return {
			rows: [
				{ template: "first stroke", height: 50 },
				{
					view: "datatable",
					localId: "active-table",
					columns: [
						{ id: "State", header: "", template: "{common.checkbox()}", checkValue: "Open", uncheckValue: "Close", width: 36 },
						{ header: "Active type", width: 100 },
						{ id: "DueDate", header: "Due date", width: 120 },
						{ id: "Details", header: "Details", width: 300, fillspace: true },
						{ id: "ContactID", header: ["Contact", { content: "selectFilter" }], width: 200, collection: userContacts },
						{ template: "<span class='webix_icon wxi-pencil'></span>", width: 50 },
						{ template: "<span class='webix_icon wxi-trash'></span>", width: 50 },
					],
				},
			]
		};
	}

	init() {
		userActivity.waitData.then(() => {
			this.$$("active-table").sync(userActivity);
		});
	}
}