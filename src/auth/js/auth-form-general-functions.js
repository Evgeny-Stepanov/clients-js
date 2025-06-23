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

export {
	createInputErrorMessage,
	showInputErrorMessage,
	recolorInvalidInputBorder,
};
