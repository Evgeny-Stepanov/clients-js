import { phoneNumber, address } from "../../db";

function changeTime() {
	const hours = document.querySelector(".calendar__time-h"),
		minutes = document.querySelector(".calendar__time-m");

	let dateNow = new Date();

	showTime(hours, minutes);
	showDate(dateNow);

	setInterval(showTime, 1_000, hours, minutes);
}

function showTime(hoursSpan, minutesSpan) {
	let dateNow = new Date();

	if (dateNow.getHours() < 10) {
		hoursSpan.textContent = `0${dateNow.getHours()}`;
	} else {
		hoursSpan.textContent = dateNow.getHours();
	}

	if (dateNow.getMinutes() < 10) {
		minutesSpan.textContent = `0${dateNow.getMinutes()}`;
	} else {
		minutesSpan.textContent = dateNow.getMinutes();
	}

	if (dateNow.getHours === 0) {
		showDate(dateNow);
	}
}

function showDate(dateNow) {
	const date = document.querySelector(".calendar__date"),
		dateOptions = {
			day: "numeric",
			month: "long",
			year: "numeric",
		};
	date.textContent = dateNow.toLocaleDateString("ru", dateOptions);
}

function createContacts(phone, address) {
	const contacts = document.querySelector(".app__aside-contacts");

	if (checkWho() === "client") {
		contacts.innerHTML = `
			<a href="https://2gis.ru/magnitogorsk/geo/3659810352402709?m=58.992316%2C53.379106%2F17.55" target="_blank" title="Местоположение в 2ГИС" class="app__aside-contacts-address">${address}</a>
			<a href="tel:+${+phone.replaceAll("-", "")}" class="app__aside-contacts-phone">${phone}</a>
		`;

		if (window.matchMedia("(min-width: 768px)").matches) {
			let link = document.querySelector(".app__aside-contacts-phone");
			link.addEventListener("click", evt => {
				evt.preventDefault();
			});
		}
	} else {
		contacts.innerHTML = `
			<div class="app__aside-contacts-address--is-cursor-default">${address}</div>
			<div class="app__aside-contacts-phone">${phone}</div>
		`;
	}
}

function checkWho() {
	let user = localStorage.getItem("online") || sessionStorage.getItem("online"),
		userType = "client";

	if (user.slice(-5) === "админ") {
		userType = "admin";
	}

	return userType;
}

changeTime();
createContacts(phoneNumber, address);
