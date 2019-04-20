// ******************************************************
// Modules
// ******************************************************

var DOM = {};
var Helpers = {};
var View = {};

"use strict";

// ******************************************************
// Directs web users from old to new domain
// ******************************************************

if (window.location.href.includes("joinmyblog") && !window.location.href.includes("dev") && !GlobalHelpers.isStandalone()) {
	window.location.href = "https://ordboka.xyz";
}

// ******************************************************
// DOM references
// ******************************************************

DOM.closeButtons = ".button.close";
DOM.closeTip = "#closeTip";
DOM.contactButton = "#contactButton";
DOM.contactPopup = "#contactPopup";
DOM.definitionPopups = ".popup.definition";
DOM.definitions = "#definitions";
DOM.dictionary = "#dictionary";
DOM.downloadMenuItem = "#downloadMenuItem";
DOM.infoTip = "#infoTip";
DOM.loading = "#loading";
DOM.menu = "#menu";
DOM.menuButton = "#menuButton";
DOM.search = "#search";
DOM.shareMenuItem = "#shareMenuItem";
DOM.sharePopup = "#sharePopup";
DOM.showComment = ".showComment";
DOM.startButton = "#startButton";
DOM.suggestionSentPopup = "#suggestionSentPopup";
DOM.updateButton = "#updateButton";
DOM.updatePopup = "#updatePopup";
DOM.welcomePopup = "#welcomePopup";

// ******************************************************
// Global variables
// ******************************************************

var _allWords = []; // Contains a cache of all the words for faster loading
var _wordsLoaded = []; // Contains words already loaded into the dictionary
var _loadingComplete = false;
var _isSearching = false;

// ******************************************************
// View
// ******************************************************

View.loadDictionary = function(words) {
	var placeholder = "Søk blant " + words.length + " ord";
	document.querySelector(DOM.search).placeholder = placeholder;

	_allWords = Helpers.sortWords(words);

	if (!localStorage.getItem("storedWords")) {
		localStorage.setItem("storedWords", JSON.stringify(_allWords)); // Used later for View.showChanges()
	}

	View.loadWords();
	Helpers.smartLoading();
}

View.reloadDictionary = function(searchTerm) {
	_wordsLoaded = [];
	_loadingComplete = false;
	_isSearching = false;

	if (searchTerm) {
		_isSearching = true;
		document.querySelector(DOM.loading).classList.add("hidden");
	} else {
		document.querySelector(DOM.loading).classList.remove("hidden");
	}

	document.querySelector(DOM.dictionary).innerHTML = "";
	document.querySelector(DOM.definitions).innerHTML = "";

	View.loadWords(searchTerm);
}

View.loadWords = function(searchTerm) {
	var words = _allWords.slice(_wordsLoaded.length);
	var wordsAdded = 0;

	for (let word of words) {
		var title = word.Title;
		var definition = word.Definition;
		var comment = word.Comment;
		var category = word.Category;

		if (searchTerm && title.toLowerCase().search(searchTerm) == -1) {
			continue; // Skips words not matching search
		}

		View.appendWord(_wordsLoaded.length, title, definition, comment, category);

		_wordsLoaded.push(word);
		wordsAdded++;

		if (wordsAdded == 40) {
			break; // Loads 40 words at a time (ends here on search)
		}
	}

	if (_wordsLoaded.length == _allWords.length) {
		_loadingComplete = true;
		document.querySelector(DOM.loading).classList.add("hidden");
	}

	View.showChanges();
}

View.appendWord = function(number, title, definition, comment, category) {
	GlobalHelpers.append(DOM.dictionary, "div", title, 'word_' + number);

	var hasComment = comment ? "" : " hidden";
	var hasCategory = category ? "" : " hidden";

	GlobalHelpers.append(DOM.definitions, "div", `
	<div class="popupContent">
		<b>${title}</b><span class="label${hasCategory}">${category}</span>
		<br>
		<div>${definition}</div>
		<div class="label${hasComment} showComment">Vis kommentar</div>
		<div class="comment hidden">${comment}</div>
	</div>
	`.trim(), ['popup', 'definition', 'hidden', 'word_' + number]);
}

