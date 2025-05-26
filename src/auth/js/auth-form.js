import { showNotification } from "./auth-notification";
import { toggleFormsVisibility } from "./auth-animations";

function validateForm(formSelector) {
	const form = document.querySelector(formSelector),
		loginInput = form.querySelector(".form__field-name input"),
		passwordInput = form.querySelector(".form__field-password input"),
		radios = form.querySelectorAll(
			".form__radio-items-wrapper input[type='radio']",
		),
		checkbox = form.querySelector("input[type='checkbox']"),
		submitButton = form.querySelector("button[type='submit']");

	function bindFocusAndBlurEvents(input) {
		const iconInputSpan = input.parentElement.querySelector(
			".form__field-control-icon",
		);

		input.addEventListener("focus", () => {
			if (!input.classList.contains("form__field-control--is-invalid")) {
				recolorInputIcon(true, iconInputSpan);
			} else {
				recolorInputIcon(false, iconInputSpan);
			}
		});

		input.addEventListener("blur", () => {
			showInputErrorMessage(createInputErrorMessage(input), input, null);
			recolorInvalidInputBorder(createInputErrorMessage(input), input);
			resetInputIconColor(iconInputSpan);
		});

		function recolorInputIcon(isInputValid, iconSpan) {
			if (isInputValid) {
				iconSpan.classList.add("form__field-control-icon--is-focus");
			} else {
				iconSpan.classList.add("form__field-control-icon--is-invalid-focus");
			}
		}

		function resetInputIconColor(iconSpan) {
			if (iconSpan.classList.contains("form__field-control-icon--is-focus")) {
				iconSpan.classList.remove("form__field-control-icon--is-focus");
			} else {
				iconSpan.classList.remove("form__field-control-icon--is-invalid-focus");
			}
		}
	}

	function removeRadiosInvalidState(radios) {
		radios.forEach(radioInput => {
			radioInput.addEventListener("click", () => {
				showInputErrorMessage("", radioInput, formSelector);
				recolorInvalidRadiosWrapperBorder("", formSelector);
			});
		});
	}

	function recolorInvalidRadiosWrapperBorder(inputErrorMessage, formSelector) {
		const radioItemsWrapper = document.querySelector(
			`${formSelector} .form__radio-items-wrapper`,
		);

		if (inputErrorMessage) {
			radioItemsWrapper.classList.add("form__radio-items-wrapper--is-invalid");
		} else {
			radioItemsWrapper.classList.remove(
				"form__radio-items-wrapper--is-invalid",
			);
		}
	}

	function login(formDataObj) {
		const {
			["name-login"]: userNameFromForm,
			["password-login"]: loginPassword,
			["who-login"]: userType,
			["remember-login"]: loginCheckbox,
		} = formDataObj;
		let storage = sessionStorage;

		if (!checkAndReturnUserFromStorage(userNameFromForm, userType)) {
			return;
		}

		const { userNameFromStorage, userFromStorage } =
				checkAndReturnUserFromStorage(userNameFromForm, userType),
			registrationPassword = userFromStorage["password-registration"],
			registrationCheckbox = userFromStorage["remember-registration"];

		if (registrationPassword === loginPassword) {
			if (loginCheckbox === "on" && registrationCheckbox === "on") {
				storage = localStorage;
			}

			storage.setItem("online", userNameFromStorage);
			window.location.assign("/app.html");
		} else {
			showNotification(".notification", "Неверный пароль", "error");
		}

		function checkAndReturnUserFromStorage(userName, userType) {
			const userNameFromStorage = returnUserKeyForStorage(userName, userType);
			let storage = sessionStorage;

			if (localStorage.getItem(userNameFromStorage)) {
				storage = localStorage;
			}

			const userFromStorage = JSON.parse(storage.getItem(userNameFromStorage));

			if (userFromStorage) {
				return { userNameFromStorage, userFromStorage };
			} else {
				showNotification(
					".notification",
					"Пользователя с таким именем не существует",
					"error",
				);
				form.reset();
			}
		}
	}

	function returnUserKeyForStorage(userName, userType) {
		if (userType === "client") {
			return `${userName}-клиент`;
		} else {
			return `${userName}-админ`;
		}
	}

	function registration(formDataObj) {
		const {
				["name-registration"]: userNameFromForm,
				["who-registration"]: userType,
				["remember-registration"]: rememberCheckbox,
			} = formDataObj,
			userNameFromStorage = returnUserKeyForStorage(userNameFromForm, userType);
		let storage = sessionStorage;

		if (rememberCheckbox === "on") {
			storage = localStorage;
		}

		if (
			localStorage.getItem(userNameFromStorage) ||
			sessionStorage.getItem(userNameFromStorage)
		) {
			showNotification(
				".notification",
				"Пользователь с таким именем уже зарегистрирован",
				"error",
			);
		} else {
			storage.setItem(userNameFromStorage, JSON.stringify(formDataObj));
			toggleFormsVisibility(
				document.querySelector("[data-form='login']"),
				document.querySelector("[data-form='registration'"),
			);
			showNotification(
				".notification",
				"Регистрация прошла успешно",
				"success",
			);
			form.reset();
		}
	}

	function validateOnSubmit(submitButton) {
		submitButton.addEventListener("click", evt => {
			evt.preventDefault();

			let countOfInvalidTextInputs = 0,
				countOfRadiosChecked = 0;

			if (createInputErrorMessage(loginInput)) {
				showInputErrorMessage(
					createInputErrorMessage(loginInput),
					loginInput,
					null,
				);
				recolorInvalidInputBorder(
					createInputErrorMessage(loginInput),
					loginInput,
				);
				countOfInvalidTextInputs++;
			}

			if (createInputErrorMessage(passwordInput)) {
				showInputErrorMessage(
					createInputErrorMessage(passwordInput),
					passwordInput,
					null,
				);
				recolorInvalidInputBorder(
					createInputErrorMessage(passwordInput),
					passwordInput,
				);
				countOfInvalidTextInputs++;
			}

			radios.forEach(radioInput => {
				if (radioInput.checked) {
					countOfRadiosChecked++;
				}
			});

			if (countOfRadiosChecked === 0) {
				showInputErrorMessage(
					createInputErrorMessage(radios[0]),
					radios[0],
					formSelector,
				);
				recolorInvalidRadiosWrapperBorder(
					createInputErrorMessage(radios[0]),
					formSelector,
				);
			}

			if (countOfInvalidTextInputs === 0 && countOfRadiosChecked > 0) {
				const formData = new FormData(form);

				if (!checkbox.checked) {
					formData.append(checkbox.name, "off");
				}

				const formDataObj = Object.fromEntries(formData.entries());

				if (form.getAttribute("data-form") === "login") {
					login(formDataObj);
				} else {
					registration(formDataObj);
				}
			}
		});
	}

	bindFocusAndBlurEvents(loginInput);
	bindFocusAndBlurEvents(passwordInput);
	removeRadiosInvalidState(radios);
	validateOnSubmit(submitButton);
}

