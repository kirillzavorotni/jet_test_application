import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
import { userStatuses } from "models/userStatuses";
import { userActivity } from "models/userActivity";
import { userActivityType } from "models/userActivityType";
import { userFiles } from "models/userFiles";
import UserInfoFormView from "views/userInfoWindowForm";

export default class userInfoTplView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					cols: [
						{
							view: "template",
							localId: "userInfoTemplate",
							template: "",
							css: "user-info-template",
						},
						{
							rows: [
								{
									cols: [
										{
											view: "button",
											label: _("Delete"),
											type: "icon",
											icon: "wxi-trash",
											width: 100,
											click: () => {
												if (userContacts.count()) {
													webix.confirm({
														title: _("Delete"),
														text: _("Do You want to delete this contact?"),
														type: "confirm-warning",
														callback: (result) => {
															if (result) {
																const userActids = [];
																const userFilesIds = [];

																const curId = this.getParam("id", true);
																userContacts.remove(curId);

																userFiles.data.each(function (obj) {
																	if (obj.ContactID == curId) {
																		userFilesIds.push(obj.id);
																	}
																});

																userActivity.data.each(function (obj) {
																	if (obj.ContactID == curId) {
																		userActids.push(obj.id);
																	}
																});

																userFiles.remove(userFilesIds);
																userActivity.remove(userActids);

																const firstId = userContacts.getFirstId();
																if (firstId) {
																	this.app.callEvent("setFirstIdParam");
																} else {
																	this.app.callEvent("showTemplate");
																}
															}
														}
													});
												}
											},
										},
										{
											view: "button",
											label: _("Edit"),
											type: "iconButton",
											icon: "wxi-pencil",
											width: 100,
											click: () => {
												userContacts.waitData.then(() => {
													if (userContacts.count()) {
														this.show("./userForm?mode=edit");
														this.app.callEvent("disableBtn");
													}
												});
											}
										},
									],
								},
								{ view: "spacer" }
							],
						},
					]
				},
				{
					rows: [
						{
							view: "tabbar", value: "activityCell", multiview: true, options: [
								{ value: _("Activity"), id: "activityCell" },
								{ value: _("Files"), id: "filesCell" },
							]
						},
						{
							cells: [
								{
									id: "activityCell",
									$subview: ActivityTableView,
								},
								{
									id: "filesCell",
									$subview: FileTableView,
								}
							],
						},
					],
				},
			],
		};
	}

	urlChange() {
		webix.promise.all([
			userContacts.waitData,
			userStatuses.waitData,
			userActivity,
		]).then(() => {
			if (userContacts.count()) {
				const id = this.getParam("id", true);
				if (id && userContacts.exists(id)) {
					const item = webix.copy(userContacts.getItem(id));

					if (userStatuses.exists(item.StatusID)) {
						item.Status = userStatuses.getItem(item.StatusID).value;
					} else {
						item.Status = "No status";
					}

					this.$$("userInfoTemplate").parse(item);
					this.$$("userInfoTemplate").setHTML(this.getTemplate(item));

					userActivity.filter(function (obj) {
						return obj.ContactID.toString() === id;
					});

					userFiles.filter(function (obj) {
						return obj.ContactID.toString() === id;
					});
					this.$$("fileTable").parse(userFiles);
				}
			} else {
				this.$$("userInfoTemplate").define("template", "");
				this.$$("userInfoTemplate").refresh();
			}
		});
	}

	getTemplate(obj) {
		const format = webix.Date.dateToStr("%d %M %Y");
		let firstName = obj.FirstName ? obj.FirstName : "No name";
		let lastName = obj.LastName ? obj.LastName : "No name";
		let photo = obj.Photo ? obj.Photo : "https://cdn.iconscout.com/icon/free/png-256/user-avatar-contact-portfolio-personal-portrait-profile-6-5623.png";
		let status = obj.Status ? obj.Status : "No status";
		let email = obj.Email ? obj.Email : "No Info";
		let skype = obj.Skype ? obj.Skype : "No status";
		let job = obj.Job ? obj.Job : "No Info";
		let company = obj.Company ? obj.Company : "No Info";
		let addres = obj.Address ? obj.Address : "No Info";
		let birthday = obj.Birthday ? format(obj.Birthday) : "No Info";

		return `
					<div class="user-info-block">
						<h3 class="user-info-block__name-text">${firstName} ${lastName}</h3>
						<div class="user-info-block user-info-wrap">
							<div class="user-info-wrap__block-img">
								<img src="${photo}" class="user-info-wrap__photo" alt="user photo">
								<p class="user-info-wrap__status">${status}</p>
							</div>
							<ul class="user-info-wrap__info-list">
								<li class="user-info-wrap__info-list-item"><span class="mdi mdi-email contact-icon"></span> <span class="contact-name">${email}</span></li>
								<li class="user-info-wrap__info-list-item"><span class="mdi mdi-skype contact-icon"></span> <span class="contact-name">${skype}</span></li>
								<li class="user-info-wrap__info-list-item"><span class="mdi mdi-monitor contact-icon"></span> <span class="contact-name">${job}</span></li>
								<li class="user-info-wrap__info-list-item"><span class="mdi mdi-toolbox contact-icon"></span> <span class="contact-name">${company}</span></li>
								<li class="user-info-wrap__info-list-item"><span class="mdi mdi-bell contact-icon"></span> <span class="contact-name">${birthday}</span></li>
								<li class="user-info-wrap__info-list-item"><span class="mdi mdi-map-marker contact-icon"></span> <span class="contact-name">${addres}</span></li>
							</ul>
						</div>
					</div>
				`;
	}
}

