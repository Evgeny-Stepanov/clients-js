/* import * as dbObj from "../../db";
import { checkWho, checkStorageOnline } from "../app";
import { showNotification } from "../../auth/js/auth-notification";

class Masters {
	constructor(mastersDbObj) {
		this.mastersDbObj = mastersDbObj;
	}

	createModal() {
		let { modal, modalDivForScroll, modalContent, modalTitle, list, closeBtn } =
			createModalStructure();

		this.createListItems(list);

		if (list.children.length === 1) {
			list.style.display = "block";
		}

		this.setModalTitle(modalTitle);

		modalContent.append(modalTitle, list, closeBtn);
		modalDivForScroll.append(modalContent);
		modal.append(modalDivForScroll);
		this.setModalAttr(modal);

		return modal;
	}

	setModalTitle(modalTitle) {
		modalTitle.textContent = "Мастера";
	}

	setModalAttr(modal) {
		modal.setAttribute("data-modal", "masters");
	}

	createListItems(list) {
		filterListItems("masters", list, null, this.mastersDbObj);
	}

	showModal() {
		let modal = this.createModal(),
			closeBtn = modal.querySelector("button[data-action='close']");

		if (modal.querySelector("ul").children.length === 0) {
			this.createNotificationMessage();
		} else {
			showModal(modal);
			calcHeightModal(modal);
			closeModal(modal, closeBtn, null);
		}
	}

	createNotificationMessage() {
		showNotification(
			"[data-notif='main']",
			"Мастера отсутствуют",
			"notif--is-error",
		);
	}
}

class Services extends Masters {
	constructor(servicesDbObj) {
		super();
		this.servicesDbObj = servicesDbObj;
	}

	setModalTitle(modalTitle) {
		modalTitle.textContent = "Услуги";
	}

	setModalAttr(modal) {
		modal.setAttribute("data-modal", "services");
	}

	createListItems(list) {
		filterListItems("services", list, this.servicesDbObj, null);
	}

	createNotificationMessage() {
		showNotification(
			"[data-notif='main']",
			"Услуги отсутствуют",
			"notif--is-error",
		);
	}
}

class ServicesForAdmins extends Services {
	constructor(servicesDbObj) {
		super();
		this.servicesDbObj = servicesDbObj;
	}

	createModal() {
		let { modal, modalDivForScroll, modalContent, modalTitle, list, closeBtn } =
				createModalStructure(),
			addBtn = document.createElement("button"),
			addBtnLi = document.createElement("li");

		createModalAddBtn(addBtn, addBtnLi, "Добавить услугу");
		addBtnLi.append(addBtn);

		this.createListItems(list);

		list.append(addBtnLi);

		if (list.children.length === 1) {
			list.style.display = "block";
		}

		this.setModalTitle(modalTitle);

		modalContent.append(modalTitle, list, closeBtn);
		modalDivForScroll.append(modalContent);
		modal.append(modalDivForScroll);
		this.setModalAttr(modal);

		return modal;
	}

	createListItems(list) {
		filterListItems("services", list, this.servicesDbObj, null);
	}

	showModal() {
		let modal = this.createModal(),
			closeBtn = modal.querySelector("button[data-action='close']"),
			addBtn = modal.querySelector("li:last-child button");

		showModal(modal);

		addBtn.closest("li").style.height = getComputedStyle(
			modal.querySelector("li"),
		).height;

		calcHeightModal(modal);
		closeModal(modal, closeBtn, null);

		modal.addEventListener("click", event => {
			if (event.target.classList.contains("actions__btn-delete")) {
				let item = event.target.closest("li");
				this.showDeleteModal(item, modal);
			}
		});

		addBtn.addEventListener("click", () => {
			this.showAddModal(modal);
		});
	}

	showDeleteModal(item, itemModal) {
		let modal = document.querySelector("dialog[data-modal='delete']"),
			modalTitle = modal.querySelector("h2"),
			modalMessage = modal.querySelector("p"),
			closeBtn = modal.querySelector("button[data-action='close']"),
			yesBtn = modal.querySelector("button[data-confirm='yes']"),
			noBtn = modal.querySelector("button[data-confirm='no']");

		this.setDeleteModalTitleAndMessage(modalTitle, modalMessage);

		showModal(modal);
		closeModal(modal, closeBtn, noBtn);

		yesBtn.onclick = () => {
			deleteItem(item);
			itemModal.remove();
			modal.close();
			this.showModal();
		};
	}

	setDeleteModalTitleAndMessage(modalTitle, modalMessage) {
		modalTitle.textContent = "Удаление услуги";
		modalMessage.textContent = "Вы уверены, что хотите удалить услугу?";
	}

	showAddModal(parentModal) {
		let modal = document.querySelector("dialog[data-modal='add-service']"),
			closeBtn = modal.querySelector("button[data-action='close']"),
			createBtn = modal.querySelector("button[data-action='create-service']");

		showModal(modal);
		closeModal(modal, closeBtn, null);
		imagesDropdown(modal);

		

		createBtn.onclick = () => {
			addServiceOrMaster(modal);
			parentModal.remove();
			modal.close();
			this.showModal();
		};
	}
}

class MastersForAdmins extends ServicesForAdmins {
	constructor(mastersDbObj) {
		super();
		this.mastersDbObj = mastersDbObj;
	}

	createModal() {
		let { modal, modalDivForScroll, modalContent, modalTitle, list, closeBtn } =
				createModalStructure(),
			addBtn = document.createElement("button"),
			addBtnLi = document.createElement("li");

		createModalAddBtn(addBtn, addBtnLi, "Добавить мастера");
		addBtnLi.append(addBtn);

		this.createListItems(list);

		list.append(addBtnLi);

		if (list.children.length === 1) {
			list.style.display = "block";
		}

		this.setModalTitle(modalTitle);

		modalContent.append(modalTitle, list, closeBtn);
		modalDivForScroll.append(modalContent);
		modal.append(modalDivForScroll);
		this.setModalAttr(modal);

		return modal;
	}

	setModalTitle(modalTitle) {
		modalTitle.textContent = "Мастера";
	}

	setModalAttr(modal) {
		modal.setAttribute("data-modal", "masters");
	}

	createListItems(list) {
		filterListItems("masters", list, null, this.mastersDbObj);
	}

	setDeleteModalTitleAndMessage(modalTitle, modalMessage) {
		modalTitle.textContent = "Удаление мастера";
		modalMessage.textContent = "Вы уверены, что хотите удалить мастера?";
	}

	showAddModal() {
		let modal = document.querySelector("dialog[data-modal='add-master']"),
			addBtn = modal.querySelector("button[data-action='create-master']"),
			closeBtn = modal.querySelector("button[data-action='close']");

		showModal(modal);
		closeModal(modal, closeBtn, null);
		imagesDropdown(modal);

		addBtn.onclick = evt => {
			evt.preventDefault();
			addServiceOrMaster(modal);
		};
	}
}

function addBlockScroll() {
	document.body.style.overflow = "hidden";
}

function removeBlockScroll() {
	document.body.style.overflow = "";
}

function createModalStructure() {
	let modal = document.createElement("dialog"),
		modalDivForScroll = document.createElement("div"),
		modalContent = document.createElement("div"),
		modalTitle = document.createElement("h2"),
		list = document.createElement("ul"),
		closeBtn = document.createElement("button");

	modal.classList.add("modal");
	modalDivForScroll.classList.add("modal__scroll-wrap");
	modalContent.classList.add("modal__content");
	modalTitle.classList.add("visually-hidden");
	list.classList.add("modal__list");
	closeBtn.classList.add("modal__close-btn");
	closeBtn.setAttribute("type", "button");
	closeBtn.setAttribute("data-action", "close");

	closeBtn.innerHTML = `
			<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path fill="#010101" fill-rule="evenodd" d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960S64 759.4 64 512S264.6 64 512 64m0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372s372-166.6 372-372s-166.6-372-372-372m128.013 198.826c.023.007.042.018.083.059l45.02 45.019c.04.04.05.06.058.083a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082L557.254 512l127.861 127.862a.268.268 0 0 1 .05.06l.009.023a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082l-45.019 45.02c-.04.04-.06.05-.083.058a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059L512 557.254L384.14 685.115c-.042.041-.06.052-.084.059a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059l-45.02-45.019a.199.199 0 0 1-.058-.083a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082L466.745 512l-127.86-127.86a.268.268 0 0 1-.05-.061l-.009-.023a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082l45.019-45.02c.04-.04.06-.05.083-.058a.118.118 0 0 1 .07 0c.022.007.041.018.082.059L512 466.745l127.862-127.86c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"/></svg>
		`;

	return {
		modal,
		modalDivForScroll,
		modalContent,
		modalTitle,
		list,
		closeBtn,
	};
}

function filterListItems(servicesOrMasters, list, servicesDbObj, mastersDbObj) {
	if (servicesOrMasters === "masters") {
		let deletedMasters = JSON.parse(
			checkStorageOnline().getItem("deletedMasters"),
		);

		for (let i = 0; i < mastersDbObj.length; i++) {
			let matchingCondition;

			if (deletedMasters) {
				for (let k = 0; k < deletedMasters.length; k++) {
					if (
						`${mastersDbObj[i].firstName} ${mastersDbObj[i].lastName}` ===
						deletedMasters[k]
					) {
						matchingCondition = true;
						break;
					} else {
						matchingCondition = false;
					}
				}
			}

			if (!matchingCondition) {
				let listItem = document.createElement("li");
				listItem.classList.add("modal__list-item", "modal__list-item--grid");

				createLiHtml("masters", mastersDbObj, null, listItem, i);

				list.append(listItem);
			}
		}
	} else if (servicesOrMasters === "services") {
		let addedServices = JSON.parse(
				checkStorageOnline().getItem("addedServices"),
			),
			deletedServices = JSON.parse(
				checkStorageOnline().getItem("deletedServices"),
			);

		if (addedServices) {
			servicesDbObj.push(...addedServices);
		}
		console.log(servicesDbObj);

		for (let i = 0; i < servicesDbObj.length; i++) {
			let matchingCondition;

			if (deletedServices) {
				for (let k = 0; k < deletedServices.length; k++) {
					if (servicesDbObj[i].name === deletedServices[k]) {
						matchingCondition = true;
						break;
					} else {
						matchingCondition = false;
					}
				}
			}

			if (!matchingCondition) {
				let listItem = document.createElement("li");
				listItem.classList.add("modal__list-item", "modal__list-item--grid");

				createLiHtml("services", null, servicesDbObj, listItem, i);

				list.append(listItem);
			}
		}
	}
}

function createLiHtml(servicesOrMasters, mastersDbObj, servicesDbObj, li, i) {
	if (checkWho() === "admin") {
		if (servicesOrMasters === "masters") {
			li.innerHTML = `
				<div class="modal__text">
					<span>${mastersDbObj[i].firstName} ${mastersDbObj[i].lastName}</span>
					<div>
						<span>Стаж работы: </span>
						<span>${mastersDbObj[i].workExperience}</span>
					</div>
				</div>
				<img src="${mastersDbObj[i].photo}" alt="Фотография мастера" />
				<button type="button" class="actions__btn actions__btn-delete actions__btn--black-text">Удалить мастера</button>
			`;
		} else if (servicesOrMasters === "services") {
			li.innerHTML = `
				<div class="modal__text">
					<div class="--mt-0">
						<span>${servicesDbObj[i].name}: </span>
						<span>${servicesDbObj[i].price} &#8381;</span>
					</div>
				</div>
				<img src="${servicesDbObj[i].image}" alt="Иконка услуги" />
				<button type="button" class="actions__btn actions__btn-delete actions__btn--black-text">Удалить услугу</button>
			`;
		}
	} else {
		if (servicesOrMasters === "masters") {
			li.innerHTML = `
				<div class="modal__text">
					<span>${mastersDbObj[i].firstName} ${mastersDbObj[i].lastName}</span>
					<div>
						<span>Стаж работы: </span>
						<span>${mastersDbObj[i].workExperience}</span>
					</div>
				</div>
				<img src="${mastersDbObj[i].photo}" alt="Фотография мастера" />
			`;
		} else if (servicesOrMasters === "services") {
			li.innerHTML = `
				<div class="modal__text">
					<div class="--mt-0">
						<span>${servicesDbObj[i].name}: </span>
						<span>${servicesDbObj[i].price} &#8381;</span>
					</div>
				</div>
				<img src="${servicesDbObj[i].image}" alt="Иконка услуги" />
			`;
		}
	}
}

function calcHeightModal(modal) {
	let modalList = modal.querySelector("ul"),
		modalListWrap = modalList.closest("div"),
		modalListItems = modalList.querySelectorAll("li"),
		listItemsGap = getComputedStyle(modalList).gap,
		sumListItemsHeight = 0,
		sumListItemsGap = 0,
		sumModalPaddingY = 0;

	if (window.matchMedia("(max-width: 767px)").matches) {
		modalListItems.forEach(modalListItem => {
			sumListItemsHeight += parseFloat(getComputedStyle(modalListItem).height);
		});
		sumListItemsGap = (modalListItems.length - 1) * parseFloat(listItemsGap);
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
				(modalListItems.length / 2 - 1) * parseFloat(listItemsGap);
		} else {
			sumListItemsGap =
				Math.floor(modalListItems.length / 2) * parseFloat(listItemsGap);
		}
	}

	sumModalPaddingY = parseFloat(getComputedStyle(modalListWrap).paddingTop) * 2;
	modal.style.height = `${sumListItemsHeight + sumListItemsGap + sumModalPaddingY}px`;
}

function showModal(modal) {
	if (
		modal.matches("[data-modal='services']") ||
		modal.matches("[data-modal='masters']")
	) {
		document.body.append(modal);
		modal.showModal();
		addBlockScroll();
	} else {
		modal.showModal();
	}
}

function closeModal(modal, closeBtn, noBtn) {
	if (
		modal.matches("[data-modal='services']") ||
		modal.matches("[data-modal='masters']")
	) {
		modal.addEventListener("click", ({ currentTarget, target }) => {
			const isClickedOnBackdrop = target === currentTarget;
			if (isClickedOnBackdrop) {
				currentTarget.close();
				modal.remove();
				removeBlockScroll();
			}
		});

		closeBtn.addEventListener("click", () => {
			modal.close();
			modal.remove();
			removeBlockScroll();
		});
	} else if (
		modal.matches("[data-modal='add-service']") ||
		modal.matches("[data-modal='add-master']")
	) {
		const form = modal.querySelector(".form");

		modal.onclick = ({ currentTarget, target }) => {
			const isClickedOnBackdrop = target === currentTarget;
			if (isClickedOnBackdrop) {
				currentTarget.close();
				resetStates(modal);
				form.reset();
			}
		};

		closeBtn.onclick = () => {
			modal.close();
			resetStates(modal);
			form.reset();
		};
	} else {
		//* When using addEventListener(), an event listener is added each time, accumulating the result
		modal.onclick = ({ currentTarget, target }) => {
			const isClickedOnBackdrop = target === currentTarget;
			if (isClickedOnBackdrop) {
				currentTarget.close();
			}
		};

		closeBtn.onclick = () => {
			modal.close();
		};

		if (noBtn) {
			noBtn.onclick = () => {
				modal.close();
			};
		} else {
			return;
		}
	}
}

function resetStates(modal) {
	let inputs = modal.querySelectorAll("input"),
		errorSpans = modal.querySelectorAll(".form__input-error"),
		selectList = modal.querySelector(".form__select-list"),
		notif = modal.querySelector(".notif");

	if (selectList.classList.contains("form__select-list--is-open")) {
		selectList.classList.remove("form__select-list--is-open");
	}

	inputs.forEach(input => {
		if (input.classList.contains("form__input--is-invalid")) {
			input.classList.remove("form__input--is-invalid");
		}
	});

	errorSpans.forEach(errorSpan => {
		if (errorSpan.textContent.length > 0) {
			errorSpan.textContent = "";
		}
	});

	if (notif.classList.contains("notif-fade")) {
		notif.classList.remove("notif-fade");
	}

	if (notif.textContent.length > 0) {
		notif.textContent = "";
	}
}

function createModalAddBtn(btn, btnLiWrap, btnText) {
	btn.textContent = btnText;
	btn.classList.add(
		"actions__btn",
		"actions__btn-add",
		"actions__btn--black-text",
	);
	btn.setAttribute("type", "button");
	btn.setAttribute("data-action", "add");

	btnLiWrap.classList.add(
		"modal__list-item",
		"modal__list-item-add-btn",
		"modal__list-item--grid",
	);
}

function deleteItem(item) {
	let itemName = item.querySelector("span").textContent,
		itemsArr = [itemName];

	if (document.querySelector("dialog[data-modal='services']")) {
		itemName = item.querySelector("span").textContent.slice(0, -2);
		itemsArr = [itemName];
		setDeletedItemInStorage("deletedServices", itemName, itemsArr);
	} else {
		setDeletedItemInStorage("deletedMasters", itemName, itemsArr);
	}
}

function setDeletedItemInStorage(itemKey, itemName, itemsArr) {
	let storage = checkStorageOnline();

	if (storage.getItem(itemKey)) {
		let itemsArr = JSON.parse(storage.getItem(itemKey));
		itemsArr.push(itemName);
		storage.setItem(itemKey, JSON.stringify(itemsArr));
	} else {
		storage.setItem(itemKey, JSON.stringify(itemsArr));
	}
}

function createService(formDataObj, servicesDbObj) {
	let { name } = formDataObj,
		addedServicesArr = [formDataObj],
		storage = checkStorageOnline(),
		returnConditionCount = 0;

	servicesDbObj.forEach(service => {
		if (service.name === name) {
			showNotification(
				"[data-notif='add-service']",
				"Такая услуга уже добавлена",
				"notif--is-error",
			);
			returnConditionCount++;
		}
	});

	if (returnConditionCount > 0) {
		return;
	}

	if (storage.getItem("addedServices")) {
		addedServicesArr = JSON.parse(storage.getItem("addedServices"));

		addedServicesArr.forEach(addedService => {
			if (addedService.name === name) {
				showNotification(
					"[data-notif='add-service']",
					"Такая услуга уже добавлена",
					"notif--is-error",
				);
				returnConditionCount++;
			}
		});

		if (returnConditionCount > 0) {
			return;
		}

		addedServicesArr.push(formDataObj);
		storage.setItem("addedServices", JSON.stringify(addedServicesArr));
	} else {
		storage.setItem("addedServices", JSON.stringify(addedServicesArr));
	}
}

function imagesDropdown(modal) {
	const form = modal.querySelector(".form"),
		selectBtn = form.querySelector(".form__select-btn"),
		selectBtnImage = selectBtn.querySelector("img"),
		selectList = form.querySelector(".form__select-list"),
		selectItems = selectList.querySelectorAll(".form__select-list-item");

	selectBtn.onclick = () => {
		selectList.style.width = getComputedStyle(selectBtn).width;
		selectList.classList.toggle("form__select-list--is-open");
	};

	selectBtnImage.src = selectItems[0].querySelector("img").src;
	selectBtnImage.setAttribute(
		"data-image",
		selectItems[0].querySelector("img").getAttribute("data-image"),
	);

	selectItems.forEach(selectItem => {
		selectItem.onclick = () => {
			let img = selectItem.querySelector("img");
			selectBtnImage.src = img.src;
			selectBtnImage.setAttribute("data-image", img.getAttribute("data-image"));
			selectList.classList.remove("form__select-list--is-open");
		};
	});

	modal.querySelector(".modal__scroll-wrap").onclick = evt => {
		if (
			!selectBtn.contains(evt.target) &&
			!selectList.querySelector(".form__select-list-item").contains(evt.target)
		) {
			selectList.classList.remove("form__select-list--is-open");
		}
	};
}

function servicesModal() {
	const button = document.querySelector(
		".actions__btn[data-action='services']",
	);
	button.addEventListener("click", () => {
		let modal;

		if (checkWho() === "client") {
			modal = new Services(dbObj.servicesDbObj);
		} else {
			modal = new ServicesForAdmins(dbObj.servicesDbObj);
		}
		modal.showModal();
	});
}

function mastersModal() {
	const button = document.querySelector(".actions__btn[data-action='masters']");
	button.addEventListener("click", () => {
		let modal;

		if (checkWho() === "client") {
			modal = new Masters(dbObj.mastersDbObj);
		} else {
			modal = new MastersForAdmins(dbObj.mastersDbObj);
		}
		modal.showModal();
	});
}

function addServiceOrMaster(modal) {
	const form = modal.querySelector(".form"),
		image = form.querySelector(".form__select-btn img"),
		submitButton = form.querySelector("button[type='submit']");

	if (modal.getAttribute("data-modal") === "add-service") {
		const nameInput = form.querySelector("#name-service"),
			priceInput = form.querySelector("#price-service");

		nameInput.addEventListener("blur", () => {
			validateOnBlur(nameInput);
		});

		priceInput.addEventListener("blur", () => {
			validateOnBlur(priceInput);
		});

		validateOnSubmit(submitButton, nameInput, priceInput);
	} else if (modal.getAttribute("data-modal") === "add-master") {
		console.log("master");
	}

	function createErrorMessage(input) {
		const noPattern = input.validity.patternMismatch,
			noValue = input.validity.valueMissing;

		let errorMessage = "";

		if (noPattern) {
			errorMessage = `${input.title}`;
		} else if (noValue) {
			errorMessage = "Заполните поле";
		}

		return errorMessage;
	}

	function showErrorMessage(message, input) {
		const messageSpan = input.parentElement.querySelector(".form__input-error");
		messageSpan.textContent = message;
	}

	function changeInvalidInputColor(message, input) {
		if (message) {
			input.classList.add("form__input--is-invalid");
		} else {
			input.classList.remove("form__input--is-invalid");
		}
	}

	function validateOnBlur(input) {
		showErrorMessage(createErrorMessage(input), input);
		changeInvalidInputColor(createErrorMessage(input), input);
	}

	function validateOnSubmit(button, ...inputs) {
		button.onclick = evt => {
			evt.preventDefault();
			let invalidTextInputsCount = 0;

			inputs.forEach(input => {
				if (createErrorMessage(input)) {
					showErrorMessage(createErrorMessage(input), input);
					changeInvalidInputColor(createErrorMessage(input), input);
					invalidTextInputsCount++;
				}
			});

			if (
				button.getAttribute("data-action") === "create-service" &&
				invalidTextInputsCount === 0
			) {
				const formData = new FormData(form);
				formData.append("image", dbObj[image.getAttribute("data-image")]);
				const formDataObj = Object.fromEntries(formData.entries());
				createService(formDataObj, dbObj.servicesDbObj, modal, form);

				modal.close();
				resetStates(modal);
				form.reset();
			} else if (
				button.getAttribute("data-action") === "create-master" &&
				invalidTextInputsCount === 0
			) {
				const formData = new FormData(form);
				formData.append("image", dbObj[image.getAttribute("data-image")]);
				const formDataObj = Object.fromEntries(formData.entries());
				//createMaster(formDataObj, dbObj.mastersDbObj, modal, form);
			}
		};
	}
}

servicesModal();
mastersModal();
 */