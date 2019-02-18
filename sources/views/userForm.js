import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
import { userStatuses } from "models/userStatuses";


export default class UserFormView extends JetView {
	config() {
		return {
			rows: [
				{ view: "template", localId: "formTitle", template: "Edit (*add) contact", type: "header", css: "userFormstyle" },
				{
					view: "form",
					localId: "contactForm",
					autoheight: false,
					elements: [
						{
							cols: [
								{
									rows: [
										{ view: "text", label: "First name", name: "FirstName" },
										{ view: "text", label: "Last name", name: "LastName" },
										{
											view: "datepicker",
											name: "StartDate",
											label: "Joining date",
											type: "date"
										},
										{
											view: "richselect",
											label: "Status",
											name: "StatusID",
											suggest: {
												data: userStatuses,
												body: {
													template: "#Value#",
												}
											},
										},
										{ view: "text", label: "Job", name: "Job" },
										{ view: "text", label: "Company", name: "Company" },
										{ view: "text", label: "Website", name: "Website" },
										{
											view: "textarea",
											label: "Addres",
											height: 100,
											name: "Address",
										},
									],
									margin: 5,
								},
								{
									rows: [
										{ view: "text", label: "Email", name: "Email" },
										{ view: "text", label: "Skype", name: "Skype" },
										{ view: "text", label: "Phone", name: "Phone" },
										{
											view: "datepicker",
											name: "Birthday",
											label: "Birthday",
											type: "date",
										},
										{
											cols: [
												{
													localId: "userImgTemplate",
													name: "Photo",
													width: 225,
													height: 225,
													template: "<img src='#src#' class='user-info-form-img' alt='User Image'>",
												},
												{
													rows: [
														{ view: "spacer" },
														{
															view: "uploader",
															label: "Change photo",
															accept: "image/jpeg, image/png",
															autosend: false,
															multiple: false,
															name: "Photo",
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
															view: "button", label: "Delete photo", click: () => {
																this.$$("userImgTemplate").setValues({ src: "" });
																this.$$("contactForm").setValues({ Photo: "" }, true);
															}
														},
													],
													width: 130,
												},
											],
										},
									],
									margin: 5,
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
									view: "button", label: "Cancel", click: () => {
										this.refreshForm();
										if (this.getUrl()[1].page === "edit") {
											this.show(`/top/contacts?id=${this.getParam("id", true)}/userInfoTpl`);
										} else {
											const firstId = userContacts.getFirstId();
											if (firstId) {
												this.show(`/top/contacts?id=${firstId}/userInfoTpl`);
											}
										}
									}
								},
								{
									view: "button", localId: "actionButton", label: "Add(*Save)", type: "form", click: () => {
										if (this.$$("contactForm").validate()) {
											const values = this.$$("contactForm").getValues();
											if (this.getUrl()[1].page === "edit") {
												userContacts.updateItem(values.id, values);
											} else {
												userContacts.add(values);
											}
											this.refreshForm();
											this.show("userInfoTpl");
										}
									}
								},
							],
							width: 230,
						},
					],
				}
			],
		}
	}

	init() {
		userContacts.waitData.then(() => {
			const url = this.getUrl();
			if (url[1].page === "edit") {
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
		this.$$("actionButton").define("label", label);
		this.$$("formTitle").define("template", `${label} contact`);
		this.$$("actionButton").refresh();
		this.$$("formTitle").refresh();
	}

	refreshForm() {
		this.$$("contactForm").clear();
		this.$$("contactForm").clearValidation();
	}
}