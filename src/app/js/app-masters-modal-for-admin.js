import { MastersModalForClient } from "./app-masters-modal-for-client";
import { addBlockScroll } from "./app-general-functions";

class MastersModalForAdmin extends MastersModalForClient {
	constructor(dbObject) {
		super(dbObject);
	}

	createMainModalListItemStructure(dbObject, listItem, i) {
		listItem.innerHTML = `
			<div class="content-list-item-text">
				<span>${dbObject[i].firstName} ${dbObject[i].lastName}</span>
				<div>
					<span>Стаж работы: </span>
					<span>${dbObject[i].experience}</span>
				</div>
			</div>
			<img src="${dbObject[i].photo}" alt="Фотография мастера" />
			<button class="content-list-item-delete-button button button--black-text" type="button">Удалить мастера</button>
		`;
	}

	showMainModal() {
		const modal = this.createMainModal(),
			modalCloseButton = modal.querySelector("[data-button-action='close']");

		if (modal.querySelector("ul").children.length === 0) {
			this.createAndShowMainModalNotification();
		} else {
			document.body.append(modal);
			modal.showModal();
			addBlockScroll();

			this.calculateHeightMainModal(modal);
			this.closeMainModal(modal, modalCloseButton);
		}

		modal.addEventListener("click", evt => {
			if (evt.target.classList.contains("content-list-item-delete-button")) {
				const modalListItem = evt.target.closest("li");
				this.showDeleteModal(modalListItem);
			}
		});
	}

	showDeleteModal(modalListItem) {
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
}

export { MastersModalForAdmin };
