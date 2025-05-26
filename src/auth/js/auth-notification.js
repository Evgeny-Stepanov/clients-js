function showNotification(notificationSelector, message, status) {
	const notification = document.querySelector(notificationSelector);

	if (notification.classList.contains("notification--error")) {
		notification.classList.remove("notification--error");
	} else if (notification.classList.contains("notification--success")) {
		notification.classList.remove("notification--success");
	}

	if (notification.classList.contains("notification-animation")) {
		notification.classList.remove("notification-animation");
		void notification.offsetWidth;
	}

	notification.textContent = message;
	notification.classList.add(
		`notification--${status}`,
		"notification-animation",
	);
}

export { showNotification };
