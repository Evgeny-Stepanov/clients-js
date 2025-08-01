import { weekDatesArray } from "./app-schedule";

function deleteAppointmentsBeforeToday() {
	const appointmentsFromStorage = JSON.parse(
		localStorage.getItem("appointments"),
	);

	if (appointmentsFromStorage) {
		const currentDate = weekDatesArray[0],
			currentYear = +currentDate.slice(-2),
			currentMonth = +currentDate.slice(3, 5),
			currentDay = +currentDate.slice(0, 2);

		let filteredAppointments = [...appointmentsFromStorage];

		for (let i = 0; i < appointmentsFromStorage.length; i++) {
			const appointmentDate = appointmentsFromStorage[i].date,
				appointmentYear = +appointmentDate.slice(-2),
				appointmentMonth = +appointmentDate.slice(3, 5),
				appointmentDay = +appointmentDate.slice(0, 2);

			let deleteCondition = false;

			if (currentYear > appointmentYear) {
				filteredAppointments = filteredAppointments.filter(
					item => item !== appointmentsFromStorage[i],
				);

				deleteCondition = true;
			}

			if (deleteCondition) continue;

			if (currentMonth > appointmentMonth) {
				filteredAppointments.push(appointmentsFromStorage[i]);

				deleteCondition = true;
			}

			if (deleteCondition) continue;

			if (currentDay > appointmentDay) {
				filteredAppointments = filteredAppointments.filter(
					item => item !== appointmentsFromStorage[i],
				);
			}
		}

		localStorage.setItem("appointments", JSON.stringify(filteredAppointments));
	}
}

deleteAppointmentsBeforeToday();
