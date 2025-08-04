import { ServicesModalForClient } from "./app-services-modal-for-client";
import { MastersModalForClient } from "./app-masters-modal-for-client";

import { weekDatesArray, showAppointmentsInTable } from "./app-schedule";

import {
	getOnlineUserStorage,
	addBlockScroll,
	removeBlockScroll,
	resetModalStates,
	closeModalWithRemoveAndEsc,
} from "./app-general-functions";

import {
	createInputErrorMessage,
	showInputErrorMessage,
	recolorInvalidInputBorder,
} from "../../auth/js/auth-form-general-functions";

import { showNotification } from "../../auth/js/auth-notification";

class AppointmentsModal {
	constructor(dbServicesObj, dbMastersObj) {
		this.dbServicesObj = dbServicesObj;
		this.dbMastersObj = dbMastersObj;
	}

	createMainModal(neededTableCell) {
		const {
			modal,
			modalDivForScroll,
			modalContent,
			modalTitle,
			modalList,
			modalCloseButton,
		} = this.createMainModalStructure();

		modal.setAttribute("data-modal", "show-appointment");

		this.createMainModalListItems(modalList, neededTableCell);

		modalTitle.textContent = "Информация о записи";

		modalContent.append(modalTitle, modalList, modalCloseButton);
		modalDivForScroll.append(modalContent);
		modal.append(modalDivForScroll);

		return modal;
	}

	createMainModalStructure() {
		const modal = document.createElement("dialog"),
			modalDivForScroll = document.createElement("div"),
			modalContent = document.createElement("div"),
			modalTitle = document.createElement("h2"),
			modalList = document.createElement("ul"),
			modalCloseButton = document.createElement("button");

		modal.classList.add("app__modal", "modal");
		modalDivForScroll.classList.add("modal__content-wrapper");
		modalContent.classList.add("modal__content");
		modalTitle.classList.add("visually-hidden");
		modalList.classList.add("modal__content-list", "content-list");
		modalCloseButton.classList.add("modal__content-close-button");
		modalCloseButton.setAttribute("type", "button");
		modalCloseButton.setAttribute("data-action-button", "close");

		modalCloseButton.innerHTML = `
			<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path fill="#010101" fill-rule="evenodd" d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960S64 759.4 64 512S264.6 64 512 64m0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372s372-166.6 372-372s-166.6-372-372-372m128.013 198.826c.023.007.042.018.083.059l45.02 45.019c.04.04.05.06.058.083a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082L557.254 512l127.861 127.862a.268.268 0 0 1 .05.06l.009.023a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082l-45.019 45.02c-.04.04-.06.05-.083.058a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059L512 557.254L384.14 685.115c-.042.041-.06.052-.084.059a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059l-45.02-45.019a.199.199 0 0 1-.058-.083a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082L466.745 512l-127.86-127.86a.268.268 0 0 1-.05-.061l-.009-.023a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082l45.019-45.02c.04-.04.06-.05.083-.058a.118.118 0 0 1 .07 0c.022.007.041.018.082.059L512 466.745l127.862-127.86c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"/></svg>
				`;

		return {
			modal,
			modalDivForScroll,
			modalContent,
			modalTitle,
			modalList,
			modalCloseButton,
		};
	}

	createMainModalListItems(list, neededTableCell) {
		const {
			dateFromNeededTableCell,
			timeFromNeededTableCell,
			appointmentClientName,
			appointmentClientPhone,
			serviceName,
			servicePrice,
			masterFullName,
		} = this.getAppointmentDataFromStorage(neededTableCell);

		list.innerHTML = `
			<li>Клиент: ${appointmentClientName}</li>
			<li>Номер телефона: ${appointmentClientPhone}</li>
			<li>Дата: ${dateFromNeededTableCell} </li>
			<li>Время: ${timeFromNeededTableCell}</li>
			<li>Услуга: ${serviceName}</li>
			<li>Мастер: ${masterFullName}</li>
			<li>Стоимость: ${servicePrice}</li>
			<li><button class="button button--black-text" type="button">Удалить</button></li>
		`;
	}

	showMainModal(neededTableCell) {
		const modal = this.createMainModal(neededTableCell),
			modalCloseButton = modal.querySelector("[data-action-button='close']");

		document.body.append(modal);
		modal.showModal();
		addBlockScroll();

		this.closeMainModal(modal, modalCloseButton);
	}

