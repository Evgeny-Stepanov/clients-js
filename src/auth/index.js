import "./../css/styles.scss";

import "./js/auth-animation.js";
import "./js/auth-form.js";
import "./js/auth-footer.js";
import "./js/auth-notification.js";

if (localStorage.getItem("online")) {
	window.location.assign("/app.html");
}
