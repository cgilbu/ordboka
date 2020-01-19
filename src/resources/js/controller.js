'use strict';

var Controller = {};

if (window.location.href.includes('joinmyblog') && !window.location.href.includes('dev') && !Helpers.isStandalone()) {
	window.location.href = 'https://ordboka.xyz'; // Redirects web users to new domain
}

Model.getWords(View.openDictionary); // Fires up the engine

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js');

	navigator.serviceWorker.addEventListener('controllerchange', function() {
		View.togglePopup(View.DOM.updatePopup);
	});
}

document.addEventListener('click', function(e) {
	if (!document.body.contains(e.target)) {
		return;
	}

	if (e.target.matches(View.DOM.closeButtons)) {
		View.togglePopup('#' + e.target.parentNode.parentNode.id);
	}

	if (e.target.matches(View.DOM.adminButton)) {
		localStorage.setItem('isAdmin', true);
		View.togglePopup(View.DOM.welcomePopup);
		return;
	}

	if (e.target.matches(View.DOM.startButton)) {
		Helpers.updateStats();
		return;
	}

	if (e.target.matches(View.DOM.updateButton)) {
		window.location.reload();
		return;
	}

	if (e.target.matches(View.DOM.search)) {
		if (e.target.value) {
			View.resetSearch(Model.CachedWords);
		}
		return;
	}

	if (e.target.matches(View.DOM.showComment)) {
		View.toggleComment();
		return;
	}

	if (e.target.matches(View.DOM.definition)) {
		View.closeDefinition();
		return;
	}

	if (e.target.matches(View.DOM.contactButton)) {
		View.sendSuggestion();
		return;
	}

	if (e.target.closest(View.DOM.dictionary)) {
		const wordIndex = e.target.dataset.index ? e.target.dataset.index : e.target.parentNode.dataset.index; // In case the star is clicked
		View.showDefinition(Model.CachedWords[wordIndex]);
		Helpers.updateStats(Model.CachedWords[wordIndex].Title);
		return;
	}

	if (e.target.closest(View.DOM.menuButton)) {
		View.toggleMenu();
		return;
	}

	if (e.target.matches(View.DOM.downloadMenuItem)) {
		if (Helpers.isAndroid()) {
			window.location.href = 'https://play.google.com/store/apps/details?id=com.redcreek.ordboka';
			return;
		}
	}

	if (e.target.parentNode.parentNode.matches(View.DOM.menu)) {
		View.toggleMenu();
		View.togglePopup('#' + e.target.dataset.popupId);

		if (e.target.matches(View.DOM.shareMenuItem)) {
			if (Helpers.shareApp('Ordboka', 'Er det mange vanskelige ord i Bibelen? Finn forklaringene her!')) {
				View.togglePopup(View.DOM.sharePopup); // Closes share-popup if navigator.share is supported
			}
		}
		return;
	}
});

$(View.DOM.search).onkeyup = function(e) {
	let searchTerm = e.target.value.toLowerCase();
	View.listWords(Model.CachedWords, searchTerm);
}
