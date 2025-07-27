import { dbServicesObj, dbMastersObj } from "../../db";

import { ServicesModalForClient } from "./app-services-modal-for-client";
import { MastersModalForClient } from "./app-masters-modal-for-client";

import { weekDatesArray } from "./app-schedule";

import { addBlockScroll, removeBlockScroll } from "./app-general-functions";

class Appointment {
	constructor() {}

	showModal() {
		const appointmentModal = document.querySelector(
				"[data-modal='create-appointment']",
			),
			appointmentModalCloseButton = appointmentModal.querySelector(
				"[data-action-button='close']",
			),
			appointmentModalServicesSelect = appointmentModal.querySelector(
				"[data-custom-select='service']",
			),
			appointmentModalMastersSelect = appointmentModal.querySelector(
				"[data-custom-select='master']",
			),
			appointmentModalDatesSelect = appointmentModal.querySelector(
				"[data-custom-select='date']",
			),
			appointmentModalTimesSelect = appointmentModal.querySelector(
				"[data-custom-select='time']",
			);

		this.createAppointmentModalServicesSelectListItems(
			appointmentModalServicesSelect,
		);
		this.createAppointmentModalMastersSelectListItems(
			appointmentModalMastersSelect,
		);
		this.createAppointmentModalDatesSelectListItems(
			appointmentModalDatesSelect,
		);

		appointmentModal.showModal();
		addBlockScroll();
		//this.validate

		this.addModalSelectDropdown(appointmentModalServicesSelect);

		this.addModalSelectDropdown(appointmentModalMastersSelect);

		this.addModalSelectDropdown(appointmentModalDatesSelect);

		this.addModalSelectDropdown(appointmentModalTimesSelect);

		this.closeModalSelectDropdownWithBackdropClick(appointmentModal);

		this.closeModal(
			appointmentModal,
			appointmentModalCloseButton,
			appointmentModalServicesSelect,
			appointmentModalMastersSelect,
			appointmentModalDatesSelect,
		);
	}

	createAppointmentModalServicesSelectListItems(
		appointmentModalServicesSelect,
	) {
		const servicesMainModal = new ServicesModalForClient(
				dbServicesObj,
			).createMainModal(),
			servicesMainModalListItems = servicesMainModal.querySelectorAll("li"),
			appointmentModalServicesSelectList =
				appointmentModalServicesSelect.querySelector(
					".content-form__field-select-list",
				);

		if (servicesMainModalListItems.length === 0) {
			appointmentModalServicesSelectList.innerHTML = `<li class="content-form__field-select-list-item">Услуги отсутствуют</li>`;
		} else {
			servicesMainModalListItems.forEach(listItem => {
				const serviceName = listItem
						.querySelector("div span:first-child")
						.textContent.slice(0, -2),
					serviceValue = listItem.getAttribute("data-value"),
					appointmentModalServicesSelectListItem = document.createElement("li");

				appointmentModalServicesSelectListItem.textContent = serviceName;
				appointmentModalServicesSelectListItem.classList.add(
					"content-form__field-select-list-item",
				);
				appointmentModalServicesSelectListItem.setAttribute(
					"data-value",
					serviceValue,
				);

				appointmentModalServicesSelectList.append(
					appointmentModalServicesSelectListItem,
				);
			});
		}
	}

	createAppointmentModalMastersSelectListItems(appointmentModalMastersSelect) {
		const mastersMainModal = new MastersModalForClient(
				dbMastersObj,
			).createMainModal(),
			mastersMainModalListItems = mastersMainModal.querySelectorAll("li"),
			appointmentModalMastersSelectList =
				appointmentModalMastersSelect.querySelector(
					".content-form__field-select-list",
				);

		if (mastersMainModalListItems.length === 0) {
			appointmentModalMastersSelectList.innerHTML = `<li class="content-form__field-select-list-item">Мастера отсутствуют</li>`;
		} else {
			mastersMainModalListItems.forEach(listItem => {
				const masterFullName = listItem.querySelector("div span").textContent,
					masterValue = listItem.getAttribute("data-value"),
					appointmentModalMastersSelectListItem = document.createElement("li");

				appointmentModalMastersSelectListItem.textContent = masterFullName;
				appointmentModalMastersSelectListItem.classList.add(
					"content-form__field-select-list-item",
				);
				appointmentModalMastersSelectListItem.setAttribute(
					"data-value",
					masterValue,
				);

				appointmentModalMastersSelectList.append(
					appointmentModalMastersSelectListItem,
				);
			});
		}
	}

