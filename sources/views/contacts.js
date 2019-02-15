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
					<img src='https://cdn.iconscout.com/icon/free/png-256/user-avatar-contact-portfolio-personal-portrait-profile-6-5623.png' class='user-icon' alt='User Image'>
					<div class="wrap-user-name">
						<p class="user-name">#FirstName# #LastName#</p>
						<span class="user-works_tatus">#Job#</span>
					</div>
				</div>
			`,
			type: {
				height: 60,
			},
			autoheight: false,
			on: {
				onAfterSelect: (id) => {
					this.setParam("id", id, true);
				},
			},
		};

		return {
			cols: [
				userList,
				{ $subview: "userInfoTpl", name: "infoTpl" },
			],
		};
	}

	init() {
		this.$$("userList").sync(userContacts);
	}

	urlChange() {
		userContacts.waitData.then(() => {
			const id = this.getParam("id");

			if (id && this.$$("userList").exists(id)) {
				this.$$("userList").select(id);
			} else {
				this.$$("userList").select(userContacts.getFirstId());
			}
			
		});
	}
}