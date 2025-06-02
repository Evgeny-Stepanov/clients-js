function getOnlineUserType() {
	const storage = getOnlineUserStorage(),
		onlineUserKey = storage.getItem("online");
	let userType = "client";

	if (onlineUserKey.slice(-5) === "админ") {
		userType = "admin";
	}

	return userType;
}

function getOnlineUserStorage() {
	let storage = localStorage;

	if (sessionStorage.getItem("online")) {
		storage = sessionStorage;
	}

	return storage;
}

function addBlockScroll() {
	document.body.style.overflow = "hidden";
}

function removeBlockScroll() {
	document.body.style.overflow = "";
}

function showMainModal(modal) {
	if (
		modal.getAttribute("data-modal") === "services" ||
		modal.getAttribute("data-modal") === "masters"
	) {
		document.body.append(modal);
		modal.showModal();
		addBlockScroll();
	} else {
		modal.showModal();
	}
}

function closeMainModal(modal, closeButton) {
	modal.addEventListener("click", ({ currentTarget, target }) => {
		const isClickedOnBackdrop = target === currentTarget;
		if (isClickedOnBackdrop) {
			currentTarget.close();
			modal.remove();
			removeBlockScroll();
		}
	});

	closeButton.addEventListener("click", () => {
		modal.close();
		modal.remove();
		removeBlockScroll();
	});
}

function closeModal(modal, closeBtn, noBtn) {
	if (
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

//function showDeleteModal() {}

//function closeDeleteModal() {}

//function showAddModal() {}

//function closeAddModal() {}

function createAndFilterModalListItemsForServices(
	modal,
	dbServicesObj,
	dbMastersObj,
	list,
) {
	const deletedServices = JSON.parse(
		getOnlineUserStorage().getItem("deletedServices"),
	);

	/* 	const addedServices = JSON.parse(
			getOnlineUserStorage().getItem("addedServices"),
		),
		deletedServices = JSON.parse(
			getOnlineUserStorage().getItem("deletedServices"),
		); */

	/* 	if (addedServices) {
		dbServicesObj.push(...addedServices);
	} */

	for (let i = 0; i < dbServicesObj.length; i++) {
		let matchingCondition = false;

		if (deletedServices) {
			for (let k = 0; k < deletedServices.length; k++) {
				if (dbServicesObj[i].name === deletedServices[k]) {
					matchingCondition = true;
					break;
				}
			}
		}

		if (!matchingCondition) {
			createModalListItem(modal, list, i, dbServicesObj, dbMastersObj);
		}
	}
}

function createAndFilterModalListItemsForMasters(
	modal,
	dbServicesObj,
	dbMastersObj,
	list,
) {
	const deletedMasters = JSON.parse(
		getOnlineUserStorage().getItem("deletedMasters"),
	);

	for (let i = 0; i < dbMastersObj.length; i++) {
		let matchingCondition = false;

		if (deletedMasters) {
			for (let k = 0; k < deletedMasters.length; k++) {
				if (
					`${dbMastersObj[i].firstName} ${dbMastersObj[i].lastName}` ===
					deletedMasters[k]
				) {
					matchingCondition = true;
					break;
				}
			}
		}

		if (!matchingCondition) {
			createModalListItem(modal, list, i, dbServicesObj, dbMastersObj);
		}
	}
}

function createModalListItem(modal, list, i, dbServicesObj, dbMastersObj) {
	const listItem = document.createElement("li");
	listItem.classList.add("modal__list-item", "modal__list-item--grid");

	createModalListItemStructure(modal, listItem, i, dbServicesObj, dbMastersObj);

	if (getOnlineUserType() === "admin") {
		createAndAddButtonToDeleteListItemForAdmin(modal, listItem);
	}

	list.append(listItem);
}

function createModalListItemStructure(
	modal,
	listItem,
	i,
	dbServicesObj,
	dbMastersObj,
) {
	if (modal.getAttribute("data-modal") === "services") {
		listItem.innerHTML = `
			<div class="modal__text">
				<div class="--mt-0">
					<span>${dbServicesObj[i].name}: </span>
					<span>${dbServicesObj[i].price} &#8381;</span>
				</div>
			</div>
			<img src="${dbServicesObj[i].image}" alt="Иконка услуги" />
		`;
	} else {
		listItem.innerHTML = `
			<div class="modal__text">
				<span>${dbMastersObj[i].firstName} ${dbMastersObj[i].lastName}</span>
				<div>
					<span>Стаж работы: </span>
					<span>${dbMastersObj[i].experience}</span>
				</div>
			</div>
			<img src="${dbMastersObj[i].photo}" alt="Фотография мастера" />
		`;
	}
}

function createAndAddButtonToDeleteListItemForAdmin(modal, listItem) {
	const deleteButton = document.createElement("button");
	deleteButton.classList.add(
		"actions__btn",
		"actions__btn-delete",
		"actions__btn--black-text",
	);
	deleteButton.setAttribute("type", "button");

	if (modal.getAttribute("data-modal") === "services") {
		deleteButton.textContent = "Удалить услугу";
	} else {
		deleteButton.textContent = "Удалить мастера";
	}

	listItem.append(deleteButton);
}

function calculateHeightMainModal(modal) {
	const modalList = modal.querySelector("ul"),
		modalListWrapper = modalList.closest("div"),
		modalListItems = modalList.querySelectorAll("li"),
		modalListItemsGap = getComputedStyle(modalList).gap;

	let sumListItemsHeight = 0,
		sumListItemsGap = 0,
		sumModalPaddingY = 0;

	if (window.matchMedia("(max-width: 767px)").matches) {
		modalListItems.forEach(modalListItem => {
			sumListItemsHeight += parseFloat(getComputedStyle(modalListItem).height);
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

export {
	getOnlineUserType,
	getOnlineUserStorage,
	showMainModal,
	closeMainModal,
	createAndFilterModalListItemsForServices,
	createAndFilterModalListItemsForMasters,
	calculateHeightMainModal,
};
