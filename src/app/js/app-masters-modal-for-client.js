import {
	getOnlineUserStorage,
	addBlockScroll,
	removeBlockScroll,
} from "./app-general-functions";

import { showNotification } from "../../auth/js/auth-notification";

class MastersModalForClient {
	constructor(dbObject) {
		this.dbObject = dbObject;
	}

	createMainModal() {
		const {
			modal,
			modalDivForScroll,
			modalContent,
			modalTitle,
			modalList,
			modalCloseButton,
		} = this.createMainModalStructure();

		this.setMainModalAttr(modal);

		this.createMainModalListItems(this.dbObject, modalList);

		if (modalList.children.length === 1) {
			modalList.style.display = "block";
		}

		this.setMainModalTitle(modalTitle);

		modalContent.append(modalTitle, modalList, modalCloseButton);
		modalDivForScroll.append(modalContent);
		modal.append(modalDivForScroll);

		return modal;
	}

	createMainModalStructure() {
		const modal = document.createElement("dialog"),
			modalDivForScroll = document.createElement("div"),
			modalContent = document.createElement("div"),
			modalTitle = document.createElement("h2"),
			modalList = document.createElement("ul"),
			modalCloseButton = document.createElement("button");

		modal.classList.add("app__modal", "modal");
		modalDivForScroll.classList.add("modal__content-wrapper");
		modalContent.classList.add("modal__content");
		modalTitle.classList.add("visually-hidden");
		modalList.classList.add("modal__content-list", "content-list");
		modalCloseButton.classList.add("modal__content-close-button");
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

	setMainModalAttr(modal) {
		modal.setAttribute("data-modal", "masters");
	}

	createMainModalListItems(dbObject, list) {
		const deletedMastersFromStorage = JSON.parse(
				getOnlineUserStorage().getItem("deletedMasters"),
			),
			addedMastersFromStorage = JSON.parse(
				getOnlineUserStorage().getItem("addedMasters"),
			);

		for (let i = 0; i < dbObject.length; i++) {
			let matchingCondition = false;

			if (deletedMastersFromStorage) {
				for (let k = 0; k < deletedMastersFromStorage.length; k++) {
					if (
						`${dbObject[i].name} ${dbObject[i].surname}` ===
						deletedMastersFromStorage[k]
					) {
						matchingCondition = true;
						break;
					}
				}
			}

			if (!matchingCondition) {
				this.createMainModalListItem(dbObject, list, i);
			}
		}

		if (addedMastersFromStorage) {
			for (let i = 0; i < addedMastersFromStorage.length; i++) {
				this.createMainModalListItem(addedMastersFromStorage, list, i);
			}
		}
	}

	createMainModalListItem(dbObject, list, i) {
		const listItem = document.createElement("li");
		listItem.classList.add("content-list-item", "content-list-item--grid");

		this.createMainModalListItemStructure(dbObject, listItem, i);

		list.append(listItem);
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
		`;
	}

	setMainModalTitle(modalTitle) {
		modalTitle.textContent = "Мастера";
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
	}

	createAndShowMainModalNotification() {
		showNotification(
			"[data-notification='body']",
			"Мастера отсутствуют",
			"error",
		);
	}

	calculateHeightMainModal(modal) {
		const modalList = modal.querySelector("ul"),
			modalListWrapper = modalList.closest("div"),
			modalListItems = modalList.querySelectorAll("li"),
			modalListItemsGap = getComputedStyle(modalList).gap;

		let sumListItemsHeight = 0,
			sumListItemsGap = 0,
			sumModalPaddingY = 0;

		if (window.matchMedia("(max-width: 767px)").matches) {
			modalListItems.forEach(modalListItem => {
				sumListItemsHeight += parseFloat(
					getComputedStyle(modalListItem).height,
				);
			});
			sumListItemsGap =
				(modalListItems.length - 1) * parseFloat(modalListItemsGap);
		} else {
			modalListItems.forEach((modalListItem, i) => {
				if (i < Math.ceil(modalListItems.length / 2)) {
					sumListItemsHeight += parseFloat(
						getComputedStyle(modalListItem).height,
					);
				}
			});

			if (modalListItems.length % 2 === 0) {
				sumListItemsGap =
					(modalListItems.length / 2 - 1) * parseFloat(modalListItemsGap);
			} else {
				sumListItemsGap =
					Math.floor(modalListItems.length / 2) * parseFloat(modalListItemsGap);
			}
		}

		sumModalPaddingY =
			parseFloat(getComputedStyle(modalListWrapper).paddingTop) * 2;
		modal.style.height = `${sumListItemsHeight + sumListItemsGap + sumModalPaddingY}px`;
	}

	closeMainModal(modal, modalCloseButton) {
		modal.addEventListener("click", ({ currentTarget, target }) => {
			const isClickedOnBackdrop = target === currentTarget;
			if (isClickedOnBackdrop) {
				modal.remove();
				removeBlockScroll();
			}
		});

		modalCloseButton.addEventListener("click", () => {
			modal.remove();
			removeBlockScroll();
		});

		document.addEventListener("keyup", closeMainModalWithEsc);

		/*
		The function was written via onclick() but in the class modal masters 
		for the admin there is one more onclick. Which overwrites this one.
		And without removeEventListener(), the handlers are summed up.
		*/
		function closeMainModalWithEsc(evt) {
			const currentOpenModal = document.querySelector(".modal[open]");

			if (evt.code === "Escape" && currentOpenModal !== modal) {
				modal.remove();
				removeBlockScroll();
				document.removeEventListener("keyup", closeMainModalWithEsc);
			}
		}
	}
}

export { MastersModalForClient };
