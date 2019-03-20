// ******************************************************
// Modules
// ******************************************************

var Core = {};
var DOM = {};
var Events = {};
var Helpers = {};
var View = {};

'use strict';

// ******************************************************
// Service worker
// ******************************************************

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/service-worker.js");

	navigator.serviceWorker.addEventListener("controllerchange", function() {
		View.showPopup("update");
	});
}

// ******************************************************
// Smart loading
// ******************************************************

var _wordsLoaded = 0;
var _loadingComplete = false;
var _isSearching = false;

// Using setInterval due to bad scroll detection on iOS
var checkForScroll = setInterval(function() {
	if (_loadingComplete) {
		clearInterval(checkForScroll);
		return;
	}

	if (_isSearching) {
		return;
	}

	var askingForMore = $(window).scrollTop() + $(window).height() > $(document).height() - 600; // 600px or closer to bottom of list

	if (askingForMore) {
		Core.getWords(View.loadWords);
	}
}, 500);

// ******************************************************
// Core: Get words
// ******************************************************

Core.getWords = function(callback, searchTerm) {
	$.getJSON("/resources/data/words.json", function(data) {
		callback(data, searchTerm);
	}).fail(function() {
		alert("Noe gikk galt: Kunne ikke laste ord");
	});
}

// ******************************************************
// View: Cache DOM
// ******************************************************

View.cacheDom = function() {
	DOM.body = $("body");
	DOM.chromeButton = $(".button.openInChrome");
	DOM.closeButtons = $(".button.close");
	DOM.closeTip = $(".tip.close");
	DOM.contactButton = $(".button.contact");
	DOM.definitions = $(".definitions");
	DOM.dictionary = $(".dictionary");
	DOM.downloadMenuItem = $(".menu .download");
	DOM.downloadPopup = $(".popup.download");
	DOM.infoTip = $(".tip.info");
	DOM.loading = $(".loading");
	DOM.menuButton = $(".menuButton");
	DOM.menuItems = $(".menu").find(".popupContent").children();
	DOM.search = $(".search");
	DOM.shareMenuItem = $(".menu .share");
	DOM.startButton = $(".button.start");
	DOM.textSuggestion = $(".textSuggestion");
	DOM.updateButton = $(".button.update");
	DOM.wordSuggestion = $(".wordSuggestion");
}

// ******************************************************
// View: Load words
// ******************************************************

View.loadWords = function(words) {
	if (_wordsLoaded == 0) {
		DOM.search.attr("placeholder", "Søk blant " + words.length + " ord");
	}

	words = Helpers.sortWords(words);
	var wordsAdded = 0;

	$.each(words, function(index, wordObject) {
		var number = index + 1;

		if (number <= _wordsLoaded) {
			return true;
		}

		var title = wordObject.Title;
		var definition = wordObject.Definition;
		var updated = wordObject.Updated;

		View.appendWord(number, title, definition, updated);
		wordsAdded++;

		if (wordsAdded == 30) {
			return false;
		}
	});

	_wordsLoaded = _wordsLoaded + wordsAdded;

	if (_wordsLoaded == words.length) {
		_loadingComplete = true;
		DOM.loading.hide();
	}
}

// ******************************************************
// View: Append word
// ******************************************************

View.appendWord = function(number, title, definition, updated) {
	DOM.dictionary.append('<div class="word_' + number + '">' + title + (updated ? ' <span>&#9679;</span>' : '') + '</div>');
	DOM.definitions.append('<div class="popup definition word_' + number + ' hidden" onclick=""><div class="popupContent"><b>' + title + '</b><br>' + definition + '</div></div>'); // "onclick" is a fix for iOS
}

// ******************************************************
// View: Show tip
// ******************************************************

