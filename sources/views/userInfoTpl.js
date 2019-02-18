import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
import { userStatuses } from "models/userStatuses";
import { userActivity } from "models/userActivity";
import { userActivityType } from "models/userActivityType";
import { userFiles } from "models/userFiles";
import UserInfoFormView from "views/userInfoWindowForm";

export default class userInfoTplView extends JetView {
	config() {

		const activityTable = {
			id: "activityCell",
			rows: [
				{
					view: "datatable",
					select: true,
					localId: "activityTable",
					columns: [
						{ id: "State", header: "", template: "{common.checkbox()}", checkValue: "Open", uncheckValue: "Close", sort: "text", width: 36 },
						{ id: "TypeID", header: ["", { content: "selectFilter" }], collection: userActivityType, sort: "text", width: 150 },
						{ id: "DueDate", header: ["", { content: "datepickerFilter" }], width: 100, format: webix.Date.dateToStr("%d-%m-%Y"), sort: "date" },
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
								title: "Delete",
								text: "Do You want to delete this activity?",
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
							label: "Add activity",
							type: "iconButton",
							icon: "wxi-plus",
							click: () => {
								this.window.showWindow("", true, this.getParam("id", true));
							},
							width: 200,
						}
					],
				},
			],
		};

		const fileTable = {
			id: "filesCell",
			rows: [
				{
					view: "datatable",
					localId: "fileTable",
					select: true,
					columns: [
						{ id: "name", header: "Name", sort: "text", fillspace: true },
						{ id: "dataChange", header: "Change data", width: 100, format: webix.Date.dateToStr("%d %M %Y"), sort: "date" },
						{ id: "size", header: "Size", width: 100, sort: "text" },
						{ template: "<span class='webix_icon wxi-trash deleteElement'></span>", width: 50 },
					],
					scrollX: false,
					onClick: {
						"deleteElement": function (e, id) {
							webix.confirm({
								title: "Delete",
								text: "Do You want to delete this file?",
								type: "confirm-warning",
								callback: function (result) {
									if (result) {
										userFiles.remove(id);
									}
									console.log(id);
									console.log(userFiles.data.pull);
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
							label: "Upload file",
							autosend: false,
							multiple: false,
							on: {
								onBeforeFileAdd: (upload) => {
									const file = upload.file;
									const reader = new FileReader();
									reader.onload = (event) => {
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
						},
						{ view: "spacer" },
					],
				},
			],
		};

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
											label: "Delete",
											type: "icon",
											icon: "wxi-trash",
											width: 100,
											click: () => {
												if (userContacts.count()) {
													webix.confirm({
														title: "Delete",
														text: "Do You want to delete this contact?",
														type: "confirm-warning",
														callback: (result) => {
															if (result) {
																userContacts.remove(this.getParam("id", true));
																const firstId = userContacts.getFirstId()
																if (firstId) {
																	this.show(`/top/contacts?id=${firstId}/${this.getUrl()[0].page}`);
																} else {
																	this.show("/top/contacts/userInfoTpl");
																}
															}
														}
													});
												}
											},
										},
										{
											view: "button",
											label: "Edit",
											type: "iconButton",
											icon: "wxi-pencil",
											width: 100,
											click: () => {
												if (userContacts.count()) {
													this.show("./userForm/edit");
												}
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
							view: "tabbar", value: 'activityCell', multiview: true, options: [
								{ value: 'Activity', id: 'activityCell' },
								{ value: 'Files', id: 'filesCell' },
							]
						},
						{
							cells: [
								activityTable,
								fileTable
							],
						},
					],
				},
			],
		};
	}

	setTemplate() {
		return `
		<div class="user-info-block">
			<h3 class="user-info-block__name-text">#FirstName# #LastName#</h3>
			<div class="user-info-block user-info-wrap">
				<div class="user-info-wrap__block-img">
					<img src="#Photo#" class="user-info-wrap__photo" alt="user photo">
					<p class="user-info-wrap__status">#Status#</p>
				</div>
				<ul class="user-info-wrap__info-list">
					<li class="user-info-wrap__info-list-item"><span class="mdi mdi-email contact-icon"></span> <span class="contact-name">#Email#</span></li>
					<li class="user-info-wrap__info-list-item"><span class="mdi mdi-skype contact-icon"></span> <span class="contact-name">#Skype#</span></li>
					<li class="user-info-wrap__info-list-item"><span class="mdi mdi-monitor contact-icon"></span> <span class="contact-name">#Job#</span></li>
					<li class="user-info-wrap__info-list-item"><span class="mdi mdi-toolbox contact-icon"></span> <span class="contact-name">#Company#</span></li>
					<li class="user-info-wrap__info-list-item"><span class="mdi mdi-bell contact-icon"></span> <span class="contact-name">#Birthday#</span></li>
					<li class="user-info-wrap__info-list-item"><span class="mdi mdi-map-marker contact-icon"></span> <span class="contact-name">#Address#</span></li>
				</ul>
			</div>
		</div>
	`
	}

	urlChange() {
		webix.promise.all([
			userContacts.waitData,
			userStatuses.waitData,
			userActivity,
			userActivityType
		]).then(() => {
			if (userContacts.count()) {
				const id = this.getParam("id", true);
				if (id && userContacts.exists(id)) {
					this.$$("userInfoTemplate").define("template", this.setTemplate());
					this.$$("userInfoTemplate").refresh();
					const item = webix.copy(userContacts.getItem(id));
					item.Status = userStatuses.getItem(item.StatusID).Value;
					this.$$("userInfoTemplate").parse(item);

					userActivity.filter(function (obj) {
						return obj.ContactID.toString() === id;
					});
					this.$$("activityTable").parse(userActivity);

					userFiles.filter(function (obj) {
						return obj.ContactID.toString() === id;
					});
					this.$$("fileTable").parse(userFiles);
				}
			} else {
				this.$$("userInfoTemplate").define("template", "");
				this.$$("userInfoTemplate").refresh();
				this.show("/top/contacts/userInfoTpl");
			}
		});
	}

	init() {
		this.window = this.ui(UserInfoFormView);
	}
}
