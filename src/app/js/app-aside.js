import { dbContactsObj } from "../../db";
import { getOnlineUserType } from "./app-general-functions";

function showTimeAndDate() {
	const hoursSpan = document.querySelector(".time-and-date__time-hours"),
		minutesSpan = document.querySelector(".time-and-date__time-minutes");

	showTime(hoursSpan, minutesSpan);
	showDate(new Date());

	setInterval(showTime, 1_000, hoursSpan, minutesSpan);

	function showTime(hoursSpan, minutesSpan) {
		const currentDate = new Date();

		if (currentDate.getHours() < 10) {
			hoursSpan.textContent = `0${currentDate.getHours()}`;
		} else {
			hoursSpan.textContent = currentDate.getHours();
		}

		if (currentDate.getMinutes() < 10) {
			minutesSpan.textContent = `0${currentDate.getMinutes()}`;
		} else {
			minutesSpan.textContent = currentDate.getMinutes();
		}

		if (currentDate.getHours() === 0 && currentDate.getMinutes() === 0) {
			showDate(currentDate);
		}
	}

	function showDate(currentDate) {
		const dateDiv = document.querySelector(".time-and-date__date"),
			dateOptions = {
				day: "numeric",
				month: "long",
				year: "numeric",
			};

		dateDiv.textContent = currentDate.toLocaleDateString("ru", dateOptions);
	}
}

function createAndShowContacts({ phoneNumber, address, linkToAddressIn2gis }) {
	const contactsDiv = document.querySelector(".aside__contacts");

	if (getOnlineUserType() === "client") {
		contactsDiv.innerHTML = `
			<a href=${linkToAddressIn2gis} target="_blank" title="Местоположение в 2ГИС" class="aside__contacts-address">${address}</a>
			<a href="tel:+${+phoneNumber.replaceAll("-", "")}" class="aside__contacts-phone">${phoneNumber}</a>
		`;

		if (window.matchMedia("(min-width: 768px)").matches) {
			const link = document.querySelector(".aside__contacts-phone");
			link.addEventListener("click", evt => {
				evt.preventDefault();
			});
		}
	} else {
		contactsDiv.innerHTML = `
			<div class="aside__contacts-address--has-cursor-default">${address}</div>
			<div class="aside__contacts-phone">${phoneNumber}</div>
		`;
	}
}

showTimeAndDate();
createAndShowContacts(dbContactsObj);
