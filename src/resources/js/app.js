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
}

// ******************************************************
// Init app
// ******************************************************

$(document).ready(function() {
	View.cacheDom();
	Core.getWords(View.loadWords);

	if (!localStorage.getItem("userID")) {
		View.showPopup(DOM.welcomePopup);
	}

	Helpers.prepareDownload();
});

// ******************************************************
// Core: Get words
// ******************************************************

Core.getWords = function(callback) {
	$.getJSON("/resources/data/words.json", function(data) {
		callback(data);
	}).fail(function() {
		alert("Noe gikk galt: Kunne ikke laste ord");
	});
}

// ******************************************************
// View: Cache DOM
// ******************************************************

View.cacheDom = function() {
	DOM.appMenuItem = $(".menu .app");
	DOM.appPopup = $(".popup.app");
	DOM.backButton = $(".button.back");
	DOM.body = $("body");
	DOM.contactButton = $(".button.contact");
	DOM.contactMenuItem = $(".menu .contact");
	DOM.contactPopup = $(".popup.contact");
	DOM.definingMenuItem = $(".menu .defining");
	DOM.definingPopup = $(".popup.defining");
	DOM.downloadButton = $(".button.download");
	DOM.fossMenuItem = $(".menu .foss");
	DOM.fossPopup = $(".popup.foss");
	DOM.menu = $(".popup.menu");
	DOM.menuButton = $(".menuButton");
	DOM.okButton = $(".button.ok");
	DOM.overlay = $(".overlay");
	DOM.popup = $(".popup");
	DOM.search = $(".search");
	DOM.startButton = $(".button.start")
	DOM.textSuggestion = $(".textSuggestion");
	DOM.tip = $(".tip");
	DOM.welcomePopup = $(".popup.welcome");
	DOM.wordSuggestion = $(".wordSuggestion");
}

// ******************************************************
// View: Load words
// ******************************************************

View.loadWords = function(words) {
	words.sort(function(a, b) {
		var titleA = a.Title.toLowerCase().replace("æ", "z").replace("ø", "zz").replace("å", "zzz");
		var titleB = b.Title.toLowerCase().replace("æ", "z").replace("ø", "zz").replace("å", "zzz");

		return titleA.localeCompare(titleB);
	});

	DOM.dictionary = $(".dictionary");

	$.each(words, function(index, wordObject) {
		var title = wordObject.Title;
		var definition = wordObject.Definition;

		DOM.dictionary.append('<div class="word"><div class="title">' + title + '</div><div class="definition popup"><b>' + title + '</b><br>' + definition + '</div></div>');
	});

	DOM.word = $(".word");
	DOM.definition = $(".definition");

	Events.bindEvents();

	DOM.search.attr("placeholder", "Søk blant " + words.length + " ord");
}

// ******************************************************
// View: Search
// ******************************************************

View.search = function(term) {
	var term = term.toLowerCase();
	DOM.word.each(function() {
		var text = $(this).find(".title").text().toLowerCase();
		(text.indexOf(term) == 0) ? $(this).show() : $(this).hide();
	});
}

// ******************************************************
// View: Reset search
// ******************************************************

View.resetSearch = function() {
	if (DOM.search.val()) {
		DOM.search.val("");
		DOM.search.blur();
		View.search("");
	}
}

// ******************************************************
// View: Popups
// ******************************************************

View.showPopup = function(popup) {
	DOM.body.css("overflow", "hidden");
	DOM.overlay.show();
	popup.show();
}

View.hidePopups = function() {
	DOM.body.css("overflow", "visible");
	DOM.overlay.hide();
	DOM.popup.hide();
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
		View.showPopup(DOM.menu);
	}
}

// ******************************************************
// Events: Bind events
// ******************************************************

Events.bindEvents = function() {
	DOM.startButton.click(function() {
		View.hidePopups();
		Helpers.getStatistics();
	});

	DOM.okButton.click(function() {
		View.hidePopups();
	});

	DOM.backButton.click(function() {
		View.hidePopups();
	});

	DOM.search.keyup(function() {
		View.search($(this).val());
	});

	DOM.search.click(function() {
		View.resetSearch();
	});

	DOM.word.find(".title").click(function() {
		View.showPopup($(this).parent().find(".definition"));
		DOM.tip.show();
		Helpers.getStatistics($(this).html());
	});

	DOM.overlay.click(function() {
		if (DOM.definition.is(":visible")) {
			View.hidePopups();
			DOM.definition.hide();
			DOM.tip.hide();
		}
	});

	DOM.menuButton.click(function() {
		View.triggerMenu();
	});

	DOM.appMenuItem.click(function() {
		View.triggerMenu();
		View.showPopup(DOM.appPopup);
	});

	DOM.downloadButton.click(function() {
		View.hidePopups();
		window.location.href = "googlechrome://ordbok.joinmyblog.com";
	});

	DOM.contactMenuItem.click(function() {
		View.triggerMenu();
		View.showPopup(DOM.contactPopup);
	});

	DOM.definingMenuItem.click(function() {
		View.triggerMenu();
		View.showPopup(DOM.definingPopup);
	});

	DOM.fossMenuItem.click(function() {
		View.triggerMenu();
		View.showPopup(DOM.fossPopup);
	});

	DOM.contactButton.click(function() {
		if (DOM.wordSuggestion.val()) {
			Helpers.sendSuggestion();
		}
	});
}

// ******************************************************
// Helpers: Send suggestion
// ******************************************************

Helpers.sendSuggestion = function() {
	var content = DOM.wordSuggestion.val() + ": " + DOM.textSuggestion.val();

	$.ajax({
		type: "post",
		url: "/resources/php/sendMail.php",
		data: { subject: "Ordboka: Nytt forslag", message: content }
	}).done(function(data) {
		View.hidePopups();
		DOM.wordSuggestion.val("");
		DOM.textSuggestion.val("");
		alert("Forslaget ditt har blitt sendt inn. Tusen takk.");
	}).fail(function() {
		alert("Noe gikk galt: Kunne ikke sende inn forslag. Sjekk at du er koblet til nettet.");
	});
}

// ******************************************************
// Helpers: Prepare download
// ******************************************************

Helpers.prepareDownload = function() {

	if (Helpers.isStandalone()) {
		DOM.appMenuItem.hide();
		return;
	}

	var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

	if (iOS) {
		DOM.downloadButton.hide();
		DOM.appPopup.find(".android").hide();
		DOM.appPopup.find(".ios").show();
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

	var newStats = { word: wordClicked, userID: localStorage.getItem("userID") };

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
// Helpers: Is standalone (launched from home screen)
// ******************************************************

Helpers.isStandalone = function() {
	if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone == true) {
		return true;
	}

	return false;
}
