const format1 = webix.Date.strToDate("%d-%m-%Y %H:%i");
const format2 = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const userActivity = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: function (obj) {
			obj.DueDate = format1(obj.DueDate);
			obj.Date = webix.Date.copy(obj.DueDate);
			obj.Time = webix.Date.copy(obj.DueDate);
		},
		$save: function (obj) {
			obj.DueDate = format2(obj.DueDate);
			delete obj.Time;
			delete obj.Date;
		},
	},
});