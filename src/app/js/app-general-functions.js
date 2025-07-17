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

function closeModal(modal, modalCloseButton) {
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

	function removeBlockScroll() {
		document.body.style.overflow = "";
	}

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

export { getOnlineUserType, getOnlineUserStorage, addBlockScroll, closeModal };
