import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
import { userActivity } from "models/userActivity";
import { userActivityType } from "models/userActivityType";

export default class UserInfoWindowFormView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
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
						label: _("Details"),
						height: 100,
						name: "Details",
					},
					{
						view: "richselect",
						label: _("Type"),
						name: "TypeID",
						options: userActivityType,
					},
					{
						view: "richselect",
						localId: "chooseContactElem",
						label: _("Contact"),
						name: "ContactID",
						suggest: {
							data: userContacts,
							body: {
								template: "#value#",
							}
						},
						disabled: false,
						value: "",
					},
					{
						cols: [
							{
								view: "datepicker",
								name: "Date",
								label: _("Date"),
								type: "date",
								format: webix.Date.dateToStr("%d-%m-%Y"),
							},
							{
								view: "datepicker",
								name: "Time",
								label: _("Time"),
								type: "time",
							},
						],
					},
					{
						view: "checkbox",
						labelRight: _("Completed"),
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
								label: _("Add"),
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
										this.app.callEvent("switchFilterValue");
									}
								}
							},
							{
								view: "button",
								label: _("Cancel"),
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

	showWindow(elem, chooseName, elemId) {
		this._elem = elem;
		this._chooseName = chooseName;
		this._elemId = elemId;

		if (this._elem) {
			this.changeLabels("Edit");
			this.$$("userForm").setValues(this._elem);
		} else {
			this.changeLabels("Add");
		}

		if (this._chooseName) {
			this.chooseElement(this._chooseName);
		}

		if (this._elemId) {
			this.setContact(this._elemId);
		}
		this.getRoot().show();
	}

	changeLabels(newLabelText) {
		const _ = this.app.getService("locale")._;
		this.$$("windowHeader").define("template", _(newLabelText));
		this.$$("windowHeader").refresh();
		this.$$("addSaveButton").define("label", _(newLabelText));
		this.$$("addSaveButton").refresh();
	}

	closeWindow() {
		this.$$("userForm").clearValidation();
		this.$$("userForm").clear();
		this.$$("activityWindow").hide();
	}

	chooseElement(chooseName) {
		this.$$("chooseContactElem").define("disabled", chooseName);
		this.$$("chooseContactElem").refresh();
	}

	setContact(id) {
		this.$$("chooseContactElem").define("value", id);
		this.$$("chooseContactElem").refresh();
	}
}