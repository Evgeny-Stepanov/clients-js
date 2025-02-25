window.addEventListener("load", () => {
	transitionAfterPageLoad(".auth__form button");
	transitionAfterPageLoad(".form__no-account a");
	transitionAfterPageLoad(".footer__settings-btn");
	transitionAfterPageLoad(".footer__contacts-btn");
	transitionAfterPageLoad(".footer__settings");
	transitionAfterPageLoad(".contacts");
});

function transitionAfterPageLoad(element) {
	document.querySelector(`${element}`).classList.remove("no-transition");
}
