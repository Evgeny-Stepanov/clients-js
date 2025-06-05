import { dbServicesObj, dbMastersObj } from "../../db";

import {
	getOnlineUserType,
	getOnlineUserStorage,
} from "./app-general-functions";

import { MastersModalForClient } from "./app-masters-modal-for-client";
import { MastersModalForAdmin } from "./app-masters-modal-for-admin";
import { ServicesModalForClient } from "./app-services-modal-for-client";
import { ServicesModalForAdmin } from "./app-services-modal-for-admin";

const servicesButton = document.querySelector(
		"[data-button-action='services']",
	),
	mastersButton = document.querySelector("[data-button-action='masters']"),
	createAppointmentButton = document.querySelector(
		"[data-button-action='createAppointment']",
	),
	resetButton = document.querySelector("[data-button-action='reset']"),
	logoutButton = document.querySelector("[data-button-action='logout']");

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

function resetAllInStorageExceptUsers(triggerButton) {
	triggerButton.addEventListener("click", () => {
		const storage = getOnlineUserStorage();

		storage.removeItem("deletedServices");
		storage.removeItem("deletedMasters");
		storage.removeItem("addedServices");
		storage.removeItem("addedMasters");
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

resetAllInStorageExceptUsers(resetButton);
logout(logoutButton);
