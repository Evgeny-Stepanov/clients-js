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

function createModalListItem(modal, list, i, dbServicesObj, dbMastersObj) {
	const listItem = document.createElement("li");
	listItem.classList.add("content-list-item", "content-list-item--grid");

	createModalListItemStructure(modal, listItem, i, dbServicesObj, dbMastersObj);

	if (getOnlineUserType() === "admin") {
		createAndAddButtonToDeleteListItemForAdmin(modal, listItem);
	}

	list.append(listItem);
}

export {
	getOnlineUserType,
	getOnlineUserStorage,
	addBlockScroll,
	removeBlockScroll,
};

/* createAndAddButtonToDeleteListItemForAdmin(listItem) {
	const deleteButton = document.createElement("button");
	deleteButton.classList.add(
		"actions__btn",
		"actions__btn-delete",
		"actions__btn--black-text",
	);
	deleteButton.setAttribute("type", "button");
	this.setTextForButtonToDeleteListItemForAdmin(deleteButton);

	listItem.append(deleteButton);
}

setTextForButtonToDeleteListItemForAdmin(deleteButton) {
	deleteButton.textContent = "Удалить мастера";
} */
