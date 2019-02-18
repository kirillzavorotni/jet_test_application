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
				template: "Add",
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
								label: "Add",
								width: 130,
								click: () => {
									if (this.$$("userForm").validate()) {
										const formValues = this.$$("userForm").getValues();
										const hours = formValues.Time.getHours();
										const minutes = formValues.Time.getMinutes();
										formValues.Date.setHours(hours, minutes);
										formValues.DueDate = formValues.Date;

										if (this._elem) {
											userActivity.updateItem(formValues.id, formValues);
										} else {
											userActivity.add(formValues);
										}

										this.closeWindow();
									}
								}
							},
							{
								view: "button",
								label: "Cancel",
								width: 130,
								click: () => {
									this.closeWindow();
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

	showWindow(elem) {
		this._elem = elem;

		if (this._elem) {
			this.changeLabels("Edit");
			this.$$("userForm").setValues(this._elem);
		} else {
			this.changeLabels("Add");
		}

		this.getRoot().show();
	}

	changeLabels(newLabelText) {
		this.$$("windowHeader").define("template", newLabelText);
		this.$$("windowHeader").refresh();
		this.$$("addSaveButton").define("label", newLabelText);
		this.$$("addSaveButton").refresh();
	}

	closeWindow() {
		this.$$("userForm").clearValidation();
		this.$$("userForm").clear();
		this.$$("activityWindow").hide();
	}
}