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

function addServiceOrMaster(modal) {
	const form = modal.querySelector(".form"),
		image = form.querySelector(".form__select-btn img"),
		submitButton = form.querySelector("button[type='submit']");

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
