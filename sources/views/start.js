import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";

export default class DataView extends JetView {
	config() {
		return {
			cols: [
				{
					view: "list",
					localId: "userList",
					select: true,
					scroll: true,
					template: `
						<div class="uset-element-wrap">
							<img src='https://cdn.iconscout.com/icon/free/png-256/user-avatar-contact-portfolio-personal-portrait-profile-6-5623.png' class='user-icon' alt='Uset Image'>
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

				},
				{ template: "Name Surname" },
			],
		};
	}

	init() {
		const userList = this.$$("userList");
		userList.sync(userContacts);

		userContacts.waitData.then(() => {
			userList.select(userContacts.getFirstId());
		});
	}

	urlChange() {
	}
}