View.showTip = function(title, text) {
	DOM.infoTip.text(text);

	var isResponsive = window.matchMedia("(min-width: 768px)").matches;

	setTimeout(function() {
		DOM.infoTip.animate({ top: "0" }, 300, function() {
			setTimeout(function() {
				DOM.infoTip.animate({ top: (isResponsive ? "-63px" : "-40px") }, 300);
				localStorage.setItem(title, true);
			}, 4000);
		});
	}, 4000);
}

// ******************************************************
// View: Search
// ******************************************************

View.search = function(words, searchTerm) {
	if (searchTerm == "") {
		View.resetDictionary();
		return;
	}

	_isSearching = true;

	DOM.dictionary.text("");
	DOM.definitions.text("");

	words = Helpers.sortWords(words);

	$.each(words, function(index, wordObject) {
		var number = index + 1;
		var title = wordObject.Title;
		var definition = wordObject.Definition;
		var updated = wordObject.Updated;

		if (title.toLowerCase().search(searchTerm) != -1) {
			View.appendWord(number, title, definition, updated);
		}
	});

	DOM.loading.hide();
}

// ******************************************************
// View: Trigger menu
// ******************************************************

View.triggerMenu = function() {
	var isOpen = DOM.menuButton.hasClass("isOpen");

	if (isOpen) {
		DOM.menuButton.removeClass("isOpen");
		DOM.menuButton.find(".fa-times").hide();
		DOM.menuButton.find(".fa-bars").show();
		View.hidePopups();
	} else {
		DOM.menuButton.addClass("isOpen");
		DOM.menuButton.find(".fa-bars").hide();
		DOM.menuButton.find(".fa-times").show();
		View.showPopup("menu");
	}
}

// ******************************************************
// View: Popups
// ******************************************************

View.showPopup = function(popupID) {
	DOM.body.css("overflow", "hidden"); // Doesn't work on iOS
	$(".popup." + popupID).removeClass("hidden");
}

View.hidePopups = function() {
	DOM.body.css("overflow", "visible");
	$(document.getElementsByClassName("popup")).addClass("hidden");
}

// ******************************************************
// View: Reset dictionary
// ******************************************************

View.resetDictionary = function() {
	$(window).scrollTop(0);

	DOM.loading.show();

	DOM.search.val("");
	DOM.search.blur();

	DOM.dictionary.text("");
	DOM.definitions.text("");

	_wordsLoaded = 0;
	_loadingComplete = false;
	_isSearching = false;

	Core.getWords(View.loadWords);
}

// ******************************************************
// Events: Bind events
// ******************************************************

Events.bindEvents = function() {
	DOM.startButton.click(function() {
		Helpers.getStatistics();
	});

	DOM.updateButton.click(function() {
		window.location.reload();
	});

	DOM.closeButtons.click(function() {
		View.hidePopups();
	});

	DOM.search.keyup(_.debounce(function() {
		var searchTerm = $(this).val().toLowerCase();
		Core.getWords(View.search, searchTerm);
	}, 200));

	DOM.search.click(function() {
		if (DOM.search.val()) {
			View.resetDictionary();
		}
	});

	$(document).on("click", ".dictionary div", function() {
		var definition = $(this).attr("class");
		View.showPopup("definition." + definition);
		DOM.closeTip.removeClass("hidden");
		Helpers.getStatistics($(this).text());
	});

	$(document).on("click", ".definition", function(e) {
		var target = $(e.target);
		if (target.hasClass("popup")) {
			View.hidePopups();
			DOM.closeTip.addClass("hidden");
		}
	});

	DOM.menuButton.click(function() {
		View.triggerMenu();
	});

	DOM.menuItems.click(function() {
		var targetPopup = $(this).attr("class");
		View.triggerMenu();
		View.showPopup(targetPopup);
	});

	DOM.chromeButton.click(function() {
		window.location.href = "googlechrome://ordbok.joinmyblog.com";
	});

	DOM.contactButton.click(function() {
		if (DOM.wordSuggestion.val()) {
			Helpers.sendSuggestion();
		}
	});

	DOM.shareMenuItem.click(function() {
		Helpers.shareApp();
	});
}

