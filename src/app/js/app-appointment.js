import { dbServicesObj, dbMastersObj } from "../../db";

import { ServicesModalForClient } from "./app-services-modal-for-client";
import { MastersModalForClient } from "./app-masters-modal-for-client";

class Appointment {
	constructor() {}

	showModal() {
		const appointmentModal = document.querySelector(
				"[data-modal='create-appointment']",
			),
			appointmentModalCloseButton = appointmentModal.querySelector(
				"[data-action-button='close']",
			),
			appointmentModalFormServicesSelect =
				appointmentModal.querySelector("select#service"),
			appointmentModalFormMastersSelect =
				appointmentModal.querySelector("select#master");

		this.createModalFormServicesOptions(appointmentModalFormServicesSelect);
		this.createModalFormMastersOptions(appointmentModalFormMastersSelect);

		appointmentModal.showModal();

		//this.validate

		this.closeModal(
			appointmentModal,
			appointmentModalCloseButton,
			appointmentModalFormServicesSelect,
			appointmentModalFormMastersSelect,
		);
	}

	createModalFormServicesOptions(servicesSelect) {
		const servicesModal = new ServicesModalForClient(
				dbServicesObj,
			).createMainModal(),
			servicesModalListItems = servicesModal.querySelectorAll("li");

		if (servicesModalListItems.length === 0) {
			servicesSelect.innerHTML = `<option>Услуги отсутствуют</option>`;
		} else {
			servicesModalListItems.forEach(listItem => {
				const serviceName = listItem
						.querySelector("div span:first-child")
						.textContent.slice(0, -2),
					serviceId = listItem.getAttribute("data-id"),
					option = document.createElement("option");

				option.textContent = serviceName;
				option.setAttribute("value", serviceId);

				servicesSelect.append(option);
			});
		}
	}

	createModalFormMastersOptions(mastersSelect) {
		const mastersModal = new MastersModalForClient(
				dbMastersObj,
			).createMainModal(),
			mastersModalListItems = mastersModal.querySelectorAll("li");

		if (mastersModalListItems.length === 0) {
			mastersSelect.innerHTML = `<option>Мастера отсутствуют</option>`;
		} else {
			mastersModalListItems.forEach(listItem => {
				const masterFullName = listItem.querySelector("div span").textContent,
					masterId = listItem.getAttribute("data-id"),
					option = document.createElement("option");

				option.textContent = masterFullName;
				option.setAttribute("value", masterId);

				mastersSelect.append(option);
			});
		}
	}

	closeModal(modal, modalCloseButton, servicesSelect, mastersSelect) {
		modal.onclick = ({ currentTarget, target }) => {
			const isClickedOnBackdrop = target === currentTarget;
			if (isClickedOnBackdrop) {
				modal.close();
				clearSelect(servicesSelect);
				clearSelect(mastersSelect);
			}
		};

		modalCloseButton.onclick = () => {
			modal.close();
			clearSelect(servicesSelect);
			clearSelect(mastersSelect);
		};

		document.addEventListener("keyup", closeModalWithEsc);

		function clearSelect(select) {
			select.innerHTML = "";
		}

		function closeModalWithEsc(evt) {
			if (evt.code === "Escape") {
				modal.close();
				clearSelect(servicesSelect);
				clearSelect(mastersSelect);
				document.removeEventListener("keyup", closeModalWithEsc);
			}
		}
	}
}

export { Appointment };
