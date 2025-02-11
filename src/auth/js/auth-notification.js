export function showNotification(message, status) {
	const notification = document.querySelector(".notif");

	notification.textContent = message;
	notification.classList.add(`${status}`);
	notification.classList.add("notif-fade");

	setTimeout(() => {
		notification.classList.remove("notif-fade");
		notification.classList.remove(`${status}`);
	}, 7_000);
}
