function backToIndex() {
	const button = document.querySelector("#back");
	button.addEventListener("click", () => {
		localStorage.removeItem("online");
		sessionStorage.removeItem("online");
		window.location.assign("/index.html");
	});
}

backToIndex();
