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
			);

		this.createModalFormServicesOptions(appointmentModal);
		this.createModalFormMastersOptions(appointmentModal);

		appointmentModal.showModal();

		//this.validate

		this.closeModal(appointmentModal, appointmentModalCloseButton);
	}

	createModalFormServicesOptions(appointmentModal) {
		const select = appointmentModal.querySelector("select#service"),
			servicesModal = new ServicesModalForClient(
				dbServicesObj,
			).createMainModal(),
			servicesModalListItems = servicesModal.querySelectorAll("li");

		servicesModalListItems.forEach(listItem => {
			const serviceName = listItem
					.querySelector("div span:first-child")
					.textContent.slice(0, -2),
				option = document.createElement("option");

			option.textContent = serviceName;

			select.append(option);
		});
	}

	createModalFormMastersOptions(appointmentModal) {
		const select = appointmentModal.querySelector("select#master"),
			mastersModal = new MastersModalForClient(dbMastersObj).createMainModal(),
			mastersModalListItems = mastersModal.querySelectorAll("li");

		mastersModalListItems.forEach(listItem => {
			const masterName = listItem.querySelector("div span").textContent,
				option = document.createElement("option");

			option.textContent = masterName;

			select.append(option);
		});
	}

	closeModal(modal, modalCloseButton) {
		modal.onclick = ({ currentTarget, target }) => {
			const isClickedOnBackdrop = target === currentTarget;
			if (isClickedOnBackdrop) {
				currentTarget.close();
			}
		};

		modalCloseButton.onclick = () => {
			modal.close();
		};
	}
}

export { Appointment };
