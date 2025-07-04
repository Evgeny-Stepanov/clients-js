function setDateAndDayInTableHeaders() {
	const monthDayTableHeaders = document.querySelectorAll(
			".schedule-table__month-day-header",
		),
		weekDayTableHeaders = document.querySelectorAll(
			".schedule-table__week-day-header",
		),
		weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
		today = new Date(),
		nextDay = new Date(today);

	for (let i = 0; i < weekDays.length; i++) {
		if (i === 0) {
			monthDayTableHeaders[i].textContent = today.toLocaleDateString("ru", {
				day: "numeric",
				month: "long",
			});
			weekDayTableHeaders[i].textContent = weekDays[today.getDay()];
		} else {
			nextDay.setDate(nextDay.getDate() + 1);
			monthDayTableHeaders[i].textContent = nextDay.toLocaleDateString("ru", {
				day: "numeric",
				month: "long",
			});
			weekDayTableHeaders[i].textContent = weekDays[nextDay.getDay()];
		}
	}
}

setDateAndDayInTableHeaders();
