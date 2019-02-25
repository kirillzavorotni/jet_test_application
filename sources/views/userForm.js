import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
import { userStatuses } from "models/userStatuses";

export default class UserFormView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{ view: "template", localId: "formTitle", template: "Edit (*add) contact", type: "header", css: "header-app" },
				{
					view: "form",
					localId: "contactForm",
					autoheight: false,
					elementsConfig: {
						labelWidth: 75,
						labelAlign: "right",
						css: "formLabelStyle",
					},
					css: "userFormStyle",
					elements: [
						{
							cols: [
								{
									rows: [
										{ view: "text", label: _("First name"), name: "FirstName" },
										{ view: "text", label: _("Last name"), name: "LastName" },
										{
											view: "datepicker",
											name: "StartDate",
											label: _("Joining date"),
											type: "date",
											format: webix.Date.dateToStr("%d-%m-%Y"),
										},
										{
											view: "richselect",
											label: _("Status"),
											name: "StatusID",
											suggest: {
												data: userStatuses,
												body: {
													template: "#Value#",
												}
											},
										},
										{ view: "text", label: _("Job"), name: "Job" },
										{ view: "text", label: _("Company"), name: "Company" },
										{ view: "text", label: _("Website"), name: "Website" },
										{
											view: "textarea",
											label: _("Addres"),
											height: 100,
											name: "Address",
										},
									],
									margin: 5,
								},
								{
									rows: [
										{ view: "text", label: _("Email"), name: "Email" },
										{ view: "text", label: _("Skype"), name: "Skype" },
										{ view: "text", label: _("Phone"), name: "Phone" },
										{
											view: "datepicker",
											name: "Birthday",
											label: _("Birthday"),
											type: "date",
											format: webix.Date.dateToStr("%d-%m-%Y"),
										},
										{
											cols: [
												{ view: "spacer", width: 78 },
												{
													localId: "userImgTemplate",
													name: "Photo",
													width: 225,
													height: 225,
													template: "<img src='#src#' class='user-info-form-img' alt=''>",
												},
												{
													rows: [
														{ view: "spacer" },
														{
															view: "uploader",
															label: _("Change photo"),
															accept: "image/jpeg, image/png",
															autosend: false,
															multiple: false,
															name: "Photo",
															css: "userFormbutton",
															on: {
																onBeforeFileAdd: (upload) => {
																	const file = upload.file;
																	const reader = new FileReader();
																	reader.onload = (event) => {
																		this.$$("userImgTemplate").setValues({ src: event.target.result });
																		this.$$("contactForm").setValues({ Photo: event.target.result }, true);
																	};
																	reader.readAsDataURL(file);
																	return false;
																}
															}
														},
														{
															view: "button", label: _("Delete photo"), css: "userFormbutton", click: () => {
																this.$$("userImgTemplate").setValues({ src: "" });
																this.$$("contactForm").setValues({ Photo: "" }, true);
															}
														},
													],
													width: 47,
												},
											],
										},
									],
									margin: 5,
									width: 350,
								},
							],
						}
					],
					rules: {
						"Address": webix.rules.isNotEmpty,
						"Birthday": webix.rules.isNotEmpty,
						"Company": webix.rules.isNotEmpty,
						"Email": webix.rules.isNotEmpty,
						"FirstName": webix.rules.isNotEmpty,
						"Job": webix.rules.isNotEmpty,
						"LastName": webix.rules.isNotEmpty,
						"Phone": webix.rules.isNotEmpty,
						"Skype": webix.rules.isNotEmpty,
						"StartDate": webix.rules.isNotEmpty,
						"StatusID": webix.rules.isNotEmpty,
						"Website": webix.rules.isNotEmpty,
					},
				},
				{
					cols: [
						{ view: "spacer" },
						{
							cols: [
								{
									view: "button", label: _("Cancel"), click: () => {
										this.refreshForm();
										if (this.getParam("mode") === "add") {
											const firstId = userContacts.getFirstId();
											if (firstId) {
												this.app.callEvent("setFirstIdParam");
											}
										}
										this.app.callEvent("showTemplate");
										this.app.callEvent("enableBtn");
									}
								},
								{
									view: "button", localId: "actionButton", label: "Add(*Save)", type: "form", click: () => {
										if (this.$$("contactForm").validate()) {
											const values = this.$$("contactForm").getValues();
											if (this.getParam("mode") === "edit") {
												userContacts.updateItem(values.id, values);
											} else {
												userContacts.add(values);
											}
											this.refreshForm();
											this.app.callEvent("showTemplate");
											this.app.callEvent("enableBtn");
										}
									}
								},
							],
							width: 230,
						},
					],
				}
			],
		};
	}

	init() {
		this._parentParam = this.getParam("id", true);
		userContacts.waitData.then(() => {
			if (this.getParam("mode") === "edit") {
				this.app.callEvent("disableBtn");
				this.editLabels("Edit");
				const itemId = this.getParam("id", true);
				const desItem = userContacts.getItem(itemId);
				this.$$("contactForm").setValues(desItem);

				this.$$("userImgTemplate").setValues({ src: desItem.Photo });
			} else {
				this.editLabels("Add");
			}
		});
	}

	editLabels(label) {
		const _ = this.app.getService("locale")._;
		this.$$("actionButton").define("label", _(label));
		this.$$("formTitle").define("template", `${_(label)} ${_("contact")}`);
		this.$$("actionButton").refresh();
		this.$$("formTitle").refresh();
	}

	refreshForm() {
		this.$$("contactForm").clear();
		this.$$("contactForm").clearValidation();
	}

	urlChange() {
		if (this.getParam("id", true) != this._parentParam) {
			this.app.callEvent("showTemplate");
			this.app.callEvent("enableBtn");
		}
	}
}