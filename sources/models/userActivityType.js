export const userActivityType = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/",
	save: "rest->http://localhost:8096/api/v1/activitytypes/",
	scheme: {
		$init: function(obj) {
			obj.value = obj.Value;
		}
	}
});