import {
	showMainModal,
	closeMainModal,
	createAndFilterModalListItemsForMasters,
	calculateHeightMainModal,
} from "./app-general-functions";
import { showNotification } from "../../auth/js/auth-notification";

class MastersModalForClient {
	constructor(dbServicesObj, dbMastersObj) {
		this.dbServicesObj = dbServicesObj;
		this.dbMastersObj = dbMastersObj;
	}

	createModal() {
		const {
			modal,
			modalDivForScroll,
			modalContent,
			modalTitle,
			modalList,
			modalCloseButton,
		} = this.createModalStructure();

		this.setModalAttr(modal);

		this.createModalListItems(
			modal,
			this.dbServicesObj,
			this.dbMastersObj,
			modalList,
		);

		if (modalList.children.length === 1) {
			modalList.style.display = "block";
		}

		this.setModalTitle(modalTitle);

		modalContent.append(modalTitle, modalList, modalCloseButton);
		modalDivForScroll.append(modalContent);
		modal.append(modalDivForScroll);

		return modal;
	}

	createModalStructure() {
		const modal = document.createElement("dialog"),
			modalDivForScroll = document.createElement("div"),
			modalContent = document.createElement("div"),
			modalTitle = document.createElement("h2"),
			modalList = document.createElement("ul"),
			modalCloseButton = document.createElement("button");

		modal.classList.add("app__modal", "modal");
		modalDivForScroll.classList.add("modal__scroll-wrap");
		modalContent.classList.add("modal__content");
		modalTitle.classList.add("visually-hidden");
		modalList.classList.add("modal__list");
		modalCloseButton.classList.add("modal__close-button");
		modalCloseButton.setAttribute("type", "button");
		modalCloseButton.setAttribute("data-button-action", "close");

		modalCloseButton.innerHTML = `
			<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path fill="#010101" fill-rule="evenodd" d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960S64 759.4 64 512S264.6 64 512 64m0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372s372-166.6 372-372s-166.6-372-372-372m128.013 198.826c.023.007.042.018.083.059l45.02 45.019c.04.04.05.06.058.083a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082L557.254 512l127.861 127.862a.268.268 0 0 1 .05.06l.009.023a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082l-45.019 45.02c-.04.04-.06.05-.083.058a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059L512 557.254L384.14 685.115c-.042.041-.06.052-.084.059a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059l-45.02-45.019a.199.199 0 0 1-.058-.083a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082L466.745 512l-127.86-127.86a.268.268 0 0 1-.05-.061l-.009-.023a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082l45.019-45.02c.04-.04.06-.05.083-.058a.118.118 0 0 1 .07 0c.022.007.041.018.082.059L512 466.745l127.862-127.86c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"/></svg>
				`;

		return {
			modal,
			modalDivForScroll,
			modalContent,
			modalTitle,
			modalList,
			modalCloseButton,
		};
	}

	createModalListItems(modal, dbServicesObj, dbMastersObj, list) {
		createAndFilterModalListItemsForMasters(
			modal,
			dbServicesObj,
			dbMastersObj,
			list,
		);
	}

	setModalAttr(modal) {
		modal.setAttribute("data-modal", "masters");
	}

	setModalTitle(modalTitle) {
		modalTitle.textContent = "Мастера";
	}

	showMainModal() {
		const modal = this.createModal(),
			closeButton = modal.querySelector("[data-button-action='close']");

		if (modal.querySelector("ul").children.length === 0) {
			this.createAndShowNotification();
		} else {
			showMainModal(modal);
			calculateHeightMainModal(modal);
			closeMainModal(modal, closeButton);
		}
	}

	createAndShowNotification() {
		showNotification(
			"[data-notification='body']",
			"Мастера отсутствуют",
			"error",
		);
	}
}

export { MastersModalForClient };
