'use strict';

var View = {
	DOM: {}
};

var $ = function(selector) {
	return document.querySelector(selector);
};

View.DOM.adminButton = '#adminButton';
View.DOM.closeButtons = '.button.close';
View.DOM.closeTip = '#closeTip';
View.DOM.comment = '#comment';
View.DOM.contactButton = '#contactButton';
View.DOM.contactPopup = '#contactPopup';
View.DOM.definition = '#definition';
View.DOM.dictionary = '#dictionary';
View.DOM.downloadMenuItem = '#downloadMenuItem';
View.DOM.infoTip = '#infoTip';
View.DOM.loading = '#loading';
View.DOM.menu = '#menu';
View.DOM.menuButton = '#menuButton';
View.DOM.playStorePopup = '#playStorePopup';
View.DOM.search = '#search';
View.DOM.shareMenuItem = '#shareMenuItem';
View.DOM.sharePopup = '#sharePopup';
View.DOM.showComment = '#showComment';
View.DOM.startButton = '#startButton';
View.DOM.suggestionSentPopup = '#suggestionSentPopup';
View.DOM.textSuggestion = '#textSuggestion';
View.DOM.updateButton = '#updateButton';
View.DOM.updatePopup = '#updatePopup';
View.DOM.welcomePopup = '#welcomePopup';
View.DOM.wordSuggestion = '#wordSuggestion';

View.openDictionary = function(words) {
	View.listWords(words);
	$(View.DOM.search).placeholder = 'Søk blant ' + words.length + ' ord';
	$(View.DOM.loading).classList.add('hidden');
	View.handleTips();
	View.prepareDownload();
}

View.listWords = function(words, searchTerm) {
	let target = $(View.DOM.dictionary);
	target.innerHTML = '';
	window.scrollTo(0, 0);

	for (let [i, word] of words.entries()) {
		if (searchTerm && word.Title.toLowerCase().search(searchTerm) == -1) {
			continue; // Skips words not matching search
		}

		let element = document.createElement('div');
		element.dataset.index = i;
		element.innerHTML = word.Title + (word.IsEssential ? ' <img src="/resources/images/star.svg" alt="Essensielt ord">' : '');
		target.appendChild(element);
	}
}

View.showDefinition = function(word) {
	let element = document.createElement('div');
	element.id = 'definition';
	element.classList.add('popup');

	let html = `<div>`;
	html += `<b>${word.Title}</b>`;

	if (word.Category) {
		html += `<span class="label">${word.Category}</span>`;
	}

	html += `<div id="definitionText">${word.Definition}</div>`;

	if (word.Comment) {
		html += `<div id="showComment" class="label">Vis kommentar</div>`;
		html += `<div id="comment" class="hidden">${word.Comment}</div>`;
	}

	html += `</div>`;

	element.innerHTML = html;
	document.body.appendChild(element);
	$(View.DOM.closeTip).classList.toggle('hidden');
	document.body.classList.toggle('noOverflow'); // Has no effect on iOS
}

View.toggleComment = function() {
	let comment = $(View.DOM.comment);
	let isOpen = !comment.classList.contains('hidden');

	$(View.DOM.showComment).innerHTML = isOpen ? 'Vis kommentar' : 'Skjul kommentar';
	comment.classList.toggle('hidden');
}

View.closeDefinition = function() {
	$(View.DOM.definition).remove();
	document.body.classList.toggle('noOverflow'); // Has no effect on iOS
	$(View.DOM.closeTip).classList.toggle('hidden');
}

View.resetSearch = function(words) {
	$(View.DOM.search).value = '';
	$(View.DOM.search).blur();
	View.listWords(words);
}

View.toggleMenu = function() {
	$(View.DOM.menuButton).classList.toggle('isOpen');
	View.togglePopup(View.DOM.menu);
}

View.togglePopup = function(targetSelector) {
	document.body.classList.toggle('noOverflow'); // Has no effect on iOS
	$(targetSelector).classList.toggle('hidden');
}

View.handleTips = function() {
	if (!localStorage.getItem('userID') && !localStorage.getItem('isAdmin')) {
		View.togglePopup(View.DOM.welcomePopup);
	} else {
		if (!localStorage.getItem('appTip') && !Helpers.isStandalone()) {
			View.showInfoTip('appTip', 'Tips: Du kan lagre Ordboka som en app via menyen');
		} else if (!localStorage.getItem('definitionTip')) {
			View.showInfoTip('definitionTip', 'Tips: Les om hvordan vi definerer ord i menyen');
		}
	}
}

View.showInfoTip = function(title, text) {
	let infoTip = $(View.DOM.infoTip);
	infoTip.innerHTML = text;

	setTimeout(function() {
		Helpers.toggleSlide(infoTip, 0, 5, 4000); // node, targetPosition, speed, displayTime
	}, 4000);

	localStorage.setItem(title, true);
}

View.prepareDownload = function() {
	if (Helpers.isAndroidApp()) {
		$(View.DOM.downloadMenuItem).classList.add('hidden');
		return;
	}

	if (Helpers.isIOS()) {
		$('#iosInfo').classList.remove('hidden');
		return;
	}

	if (!Helpers.isIOS() && !Helpers.isAndroid()) {
		$('#otherInfo').classList.remove('hidden');
		return;
	}

	if (Helpers.isAndroid() && !Helpers.isAndroidApp() && !localStorage.getItem('playStoreTip')) {
		const webUser = '#playStorePopup #webUser';
		const appUser = '#playStorePopup #appUser';

		if (Helpers.isStandalone()) {
			$(webUser).classList.add('hidden');
			$(appUser).classList.remove('hidden');
		}

		View.togglePopup(View.DOM.playStorePopup);
		localStorage.setItem('playStoreTip', true);
	}
}

View.sendSuggestion = function() {
	let wordSuggestion = $(View.DOM.wordSuggestion);
	let textSuggestion = $(View.DOM.textSuggestion);

	if (!wordSuggestion.value) {
		return;
	}

	let message = wordSuggestion.value;

	if (textSuggestion.value) {
		message += ': ' + textSuggestion.value;
	}

	Helpers.sendMail('Ordboka: Nytt forslag', message, View.suggestionSent);
}

View.suggestionSent = function(success) {
	if (!success) {
		alert('Noe gikk galt: Kunne ikke sende forslag. Sjekk at du er koblet til nettet.');
		return;
	}

	View.togglePopup(View.DOM.contactPopup);
	View.togglePopup(View.DOM.suggestionSentPopup);

	$(View.DOM.wordSuggestion).value = '';
	$(View.DOM.textSuggestion).value = '';
}