// ******************************************************
// Helpers: Prepare download
// ******************************************************

Helpers.prepareDownload = function() {
	if (Helpers.isStandalone()) {
		DOM.downloadMenuItem.hide();
		return;
	}

	var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

	if (iOS) {
		DOM.downloadPopup.find(".ios").show();
		DOM.downloadPopup.find(".telegram").show();
		var isIOSChrome = navigator.userAgent.match("CriOS");

		if (isIOSChrome) {
			DOM.downloadPopup.find(".iosChrome").show();
			DOM.downloadPopup.find(".telegram").hide();
		}

		return;
	}

	var isChrome = navigator.userAgent.match("Chrome");

	if (!isChrome) {
		DOM.downloadPopup.find(".androidOther").show();
		DOM.chromeButton.show();
		return;
	}

	DOM.downloadPopup.find(".androidChrome").show();
}

// ******************************************************
// Helpers: Is standalone (launched from home screen)
// ******************************************************

Helpers.isStandalone = function() {
	if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone == true) {
		return true;
	}

	return false;
}

// ******************************************************
// Helpers: Sort words
// ******************************************************

Helpers.sortWords = function(words) {
	var sortedWords = words.sort(function(a, b) {
		var titleA = a.Title.toLowerCase().replace("æ", "z").replace("ø", "zz").replace("å", "zzz"); // Unicode sorting (room for improvement)
		var titleB = b.Title.toLowerCase().replace("æ", "z").replace("ø", "zz").replace("å", "zzz");

		return titleA.localeCompare(titleB);
	});

	return sortedWords;
}

// ******************************************************
// Helpers: Send suggestion
// ******************************************************

Helpers.sendSuggestion = function() {
	var message = DOM.wordSuggestion.val();

	if (DOM.textSuggestion.val()) {
		message += ": " + DOM.textSuggestion.val();
	}

	$.ajax({
		type: "post",
		url: "/resources/php/sendMail.php",
		data: { subject: "Ordboka: Nytt forslag", message: message }
	}).done(function(data) {
		View.hidePopups();
		DOM.wordSuggestion.val("");
		DOM.textSuggestion.val("");
		View.showPopup("suggestionSent");
	}).fail(function() {
		alert("Noe gikk galt: Kunne ikke sende forslag. Sjekk at du er koblet til nettet.");
	});
}

// ******************************************************
// Helpers: Share app
// ******************************************************

Helpers.shareApp = function() {
	var link = window.location.href.replace(/\/$/, ""); // Removes trailing slash

	if (navigator.share) {
		navigator.share({
			title: "Ordboka",
			text: "Er det mange vanskelige ord i menigheten? Finn forklaringene her!",
			url: link
		});

		View.hidePopups(); // Share-popup will only show if navigator.share is not supported
	}
}

// ******************************************************
// Helpers: Get statistics
// ******************************************************

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

	var newStats = { word: wordClicked, userID: localStorage.getItem("userID"), utcDateTime: utcDateTime, isStandalone: Helpers.isStandalone() };

	$.ajax({
		type: "post",
		url: "/resources/php/updateStats.php",
		data: { newStats: JSON.stringify(newStats) },
		error: function(data) {
			console.log("Noe gikk galt: Kunne ikke oppdatere statistikk");
		}
	});
}

// ******************************************************
// Init app
// ******************************************************

View.cacheDom();
Events.bindEvents();
Core.getWords(View.loadWords);
Helpers.prepareDownload();

if (!localStorage.getItem("userID")) {
	View.showPopup("welcome");
} else {
	if (!localStorage.getItem("definitionTip")) {
		View.showTip("definitionTip", "Tips: Les om hvordan vi definerer ord i menyen");
	} else if (!localStorage.getItem("appTip") && !Helpers.isStandalone()) {
		View.showTip("appTip", "Tips: Du kan lagre ordboka som en app via menyen");
	}
}