class FileTableView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					view: "datatable",
					localId: "fileTable",
					select: true,
					columns: [
						{ id: "name", header: _("Name"), sort: "text", fillspace: true },
						{ id: "dataChange", header: _("Change data"), width: 100, format: webix.Date.dateToStr("%d %M %Y"), sort: "date" },
						{ id: "size", header: _("Size"), width: 100, sort: "text" },
						{ template: "<span class='webix_icon wxi-trash deleteElement'></span>", width: 50 },
					],
					scrollX: false,
					onClick: {
						"deleteElement": function (e, id) {
							webix.confirm({
								title: _("Delete"),
								text: _("Do You want to delete this file?"),
								type: "confirm-warning",
								callback: function (result) {
									if (result) {
										userFiles.remove(id);
									}
								}
							});
							return false;
						}
					},
				},
				{
					cols: [
						{ view: "spacer" },
						{
							view: "uploader",
							type: "iconButton",
							width: 200,
							icon: "wxi-download",
							localId: "uploadBtn",
							label: _("Upload file"),
							autosend: false,
							on: {
								onBeforeFileAdd: (upload) => {
									if (this.getParam("id", true)) {
										const file = upload.file;
										const reader = new FileReader();
										reader.onload = () => {

											const elem = {
												ContactID: this.getParam("id", true),
												name: upload.name,
												size: upload.sizetext,
												dataChange: file.lastModifiedDate,
											};

											userFiles.add(elem);
										};
										reader.readAsDataURL(file);
										return false;
									}
								}
							}
						},
						{ view: "spacer" },
					],
				},
			],
		};
	}

	init() {
		this.$$("fileTable").parse(userFiles);
		this.window = this.ui(UserInfoFormView);
	}

	urlChange() {
		userContacts.waitData.then(() => {
			if (!userContacts.count()) {
				this.$$("uploadBtn").disable();
			} else {
				this.$$("uploadBtn").enable();
			}
		});
	}
}

class ActivityTableView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			id: "activityCell",
			rows: [
				{
					view: "datatable",
					select: true,
					localId: "activityTable",
					columns: [
						{ id: "State", header: "", template: "{common.checkbox()}", checkValue: "Open", uncheckValue: "Close", sort: "text", width: 36 },
						{ id: "TypeID", header: ["", { content: "richSelectFilter" }], collection: userActivityType, sort: "text", width: 150 },
						{ id: "DueDate", header: ["", { content: "datepickerFilter", inputConfig: { format:webix.Date.dateToStr("%d-%m-%Y") } }], width: 150, format:webix.Date.dateToStr("%d-%m-%Y"), sort: "date" },
						{ id: "Details", header: ["", { content: "textFilter" }], width: 200, fillspace: true, sort: "text" },
						{ template: "<span class='webix_icon wxi-pencil editElement'></span>", width: 50 },
						{ template: "<span class='webix_icon wxi-trash deleteElement'></span>", width: 50 },
					],
					scrollX: false,
					onClick: {
						"editElement": function (e, id) {
							let tableElem = this.getItem(id);
							this.$scope.window.showWindow(tableElem, true, "");
						},
						"deleteElement": function (e, id) {
							webix.confirm({
								title: _("Delete"),
								text: _("Do You want to delete this activity?"),
								type: "confirm-warning",
								callback: function (result) {
									if (result) {
										userActivity.remove(id);
									}
								}
							});
							return false;
						}
					},
				},
				{
					cols: [
						{ view: "spacer" },
						{
							view: "button",
							localId: "addActivityBtn",
							label: _("Add activity"),
							type: "iconButton",
							icon: "wxi-plus",
							click: () => {
								if (this.getParam("id", true)) {
									this.window.showWindow("", true, this.getParam("id", true));
								}
							},
							width: 200,
						}
					],
				},
			],
		};
	}

	init() {
		this.$$("activityTable").parse(userActivity);
		this.window = this.ui(UserInfoFormView);
	}

	urlChange() {
		userContacts.waitData.then(() => {
			if (!userContacts.count()) {
				this.$$("addActivityBtn").disable();
			} else {
				this.$$("addActivityBtn").enable();
			}
		});
	}
}
