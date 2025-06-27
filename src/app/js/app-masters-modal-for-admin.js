import { MastersModalForClient } from "./app-masters-modal-for-client";
import { getOnlineUserStorage, addBlockScroll } from "./app-general-functions";
import {
	createInputErrorMessage,
	showInputErrorMessage,
	recolorInvalidInputBorder,
} from "../../auth/js/auth-form-general-functions";
import { dbIconsObj, dbMastersObj } from "../../db";
import { showNotification } from "../../auth/js/auth-notification";

class MastersModalForAdmin extends MastersModalForClient {
	constructor(dbObject) {
		super(dbObject);
	}

	createMainModal() {
		const {
				modal,
				modalDivForScroll,
				modalContent,
				modalTitle,
				modalList,
				modalCloseButton,
			} = this.createMainModalStructure(),
			modalAddButton = document.createElement("button"),
			modalAddButtonListItem = document.createElement("li");

		modalAddButtonListItem.classList.add(
			"content-list-item",
			"content-list-item-add-button-wrapper",
			"content-list-item--grid",
		);

		this.setModalAddButtonText(modalAddButton);

		modalAddButton.classList.add(
			"content-list-item__add-button",
			"button",
			"button--black-text",
		);
		modalAddButton.setAttribute("type", "button");
		modalAddButton.setAttribute("data-button-action", "addListItem");

		modalAddButtonListItem.append(modalAddButton);

		this.setMainModalAttr(modal);

		this.createMainModalListItems(this.dbObject, modalList);

		modalList.append(modalAddButtonListItem);

		if (modalList.children.length === 1) {
			modalList.style.display = "block";
		}

		this.setMainModalTitle(modalTitle);

		modalContent.append(modalTitle, modalList, modalCloseButton);
		modalDivForScroll.append(modalContent);
		modal.append(modalDivForScroll);

		return modal;
	}

	setModalAddButtonText(button) {
		button.textContent = "Добавить мастера";
	}

	createMainModalListItemStructure(dbObject, listItem, i) {
		listItem.innerHTML = `
			<div class="content-list-item__text">
				<span>${dbObject[i].name} ${dbObject[i].surname}</span>
				<div>
					<span>Стаж работы: </span>
					<span>${dbObject[i].experience}</span>
				</div>
			</div>
			<img src="${dbObject[i].image}" alt="Фотография мастера" />
			<button class="content-list-item__delete-button button button--black-text" type="button">Удалить мастера</button>
		`;
	}

	showMainModal() {
		const modal = this.createMainModal(),
			modalAddButton = modal.querySelector(
				"[data-button-action='addListItem']",
			),
			modalCloseButton = modal.querySelector("[data-button-action='close']");

		document.body.append(modal);
		modal.showModal();
		addBlockScroll();

		modalAddButton.closest("li").style.height = getComputedStyle(
			modal.querySelector("li"),
		).height;

		this.calculateHeightMainModal(modal);
		this.closeMainModal(modal, modalCloseButton);

		modal.addEventListener("click", evt => {
			if (evt.target.classList.contains("content-list-item__delete-button")) {
				const modalListItem = evt.target.closest("li");
				this.showDeleteModal(modalListItem, modal);
			}
		});

		modalAddButton.addEventListener("click", () => {
			this.showAddModal();
		});
	}

	showDeleteModal(modalListItem, mainModal) {
		const deleteModal = document.querySelector("[data-modal='delete']"),
			deleteModalTitle = deleteModal.querySelector("h2"),
			deleteModalMessage = deleteModal.querySelector("p"),
			deleteModalYesButton = deleteModal.querySelector(
				"[data-button-confirm='yes']",
			),
			deleteModalNoButton = deleteModal.querySelector(
				"[data-button-confirm='no']",
			),
			deleteModalCloseButton = deleteModal.querySelector(
				"[data-button-action='close']",
			);

		this.setDeleteModalTitleAndMessage(deleteModalTitle, deleteModalMessage);

		deleteModal.showModal();

		this.closeDeleteModal(
			deleteModal,
			deleteModalNoButton,
			deleteModalCloseButton,
		);

		deleteModalYesButton.onclick = () => {
			this.setDeletedItemInStorage(modalListItem);
			modalListItem.remove();
			deleteModal.close();
			mainModal.remove();
			this.showMainModal();
		};
	}

	setDeleteModalTitleAndMessage(title, message) {
		title.textContent = "Удаление мастера";
		message.textContent = "Вы уверены, что хотите удалить мастера?";
	}

	closeDeleteModal(modal, modalNoButton, modalCloseButton) {
		modal.onclick = ({ currentTarget, target }) => {
			const isClickedOnBackdrop = target === currentTarget;
			if (isClickedOnBackdrop) {
				currentTarget.close();
			}
		};

		modalCloseButton.onclick = () => {
			modal.close();
		};

		modalNoButton.onclick = () => {
			modal.close();
		};
	}

	setDeletedItemInStorage(modalListItem) {
		const itemValue = modalListItem.querySelector("span").textContent,
			storage = getOnlineUserStorage();

		let itemsArray = [itemValue];

		if (storage.getItem("deletedMasters")) {
			itemsArray = JSON.parse(storage.getItem("deletedMasters"));
			itemsArray.push(itemValue);
			storage.setItem("deletedMasters", JSON.stringify(itemsArray));
		} else {
			storage.setItem("deletedMasters", JSON.stringify(itemsArray));
		}
	}

