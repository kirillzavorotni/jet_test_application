const format = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const userContacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$change: function (obj) {
			obj.value = obj.FirstName + " " + obj.LastName;
		},
		$save: function (obj) {
			obj.Birthday = format(obj.Birthday);
			obj.StartDate = format(obj.StartDate);
		},
	}
});