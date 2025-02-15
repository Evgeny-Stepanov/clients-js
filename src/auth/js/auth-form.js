import { showNotification } from "./auth-notification";
import { toggleFormVisibility } from "./auth-animation";

function validateForm(formSelector) {
	const form = document.querySelector(`${formSelector}`),
		loginInput = form.querySelector(".form__input-name input"),
		passwordInput = form.querySelector(".form__input-password input"),
		radioInputs = form.querySelectorAll("fieldset input[type='radio']"),
		checkboxInput = form.querySelector("input[type='checkbox']"),
		submitButton = form.querySelector("button[type='submit']");

	function createErrorMessage(input) {
		const short = input.validity.tooShort,
			long = input.validity.tooLong,
			noPattern = input.validity.patternMismatch,
			noValue = input.validity.valueMissing;

		let errorMessage = "";

		if (short || long || noPattern) {
			errorMessage = `${input.title}`;
		}

		if (noValue) {
			errorMessage = "Заполните поле";
		}

		if (input.type === "radio") {
			errorMessage = "Выберите кто вы";
		}

		return errorMessage;
	}

	function showErrorMessage(message, input) {
		let messageSpan;

		if (input.type === "radio") {
			messageSpan = document.querySelector(
				`${formSelector} fieldset .form__input-error`,
			);
		} else {
			messageSpan = input.parentElement.querySelector(".form__input-error");
		}

		messageSpan.textContent = message;
	}

	function changeInputColor(input) {
		input.addEventListener("focus", () => {
			if (!input.classList.contains("form__input--is-invalid")) {
				input.classList.add("form__input--is-focus");
				changeIconInputColor("", input);
			} else {
				changeIconInputColor(createErrorMessage(input), input);
			}
		});

		input.addEventListener("blur", () => {
			input.classList.remove("form__input--is-focus");
			validateOnBlur(input);
			removeIconInputColor(input);
		});
	}

	function changeInvalidInputColor(message, input) {
		const inputsFieldsetWrap = document.querySelector(
			`${formSelector} .form__fieldset-inputs-wrapper`,
		);

		if (message && input.type !== "radio") {
			input.classList.add("form__input--is-invalid");
		} else {
			input.classList.remove("form__input--is-invalid");
		}

		if (message && input.type === "radio") {
			inputsFieldsetWrap.classList.add(
				"form__fieldset-inputs-wrapper--is-invalid",
			);
		}

		if (!message && input.type === "radio") {
			inputsFieldsetWrap.classList.remove(
				"form__fieldset-inputs-wrapper--is-invalid",
			);
		}
	}

	function changeIconInputColor(message, input) {
		const iconInputSpan = input.parentElement.querySelector(
			".form__input-icon-span",
		);

		if (message) {
			iconInputSpan.classList.add("form__input-span--is-invalid-focus");
		} else {
			iconInputSpan.classList.add("form__input-span--is-focus");
		}
	}

	function removeIconInputColor(input) {
		const iconInputSpan = input.parentElement.querySelector(
			".form__input-icon-span",
		);

		if (iconInputSpan.classList.contains("form__input-span--is-focus")) {
			iconInputSpan.classList.remove("form__input-span--is-focus");
		}

		if (
			iconInputSpan.classList.contains("form__input-span--is-invalid-focus")
		) {
			iconInputSpan.classList.remove("form__input-span--is-invalid-focus");
		}
	}

	function validateOnBlur(input) {
		showErrorMessage(createErrorMessage(input), input);
		changeInvalidInputColor(createErrorMessage(input), input);
	}

	function validateRadioInputs(radioInputs) {
		radioInputs.forEach(radioInput => {
			radioInput.addEventListener("click", () => {
				if (radioInput.checked) {
					showErrorMessage("", radioInput);
					changeInvalidInputColor("", radioInput);
				}
			});
		});
	}

	function checkUser(formDataObj) {
		let {
			["name-login"]: name,
			["password-login"]: loginPassword,
			["who-login"]: who,
			["remember-login"]: rememberCheckbox,
		} = formDataObj;

		if (localStorage.getItem(checkWho(name, who))) {
			let userName = checkWho(name, who),
				user = JSON.parse(localStorage.getItem(checkWho(name, who)));
			loginUser(user, loginPassword, rememberCheckbox, userName);
		} else if (sessionStorage.getItem(checkWho(name, who))) {
			let userName = checkWho(name, who),
				user = JSON.parse(sessionStorage.getItem(checkWho(name, who)));
			loginUser(user, loginPassword, rememberCheckbox, userName);
		} else {
			showNotification(
				"Пользователя с таким именем не существует",
				"notif--is-error",
			);
			form.reset();
		}
	}

	function loginUser(user, loginPassword, rememberCheckbox, userName) {
		let registrationPassword = user["password-registration"],
			storage = sessionStorage;

		if (registrationPassword === loginPassword) {
			if (rememberCheckbox === "on") {
				storage = localStorage;
			}
			storage.setItem("redirect", "true");
			storage.setItem("online", userName);
			window.location.assign("app.html");
		} else {
			showNotification("Неверный пароль", "notif--is-error");
		}
	}

	function createNameInStorage(name, user, storage) {
		if (localStorage.getItem(name) || sessionStorage.getItem(name)) {
			showNotification(
				"Пользователь с таким именем уже зарегистрирован",
				"notif--is-error",
			);
		} else {
			storage.setItem(name, JSON.stringify(user));
			toggleFormVisibility(
				document.querySelector(".form--login"),
				document.querySelector(".form--registration"),
			);
			showNotification("Регистрация прошла успешно", "notif--is-success");
			form.reset();
		}
	}

	function checkWho(name, who) {
		if (who === "client") {
			return `${name}-клиент`;
		} else {
			return `${name}-админ`;
		}
	}

	function createUser(formDataObj) {
		let {
				["name-registration"]: name,
				["who-registration"]: who,
				["remember-registration"]: rememberCheckbox,
			} = formDataObj,
			storage = sessionStorage;

		if (rememberCheckbox === "on") {
			storage = localStorage;
		}

		createNameInStorage(checkWho(name, who), formDataObj, storage);
	}

	function validateOnSubmit(button) {
		button.addEventListener("click", evt => {
			evt.preventDefault();

			let validTextInputsCount = 2,
				falseRadioCheckedCount = 0;

			if (createErrorMessage(loginInput)) {
				showErrorMessage(createErrorMessage(loginInput), loginInput);
				changeInvalidInputColor(createErrorMessage(loginInput), loginInput);
				validTextInputsCount--;
			}

			if (createErrorMessage(passwordInput)) {
				showErrorMessage(createErrorMessage(passwordInput), passwordInput);
				changeInvalidInputColor(
					createErrorMessage(passwordInput),
					passwordInput,
				);
				validTextInputsCount--;
			}

			radioInputs.forEach(radioInput => {
				if (radioInput.checked === false) {
					falseRadioCheckedCount++;
				}

				if (falseRadioCheckedCount === 2) {
					showErrorMessage(createErrorMessage(radioInput), radioInput);
					changeInvalidInputColor(createErrorMessage(radioInput), radioInput);
				} else {
					showErrorMessage("", radioInput);
					changeInvalidInputColor("", radioInput);
				}
			});

			if (validTextInputsCount === 2 && falseRadioCheckedCount === 1) {
				const formData = new FormData(form);

				if (!checkboxInput.checked) {
					formData.append(checkboxInput.name, "off");
				}

				const formDataObj = Object.fromEntries(formData.entries());

				if (button.getAttribute("data-button") === "registration") {
					createUser(formDataObj);
				} else {
					checkUser(formDataObj);
				}
			}
		});
	}

	//localStorage.clear();
	//sessionStorage.clear();

	changeInputColor(loginInput);
	changeInputColor(passwordInput);
	validateRadioInputs(radioInputs);
	validateOnSubmit(submitButton);
}

validateForm(".form--login");
validateForm(".form--registration");
