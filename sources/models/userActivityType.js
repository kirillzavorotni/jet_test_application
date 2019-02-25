export const userActivityType = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/",
	save: "rest->http://localhost:8096/api/v1/activitytypes/",
	scheme: {
		$change: function (obj) {
			obj.value = `<span class="fas fa-${obj.Icon}"></span> -- ${obj.Value}`;
		}
	}
});