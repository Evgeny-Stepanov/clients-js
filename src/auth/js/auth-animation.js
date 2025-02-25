function toggleInputTypeAndChangeIcon() {
	const passwordInputs = document.querySelectorAll(
			"input[data-input='password']",
		),
		iconPasswordParents = document.querySelectorAll(
			"input[data-input='password'] ~ span.form__input-icon-span",
		),
		closeEyeIcons = document.querySelectorAll("svg[data-eye='close']"),
		openEyeIcons = document.querySelectorAll("svg[data-eye='open']");

	iconPasswordParents.forEach((parent, index) => {
		parent.addEventListener("click", () => {
			if (passwordInputs[index].type === "password") {
				passwordInputs[index].type = "text";
				changeInputPasswordIcon(
					closeEyeIcons[index],
					openEyeIcons[index],
					"form__input-svg--is-visible",
				);
			} else {
				passwordInputs[index].type = "password";
				changeInputPasswordIcon(
					closeEyeIcons[index],
					openEyeIcons[index],
					"form__input-svg--is-visible",
				);
			}
		});
	});
}

function changeInputPasswordIcon(closeEyeIcon, openEyeIcon, visibilityClass) {
	closeEyeIcon.classList.toggle(visibilityClass);
	openEyeIcon.classList.toggle(visibilityClass);
}

function changeClientsTextColor() {
	const formButtons = document.querySelectorAll(".form button"),
		clientsText = document.querySelector(".auth__title span");

	formButtons.forEach(button => {
		button.addEventListener("mouseover", () => {
			clientsText.classList.add("auth__title-span--is-hover");
		});

		button.addEventListener("mouseout", () => {
			clientsText.classList.remove("auth__title-span--is-hover");
		});
	});
}

export function toggleFormVisibility(hiddenForm, visibleForm) {
	hiddenForm.classList.remove("form--is-hidden");
	hiddenForm.classList.add("form-animation");
	visibleForm.classList.add("form--is-hidden");
	visibleForm.classList.remove("form-animation");
}

function animateFormCards() {
	const formLogin = document.querySelector(".form--login"),
		formRegistration = document.querySelector(".form--registration"),
		formLoginLink = formRegistration.querySelector("a"),
		formRegistrationLink = formLogin.querySelector("a");

	formRegistrationLink.addEventListener("click", evt => {
		evt.preventDefault();
		toggleFormVisibility(formRegistration, formLogin);
	});

	formLoginLink.addEventListener("click", evt => {
		evt.preventDefault();
		toggleFormVisibility(formLogin, formRegistration);
	});
}

function showTextOnMobile() {
	const showTextButton = document.querySelector(".auth__btn"),
		textsWrap = document.querySelector(".auth__descr-wrapper"),
		fullText = document.querySelector(".auth__descr"),
		shortText = document.querySelector(".auth__descr--is-mobile");

	showTextButton.addEventListener("click", () => {
		textsWrap.classList.add("auth__descr-wrapper--is-grow");
		fullText.classList.add("auth__descr--is-visible");
		shortText.classList.add("auth__descr--is-hidden");
	});
}

toggleInputTypeAndChangeIcon();
changeClientsTextColor();
animateFormCards();
showTextOnMobile();
