import { getOnlineUserStorage } from "./app-general-functions";

function setUserNameInTitle() {
	const storage = getOnlineUserStorage(),
		onlineUserKey = storage.getItem("online"),
		/* 
		I search for a user in local storage and in session storage 
		because a user can be registered in local storage and be online in session storage
		*/
		user =
			JSON.parse(localStorage.getItem(onlineUserKey)) ||
			JSON.parse(sessionStorage.getItem(onlineUserKey));

	document.title += `${user["name-registration"]} ${String.fromCodePoint(128526)}`;
}

setUserNameInTitle();
