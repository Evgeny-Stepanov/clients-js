import { dbServicesObj, dbMastersObj } from "../../db";

import { getOnlineUserStorage } from "./app-general-functions";

import { AppointmentsModal } from "./app-appointments-modal";

const weekDatesArray = [];

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

			weekDatesArray.push(
				currentDate.toLocaleDateString("ru", {
					day: "2-digit",
					month: "2-digit",
					year: "2-digit",
				}),
			);
		} else {
			nextDate.setDate(nextDate.getDate() + 1);
			monthDayTableHeaders[i].textContent = nextDate.toLocaleDateString("ru", {
				day: "numeric",
				month: "long",
			});

			weekDayTableHeaders[i].textContent = weekDays[nextDate.getDay()];

			weekDatesArray.push(
				nextDate.toLocaleDateString("ru", {
					day: "2-digit",
					month: "2-digit",
					year: "2-digit",
				}),
			);
		}
	}
}

function deleteAppointmentsBeforeToday() {
	const appointmentsFromLocalStorage = JSON.parse(
		localStorage.getItem("appointments"),
	);

	if (appointmentsFromLocalStorage) {
		const currentDate = weekDatesArray[0],
			currentYear = +currentDate.slice(-2),
			currentMonth = +currentDate.slice(3, 5),
			currentDay = +currentDate.slice(0, 2);

		let filteredAppointments = [...appointmentsFromLocalStorage];

		for (let i = 0; i < filteredAppointments.length; i++) {
			const appointmentDate = filteredAppointments[i].date,
				appointmentYear = +appointmentDate.slice(-2),
				appointmentMonth = +appointmentDate.slice(3, 5),
				appointmentDay = +appointmentDate.slice(0, 2);

			let deleteCondition = false;

			if (currentYear > appointmentYear) {
				filteredAppointments = filteredAppointments.filter(
					item => item !== filteredAppointments[i],
				);

				deleteCondition = true;
			}

			if (deleteCondition) continue;

			if (currentMonth > appointmentMonth) {
				filteredAppointments = filteredAppointments.filter(
					item => item !== filteredAppointments[i],
				);

				deleteCondition = true;
			}

			if (deleteCondition) continue;

			if (currentDay > appointmentDay) {
				filteredAppointments = filteredAppointments.filter(
					item => item !== filteredAppointments[i],
				);
			}
		}

		if (filteredAppointments.length === 0) {
			localStorage.removeItem("appointments");
		} else {
			localStorage.setItem(
				"appointments",
				JSON.stringify(filteredAppointments),
			);
		}
	}
}

function setDateAttrInTableCell() {
	const tableRowHeaders = document.querySelectorAll(".schedule-row-header");

	for (let i = 0; i < tableRowHeaders.length; i++) {
		const tableRow = tableRowHeaders[i].parentElement;

		for (let k = 0; k < 7; k++) {
			const tableCell = tableRow.querySelectorAll("td");

			tableCell[k].setAttribute(
				"data-table-date",
				weekDatesArray[k].replaceAll(".", "-"),
			);
		}
	}
}

function showAppointmentsInTable(dbServicesObject, dbMastersObject) {
	const storage = getOnlineUserStorage(),
		appointmentsFromStorage = JSON.parse(storage.getItem("appointments")),
		addedServicesFromStorage = JSON.parse(storage.getItem("addedServices")),
		tableCells = document.querySelectorAll("[data-table-time]"),
		tableCellsArray = Array.from(tableCells);

	if (appointmentsFromStorage) {
		appointmentsFromStorage.forEach(appointment => {
			const date = appointment.date,
				time = appointment.time,
				serviceId = +appointment.service,
				neededTableCell = tableCellsArray.find(
					tableCell =>
						tableCell.getAttribute("data-table-date") === date &&
						tableCell.getAttribute("data-table-time") === time,
				);

			let serviceMatchCondition = false;

			dbServicesObject.forEach(serviceObject => {
				if (serviceObject.id === serviceId) {
					const serviceName = serviceObject.name;
					neededTableCell.querySelector("div").textContent = serviceName;

					serviceMatchCondition = true;
				}
			});

			if (!serviceMatchCondition && addedServicesFromStorage) {
				addedServicesFromStorage.forEach(serviceObject => {
					if (+serviceObject.id === serviceId) {
						const serviceName = serviceObject.name;
						neededTableCell.querySelector("div").textContent = serviceName;
					}
				});
			}

			neededTableCell.classList.add("schedule-appointment");

			neededTableCell.onclick = () => {
				new AppointmentsModal(dbServicesObject, dbMastersObject).showMainModal(
					neededTableCell,
				);
			};
		});
	}
}

setDateAndDayInTableHeaders();
deleteAppointmentsBeforeToday();
setDateAttrInTableCell();
showAppointmentsInTable(dbServicesObj, dbMastersObj);

export { weekDatesArray, showAppointmentsInTable };
