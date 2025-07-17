import { MastersModalForAdmin } from "./app-masters-modal-for-admin";

import { dbServicesObj } from "../../db";

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
			),
			addedServicesFromStorage = JSON.parse(
				getOnlineUserStorage().getItem("addedServices"),
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

		if (addedServicesFromStorage) {
			for (let i = 0; i < addedServicesFromStorage.length; i++) {
				this.createMainModalListItem(addedServicesFromStorage, list, i);
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
			<button class="content-list-item__delete-button button button--black-text" type="button">Удалить</button>
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

		this.deleteEqualItemInStorage();
	}

	showAddModal() {
		const addModal = document.querySelector("[data-modal='add-service']"),
			selectedImageFromDropdownList = addModal.querySelector(
				".content-form__field-dropdown-button img",
			),
			addModalCloseButton = addModal.querySelector(
				"[data-action-button='close']",
			);

		this.addModalImagesDropdown(addModal);

		addModal.showModal();

		this.validateAddModalForm(addModal, selectedImageFromDropdownList);

		this.closeAddModal(addModal, addModalCloseButton);
	}

	setAddedItemInStorage(formDataObj, addModal) {
		const { name } = formDataObj,
			storage = getOnlineUserStorage(),
			deletedServicesFromStorage = JSON.parse(
				storage.getItem("deletedServices"),
			),
			mainModal = document.querySelector("[data-modal='services']");

		let itemsArray = [formDataObj],
			matchingCondition = false;

		if (deletedServicesFromStorage) {
			deletedServicesFromStorage.forEach(deletedService => {
				if (deletedService === name) {
					showNotification(
						"[data-notification='add-service']",
						'Данная услуга была добавлена изначально, но вы ее удалили. Для сброса изменений нажмите кнопку "Сбросить"',
						"error",
					);
					matchingCondition = true;
				}
			});
		} else {
			dbServicesObj.forEach(dbService => {
				if (dbService.name === name) {
					showNotification(
						"[data-notification='add-service']",
						"Данная услуга уже добавлена",
						"error",
					);
					matchingCondition = true;
				}
			});
		}

		if (matchingCondition) {
			return;
		}

		if (storage.getItem("addedServices")) {
			const itemsArray = JSON.parse(storage.getItem("addedServices"));

			itemsArray.forEach(itemArray => {
				if (itemArray.name === name) {
					showNotification(
						"[data-notification='add-service']",
						"Данная услуга уже добавлена",
						"error",
					);
					matchingCondition = true;
				}
			});

			if (matchingCondition) {
				return;
			}

			itemsArray.push(formDataObj);
			storage.setItem("addedServices", JSON.stringify(itemsArray));
		} else {
			storage.setItem("addedServices", JSON.stringify(itemsArray));
		}

		this.deleteEqualItemInStorage();

		addModal.close();
		this.resetAddModalStates(addModal);
		mainModal.remove();
		this.showMainModal();
	}

	deleteEqualItemInStorage() {
		const storage = getOnlineUserStorage(),
			deletedServicesFromStorage = JSON.parse(
				storage.getItem("deletedServices"),
			),
			addedServicesFromStorage = JSON.parse(storage.getItem("addedServices"));

		if (deletedServicesFromStorage && addedServicesFromStorage) {
			for (let i = 0; i < deletedServicesFromStorage.length; i++) {
				for (let k = 0; k < addedServicesFromStorage.length; k++) {
					if (
						deletedServicesFromStorage[i] === addedServicesFromStorage[k].name
					) {
						const deletedServicesFilteredArray =
							deletedServicesFromStorage.filter(
								item => item !== addedServicesFromStorage[k].name,
							);

						const addedServicesFilteredArray = addedServicesFromStorage.filter(
							item => item.name !== deletedServicesFromStorage[i],
						);

						if (deletedServicesFilteredArray.length === 0) {
							storage.removeItem("deletedServices");
						} else {
							storage.setItem(
								"deletedServices",
								JSON.stringify(deletedServicesFilteredArray),
							);
						}

						if (addedServicesFilteredArray.length === 0) {
							storage.removeItem("addedServices");
						} else {
							storage.setItem(
								"addedServices",
								JSON.stringify(addedServicesFilteredArray),
							);
						}
					}
				}
			}
		}
	}
}

export { ServicesModalForAdmin };
