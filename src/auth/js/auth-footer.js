const footerContactsWrap = document.querySelector(".footer__contacts-wrapper");

function changeFontSize() {
	const rangeInput = document.querySelector("#font-size"),
		inputValueSpan = document.querySelector(".settings__font-size-value");

	if (localStorage.getItem("font-size")) {
		rangeInput.value = localStorage.getItem("font-size");
		changeInputRange(
			rangeInput,
			inputValueSpan,
			localStorage.getItem("font-size"),
		);
	}

	rangeInput.addEventListener("input", () => {
		changeInputRange(rangeInput, inputValueSpan, rangeInput.value);

		if (rangeInput.value == 16) {
			localStorage.removeItem("font-size");
		} else {
			localStorage.setItem("font-size", rangeInput.value);
		}
	});
}

function changeInputRange(input, valueSpan, fontSizeValue) {
	valueSpan.textContent = input.value;
	changeInputRangeColorFill(input);
	setFontSizeVariable(fontSizeValue);
}

function setFontSizeVariable(value) {
	const root = document.querySelector(":root");
	root.style.setProperty("--font-size", `${value}px`);
}

function changeInputRangeColorFill(rangeInput) {
	const value =
		((rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min)) *
		100;
	rangeInput.style.background =
		"linear-gradient(to right, #902bf5 " +
		value +
		"%, transparent " +
		value +
		"%)";
}

function changeThemeColor() {
	const checkboxInput = document.querySelector("#theme-color");

	if (localStorage.getItem("theme-color")) {
		document.body.classList.add("white-theme");
		checkboxInput.checked = true;
	}

	checkboxInput.addEventListener("change", () => {
		if (checkboxInput.checked) {
			localStorage.setItem("theme-color", "white");
			document.body.classList.add("white-theme");
		} else {
			localStorage.removeItem("theme-color");
			document.body.classList.remove("white-theme");
		}
	});
}

function showFooterBlock(button, block, hiddenBlock) {
	button.addEventListener("click", () => {
		if (
			!block.classList.contains("footer--is-visible") &&
			window.matchMedia("(min-width: 481px) and (max-width: 670px)").matches
		) {
			hiddenBlock.classList.add("footer--is-hidden");
		}

		if (
			block.classList.contains("footer--is-visible") &&
			window.matchMedia("(min-width: 481px) and (max-width: 670px)").matches
		) {
			hiddenBlock.classList.remove("footer--is-hidden");
		}

		if (
			!block.classList.contains("footer--is-visible") &&
			window.matchMedia("(min-width: 320px) and (max-width: 480px)").matches
		) {
			block.classList.add("top-100");

			if (block.matches(".footer__settings")) {
				footerContactsWrap.classList.add(
					"footer__contacts-wrapper--has-margin-top",
				);
			}
		}

		if (
			block.classList.contains("footer--is-visible") &&
			window.matchMedia("(min-width: 320px) and (max-width: 480px)").matches
		) {
			block.classList.remove("top-100");

			if (block.matches(".footer__settings")) {
				footerContactsWrap.classList.remove(
					"footer__contacts-wrapper--has-margin-top",
				);
			}
		}

		block.classList.toggle("footer--is-visible");
	});
}

function hideFooterBlock(button, block, hiddenBlock) {
	document.body.addEventListener("click", evt => {
		if (!block.contains(evt.target) && !button.contains(evt.target)) {
			block.classList.remove("footer--is-visible");
		}

		if (
			window.matchMedia("(min-width: 481px) and (max-width: 670px)").matches &&
			!block.contains(evt.target) &&
			!button.contains(evt.target)
		) {
			hiddenBlock.classList.remove("footer--is-hidden");
		}

		if (
			window.matchMedia("(min-width: 320px) and (max-width: 480px)").matches &&
			!block.contains(evt.target) &&
			!button.contains(evt.target)
		) {
			block.classList.remove("top-100");

			if (block.matches(".footer__settings")) {
				footerContactsWrap.classList.remove(
					"footer__contacts-wrapper--has-margin-top",
				);
			}
		}
	});
}

changeFontSize();
changeInputRangeColorFill(document.querySelector("#font-size"));
changeThemeColor();
showFooterBlock(
	document.querySelector(".footer__settings-btn"),
	document.querySelector(".footer__settings"),
	document.querySelector(".footer__contacts-wrapper"),
);

showFooterBlock(
	document.querySelector(".footer__contacts-btn"),
	document.querySelector(".footer__contacts.contacts"),
	document.querySelector(".footer__settings-wrapper"),
);
hideFooterBlock(
	document.querySelector(".footer__settings-btn"),
	document.querySelector(".footer__settings"),
	document.querySelector(".footer__contacts-wrapper"),
);
hideFooterBlock(
	document.querySelector(".footer__contacts-btn"),
	document.querySelector(".footer__contacts.contacts"),
	document.querySelector(".footer__settings-wrapper"),
);
