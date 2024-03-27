/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * Main replacement script that handles boilerplate classes
 */

//var logoUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png";
//var favicon = "https://www.w3schools.com/favicon.ico";
var logoUrl = chrome.extension.getURL('resources/logo.png');
var favicon = chrome.extension.getURL('resources/favicon.ico');

var homepageLogo = [".lnXdpd", ".k1zIA", ".SuUcIb"]; // Homepage logo, its container, and the Doodle share button
var searchLogo = [".jfN4p", ".TYpZOd"]; // PNG and SVG (respectively) results page logos
var randRow = [".zp6Lyf", ".XtQzZd"]; // Classes of actual button div and then the navbar which is left too high

RunWhenReady(["head"], function(loadedElement) {
	loadedElement.innerHTML += '<link rel="icon" href="' + favicon + '">';
});

var subdomain = window.location.host.split('.')[0];
var page = "/" + location.pathname.split('/')[1];
var isImageSearch = false;
if(new URLSearchParams(window.location.search).get('tbm') == "isch") { // Query string `&tbm=isch` only present on Images results, where the logo is an SVG
	isImageSearch = true;
}

RunWhenReady([
	homepageLogo[1], searchLogo[0], searchLogo[1]
], function(loadedElement) {
	Main();
});

/*
 * void Main()
 * Calls either function depending on what page is loaded right now
 */
function Main() {
	switch(page) {
		case "/":
		case "/webhp":
		case "/imghp":
			SwapHomepageLogo();
			break;
		case "/search":
			SwapSearchLogo();
	}
}

/*
 * void SwapHomepageLogo()
 * Replaces Google Doodles and the regular logo image with the old logo on the Google homepages
 */
function SwapHomepageLogo() {
	if(!(page == "/imghp" || subdomain == "images")) {
		document.getElementsByClassName(homepageLogo[1])[0].outerHTML = '<div style="margin-top:auto; max-height:92px;"><img class="' + homepageLogo[0] + '"></div>';
	}

	document.getElementsByClassName(homepageLogo[0])[0].src = logoUrl;
	document.getElementsByClassName(homepageLogo[0])[0].srcset = ""; // Clear override
	// Override Doodle size styles:
	document.getElementsByClassName(homepageLogo[0])[0].width = "272";
	document.getElementsByClassName(homepageLogo[0])[0].height = "92";
	// Remove share button (only present on Doodles):
	try {
		document.getElementsByClassName(homepageLogo[2])[0].remove();
	} catch(TypeError) {}
}

/*
 * void SwapSearchLogo()
 * Replaces small logo on search pages
 * TODO: Doodle compatibility
 */
function SwapSearchLogo() {
	if(!isImageSearch) {
		document.getElementsByClassName(searchLogo[0])[0].src = logoUrl;
		return;
	}
	
	document.getElementsByClassName(searchLogo[1])[0].outerHTML = document.getElementsByClassName(searchLogo[1])[0].outerHTML.replace(/svg/g, "img");
	document.getElementsByClassName(searchLogo[1])[0].height = "30"; // SVG proportions are 34px for some reason so override here
	document.getElementsByClassName(searchLogo[1])[0].src = logoUrl;

	// Remove random bar of buttons Google thought'd be a good idea to add:
	document.getElementsByClassName(randRow[0])[0].remove();
	document.getElementsByClassName(randRow[1])[0].style.height = "57px";
}

/*
 * void RunWhenReady(String[] selectors, function code)
 * Takes code and runs it when at least one of the input querySelectors is detected.
 * Returns a DOMObject `loadedElement`, corresponding to the earliest loaded element
 * that matches a selector.
 * TODO: Asynchronously create a new thread to run this code.
 */
function RunWhenReady(selectors, code) {
	var loadedElement;
	var observer = new MutationObserver(function (mutations, mutationInstance) {
		for(var i = 0; i < selectors.length; i++) {
			if(document.querySelector(selectors[i]) != null) {
				loadedElement = document.querySelector(selectors[i]);
				code(loadedElement);
				mutationInstance.disconnect();
				break; // Not bothered returning an array so I'll return one object as loadedElement
			}
		}
	});
	observer.observe(document, {childList: true, subtree: true});
}
