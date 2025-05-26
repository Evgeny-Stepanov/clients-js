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

export { getOnlineUserType, getOnlineUserStorage };
