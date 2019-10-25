'use strict';

var Helpers = {};

Helpers.isStandalone = function() {
	if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone == true) {
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
	let defaultPosition = node.getBoundingClientRect().top;
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

Helpers.updateStats = function(wordClicked) {
	if (localStorage.getItem('isAdmin')) {
		return;
	}

	if (!localStorage.getItem('userID')) {
		let randomID = new Uint32Array(1);
		window.crypto.getRandomValues(randomID);
		localStorage.setItem('userID', parseInt(randomID));
	}

	if (!wordClicked) {
		return;
	}

	let utcDateTime = new Date().toISOString();
	let statsObject = { word: wordClicked, userID: localStorage.getItem('userID'), utcDateTime: utcDateTime, isStandalone: Helpers.isStandalone() };

	let statsData = '?statsData=' + JSON.stringify(statsObject);
	fetch('/resources/php/updateStats.php' + statsData)
		.then(function(response) {
			if (response.status == 500) {
				console.log('Noe gikk galt: Kunne ikke oppdatere statistikk');
			}
		});
}
