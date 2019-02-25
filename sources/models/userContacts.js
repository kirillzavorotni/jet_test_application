const format1 = webix.Date.strToDate("%d-%m-%Y");
const format2 = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const userContacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$change: function (obj) {
			obj.Birthday = format1(obj.Birthday);
			obj.StartDate = format1(obj.StartDate);
			obj.value = obj.FirstName + " " + obj.LastName;
		},
		$save: function (obj) {
			obj.Birthday = format2(obj.Birthday);
			obj.StartDate = format2(obj.StartDate);
		},
	}
});