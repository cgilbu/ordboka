'use strict';

var Helpers = {};

Helpers.isStandalone = function() {
	if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone == true) {
		return true;
	}

	return false;
}

Helpers.isAndroidApp = function() {
	if (document.referrer.includes('android-app://com.redcreek')) {
		return true;
	}

	return false;
}

Helpers.isAndroid = function() {
	if (/android/i.test(navigator.userAgent)) {
		return true;
	}

	return false;
}

Helpers.isIOS = function() {
	if (/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent)) { // New iPads look like Macs
		return true;
	}

	return false;
}

Helpers.shareApp = function(title, text) {
	let url = window.location.href.replace(/\/$/, ''); // Removes trailing slash

	if (navigator.share) {
		navigator.share({
			title: title,
			text: text,
			url: url
		});

		return true;
	}
}

Helpers.sendMail = function(title, text, callback) {
	let mailData = `?subject=${title}&message=${text}`;
	fetch('/resources/php/sendMail.php' + mailData)
		.then(function(response) {
			callback(response.status == 500 ? false : true);
		});
}

Helpers.toggleSlide = function(node, targetPosition, speed, displayTime) {
	let defaultPosition = Math.round(node.getBoundingClientRect().top);
	let currentPosition = defaultPosition;
	let slidingDown = true;
	let animation = setInterval(animate, speed);

	function animate() {
		if (currentPosition == targetPosition) {
			clearInterval(animation);
			if (slidingDown) {
				setTimeout(function() {
					targetPosition = defaultPosition;
					slidingDown = false;
					animation = setInterval(animate, speed);
				}, displayTime);
			}
		} else {
			if (slidingDown) {
				currentPosition++;
			} else {
				currentPosition--;
			}
			node.style.top = currentPosition + 'px';
		}
	}
}