	showAddModal() {
		const addModal = document.querySelector("[data-modal='add-master']"),
			selectedImageFromDropdownList = addModal.querySelector(
				".content-form__field-dropdown-button img",
			),
			addModalCloseButton = addModal.querySelector(
				"[data-button-action='close']",
			);

		this.addModalImagesDropdown(addModal);

		addModal.showModal();

		this.validateAddModalForm(addModal, selectedImageFromDropdownList);

		this.closeAddModal(addModal, addModalCloseButton);
	}

	addModalImagesDropdown(modal) {
		const modalForm = modal.querySelector(".modal__content-form"),
			dropdownButton = modalForm.querySelector(
				".content-form__field-dropdown-button",
			),
			dropdownButtonImage = dropdownButton.querySelector("img"),
			dropdownList = modalForm.querySelector(
				".content-form__field-dropdown-list",
			),
			dropdownListItems = dropdownList.querySelectorAll(
				".content-form__field-dropdown-list-item",
			);

		dropdownButton.onclick = () => {
			dropdownList.style.width = getComputedStyle(dropdownButton).width;
			dropdownList.classList.toggle(
				"content-form__field-dropdown-list--is-open",
			);
		};

		dropdownButtonImage.src = dropdownListItems[0].querySelector("img").src;
		dropdownButtonImage.setAttribute(
			"data-image",
			dropdownListItems[0].querySelector("img").getAttribute("data-image"),
		);

		dropdownListItems.forEach(listItem => {
			listItem.onclick = () => {
				const img = listItem.querySelector("img");
				dropdownButtonImage.src = img.src;
				dropdownButtonImage.setAttribute(
					"data-image",
					img.getAttribute("data-image"),
				);
				dropdownList.classList.remove(
					"content-form__field-dropdown-list--is-open",
				);
			};
		});

		modal.querySelector(".modal__content-wrapper").onclick = evt => {
			if (
				!dropdownButton.contains(evt.target) &&
				!dropdownList
					.querySelector(".content-form__field-dropdown-list-item")
					.contains(evt.target)
			) {
				dropdownList.classList.remove(
					"content-form__field-dropdown-list--is-open",
				);
			}
		};
	}

	closeAddModal(modal, modalCloseButton) {
		modal.onclick = ({ currentTarget, target }) => {
			const isClickedOnBackdrop = target === currentTarget;
			if (isClickedOnBackdrop) {
				currentTarget.close();
				this.resetAddModalStates(modal);
			}
		};

		modalCloseButton.onclick = () => {
			modal.close();
			this.resetAddModalStates(modal);
		};

		document.onkeyup = evt => {
			if (evt.code === "Escape") {
				this.resetAddModalStates(modal);
			}
		};
	}

	resetAddModalStates(modal) {
		const form = modal.querySelector(".modal__content-form"),
			formInputs = form.querySelectorAll("input"),
			formErrorSpans = form.querySelectorAll(".content-form__field-error"),
			dropdownList = form.querySelector(".content-form__field-dropdown-list"),
			modalNotification = modal.querySelector(".notification");

		if (
			dropdownList.classList.contains(
				"content-form__field-dropdown-list--is-open",
			)
		) {
			dropdownList.classList.remove(
				"content-form__field-dropdown-list--is-open",
			);
		}

		formInputs.forEach(input => {
			if (input.classList.contains("form__field-control--is-invalid")) {
				input.classList.remove("form__field-control--is-invalid");
			}
		});

		formErrorSpans.forEach(errorSpan => {
			if (errorSpan.textContent.length > 0) {
				errorSpan.textContent = "";
			}
		});

		form.reset();

		if (modalNotification.classList.contains("notification-animation")) {
			modalNotification.classList.remove("notification-animation");
		}

		if (modalNotification.textContent.length > 0) {
			modalNotification.textContent = "";
		}
	}

	validateAddModalForm(modal, selectedImage) {
		const form = modal.querySelector(".modal__content-form"),
			inputs = form.querySelectorAll("input"),
			submitButton = form.querySelector("button[type='submit']");

		inputs.forEach(input => {
			bindBlurEvents(input);
		});

		// Arrow function due to loss this
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
					const formData = new FormData(form);
					formData.append(
						"image",
						dbIconsObj[selectedImage.getAttribute("data-image")],
					);

					const formDataObj = Object.fromEntries(formData.entries());

					this.setAddedItemInStorage(formDataObj, modal);
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

	setAddedItemInStorage(formDataObj, modal) {
		const { name, surname } = formDataObj,
			formDataObjFullName = `${name} ${surname}`,
			storage = getOnlineUserStorage(),
			mainModal = document.querySelector("[data-modal='masters']");

		let itemsArray = [formDataObj],
			returnConditionCount = 0;

		dbMastersObj.forEach(dbMaster => {
			if (`${dbMaster.name} ${dbMaster.surname}` === formDataObjFullName) {
				showNotification(
					"[data-notification='add-master']",
					"Такой мастер уже добавлен",
					"error",
				);
				returnConditionCount++;
			}
		});

		if (returnConditionCount > 0) {
			return;
		}

		if (storage.getItem("addedMasters")) {
			const itemsArray = JSON.parse(storage.getItem("addedMasters"));

			itemsArray.forEach(itemArray => {
				if (`${itemArray.name} ${itemArray.surname}` === formDataObjFullName) {
					showNotification(
						"[data-notification='add-master']",
						"Такой мастер уже добавлен",
						"error",
					);
					returnConditionCount++;
				}
			});

			if (returnConditionCount > 0) {
				return;
			}

			itemsArray.push(formDataObj);
			storage.setItem("addedMasters", JSON.stringify(itemsArray));
		} else {
			storage.setItem("addedMasters", JSON.stringify(itemsArray));
		}

		modal.close();
		this.resetAddModalStates(modal);
		mainModal.remove();
		this.showMainModal();
	}
}

export { MastersModalForAdmin };