View.showChanges = function() {
	if (localStorage.getItem("storedWordsLifespan") == null) {
		return;
	}

	var storedWordsLifespan = parseInt(localStorage.getItem("storedWordsLifespan"));

	if (storedWordsLifespan == 0) {
		localStorage.removeItem("storedWordsLifespan");
		localStorage.setItem("storedWords", JSON.stringify(_allWords));
		return;
	}

	var storedWords = JSON.parse(localStorage.getItem("storedWords"));

	for (let [i, loadedWord] of _wordsLoaded.entries()) {
		var title = loadedWord.Title.toLowerCase();
		var definition = loadedWord.Definition.toLowerCase();
		var comment = loadedWord.Comment;

		var matchFound = false;

		for (let storedWord of storedWords) {
			var storedTitle = storedWord.Title.toLowerCase();
			var storedDefinition = storedWord.Definition.toLowerCase();
			var storedComment = storedWord.Comment;

			if (title == storedTitle && definition == storedDefinition && comment == storedComment) {
				matchFound = true;
			}
		}

		if (!matchFound) {
			document.querySelector(".word_" + i).classList.add("updated");
		}
	}
}

View.togglePopup = function(targetSelector) {
	GlobalHelpers.toggleClass("body", "noOverflow"); // Have no effect on iOS
	GlobalHelpers.toggleClass(targetSelector, "hidden");
}

View.toggleMenu = function() {
	GlobalHelpers.toggleClass(DOM.menuButton, "isOpen");
	View.togglePopup(DOM.menu);
}

View.showTip = function(title, text) {
	var infoTip = document.querySelector(DOM.infoTip);
	infoTip.innerHTML = text;

	setTimeout(function() {
		GlobalHelpers.toggleSlide(infoTip, 0, 5, 4000);
	}, 4000);

	localStorage.setItem(title, true);
}

View.prepareDownload = function() {
	if (GlobalHelpers.isStandalone()) {
		GlobalHelpers.toggleClass(DOM.downloadMenuItem, "hidden");
		return;
	}

	var androidChromeInfo = "#androidChrome";
	var androidOtherInfo = "#androidOther";
	var iosChromeInfo = "#iosChrome";
	var iosInfo = "#ios";
	var telegramInfo = "#telegram";

	var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

	if (iOS) {
		GlobalHelpers.toggleClass(iosInfo, "hidden");
		GlobalHelpers.toggleClass(telegramInfo, "hidden");

		var iOSChrome = navigator.userAgent.match("CriOS");

		if (iOSChrome) {
			GlobalHelpers.toggleClass(iosChromeInfo, "hidden");
			GlobalHelpers.toggleClass(telegramInfo, "hidden");
		}

		return;
	}

	var androidChrome = navigator.userAgent.match("Chrome");

	if (!androidChrome) {
		GlobalHelpers.toggleClass(androidOtherInfo, "hidden");
		return;
	}

	GlobalHelpers.toggleClass(androidChromeInfo, "hidden");
}

// ******************************************************
// Helpers
// ******************************************************

Helpers.getWords = function(callback, searchTerm) {
	var request = new XMLHttpRequest();
	request.open('GET', '/resources/data/words.json');

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			callback(data, searchTerm);
		} else {
			alert("Noe gikk galt: Kunne ikke laste ord");
		}
	}

	request.onerror = function() {
		alert("Noe gikk galt: Kunne ikke laste ord");
	}

	request.send();
}

Helpers.sortWords = function(words) {
	var sortedWords = words.sort((a, b) => { // Unicode sorting (room for improvement)
		var titleA = a.Title.toLowerCase().replace("æ", "z").replace("ø", "zz").replace("å", "zzz");
		var titleB = b.Title.toLowerCase().replace("æ", "z").replace("ø", "zz").replace("å", "zzz");

		return titleA.localeCompare(titleB);
	});

	return sortedWords;
}

Helpers.sendSuggestion = function() {
	var wordSuggestion = document.querySelector("#wordSuggestion");
	var textSuggestion = document.querySelector("#textSuggestion");

	if (!wordSuggestion.value) {
		return;
	}

	var message = wordSuggestion.value;

	if (textSuggestion.value) {
		message += ": " + textSuggestion.value;
	}

	var request = new XMLHttpRequest();
	var data = "?subject=Ordboka: Nytt forslag&message=" + message;
	request.open('GET', '/resources/php/sendMail.php' + data);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			View.togglePopup(DOM.contactPopup);
			View.togglePopup(DOM.suggestionSentPopup);
			wordSuggestion.value = "";
			textSuggestion.value = "";
		} else {
			alert("Noe gikk galt: Kunne ikke sende forslag. Sjekk at du er koblet til nettet.");
		}
	}

	request.onerror = function() {
		alert("Noe gikk galt: Kunne ikke sende forslag. Sjekk at du er koblet til nettet.");
	}

	request.send();
}

