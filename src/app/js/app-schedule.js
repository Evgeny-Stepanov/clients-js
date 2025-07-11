function setDateAndDayInTableHeaders() {
	const monthDayTableHeaders = document.querySelectorAll(
			".schedule-column-header__month-day",
		),
		weekDayTableHeaders = document.querySelectorAll(
			".schedule-column-header__week-day",
		),
		weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
		currentDate = new Date(),
		nextDate = new Date(currentDate);

	for (let i = 0; i < weekDays.length; i++) {
		if (i === 0) {
			monthDayTableHeaders[i].textContent = currentDate.toLocaleDateString(
				"ru",
				{
					day: "numeric",
					month: "long",
				},
			);

			weekDayTableHeaders[i].textContent = weekDays[currentDate.getDay()];
		} else {
			nextDate.setDate(nextDate.getDate() + 1);

			monthDayTableHeaders[i].textContent = nextDate.toLocaleDateString("ru", {
				day: "numeric",
				month: "long",
			});

			weekDayTableHeaders[i].textContent = weekDays[nextDate.getDay()];
		}
	}
}

setDateAndDayInTableHeaders();
