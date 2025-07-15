function showMobileMenu() {
	const mobileMenuWrapper = document.querySelector(
			".app__main-actions-mobile-wrapper",
		),
		showMobileMenuButton = mobileMenuWrapper.querySelector(
			".app__main-actions-mobile-menu-button",
		),
		mobileMenu = mobileMenuWrapper.querySelector(".app__main-actions-mobile"),
		mobileMenuBackdrop = mobileMenuWrapper.querySelector(
			".app__main-actions-mobile-backdrop",
		);

	mobileMenuWrapper.addEventListener("click", evt => {
		if (evt.target === showMobileMenuButton) {
			showMobileMenuButton.classList.toggle(
				"app__main-actions-mobile-menu-button--is-clicked",
			);

			mobileMenu.classList.toggle("app__main-actions-mobile--is-shown");

			recolorClientsText();
		}

		if (
			mobileMenu.classList.contains("app__main-actions-mobile--is-shown") &&
			evt.target === mobileMenuBackdrop
		) {
			showMobileMenuButton.classList.toggle(
				"app__main-actions-mobile-menu-button--is-clicked",
			);

			mobileMenu.classList.toggle("app__main-actions-mobile--is-shown");

			recolorClientsText();
		}
	});

	function recolorClientsText() {
		const clientsText = document.querySelector("[data-recolored-text]");

		clientsText.classList.toggle(
			"app__main-actions-mobile-title-span--is-recolored",
		);
	}
}

showMobileMenu();
