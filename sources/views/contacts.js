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
			template: `
				<div class="uset-element-wrap">
					<img src='#Photo#' class='user-icon' alt='User Image'>
					<div class="wrap-user-name">
						<p class="user-name">#FirstName# #LastName#</p>
						<span class="user-works_tatus">#Job#</span>
					</div>
				</div>
			`,
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
							view: "button",
							localId: "addButton",
							label: "Add contact",
							type: "iconButton",
							icon: "wxi-plus",
							click: () => {
								if (this.getUrl().length < 3) {
									this.show("./userForm/add");
								}
							}
						},
					],
				},
				{ $subview: true },
			],
		};
	}

	init(view, url) {
		this.$$("userList").sync(userContacts);
		userContacts.waitData.then(() => {
			if (url.length < 2) {
				this.show("./userInfoTpl");
			}
		});
	}

	urlChange() {
		userContacts.waitData.then(() => {
				const id = this.getParam("id");
				if (id && userContacts.exists(id)) {
					this.$$("userList").select(id);
				} else {
					this.$$("userList").select(userContacts.getFirstId());
					this.setParam("id", userContacts.getFirstId(), true);
				}
		});
	}
}