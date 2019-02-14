import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
import { userActivity } from "models/userActivity";
import { userActivityType } from "models/userActivityType";

export default class UserInfoWindowFormView extends JetView {
	config() {

		return {
			view: "window",
			localId: "activityWindow",
			head: {
				localId: "windowHeader",
				template: "Add (*edit) activity",
			},
			width: 500,
			height: 400,
			position: "center",
			modal: true,
			body: {
				view: "form",
				localId: "userForm",
				elements: [
					{
						view: "textarea",
						label: "Details",
						height: 100,
						name: "Details",
					},
					{
						view: "richselect",
						label: "Type",
						name: "TypeID",
						suggest: {
							data: userActivityType,
							body: {
								template: "#Value#",
							}
						},
					},
					{
						view: "richselect",
						label: "Contact",
						name: "ContactID",
						suggest: {
							data: userContacts,
							body: {
								template: "#value#",
							}
						},
					},
					{
						cols: [
							{
								view: "datepicker",
								name: "Date",
								label: "Date",
								type: "date"
							},
							{
								view: "datepicker",
								name: "Time",
								label: "Time",
								type: "time",
							},
						],
					},
					{
						view: "checkbox",
						labelRight: "Completed",
						name: "State",
						checkValue: "Open",
						uncheckValue: "Close",
					},
					{
						cols: [
							{ view: "spacer" },
							{
								view: "button",
								localId: "addSaveButton",
								type: "form",
								label: "Add (*save)",
								width: 130,
								click: () => {
									if (this.$$("userForm").validate()) {
										const formValues = this.$$("userForm").getValues();
										// for correct working
										const format1 = webix.Date.dateToStr("%Y-%m-%d");
										const format2 = webix.Date.dateToStr("%H:%i");
										const format3 = webix.Date.strToDate("%Y-%m-%d %H:%i");
										const date = format1(formValues.Date);
										const time = format2(formValues.Time);
										formValues.DueDate = date + " " + time;
										formValues.DueDate = format3(formValues.DueDate);
										//
										if (this._action === "editing") {
											userActivity.updateItem(formValues.id, formValues);
										} else {
											userActivity.add(formValues);
										}

										this.$$("activityWindow").hide();
									}
								}
							},
							{
								view: "button",
								label: "Cancel",
								width: 130,
								click: () => {
									this.$$("userForm").clear();
									this.$$("activityWindow").hide();
								}
							},
						],
					},
				],
				rules: {
					"Details": webix.rules.isNotEmpty,
					"TypeID": webix.rules.isNotEmpty,
					"ContactID": webix.rules.isNotEmpty,
					"Date": webix.rules.isNotEmpty,
					"Time": webix.rules.isNotEmpty,
				},
			}
		};

	}

	showWindow(elem, action, buttonName, headText) {

		this._buttonName = buttonName;
		this._action = action;
		this._headText = headText;
		this._elem = elem;

		this.$$("windowHeader").define("template", this._headText);
		this.$$("windowHeader").refresh();
		this.$$("userForm").clear();

		this.$$("addSaveButton").define("label", buttonName);
		this.$$("addSaveButton").refresh();

		if (this._elem) {
			this.getRoot().show();
			this.$$("userForm").setValues(this._elem);
		} else {
			this.getRoot().show();
		}
	}
}