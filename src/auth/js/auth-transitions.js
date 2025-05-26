window.addEventListener("load", () => {
	setTransitionAfterPageLoad(".auth__form button");
	setTransitionAfterPageLoad(".form__form-change-button-wrapper a");
	setTransitionAfterPageLoad(".footer__show-settings-button");
	setTransitionAfterPageLoad(".footer__show-contacts-button");
	setTransitionAfterPageLoad(".footer__settings");
	setTransitionAfterPageLoad(".footer__contacts");
});

function setTransitionAfterPageLoad(selector) {
	document.querySelector(selector).classList.remove("no-transition");
}

export { setTransitionAfterPageLoad };
