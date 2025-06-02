import { MastersModalForClient } from "./app-masters-modal-for-client";
import { createAndFilterModalListItemsForServices } from "./app-general-functions";
import { showNotification } from "../../auth/js/auth-notification";

class ServicesModalForClient extends MastersModalForClient {
	constructor(dbServicesObj, dbMastersObj) {
		super(dbServicesObj, dbMastersObj);
	}

	createModalListItems(modal, dbServicesObj, dbMastersObj, list) {
		createAndFilterModalListItemsForServices(
			modal,
			dbServicesObj,
			dbMastersObj,
			list,
		);
	}

	setModalAttr(modal) {
		modal.setAttribute("data-modal", "services");
	}

	setModalTitle(modalTitle) {
		modalTitle.textContent = "Услуги";
	}

	createAndShowNotification() {
		showNotification(
			"[data-notification='body']",
			"Услуги отсутствуют",
			"error",
		);
	}
}

export { ServicesModalForClient };
