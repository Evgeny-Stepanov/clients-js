const rangeInput = document.querySelector("input#font-size"),
	showSettingsButton = document.querySelector(".footer__show-settings-button"),
	footerSettingsWrapper = document.querySelector(".footer__settings-wrapper"),
	footerSettings = document.querySelector(".footer__settings"),
	showContactsButton = document.querySelector(".footer__show-contacts-button"),
	footerContactsWrapper = document.querySelector(".footer__contacts-wrapper"),
	footerContacts = document.querySelector(".footer__contacts");

function changeFontSize(rangeInput) {
	const rangeInputValueSpan = document.querySelector(
			".settings__font-size-value",
		),
		fontSizeValueFromLocalStorage = localStorage.getItem("font-size");

	if (fontSizeValueFromLocalStorage) {
		rangeInput.value = fontSizeValueFromLocalStorage;
		changeRangeInputAndFontSizeRootVariable(
			rangeInput,
			rangeInputValueSpan,
			fontSizeValueFromLocalStorage,
		);
	}

	rangeInput.addEventListener("input", () => {
		changeRangeInputAndFontSizeRootVariable(
			rangeInput,
			rangeInputValueSpan,
			rangeInput.value,
		);

		if (rangeInput.value == 16) {
			localStorage.removeItem("font-size");
		} else {
			localStorage.setItem("font-size", rangeInput.value);
		}
	});

	function changeRangeInputAndFontSizeRootVariable(
		input,
		valueSpan,
		fontSizeValue,
	) {
		valueSpan.textContent = input.value;
		recolorRangeInputFill(input);
		document.body.style.setProperty("--font-size", `${fontSizeValue}px`);
	}
}

function recolorRangeInputFill(input) {
	const fillPercent =
			((input.value - input.min) / (input.max - input.min)) * 100,
		fillColor = getComputedStyle(document.body).getPropertyValue(
			"--color-accent",
		);

	input.style.background =
		`linear-gradient(to right, ${fillColor} ` +
		fillPercent +
		"%, transparent " +
		fillPercent +
		"%)";
}

function changeThemeColor() {
	const checkboxInput = document.querySelector("input#theme-color");

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

function showFooterBlock(showButton, targetBlock, blockToHide) {
	showButton.addEventListener("click", () => {
		if (
			!targetBlock.classList.contains("block--is-visible") &&
			window.matchMedia("(min-width: 481px) and (max-width: 670px)").matches
		) {
			blockToHide.classList.add("block--is-hidden");
		}

		if (
			targetBlock.classList.contains("block--is-visible") &&
			window.matchMedia("(min-width: 481px) and (max-width: 670px)").matches
		) {
			blockToHide.classList.remove("block--is-hidden");
		}

		if (
			!targetBlock.classList.contains("block--is-visible") &&
			window.matchMedia("(min-width: 320px) and (max-width: 480px)").matches
		) {
			targetBlock.classList.add("has-top-100-percents");

			if (targetBlock.matches(".footer__settings")) {
				footerContactsWrapper.classList.add(
					"footer__contacts-wrapper--has-margin-top",
				);
			}
		}

		if (
			targetBlock.classList.contains("block--is-visible") &&
			window.matchMedia("(min-width: 320px) and (max-width: 480px)").matches
		) {
			targetBlock.classList.remove("has-top-100-percents");

			if (targetBlock.matches(".footer__settings")) {
				footerContactsWrapper.classList.remove(
					"footer__contacts-wrapper--has-margin-top",
				);
			}
		}

		targetBlock.classList.toggle("block--is-visible");
	});
}

function hideFooterBlock(showButton, targetBlock, blockToHide) {
	document.documentElement.addEventListener("click", evt => {
		if (!targetBlock.contains(evt.target) && !showButton.contains(evt.target)) {
			targetBlock.classList.remove("block--is-visible");
		}

		if (
			window.matchMedia("(min-width: 481px) and (max-width: 670px)").matches &&
			!targetBlock.contains(evt.target) &&
			!showButton.contains(evt.target)
		) {
			blockToHide.classList.remove("block--is-hidden");
		}

		if (
			window.matchMedia("(min-width: 320px) and (max-width: 480px)").matches &&
			!targetBlock.contains(evt.target) &&
			!showButton.contains(evt.target)
		) {
			targetBlock.classList.remove("has-top-100-percents");

			if (targetBlock.matches(".footer__settings")) {
				footerContactsWrapper.classList.remove(
					"footer__contacts-wrapper--has-margin-top",
				);
			}
		}
	});
}

changeFontSize(rangeInput);
recolorRangeInputFill(rangeInput);
changeThemeColor();
showFooterBlock(showSettingsButton, footerSettings, footerContactsWrapper);
showFooterBlock(showContactsButton, footerContacts, footerSettingsWrapper);
hideFooterBlock(showSettingsButton, footerSettings, footerContactsWrapper);
hideFooterBlock(showContactsButton, footerContacts, footerSettingsWrapper);
