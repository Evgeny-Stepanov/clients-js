function showMobileMenu() {
	const showMobileMenuButton = document.querySelector(
			".app__main-actions-mobile-menu-button",
		),
		mobileMenu = document.querySelector(".app__main-actions-mobile");

	showMobileMenuButton.addEventListener("click", () => {
		showMobileMenuButton.classList.toggle(
			"app__main-actions-mobile-menu-button--is-clicked",
		);

		mobileMenu.classList.toggle("app__main-actions-mobile--is-shown");

		recolorClientsText();
	});

	function recolorClientsText() {
		const clientsText = document.querySelector("[data-recolored-text]");

		clientsText.classList.toggle(
			"app__main-actions-mobile-title-span--is-recolored",
		);
	}
}

showMobileMenu();