function createInputErrorMessage(input) {
	const tooShort = input.validity.tooShort,
		tooLong = input.validity.tooLong,
		patternMiss = input.validity.patternMismatch,
		noValue = input.validity.valueMissing;

	let inputErrorMessage = "";

	if (tooShort || tooLong || patternMiss) {
		inputErrorMessage = input.title;
	}

	if (noValue) {
		inputErrorMessage = "Заполните поле";
	}

	if (input.type === "radio") {
		inputErrorMessage = "Выберите кто вы";
	}

	return inputErrorMessage;
}

function showInputErrorMessage(inputErrorMessage, input, formSelector) {
	let inputErrorMessageSpan;

	if (input.type === "radio") {
		inputErrorMessageSpan = document.querySelector(
			`${formSelector} .form__radios .form__field-error`,
		);
	} else {
		inputErrorMessageSpan =
			input.parentElement.querySelector(".form__field-error");
	}

	inputErrorMessageSpan.textContent = inputErrorMessage;
}

function recolorInvalidInputBorder(inputErrorMessage, input) {
	if (inputErrorMessage) {
		input.classList.add("form__field-control--is-invalid");
	} else {
		input.classList.remove("form__field-control--is-invalid");
	}
}

validateForm("[data-form='login']");
validateForm("[data-form='registration']");

export {
	createInputErrorMessage,
	showInputErrorMessage,
	recolorInvalidInputBorder,
};
