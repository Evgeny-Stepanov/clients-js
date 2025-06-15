import { MastersModalForAdmin } from "./app-masters-modal-for-admin";
import { getOnlineUserStorage } from "./app-general-functions";
import { showNotification } from "../../auth/js/auth-notification";

class ServicesModalForAdmin extends MastersModalForAdmin {
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
			<div class="content-list-item-text">
				<div class="has-margin-top-0">
					<span>${dbObject[i].name}: </span>
					<span>${dbObject[i].price} &#8381;</span>
				</div>
			</div>
			<img src="${dbObject[i].image}" alt="Иконка услуги" />
			<button class="content-list-item-delete-button button button--black-text" type="button">Удалить услугу</button>
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

	setDeleteModalTitleAndMessage(title, message) {
		title.textContent = "Удаление услуги";
		message.textContent = "Вы уверены, что хотите удалить услугу?";
	}

	setDeletedItemInStorage(modalListItem) {
		const itemValue = modalListItem
				.querySelector("span")
				.textContent.slice(0, -2),
			storage = getOnlineUserStorage();
		let itemsArray = [itemValue];

		if (storage.getItem("deletedServices")) {
			itemsArray = JSON.parse(storage.getItem("deletedServices"));
			itemsArray.push(itemValue);
			storage.setItem("deletedServices", JSON.stringify(itemsArray));
		} else {
			storage.setItem("deletedServices", JSON.stringify(itemsArray));
		}
	}
}

export { ServicesModalForAdmin };
