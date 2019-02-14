export const userActivity = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: function (obj) {
			const format = webix.Date.strToDate("%d-%m-%Y %H:%i");
			obj.DueDate = format(obj.DueDate);
			obj.Date = webix.Date.copy(obj.DueDate);
			obj.Time = webix.Date.copy(obj.DueDate);
		},
		$save: function (obj) {
			const format = webix.Date.dateToStr("%Y-%m-%d %H:%i");
			obj.DueDate = format(obj.DueDate);
		},
	},
});