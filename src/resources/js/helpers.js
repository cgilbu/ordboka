// ******************************************************
// Module: Global helpers
// ******************************************************

var GlobalHelpers = {};

"use strict";

GlobalHelpers.append = function(targetSelector, tagName, content, className) {
	var newElement = document.createElement(tagName);
	newElement.innerHTML = content;

	if (className) {
		if (Array.isArray(className)) {
			className.forEach(name => {
				newElement.classList.add(name);
			});
		} else {
			newElement.classList.add(className);
		}
	}

	var targets = document.querySelectorAll(targetSelector);
	[...targets].forEach(target => {
		target.appendChild(newElement);
	});
}

GlobalHelpers.getClassSelector = function(node) {
	return "." + node.className.split(" ").join(".");
}

GlobalHelpers.isStandalone = function() {
	if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone == true) {
		return true;
	}

	return false;
}

GlobalHelpers.shareApp = function(title, text) {
	var link = window.location.href.replace(/\/$/, ""); // Removes trailing slash

	if (navigator.share) {
		navigator.share({
			title: title,
			text: text,
			url: link
		});

		return true;
	}
}

GlobalHelpers.toggleClass = function(targetSelector, className) {
	var targets = document.querySelectorAll(targetSelector);
	[...targets].forEach(target => {
		target.classList.toggle(className);
	});
}

GlobalHelpers.toggleSlide = function(node, targetPosition, speed, displayTime) {
	var defaultPosition = node.getBoundingClientRect().top;
	var currentPosition = defaultPosition;
	var slidingDown = true;
	var animation = setInterval(animate, speed);

	function animate() {
		if (currentPosition == targetPosition) {
			clearInterval(animation);
			setTimeout(function() {
				targetPosition = defaultPosition;
				slidingDown = false;
				animation = setInterval(animate, speed);
			}, displayTime);
		} else {
			if (slidingDown) {
				currentPosition++;
			} else {
				currentPosition--;
			}
			node.style.top = currentPosition + "px";
		}
	}
}
