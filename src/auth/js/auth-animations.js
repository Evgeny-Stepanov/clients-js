function toggleInputTypeAndPasswordIcon() {
	const passwordInputs = document.querySelectorAll("[data-input-password]"),
		iconPasswordSpans = document.querySelectorAll(
			"[data-input-password] ~ .form__field-control-icon",
		),
		closedEyeIcons = document.querySelectorAll("[data-eye='closed']"),
		openEyeIcons = document.querySelectorAll("[data-eye='open']");

	iconPasswordSpans.forEach((span, index) => {
		span.addEventListener("click", () => {
			if (passwordInputs[index].type === "password") {
				passwordInputs[index].type = "text";
				changePasswordIcon(
					closedEyeIcons[index],
					openEyeIcons[index],
					"form__field-control-icon-svg--is-hidden",
				);
			} else {
				passwordInputs[index].type = "password";
				changePasswordIcon(
					closedEyeIcons[index],
					openEyeIcons[index],
					"form__field-control-icon-svg--is-hidden",
				);
			}
		});
	});

	function changePasswordIcon(closedEyeIcon, openEyeIcon, visibilityClass) {
		closedEyeIcon.classList.toggle(visibilityClass);
		openEyeIcon.classList.toggle(visibilityClass);
	}
}

function recolorClientsText() {
	const formButtons = document.querySelectorAll(".auth__form button"),
		clientsText = document.querySelector("[data-recolored-text]");

	formButtons.forEach(button => {
		button.addEventListener("mouseover", () => {
			clientsText.classList.add("info__title-span--is-recolored");
		});

		button.addEventListener("mouseout", () => {
			clientsText.classList.remove("info__title-span--is-recolored");
		});
	});
}

function animateFormCards() {
	const loginForm = document.querySelector("[data-form='login']"),
		registrationForm = document.querySelector("[data-form='registration']"),
		linkToRegistrationForm = loginForm.querySelector("a"),
		linkToLoginForm = registrationForm.querySelector("a");

	linkToRegistrationForm.addEventListener("click", evt => {
		evt.preventDefault();
		toggleFormsVisibility(registrationForm, loginForm);
	});

	linkToLoginForm.addEventListener("click", evt => {
		evt.preventDefault();
		toggleFormsVisibility(loginForm, registrationForm);
	});
}

function toggleFormsVisibility(hiddenForm, visibleForm) {
	hiddenForm.classList.remove("form--is-hidden");
	hiddenForm.classList.add("form-animation");
	visibleForm.classList.remove("form-animation");
	visibleForm.classList.add("form--is-hidden");
}

function showFullTextOnMobile() {
	const showFullTextButton = document.querySelector(
			".info__text-mobile-show-button",
		),
		textsWrapper = document.querySelector(".info__text-wrapper"),
		fullText = textsWrapper.querySelector(".info__text"),
		shortText = textsWrapper.querySelector(".info__text-mobile");

	showFullTextButton.addEventListener("click", () => {
		textsWrapper.classList.add("info__text-wrapper--is-full");
		fullText.classList.add("info__text--is-visible");
		shortText.classList.add("info__text-mobile--is-hidden");
	});
}

toggleInputTypeAndPasswordIcon();
recolorClientsText();
animateFormCards();
showFullTextOnMobile();

export { toggleFormsVisibility };
