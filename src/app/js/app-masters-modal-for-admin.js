import { MastersModalForClient } from "./app-masters-modal-for-client";
import { getOnlineUserStorage, addBlockScroll } from "./app-general-functions";

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
				<span>${dbObject[i].firstName} ${dbObject[i].lastName}</span>
				<div>
					<span>Стаж работы: </span>
					<span>${dbObject[i].experience}</span>
				</div>
			</div>
			<img src="${dbObject[i].photo}" alt="Фотография мастера" />
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
		const addModal = document.querySelector("[data-modal='add-master']");
		/* 			deleteModalTitle = deleteModal.querySelector("h2"),
			deleteModalMessage = deleteModal.querySelector("p"),
			deleteModalYesButton = deleteModal.querySelector(
				"[data-button-confirm='yes']",
			),
			deleteModalNoButton = deleteModal.querySelector(
				"[data-button-confirm='no']",
			),
			deleteModalCloseButton = deleteModal.querySelector(
				"[data-button-action='close']",
			); */

		addModal.showModal();
	}
}

export { MastersModalForAdmin };
