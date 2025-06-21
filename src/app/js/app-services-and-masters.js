class ServicesForAdmins extends Services {
	showAddModal(parentModal) {
		let modal = document.querySelector("dialog[data-modal='add-service']"),
			closeBtn = modal.querySelector("button[data-action='close']"),
			createBtn = modal.querySelector("button[data-action='create-service']");

		showModal(modal);
		closeModal(modal, closeBtn, null);
		imagesDropdown(modal);

		createBtn.onclick = () => {
			addServiceOrMaster(modal);
			parentModal.remove();
			modal.close();
			this.showModal();
		};
	}
}

class MastersForAdmins extends ServicesForAdmins {
	showAddModal() {
		let modal = document.querySelector("dialog[data-modal='add-master']"),
			addBtn = modal.querySelector("button[data-action='create-master']"),
			closeBtn = modal.querySelector("button[data-action='close']");

		showModal(modal);
		closeModal(modal, closeBtn, null);
		imagesDropdown(modal);

		addBtn.onclick = evt => {
			evt.preventDefault();
			addServiceOrMaster(modal);
		};
	}
}

function resetStates(modal) {
	let inputs = modal.querySelectorAll("input"),
		errorSpans = modal.querySelectorAll(".form__input-error"),
		selectList = modal.querySelector(".form__select-list"),
		notif = modal.querySelector(".notif");

	if (selectList.classList.contains("form__select-list--is-open")) {
		selectList.classList.remove("form__select-list--is-open");
	}

	inputs.forEach(input => {
		if (input.classList.contains("form__input--is-invalid")) {
			input.classList.remove("form__input--is-invalid");
		}
	});

	errorSpans.forEach(errorSpan => {
		if (errorSpan.textContent.length > 0) {
			errorSpan.textContent = "";
		}
	});

	if (notif.classList.contains("notif-fade")) {
		notif.classList.remove("notif-fade");
	}

	if (notif.textContent.length > 0) {
		notif.textContent = "";
	}
}

function createService(formDataObj, servicesDbObj) {
	let { name } = formDataObj,
		addedServicesArr = [formDataObj],
		storage = checkStorageOnline(),
		returnConditionCount = 0;

	servicesDbObj.forEach(service => {
		if (service.name === name) {
			showNotification(
				"[data-notif='add-service']",
				"Такая услуга уже добавлена",
				"notif--is-error",
			);
			returnConditionCount++;
		}
	});

	if (returnConditionCount > 0) {
		return;
	}

	if (storage.getItem("addedServices")) {
		addedServicesArr = JSON.parse(storage.getItem("addedServices"));

		addedServicesArr.forEach(addedService => {
			if (addedService.name === name) {
				showNotification(
					"[data-notif='add-service']",
					"Такая услуга уже добавлена",
					"notif--is-error",
				);
				returnConditionCount++;
			}
		});

		if (returnConditionCount > 0) {
			return;
		}

		addedServicesArr.push(formDataObj);
		storage.setItem("addedServices", JSON.stringify(addedServicesArr));
	} else {
		storage.setItem("addedServices", JSON.stringify(addedServicesArr));
	}
}

function imagesDropdown(modal) {
	const form = modal.querySelector(".form"),
		selectBtn = form.querySelector(".form__select-btn"),
		selectBtnImage = selectBtn.querySelector("img"),
		selectList = form.querySelector(".form__select-list"),
		selectItems = selectList.querySelectorAll(".form__select-list-item");

	selectBtn.onclick = () => {
		selectList.style.width = getComputedStyle(selectBtn).width;
		selectList.classList.toggle("form__select-list--is-open");
	};

	selectBtnImage.src = selectItems[0].querySelector("img").src;
	selectBtnImage.setAttribute(
		"data-image",
		selectItems[0].querySelector("img").getAttribute("data-image"),
	);

	selectItems.forEach(selectItem => {
		selectItem.onclick = () => {
			let img = selectItem.querySelector("img");
			selectBtnImage.src = img.src;
			selectBtnImage.setAttribute("data-image", img.getAttribute("data-image"));
			selectList.classList.remove("form__select-list--is-open");
		};
	});

	modal.querySelector(".modal__scroll-wrap").onclick = evt => {
		if (
			!selectBtn.contains(evt.target) &&
			!selectList.querySelector(".form__select-list-item").contains(evt.target)
		) {
			selectList.classList.remove("form__select-list--is-open");
		}
	};
}

function addServiceOrMaster(modal) {
	const form = modal.querySelector(".form"),
		image = form.querySelector(".form__select-btn img"),
		submitButton = form.querySelector("button[type='submit']");

	if (modal.getAttribute("data-modal") === "add-service") {
		const nameInput = form.querySelector("#name-service"),
			priceInput = form.querySelector("#price-service");

		nameInput.addEventListener("blur", () => {
			validateOnBlur(nameInput);
		});

		priceInput.addEventListener("blur", () => {
			validateOnBlur(priceInput);
		});

		validateOnSubmit(submitButton, nameInput, priceInput);
	} else if (modal.getAttribute("data-modal") === "add-master") {
		console.log("master");
	}

	function createErrorMessage(input) {
		const noPattern = input.validity.patternMismatch,
			noValue = input.validity.valueMissing;

		let errorMessage = "";

		if (noPattern) {
			errorMessage = `${input.title}`;
		} else if (noValue) {
			errorMessage = "Заполните поле";
		}

		return errorMessage;
	}

	function showErrorMessage(message, input) {
		const messageSpan = input.parentElement.querySelector(".form__input-error");
		messageSpan.textContent = message;
	}

	function changeInvalidInputColor(message, input) {
		if (message) {
			input.classList.add("form__input--is-invalid");
		} else {
			input.classList.remove("form__input--is-invalid");
		}
	}

	function validateOnBlur(input) {
		showErrorMessage(createErrorMessage(input), input);
		changeInvalidInputColor(createErrorMessage(input), input);
	}

	function validateOnSubmit(button, ...inputs) {
		button.onclick = evt => {
			evt.preventDefault();
			let invalidTextInputsCount = 0;

			inputs.forEach(input => {
				if (createErrorMessage(input)) {
					showErrorMessage(createErrorMessage(input), input);
					changeInvalidInputColor(createErrorMessage(input), input);
					invalidTextInputsCount++;
				}
			});

			if (
				button.getAttribute("data-action") === "create-service" &&
				invalidTextInputsCount === 0
			) {
				const formData = new FormData(form);
				formData.append("image", dbObj[image.getAttribute("data-image")]);
				const formDataObj = Object.fromEntries(formData.entries());
				createService(formDataObj, dbObj.servicesDbObj, modal, form);

				modal.close();
				resetStates(modal);
				form.reset();
			} else if (
				button.getAttribute("data-action") === "create-master" &&
				invalidTextInputsCount === 0
			) {
				const formData = new FormData(form);
				formData.append("image", dbObj[image.getAttribute("data-image")]);
				const formDataObj = Object.fromEntries(formData.entries());
				//createMaster(formDataObj, dbObj.mastersDbObj, modal, form);
			}
		};
	}
}
