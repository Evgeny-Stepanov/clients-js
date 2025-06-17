import { MastersModalForClient } from "./app-masters-modal-for-client";
import { getOnlineUserStorage } from "./app-general-functions";
import { showNotification } from "../../auth/js/auth-notification";

class ServicesModalForClient extends MastersModalForClient {
	constructor(dbObject) {
		super(dbObject);
	}

	setMainModalAttr(modal) {
		modal.setAttribute("data-modal", "services");
	}

	createMainModalListItems(dbObject, list) {
		const deletedServicesFromStorage = JSON.parse(
			getOnlineUserStorage().getItem("deletedServices"),
		);

		for (let i = 0; i < dbObject.length; i++) {
			let matchingCondition = false;

			if (deletedServicesFromStorage) {
				for (let k = 0; k < deletedServicesFromStorage.length; k++) {
					if (dbObject[i].name === deletedServicesFromStorage[k]) {
						matchingCondition = true;
						break;
					}
				}
			}

			if (!matchingCondition) {
				this.createMainModalListItem(dbObject, list, i);
			}
		}
	}

	createMainModalListItemStructure(dbObject, listItem, i) {
		listItem.innerHTML = `
			<div class="content-list-item__text">
				<div class="has-margin-top-0">
					<span>${dbObject[i].name}: </span>
					<span>${dbObject[i].price} &#8381;</span>
				</div>
			</div>
			<img src="${dbObject[i].image}" alt="Иконка услуги" />
		`;
	}

	setMainModalTitle(modalTitle) {
		modalTitle.textContent = "Услуги";
	}

	createAndShowMainModalNotification() {
		showNotification(
			"[data-notification='body']",
			"Услуги отсутствуют",
			"error",
		);
	}
}

export { ServicesModalForClient };
