const format1 = webix.Date.strToDate("%d-%m-%Y");
const format2 = webix.Date.dateToStr("%Y-%m-%d %H:%i");
const format3 = webix.Date.dateToStr("%d %M %Y");

export const userContacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$change: function (obj) {
			obj.Birthday = format1(obj.Birthday);
			obj.StartDate = format1(obj.StartDate);
			obj.birthTPL = format3(webix.Date.copy(obj.Birthday));
			obj.value = obj.FirstName + " " + obj.LastName;

			if (!obj.Photo) {
				obj.Photo = "https://cdn.iconscout.com/icon/free/png-256/user-avatar-contact-portfolio-personal-portrait-profile-6-5623.png";
			}
			for(let key in obj) {
				if (!obj[key]) {
					obj[key] = "No Info";
				}
			}
		},
		$save: function (obj) {
			obj.Birthday = format2(obj.Birthday);
			obj.StartDate = format2(obj.StartDate);
			delete obj.birthTPL;
		},
	}
});