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

	if (e.target.parentNode.matches(View.DOM.dictionary)) {
		View.showDefinition(Model.CachedWords[e.target.dataset.index]);
		Helpers.updateStats(e.target.innerHTML);
		return;
	}

	if (e.target.matches(View.DOM.menuButton) || e.target.parentNode.matches(View.DOM.menuButton)) {
		View.toggleMenu();
		return;
	}

	if (e.target.parentNode.parentNode.matches(View.DOM.menu)) {
		View.toggleMenu();
		View.togglePopup('#' + e.target.dataset.popupId);

		if (e.target.matches(View.DOM.shareMenuItem)) {
			if (Helpers.shareApp('Ordboka', 'Er det mange vanskelige ord i menigheten? Finn forklaringene her!')) {
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