Helpers.getStatistics = function(wordClicked) {
	if (!localStorage.getItem("userID")) {
		var randomID = new Uint32Array(1);
		window.crypto.getRandomValues(randomID);
		localStorage.setItem("userID", parseInt(randomID));
	}

	if (!wordClicked) {
		return;
	}

	var d = new Date();
	var utcDateTime = (d.getUTCMonth() + 1) + "/" + d.getUTCDate() + "/" + d.getUTCFullYear() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();

	var newStats = { word: wordClicked, userID: localStorage.getItem("userID"), utcDateTime: utcDateTime, isStandalone: GlobalHelpers.isStandalone() };

	var request = new XMLHttpRequest();
	var data = "?newStats=" + JSON.stringify(newStats);
	request.open('GET', '/resources/php/updateStats.php' + data);

	request.onerror = function() {
		console.log("Noe gikk galt: Kunne ikke oppdatere statistikk");
	}

	request.send();
}

// ******************************************************
// Smart loading
// ******************************************************

Helpers.smartLoading = function() {
	setInterval(function() { // Using setInterval instead of onscroll due to bad scroll detection on iOS
		if (_loadingComplete || _isSearching) {
			return;
		}

		var distanceFromBottom = document.body.scrollHeight - window.innerHeight - window.scrollY;

		if (distanceFromBottom < 500) {
			View.loadWords();
		}
	}, 100);
}

// ******************************************************
// Events
// ******************************************************

document.addEventListener("click", function(e) {
	if (!document.body.contains(e.target)) {
		return;
	}

	if (e.target.matches(DOM.startButton)) {
		Helpers.getStatistics();
	}

	if (e.target.matches(DOM.updateButton)) {
		localStorage.setItem("storedWordsLifespan", 7); // Decreases on page load
		window.location.reload();
	}

	if (e.target.matches(DOM.search)) {
		if (e.target.value) {
			e.target.value = "";
			View.reloadDictionary();
		}
	}

	if (e.target.parentNode.matches(DOM.dictionary)) {
		var wordID = e.target.classList[0];
		View.togglePopup(DOM.definitionPopups + "." + wordID);
		GlobalHelpers.toggleClass(DOM.closeTip, "hidden");
		Helpers.getStatistics(e.target.innerHTML);
	}

	if (e.target.parentNode.matches(DOM.definitions)) {
		View.togglePopup(GlobalHelpers.getClassSelector(e.target));
		GlobalHelpers.toggleClass(DOM.closeTip, "hidden");
	}

	if (e.target.matches(DOM.showComment)) {
		var comment = e.target.nextElementSibling;

		if (comment.classList.contains("hidden")) {
			e.target.innerHTML = "Skjul kommentar";
		} else {
			e.target.innerHTML = "Vis kommentar";
		}

		comment.classList.toggle("hidden");
	}

	if (e.target.matches(DOM.menuButton) || e.target.parentNode.matches(DOM.menuButton)) {
		View.toggleMenu();
	}

	if (e.target.parentNode.parentNode.matches(DOM.menu)) {
		View.toggleMenu();
		View.togglePopup("#" + e.target.dataset.popupId);
	}

	if (e.target.matches(DOM.closeButtons)) {
		View.togglePopup("#" + e.target.parentNode.parentNode.id);
	}

	if (e.target.matches(DOM.contactButton)) {
		Helpers.sendSuggestion();
	}

	if (e.target.matches(DOM.shareMenuItem)) {
		if (GlobalHelpers.shareApp("Ordboka", "Er det mange vanskelige ord i menigheten? Finn forklaringene her!")) {
			View.togglePopup(DOM.sharePopup); // Share-popup will only show if navigator.share is not supported
		}
	}
});

document.querySelector(DOM.search).onkeyup = function(e) {
	var searchTerm = e.target.value.toLowerCase();
	View.reloadDictionary(searchTerm);
}

// ******************************************************
// Service worker
// ******************************************************

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/service-worker.js");

	navigator.serviceWorker.addEventListener("controllerchange", function() {
		View.togglePopup(DOM.updatePopup);
	});
}

// ******************************************************
// Init app
// ******************************************************

Helpers.getWords(View.loadDictionary);
View.prepareDownload();

if (localStorage.getItem("storedWordsLifespan")) {
	localStorage.setItem("storedWordsLifespan", parseInt(localStorage.getItem("storedWordsLifespan")) - 1);
}

if (!localStorage.getItem("userID")) {
	View.togglePopup(DOM.welcomePopup);
} else {
	if (!localStorage.getItem("definitionTip")) {
		View.showTip("definitionTip", "Tips: Les om hvordan vi definerer ord i menyen");
	} else if (!localStorage.getItem("appTip") && !GlobalHelpers.isStandalone()) {
		View.showTip("appTip", "Tips: Du kan lagre ordboka som en app via menyen");
	}
}
