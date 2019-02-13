import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
import { userStatuses } from "models/userStatuses";

export default class userInfoTplView extends JetView {
	config() {
		return {
			rows: [
				{
					cols: [
						{
							view: "template",
							localId: "userInfoTemplate",
							template: `
								<div class="user-info-block">
									<h3 class="user-info-block__name-text">#FirstName# #LastName#</h3>
									<div class="user-info-block user-info-wrap">
										<div class="user-info-wrap__block-img">
											<img src="https://cdn.iconscout.com/icon/free/png-256/user-avatar-contact-portfolio-personal-portrait-profile-6-5623.png" class="user-info-wrap__photo" alt="user photo">
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
							`,
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
										},
										{
											view: "button",
											label: "Edit",
											type: "iconButton",
											icon: "wxi-pencil",
											width: 100,
										},
									],
								},
								{ view: "spacer" },
							],
						},
					]
				},
			],
		};
	}

	urlChange() {
		webix.promise.all([
			userContacts.waitData,
			userStatuses.waitData
		]).then(() => {
			// this.getParam("id") - NOT WORKING
			const parentView = this.getParentView();
			const id = parentView.getParam("id");
			
			const item = webix.copy(userContacts.getItem(id));
			item.Status = userStatuses.getItem(item.StatusID).Value;
			this.$$("userInfoTemplate").parse(item);
		});
	}
}
