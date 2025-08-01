import { dbServicesObj, dbMastersObj } from "../../db";

import { ServicesModalForClient } from "./app-services-modal-for-client";
import { MastersModalForClient } from "./app-masters-modal-for-client";

import { weekDatesArray } from "./app-schedule";

import {
	getOnlineUserStorage,
	addBlockScroll,
	removeBlockScroll,
	resetModalStates,
} from "./app-general-functions";

import {
	createInputErrorMessage,
	showInputErrorMessage,
	recolorInvalidInputBorder,
} from "../../auth/js/auth-form-general-functions";

import { showNotification } from "../../auth/js/auth-notification";

class AppointmentModal {
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

		this.addModalSelectDropdown(
			appointmentModal,
			appointmentModalServicesSelect,
		);

		this.addModalSelectDropdown(
			appointmentModal,
			appointmentModalMastersSelect,
		);

		this.addModalSelectDropdown(appointmentModal, appointmentModalDatesSelect);

		this.addModalSelectDropdown(appointmentModal, appointmentModalTimesSelect);

		appointmentModal.showModal();
		addBlockScroll();

		this.validateModalForm(
			appointmentModal,
			appointmentModalServicesSelect,
			appointmentModalMastersSelect,
			appointmentModalDatesSelect,
		);

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