	getAppointmentDataFromStorage(neededTableCell) {
		const storage = getOnlineUserStorage(),
			dateFromNeededTableCell = neededTableCell.getAttribute("data-table-date"),
			timeFromNeededTableCell = neededTableCell.getAttribute("data-table-time"),
			appointmentsFromStorage = JSON.parse(storage.getItem("appointments")),
			addedServicesFromStorage = JSON.parse(storage.getItem("addedServices")),
			addedMastersFromStorage = JSON.parse(storage.getItem("addedMasters")),
			appointment = appointmentsFromStorage.find(
				appointment =>
					appointment.date === dateFromNeededTableCell &&
					appointment.time === timeFromNeededTableCell,
			),
			appointmentServiceId = +appointment.service,
			appointmentMasterId = +appointment.master,
			appointmentClientName = appointment["name-client"],
			appointmentClientPhone = appointment["phone-client"];

		let serviceName,
			servicePrice,
			masterFullName,
			serviceMatchCondition = false,
			masterMatchCondition = false;

		//console.log("masters", this.dbMastersObj);
		//console.log("services", this.dbServicesObj);

		this.dbServicesObj.forEach(serviceObject => {
			if (serviceObject.id === appointmentServiceId) {
				serviceName = serviceObject.name;
				servicePrice = serviceObject.price;

				serviceMatchCondition = true;
			}
		});

		if (!serviceMatchCondition && addedServicesFromStorage) {
			addedServicesFromStorage.forEach(serviceObject => {
				if (+serviceObject.id === appointmentServiceId) {
					serviceName = serviceObject.name;
					servicePrice = serviceObject.price;
				}
			});
		}

		this.dbMastersObj.forEach(masterObject => {
			if (masterObject.id === appointmentMasterId) {
				masterFullName = `${masterObject.name} ${masterObject.surname}`;

				masterMatchCondition = true;
			}
		});

		if (!masterMatchCondition && addedMastersFromStorage) {
			addedMastersFromStorage.forEach(masterObject => {
				if (+masterObject.id === appointmentMasterId) {
					masterFullName = `${masterObject.name} ${masterObject.surname}`;
				}
			});
		}

		return {
			dateFromNeededTableCell,
			timeFromNeededTableCell,
			appointmentClientName,
			appointmentClientPhone,
			serviceName,
			servicePrice,
			masterFullName,
		};
	}

	closeMainModal(modal, modalCloseButton) {
		closeModalWithRemoveAndEsc(modal, modalCloseButton);
	}

	showAddModal() {
		const modal = document.querySelector("[data-modal='create-appointment']"),
			modalCloseButton = modal.querySelector("[data-action-button='close']"),
			modalServicesSelect = modal.querySelector(
				"[data-custom-select='service']",
			),
			modalMastersSelect = modal.querySelector("[data-custom-select='master']"),
			modalDatesSelect = modal.querySelector("[data-custom-select='date']"),
			modalTimeSelect = modal.querySelector("[data-custom-select='time']");

		this.createAddModalServicesSelectListItems(modalServicesSelect);
		this.createAddModalMastersSelectListItems(modalMastersSelect);
		this.createAddModalDatesSelectListItems(modalDatesSelect);

		this.addModalSelectDropdown(modal, modalServicesSelect);

		this.addModalSelectDropdown(modal, modalMastersSelect);

		this.addModalSelectDropdown(modal, modalDatesSelect);

		this.addModalSelectDropdown(modal, modalTimeSelect);

		modal.showModal();
		addBlockScroll();

		this.validateAddModalForm(
			modal,
			modalServicesSelect,
			modalMastersSelect,
			modalDatesSelect,
		);

		this.closeAddModalSelectDropdownWithBackdropClick(modal);

		this.closeAddModal(
			modal,
			modalCloseButton,
			modalServicesSelect,
			modalMastersSelect,
			modalDatesSelect,
		);
	}

	createAddModalServicesSelectListItems(modalServicesSelect) {
		const mainServicesModal = new ServicesModalForClient(
				this.dbServicesObj,
			).createMainModal(),
			mainServicesModalListItems = mainServicesModal.querySelectorAll("li"),
			addModalServicesSelectList = modalServicesSelect.querySelector(
				".content-form__field-select-list",
			);

		if (mainServicesModalListItems.length === 0) {
			addModalServicesSelectList.innerHTML = `<li class="content-form__field-select-list-item">Услуги отсутствуют</li>`;
		} else {
			mainServicesModalListItems.forEach(listItem => {
				const serviceName = listItem
						.querySelector("div span:first-child")
						.textContent.slice(0, -2),
					serviceValue = listItem.getAttribute("data-value"),
					addModalServicesSelectListItem = document.createElement("li");

				addModalServicesSelectListItem.textContent = serviceName;
				addModalServicesSelectListItem.classList.add(
					"content-form__field-select-list-item",
				);
				addModalServicesSelectListItem.setAttribute("data-value", serviceValue);

				addModalServicesSelectList.append(addModalServicesSelectListItem);
			});
		}
	}

