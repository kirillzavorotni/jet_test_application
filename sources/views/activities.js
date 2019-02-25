import { JetView } from "webix-jet";
import { userContacts } from "models/userContacts";
import { userActivity } from "models/userActivity";
import { userActivityType } from "models/userActivityType";
import UserInfoFormView from "views/userInfoWindowForm";

export default class ActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					cols: [
						{},
						{
							view: "button",
							label: _("Add activity"),
							type: "iconButton",
							icon: "wxi-plus-square",
							width: 200,
							click: () => {
								this.window.showWindow("", "", "");
							}
						},
					],
				},
				{
					view: "tabbar",
					localId: "tabbarFilter",
					value: "activityAll",
					options: [
						{ id: "activityAll", value: _("All") },
						{ id: "activityNotCompleted", value: _("Not completed") },
						{ id: "activityCompiled", value: _("Completed") },
						{ id: "activityOverDue", value: _("Over Due") },
						{ id: "activityToday", value: _("Today") },
						{ id: "activityTommorow", value: _("Tommorow") },
						{ id: "activityThisWeek", value: _("This Week") },
						{ id: "activityThisMounth", value: _("This Month") },
					],
					on: {
						"onChange": () => {
							this.$$("active-table").filterByAll();
						}
					}
				},
				{
					view: "datatable",
					select: true,
					localId: "active-table",
					columns: [
						{ id: "State", header: "", template: "{common.checkbox()}", checkValue: "Open", uncheckValue: "Close", sort: "text", width: 36 },
						{ id: "TypeID", header: [_("Active type"), { content: "selectFilter" }], collection: userActivityType, sort: "text", width: 100 },
						{ id: "DueDate", header: [_("Due date"), { content: "datepickerFilter", inputConfig: { timepicker: true, format: webix.Date.dateToStr("%d-%m-%Y") } }], width: 150, format: webix.Date.dateToStr("%d-%m-%Y %H:%i"), sort: "date" },
						{ id: "Details", header: [_("Details"), { content: "textFilter" }], width: 300, fillspace: true, sort: "text" },
						{ id: "ContactID", header: [_("Contact"), { content: "selectFilter" }], width: 200, collection: userContacts, sort: "text" },
						{ template: "<span class='webix_icon wxi-pencil editElement'></span>", width: 50 },
						{ template: "<span class='webix_icon wxi-trash deleteElement'></span>", width: 50 },
					],
					onClick: {
						"editElement": function (e, id) {
							let tableElem = this.getItem(id);
							this.$scope.window.showWindow(tableElem, "", "");
						},
						"deleteElement": function (e, id) {
							webix.confirm({
								title: _("Delete"),
								text: _("Do You want to delete this activity?"),
								type: "confirm-warning",
								callback: function (result) {
									if (result) {
										userActivity.remove(id);
									}
								}
							});
							return false;
						}
					},
				},
			]
		};
	}

	init() {
		userActivity.filter();
		this.$$("active-table").sync(userActivity);
		this.window = this.ui(UserInfoFormView);

		this.app.attachEvent("switchFilterValue", () => {
			this.$$("tabbarFilter").setValue("activityAll");
		});

		this.$$("active-table").registerFilter(
			this.$$("tabbarFilter"),
			{
				compare: function (value, filter, item) {
					if (filter === "activityNotCompleted") {
						return item.State === "Close";
					} else if (filter === "activityCompiled") {
						return item.State === "Open";
					} else if (filter === "activityOverDue") {
						return new Date() - item.DueDate.getTime() > 0;
					} else if (filter === "activityToday") {
						const dateFrom = new Date();
						dateFrom.setHours(0, 0, 0, 0);

						const dateTo = new Date();
						dateTo.setHours(23, 59, 59, 59);

						return item.DueDate >= dateFrom && item.DueDate < dateTo;
					} else if (filter === "activityTommorow") {
						const today = new Date().getDate();
						const tommorow = new Date(new Date().setDate(today + 1));
						const afterTomorrow = new Date(new Date().setDate(today + 2));

						tommorow.setHours(0, 0, 0, 0);
						afterTomorrow.setHours(0, 0, 0, 0);

						return item.DueDate >= tommorow && item.DueDate < afterTomorrow;
					} else if (filter === "activityThisWeek") {
						const date = new Date();
						const today = new Date().getDate();

						const currentWeekDay = (date.getDay() === 0) ? 7 : date.getDay();
						let startWeekDay = new Date(new Date().setHours(0, 0, 0, 0));
						startWeekDay = new Date(startWeekDay.setDate(today - (currentWeekDay - 1)));

						let finalWeekDay = new Date(new Date().setHours(23, 59, 59, 59));
						finalWeekDay = new Date(finalWeekDay.setDate(today + (7 - currentWeekDay)));

						return item.DueDate >= startWeekDay && item.DueDate <= finalWeekDay;
					} else if (filter === "activityThisMounth") {
						let startMonthDay = new Date(new Date().setDate(1)).setHours(0, 0, 0, 0);
						startMonthDay = new Date(startMonthDay);

						const nextMonth = startMonthDay.getMonth() + 1;

						let finishMonthDay = new Date(new Date().setMonth(nextMonth, 1)).setHours(0, 0, 0, 0);
						finishMonthDay = new Date(finishMonthDay);

						return item.DueDate >= startMonthDay && item.DueDate < finishMonthDay;
					} else {
						return true;
					}
				},
			},
			{
				getValue: function (node) {
					return node.getValue();
				},
				setValue: function (node, value) {
					node.setValue(value);
				}
			}
		);
	}

	urlChange() {
		userContacts.waitData.then(() => {
			userContacts.filter();
		});
	}
}
