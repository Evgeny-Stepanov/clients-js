import "./../css/app.scss";

import "./js/app-transition";
import "./../db";
import "./js/app-aside";
import "./js/app-action-buttons";
import "./../auth/js/auth-footer";

function changeTitle() {
	let userName =
			localStorage.getItem("online") || sessionStorage.getItem("online"),
		user =
			JSON.parse(localStorage.getItem(userName)) ||
			JSON.parse(sessionStorage.getItem(userName));

	document.title += `${user["name-registration"]} ${String.fromCodePoint(128526)}`;
}
changeTitle();