	createAddModalMastersSelectListItems(modalMastersSelect) {
		const mainMastersModal = new MastersModalForClient(
				this.dbMastersObj,
			).createMainModal(),
			mainMastersModalListItems = mainMastersModal.querySelectorAll("li"),
			addModalMastersSelectList = modalMastersSelect.querySelector(
				".content-form__field-select-list",
			);

		if (mainMastersModalListItems.length === 0) {
			addModalMastersSelectList.innerHTML = `<li class="content-form__field-select-list-item">Мастера отсутствуют</li>`;
		} else {
			mainMastersModalListItems.forEach(listItem => {
				const masterFullName = listItem.querySelector("div span").textContent,
					masterValue = listItem.getAttribute("data-value"),
					addModalMastersSelectListItem = document.createElement("li");

				addModalMastersSelectListItem.textContent = masterFullName;
				addModalMastersSelectListItem.classList.add(
					"content-form__field-select-list-item",
				);
				addModalMastersSelectListItem.setAttribute("data-value", masterValue);

				addModalMastersSelectList.append(addModalMastersSelectListItem);
			});
		}
	}

	createAddModalDatesSelectListItems(modalDatesSelect) {
		const columnHeadersWithDate = document.querySelectorAll(
				".schedule-column-header",
			),
			addModalDatesSelectList = modalDatesSelect.querySelector(
				".content-form__field-select-list",
			);

		columnHeadersWithDate.forEach((date, i) => {
			const monthDay = date.querySelector(
					".schedule-column-header__month-day",
				).textContent,
				weekDay = date.querySelector(
					".schedule-column-header__week-day",
				).textContent,
				addModalDatesSelectListItem = document.createElement("li");

			addModalDatesSelectListItem.textContent = `${monthDay}, ${weekDay}`;
			addModalDatesSelectListItem.classList.add(
				"content-form__field-select-list-item",
			);
			addModalDatesSelectListItem.setAttribute(
				"data-value",
				weekDatesArray[i].replaceAll(".", "-"),
			);

			addModalDatesSelectList.append(addModalDatesSelectListItem);
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

	validateAddModalForm(modal, servicesSelect, mastersSelect, datesSelect) {
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
						selectedSelectOptions = form.querySelectorAll(
							".content-form__field-select-button",
						);

					selectedSelectOptions.forEach(selectedOption => {
						const formDataKey =
								selectedOption.parentElement.getAttribute("data-custom-select"),
							formDataValue = selectedOption.getAttribute("data-value");

						formData.append(formDataKey, formDataValue);
					});

					const formDataObj = Object.fromEntries(formData.entries());

					this.setAddedItemInStorage(
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

	setAddedItemInStorage(
		formDataObj,
		addModal,
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

		addModal.close();
		showAppointmentsInTable(this.dbServicesObj, this.dbMastersObj);
		this.clearSelect(servicesSelect);
		this.clearSelect(mastersSelect);
		this.clearSelect(datesSelect);
		this.resetAddModalStates(addModal);
		removeBlockScroll();
	}

	clearSelect(select) {
		const selectList = select.querySelector(".content-form__field-select-list");
		selectList.innerHTML = "";
	}

	closeAddModalSelectDropdownWithBackdropClick(modal) {
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

	closeAddModal(
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
				this.resetAddModalStates(modal);
				removeBlockScroll();
				document.removeEventListener("keyup", closeModalWithEsc);
			}
		};

		modalCloseButton.onclick = () => {
			modal.close();
			this.clearSelect(servicesSelect);
			this.clearSelect(mastersSelect);
			this.clearSelect(datesSelect);
			this.resetAddModalStates(modal);
			removeBlockScroll();
			document.removeEventListener("keyup", closeModalWithEsc);
		};

		const closeModalWithEsc = evt => {
			if (evt.code === "Escape") {
				modal.close();
				this.clearSelect(servicesSelect);
				this.clearSelect(mastersSelect);
				this.clearSelect(datesSelect);
				this.resetAddModalStates(modal);
				removeBlockScroll();
				document.removeEventListener("keyup", closeModalWithEsc);
			}
		};

		document.addEventListener("keyup", closeModalWithEsc);
	}

	resetAddModalStates(modal) {
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

export { AppointmentsModal };
