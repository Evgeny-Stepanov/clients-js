import { dbServicesObj, dbMastersObj } from "../../db";

import {
	getOnlineUserType,
	getOnlineUserStorage,
} from "./app-general-functions";

import { MastersModalForClient } from "./app-masters-modal-for-client";
import { MastersModalForAdmin } from "./app-masters-modal-for-admin";
import { ServicesModalForClient } from "./app-services-modal-for-client";
import { ServicesModalForAdmin } from "./app-services-modal-for-admin";
import { AppointmentsModal } from "./app-appointments-modal";

const servicesButton = document.querySelector(
		"[data-action-button='services']",
	),
	mastersButton = document.querySelector("[data-action-button='masters']"),
	createAppointmentButton = document.querySelector(
		"[data-action-button='createAppointment']",
	),
	resetButton = document.querySelector("[data-action-button='reset']"),
	logoutButton = document.querySelector("[data-action-button='logout']"),
	servicesButtonOnMobile = document.querySelector(
		"[data-mobile-action-button='services']",
	),
	mastersButtonOnMobile = document.querySelector(
		"[data-mobile-action-button='masters']",
	),
	createAppointmentButtonOnMobile = document.querySelector(
		"[data-mobile-action-button='createAppointment']",
	),
	resetButtonOnMobile = document.querySelector(
		"[data-mobile-action-button='reset']",
	),
	logoutButtonOnMobile = document.querySelector(
		"[data-mobile-action-button='logout']",
	);

function createAndShowServicesOrMastersModal(
	triggerButton,
	classInstanceForClient,
	classInstanceForAdmin,
) {
	triggerButton.addEventListener("click", () => {
		let modal = classInstanceForClient;

		if (getOnlineUserType() === "admin") {
			modal = classInstanceForAdmin;
		}

		modal.showMainModal();
	});
}

function createAppointment(triggerButton, classInstance) {
	triggerButton.addEventListener("click", () => {
		const modal = classInstance;

		modal.showAddModal();
	});
}

function resetAllInStorageExceptUsers(triggerButton) {
	triggerButton.addEventListener("click", () => {
		const storage = getOnlineUserStorage();

		storage.removeItem("deletedServices");
		storage.removeItem("deletedMasters");
		storage.removeItem("addedServices");
		storage.removeItem("addedMasters");
		storage.removeItem("appointments");
	});
}

function logout(triggerButton) {
	triggerButton.addEventListener("click", () => {
		const storage = getOnlineUserStorage();

		storage.removeItem("online");
		window.location.assign("/index.html");
	});
}

createAndShowServicesOrMastersModal(
	servicesButton,
	new ServicesModalForClient(dbServicesObj),
	new ServicesModalForAdmin(dbServicesObj),
);
createAndShowServicesOrMastersModal(
	mastersButton,
	new MastersModalForClient(dbMastersObj),
	new MastersModalForAdmin(dbMastersObj),
);
createAndShowServicesOrMastersModal(
	servicesButtonOnMobile,
	new ServicesModalForClient(dbServicesObj),
	new ServicesModalForAdmin(dbServicesObj),
);
createAndShowServicesOrMastersModal(
	mastersButtonOnMobile,
	new MastersModalForClient(dbMastersObj),
	new MastersModalForAdmin(dbMastersObj),
);

createAppointment(
	createAppointmentButton,
	new AppointmentsModal(dbServicesObj, dbMastersObj),
);
createAppointment(
	createAppointmentButtonOnMobile,
	new AppointmentsModal(dbServicesObj, dbMastersObj),
);

resetAllInStorageExceptUsers(resetButton);
resetAllInStorageExceptUsers(resetButtonOnMobile);

logout(logoutButton);
logout(logoutButtonOnMobile);
