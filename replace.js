/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * Main replacement script that handles boilerplate classes
 */

//var logoUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png";
//var favicon = "https://www.w3schools.com/favicon.ico";
var logoUrl = browser.runtime.getURL('resources/logo.png');
var favicon = browser.runtime.getURL('resources/favicon.ico');

// TODO: Settings popup window
var modifyResultsPage = true;

// Homepage logo, its container, and the Doodle share button
var homepageLogo = [".lnXdpd", ".k1zIA", ".SuUcIb"];
// PNG and SVG (respectively) results page logos
var searchLogo = [".jfN4p", ".TYpZOd"];
// Classes of actual button div and then the navbar which is left too high
var randRow = [".IUOThf", ".XtQzZd"];
// Search box, search suggestions dropdown, suggestions dropdown buttons container
var searchBox = [".RNNXgb", ".aajZCb", ".lJ9FBc"];

RunWhenReady(["head"], function(loadedElement) {
	loadedElement.append(Object.assign(document.createElement("link"),{rel:"icon", href:favicon}));
});

var subdomain = window.location.host.split(".")[0];
var page = "/" + location.pathname.split("/")[1];
var isImageSearch = false;
if(new URLSearchParams(window.location.search).get("tbm") == "isch") { // Query string `&tbm=isch` only present on Images results, where the logo is an SVG
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
			SwapResultsLogo();
	}
}

/*
 * void SwapHomepageLogo()
 * Replaces Google Doodles and the regular logo image with the old logo on the Google homepages
 */
function SwapHomepageLogo() {
	if(!(page == "/imghp" || subdomain == "images")) {
		document.querySelector(homepageLogo[1]).outerHTML = '<div style="margin-top:auto; max-height:92px;"><img class="' + homepageLogo[0].split(".")[1] + '"></div>';
	}
	document.querySelector(homepageLogo[0]).src = logoUrl;
	document.querySelector(homepageLogo[0]).srcset = ""; // Clear override

	document.querySelector(searchBox[0]).style.borderRadius = "2px";
	document.querySelector(searchBox[1]).style.borderRadius = "0 0 2px 2px";

	// Override Doodle size styles:
	document.querySelector(homepageLogo[0]).width = "272";
	document.querySelector(homepageLogo[0]).height = "92";
	// Remove share button (only present on Doodles):
	try {
		document.querySelector(homepageLogo[2]).remove();
	} catch(TypeError) {}
}

/*
 * void SwapResultsLogo()
 * Replaces small logo on search pages
 * TODO: Doodle compatibility
 */
function SwapResultsLogo() {
	// Remove random bar of buttons Google thought'd be a good idea to add:
	RunWhenReady([randRow[0]], function (loadedElement) {
		document.querySelector(randRow[0]).remove();
		document.querySelector(randRow[1]).style.height = "57px";
	});

	document.querySelector(searchBox[0]).style.borderRadius = "2px";
	document.querySelector(searchBox[1]).style.borderRadius = "0 0 2px 2px";

	if(modifyResultsPage) {
		var resultsStyles = document.createElement("style");
		resultsStyles.appendChild(document.createTextNode(`
			.tF2Cxc.asEBEc, .vt6azd, .hlcw0c, .g {
				margin-bottom: 0 !important;
			}
			.MjjYud {
				margin-bottom: 16px;
			}
			.yG4QQe.TBC9ub, .ULSxyf, .cUnQKe {
				display: none;
			}
		`));
		document.head.append(resultsStyles);
	}

	if(!isImageSearch) {
		document.querySelector(searchLogo[0]).src = logoUrl;
		return;
	}

	// Image search results logo:
	document.querySelector(searchLogo[1]).outerHTML = document.querySelector(searchLogo[1]).outerHTML.replace(/svg/g, "img");
	document.querySelector(searchLogo[1]).height = "30"; // SVG proportions are 34px for some reason so override here
	document.querySelector(searchLogo[1]).src = logoUrl;
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
