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

export {
	getOnlineUserType,
	getOnlineUserStorage,
	addBlockScroll,
	removeBlockScroll,
};
