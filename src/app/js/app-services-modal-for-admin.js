//import { showNotification } from "../../auth/js/auth-notification";
import { MastersModalForClient } from "./app-masters-modal-for-client";

class ServicesModalForAdmin extends MastersModalForClient {
	constructor() {
		super();
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

export { ServicesModalForAdmin };