	addModalSelectDropdown(modal, select) {
		const dropdownButton = select.querySelector(
				".content-form__field-select-button",
			),
			dropdownList = select.querySelector(".content-form__field-select-list"),
			dropdownListItems = dropdownList.querySelectorAll(
				".content-form__field-select-list-item",
			);

		dropdownButton.onclick = () => {
			const openDropdownList = modal.querySelector(
					".content-form__field-select-list--is-open",
				),
				activeDropdownButton = modal.querySelector(
					".content-form__field-select-button--is-active",
				);

			if (openDropdownList && openDropdownList !== dropdownList) {
				openDropdownList.classList.remove(
					"content-form__field-select-list--is-open",
				);
			}

			if (activeDropdownButton && activeDropdownButton !== dropdownButton) {
				activeDropdownButton.classList.remove(
					"content-form__field-select-button--is-active",
				);
			}

			dropdownList.style.width = getComputedStyle(dropdownButton).width;
			dropdownList.classList.toggle("content-form__field-select-list--is-open");
			dropdownButton.classList.toggle(
				"content-form__field-select-button--is-active",
			);
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
				dropdownButton.classList.remove(
					"content-form__field-select-button--is-active",
				);
				dropdownList.classList.remove(
					"content-form__field-select-list--is-open",
				);
			};
		});
	}

	validateModalForm(modal, servicesSelect, mastersSelect, datesSelect) {
		const form = modal.querySelector(".modal__content-form"),
			inputs = form.querySelectorAll("input"),
			submitButton = form.querySelector("button[type='submit']");

		inputs.forEach(input => {
			bindBlurEvents(input);
		});

		const validateOnSubmit = (submitButton, modal) => {
			submitButton.onclick = evt => {
				evt.preventDefault();

				let countOfInvalidTextInputs = 0;

				inputs.forEach(input => {
					if (createInputErrorMessage(input)) {
						showInputErrorMessage(createInputErrorMessage(input), input, null);
						recolorInvalidInputBorder(createInputErrorMessage(input), input);
						countOfInvalidTextInputs++;
					}
				});

				if (countOfInvalidTextInputs === 0) {
					const formData = new FormData(form),
						selectedListOptions = form.querySelectorAll(
							".content-form__field-select-button",
						);

					selectedListOptions.forEach(selectedOption => {
						const formDataKey =
								selectedOption.parentElement.getAttribute("data-custom-select"),
							formDataValue = selectedOption.getAttribute("data-value");

						formData.append(formDataKey, formDataValue);
					});

					const formDataObj = Object.fromEntries(formData.entries());

					this.setAppointmentItemInStorage(
						formDataObj,
						modal,
						servicesSelect,
						mastersSelect,
						datesSelect,
					);
				}
			};
		};

		validateOnSubmit(submitButton, modal);

		function bindBlurEvents(input) {
			input.onblur = () => {
				showInputErrorMessage(createInputErrorMessage(input), input, null);
				recolorInvalidInputBorder(createInputErrorMessage(input), input);
			};
		}
	}

	setAppointmentItemInStorage(
		formDataObj,
		modal,
		servicesSelect,
		mastersSelect,
		datesSelect,
	) {
		const { date, time } = formDataObj,
			storage = getOnlineUserStorage(),
			itemsArray = [formDataObj];

		let matchingCondition = false;

		if (storage.getItem("appointments")) {
			const itemsArray = JSON.parse(storage.getItem("appointments"));

			itemsArray.forEach(itemArray => {
				if (itemArray.date === date && itemArray.time === time) {
					showNotification(
						"[data-notification='create-appointment']",
						"Данная дата и время уже заняты. Выберите другой день или время",
						"error",
					);
					matchingCondition = true;
				}
			});

			if (matchingCondition) {
				return;
			}

			itemsArray.push(formDataObj);
			storage.setItem("appointments", JSON.stringify(itemsArray));
		} else {
			storage.setItem("appointments", JSON.stringify(itemsArray));
		}

		modal.close();
		this.clearSelect(servicesSelect);
		this.clearSelect(mastersSelect);
		this.clearSelect(datesSelect);
		this.resetModalStates(modal);
		removeBlockScroll();
	}

	clearSelect(select) {
		const selectList = select.querySelector(".content-form__field-select-list");
		selectList.innerHTML = "";
	}

	closeModalSelectDropdownWithBackdropClick(modal) {
		modal.querySelector(".modal__content-wrapper").onclick = evt => {
			const openDropdownList = modal.querySelector(
				".content-form__field-select-list--is-open",
			);

			if (openDropdownList) {
				const activeDropdownButton = openDropdownList.previousElementSibling;

				if (
					!activeDropdownButton.contains(evt.target) &&
					!openDropdownList
						.querySelector(".content-form__field-select-list-item")
						.contains(evt.target)
				) {
					openDropdownList.classList.remove(
						"content-form__field-select-list--is-open",
					);
					activeDropdownButton.classList.remove(
						"content-form__field-select-button--is-active",
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
		modal.onclick = ({ currentTarget, target }) => {
			const isClickedOnBackdrop = target === currentTarget;
			if (isClickedOnBackdrop) {
				modal.close();
				this.clearSelect(servicesSelect);
				this.clearSelect(mastersSelect);
				this.clearSelect(datesSelect);
				this.resetModalStates(modal);
				removeBlockScroll();
				document.removeEventListener("keyup", closeModalWithEsc);
			}
		};

		modalCloseButton.onclick = () => {
			modal.close();
			this.clearSelect(servicesSelect);
			this.clearSelect(mastersSelect);
			this.clearSelect(datesSelect);
			this.resetModalStates(modal);
			removeBlockScroll();
			document.removeEventListener("keyup", closeModalWithEsc);
		};

		const closeModalWithEsc = evt => {
			if (evt.code === "Escape") {
				modal.close();
				this.clearSelect(servicesSelect);
				this.clearSelect(mastersSelect);
				this.clearSelect(datesSelect);
				this.resetModalStates(modal);
				removeBlockScroll();
				document.removeEventListener("keyup", closeModalWithEsc);
			}
		};

		document.addEventListener("keyup", closeModalWithEsc);
	}

	resetModalStates(modal) {
		const form = modal.querySelector(".modal__content-form"),
			formInputs = form.querySelectorAll("input"),
			formErrorSpans = form.querySelectorAll(".content-form__field-error"),
			openDropdownList = form.querySelector(
				".content-form__field-select-list--is-open",
			),
			modalNotification = modal.querySelector(".notification");

		if (openDropdownList) {
			const activeDropdownButton = openDropdownList.previousElementSibling;

			openDropdownList.classList.remove(
				"content-form__field-select-list--is-open",
			);
			activeDropdownButton.classList.remove(
				"content-form__field-select-button--is-active",
			);
		}

		resetModalStates(form, formInputs, formErrorSpans, modalNotification);
	}
}

export { AppointmentModal };
