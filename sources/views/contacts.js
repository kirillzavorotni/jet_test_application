import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";

export default class ContactsView extends JetView {
	config() {
		const userList = {
			view: "list",
			localId: "userList",
			width: 270,
			select: true,
			scroll: true,
			template: function (obj) {
				let firstName = obj.FirstName ? obj.FirstName : "No name";
				let lastName = obj.LastName ? obj.LastName : "No name";
				let job = obj.Job ? obj.Job : "No Info";
				let photo = obj.Photo ? obj.Photo : "https://cdn.iconscout.com/icon/free/png-256/user-avatar-contact-portfolio-personal-portrait-profile-6-5623.png";
				return `
					<div class="uset-element-wrap">
						<img src='${photo}' class='user-icon' alt='User Image'>
						<div class="wrap-user-name">
							<p class="user-name">${firstName} ${lastName}</p>
							<span class="user-works_tatus">${job}</span>
						</div>
					</div>
				`;
			},
			type: {
				height: 60,
			},
			on: {
				"onAfterSelect": (id) => {
					this.setParam("id", id, true);
				},
			},
		};

		return {
			cols: [
				{
					rows: [
						userList,
						{
							cols: [
								{ view: "spacer" },
								{
									view: "button",
									width: 200,
									localId: "addButton",
									label: "Add contact",
									type: "iconButton",
									icon: "wxi-plus",
									click: () => {
										this.show("userForm?mode=add");
									}
								},
								{ view: "spacer" },
							],
						}
					],
				},
				{ $subview: true },
			],
		};
	}

	init() {
		this.$$("userList").sync(userContacts);
		userContacts.waitData.then(() => {
			if (!this.getSubView()) {
				this.show("./userInfoTpl");
			}

			this.on(this.app, "disableBtn", () => {
				this.$$("addButton").disable();
			});

			this.on(this.app, "enableBtn", () => {
				this.$$("addButton").enable();
			});

			this.on(this.app, "setFirstIdParam", () => {
				userContacts.waitData.then(() => {
					const firstId = userContacts.getFirstId();
					if (firstId) {
						this.setParam("id", firstId, true);
					}
				});
			});

			this.on(this.app, "showTemplate", () => {
				this.show("userInfoTpl");
			});

			this.on(webix.dp(userContacts), "onAfterInsert", (response) => {
				this.$$("userList").select(response.id);
			});

		});
	}

	urlChange() {
		userContacts.waitData.then(() => {
			const id = this.getParam("id");
			if (id && userContacts.exists(id) && !this.$$("userList").getSelectedId()) {
				this.$$("userList").select(id);
			} else if (!id || !userContacts.exists(id)) {
				this.$$("userList").select(userContacts.getFirstId());
			} else if (id && userContacts.exists(id) && this.$$("userList").getSelectedId()) {
				this.$$("userList").select(id);
			}
		});
	}
}