	createAppointmentModalDatesSelectListItems(appointmentModalDatesSelect) {
		const columnHeadersWithDate = document.querySelectorAll(
				".schedule-column-header",
			),
			appointmentModalDatesSelectList =
				appointmentModalDatesSelect.querySelector(
					".content-form__field-select-list",
				);

		columnHeadersWithDate.forEach((date, i) => {
			const monthDay = date.querySelector(
					".schedule-column-header__month-day",
				).textContent,
				weekDay = date.querySelector(
					".schedule-column-header__week-day",
				).textContent,
				appointmentModalDatesSelectListItem = document.createElement("li");

			appointmentModalDatesSelectListItem.textContent = `${monthDay}, ${weekDay}`;
			appointmentModalDatesSelectListItem.classList.add(
				"content-form__field-select-list-item",
			);
			appointmentModalDatesSelectListItem.setAttribute(
				"data-value",
				weekDatesArray[i].replaceAll(".", "-"),
			);

			appointmentModalDatesSelectList.append(
				appointmentModalDatesSelectListItem,
			);
		});
	}

	addModalSelectDropdown(select) {
		const dropdownButton = select.querySelector(
				".content-form__field-select-button",
			),
			dropdownList = select.querySelector(".content-form__field-select-list"),
			dropdownListItems = dropdownList.querySelectorAll(
				".content-form__field-select-list-item",
			);

		dropdownButton.onclick = () => {
			const openDropdownList = document.querySelector(
				".content-form__field-select-list--is-open",
			);

			if (openDropdownList && openDropdownList !== dropdownList) {
				openDropdownList.classList.remove(
					"content-form__field-select-list--is-open",
				);
			}

			dropdownList.style.width = getComputedStyle(dropdownButton).width;
			dropdownList.classList.toggle("content-form__field-select-list--is-open");
		};

		dropdownButton.textContent = dropdownListItems[0].textContent;
		dropdownButton.setAttribute(
			"data-value",
			dropdownListItems[0].getAttribute("data-value"),
		);

		dropdownListItems.forEach(listItem => {
			listItem.onclick = () => {
				const dataValue = listItem.getAttribute("data-value");
				dropdownButton.setAttribute("data-value", dataValue);
				dropdownButton.textContent = listItem.textContent;
				dropdownList.classList.remove(
					"content-form__field-select-list--is-open",
				);
			};
		});
	}

	closeModalSelectDropdownWithBackdropClick(modal) {
		modal.querySelector(".modal__content-wrapper").onclick = evt => {
			const openDropdownList = modal.querySelector(
				".content-form__field-select-list--is-open",
			);

			if (openDropdownList) {
				const openDropdownButton = openDropdownList.previousElementSibling;

				if (
					!openDropdownButton.contains(evt.target) &&
					!openDropdownList
						.querySelector(".content-form__field-select-list-item")
						.contains(evt.target)
				) {
					openDropdownList.classList.remove(
						"content-form__field-select-list--is-open",
					);
				}
			}
		};
	}

	closeModal(
		modal,
		modalCloseButton,
		servicesSelect,
		mastersSelect,
		datesSelect,
	) {
		document.addEventListener("keyup", closeModalWithEsc);

		modal.onclick = ({ currentTarget, target }) => {
			const isClickedOnBackdrop = target === currentTarget;
			if (isClickedOnBackdrop) {
				modal.close();
				clearSelect(servicesSelect);
				clearSelect(mastersSelect);
				clearSelect(datesSelect);
				removeBlockScroll();
				document.removeEventListener("keyup", closeModalWithEsc);
			}
		};

		modalCloseButton.onclick = () => {
			modal.close();
			clearSelect(servicesSelect);
			clearSelect(mastersSelect);
			clearSelect(datesSelect);
			removeBlockScroll();
			document.removeEventListener("keyup", closeModalWithEsc);
		};

		function closeModalWithEsc(evt) {
			if (evt.code === "Escape") {
				modal.close();
				clearSelect(servicesSelect);
				clearSelect(mastersSelect);
				clearSelect(datesSelect);
				removeBlockScroll();
				document.removeEventListener("keyup", closeModalWithEsc);
			}
		}

		function clearSelect(select) {
			const selectList = select.querySelector(
				".content-form__field-select-list",
			);
			selectList.innerHTML = "";
		}
	}
}

export { Appointment };
