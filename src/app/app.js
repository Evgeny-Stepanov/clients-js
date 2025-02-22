function backToIndex() {
	const button = document.querySelector("#back");
	button.addEventListener("click", () => {
		localStorage.removeItem("online");
		sessionStorage.removeItem("online");
		window.location.assign("/index.html");
	});
}

function changeTitle() {
	let userName =
			localStorage.getItem("online") || sessionStorage.getItem("online"),
		user =
			JSON.parse(localStorage.getItem(userName)) ||
			JSON.parse(sessionStorage.getItem(userName));

	document.title += `${user["name-registration"]} ${String.fromCodePoint(128526)}`;
}

changeTitle();

backToIndex();
