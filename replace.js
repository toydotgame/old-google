/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * Main replacement script that handles boilerplate classes
 */

//var logoUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png";
//var favicon = "https://www.w3schools.com/favicon.ico";
var logoUrl = browser.runtime.getURL('resources/logo.png');
var favicon = browser.runtime.getURL('resources/favicon.ico');

// Homepage logo, its container, and the Doodle share button
var homepageLogo = [".lnXdpd", ".k1zIA", ".SuUcIb"];
// PNG and SVG (respectively) results page logos
var searchLogo = [".jfN4p", ".TYpZOd"];
// Classes of actual button div and then the navbar which is left too high
var randRow = [".IUOThf", ".XtQzZd"];
// Search box, search suggestions dropdown, results favicons
var searchBox = [".RNNXgb", ".aajZCb"];

var subdomain = window.location.host.split(".")[0];
var page = "/" + location.pathname.split("/")[1];
var isImageSearch = false;
if(new URLSearchParams(window.location.search).get("tbm") == "isch") { // Query string `&tbm=isch` only present on Images results, where the logo is an SVG
	isImageSearch = true;
}

var config;
(async () => { // The remainder of replace.js is all async'd until EOF
config = await LoadConfig();

RunWhenReady(["head"], function(loadedElement) {
	loadedElement.append(Object.assign(document.createElement("link"),{rel:"icon", href:favicon}));
});

RunWhenReady([
	homepageLogo[1], searchLogo[0], searchLogo[1], ".logowrap", ".lockup-logo"
], function(loadedElement) {
	Main();
});

/*
 * void Main()
 * Calls either function depending on what page is loaded right now
 */
function Main() {
	switch(subdomain) {
		case "patents":
			SpecialHpLogo();
			break;
		case "www":
		case "images":
			switch(page) {
				case "/":
				case "/webhp":
				case "/imghp":
				case "/videohp":
					SwapHomepageLogo();
					break;
				case "/search":
					SwapResultsLogo();
					ModifyResultsPage();
			}
	}
}

/*
 * void SwapHomepageLogo()
 * Replaces Google Doodles and the regular logo image with the old logo on the Google homepages
 */
function SwapHomepageLogo() {
	if(!(page == "/imghp" || subdomain == "images" || page == "/videohp")) {
		document.querySelector(homepageLogo[1]).outerHTML = '<div style="margin-top:auto; max-height:92px;"><img class="' + homepageLogo[0].split(".")[1] + '"></div>';
	}
	document.querySelector(homepageLogo[0]).src = logoUrl;
	document.querySelector(homepageLogo[0]).srcset = ""; // Clear override

	if(CheckConfigKey("squareBox")) {
		document.querySelector(searchBox[0]).style.borderRadius = "2px";
		document.querySelector(searchBox[1]).style.borderRadius = "0 0 2px 2px";
	}

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
	if(!isImageSearch) {
		if(CheckConfigKey("udm14")) {
			if(new URLSearchParams(window.location.search).get("udm") == null) {
				window.location.replace(window.location + "&udm=14");
			}
		}

		document.querySelector(searchLogo[0]).src = logoUrl;
		return;
	}

	// Image search results logo:
	document.querySelector(searchLogo[1]).outerHTML = document.querySelector(searchLogo[1]).outerHTML.replace(/svg/g, "img");
	document.querySelector(searchLogo[1]).height = "30"; // SVG proportions are 34px for some reason so override here
	document.querySelector(searchLogo[1]).src = logoUrl;
}

/*
 * async void ModifyResultsPage()
 * Run in the scope of a search results page only, fetches config before running,
 * each segment of code can be toggled to the user's preference.
 */
async function ModifyResultsPage() {	
	// Green URLs and proper URL text:
	if(CheckConfigKey("greenUrls")) {
		var greenUrlsStyle = document.createElement("style");
		greenUrlsStyle.appendChild(document.createTextNode(`
			cite, .ylgVCe.ob9lvb {
				color: #093;
			}
		`));
		document.head.append(greenUrlsStyle);
		
		document.addEventListener("DOMContentLoaded", function() {
			var resultUrls = document.querySelectorAll(".ylgVCe.ob9lvb");
			for(var i = 0; i < resultUrls.length; i++) {
				resultUrls[i].innerHTML = resultUrls[i].innerHTML.replace(/ › /g, "/");
			}
		});
	}

	// Slim padding between results:
	if(CheckConfigKey("padding")) {
		var paddingStyle = document.createElement("style");
		paddingStyle.appendChild(document.createTextNode(`
			.tF2Cxc.asEBEc, .vt6azd, .hlcw0c, .g {
				margin-bottom: 0 !important;
			}
			.MjjYud, .cUnQKe { /* General containers, People also searched for */
				margin-bottom: 16px !important;
			}
			.ULSxyf:nth-child(2), #appbar { /* Top result extract */
				display: none;
				/* .yG4QQe.TBC9ub used to be display:none'd but until I find out what it is again I'm not going to add it */
			}
		`));
		document.head.append(paddingStyle);
	}

	// Remove "People also search for":
	if(CheckConfigKey("peopleAlsoSearchedFor")) {
		var pasfStyle = document.createElement("style");
		pasfStyle.appendChild(document.createTextNode(`
			#bres, .cUnQKe, .TzHB6b.cLjAic { /* PASF buttons, People also searched for, PASF (button edition) (also removes other search gimmicks potentially) */
				display: none;
			}
			.hlcw0c { /* Always the result just before a results gimmick */
				margin-bottom: 0 !important;
			}
		`));
		document.head.append(pasfStyle);
	}

	// Related search tags row of meaningless unrelated nonsense:
	if(CheckConfigKey("removeRandRow")) {
		RunWhenReady([randRow[0]], function (loadedElement) {
			document.querySelector(randRow[0]).remove();
			document.querySelector(randRow[1]).style.height = "57px";
		});
	}

	// Square search box:
	if(CheckConfigKey("squareBox")) {
		document.querySelector(searchBox[0]).style.borderRadius = "2px";
		document.querySelector(searchBox[1]).style.borderRadius = "0 0 2px 2px";
		var resultsFaviconStyle = document.createElement("style");
		resultsFaviconStyle.appendChild(document.createTextNode(`
			.H9lube, .UnOTSe img { /* Two styles of results favicon */
				border-radius: 2px !important;
			}
		`));
		document.head.append(resultsFaviconStyle);
	}
}

/*
 * void SpecialHpLogo()
 * Runs arbitrary code based on what subdomain of specialty Google search is being loaded
 */
function SpecialHpLogo() {
	switch(subdomain) {
		case "patents":
			/* This is a messy thing. Google Patents doesn't have a dedicated search page
			 * so we have to set up a MutationObserver to observe when the page changes and
			 * check if the query strings (window.location.href) have changed at all. If they
			 * have, then we run patentsTryReplacing(), a general catch-all bodge replacement
			 * that can run safely on the hp and search page. The MutationObserver won't do
			 * anything on the initial page load, however—so we call patentsTryReplacing()
			 * directly after it is defined also.
			 * Hours wasted counter: 1
			 */
			function patentsTryReplacing() {
				try {
					document.querySelector(".logowrap > img").src = browser.runtime.getURL("resources/patents.png");
					document.querySelector("h1.style-scope.landing-page").innerHTML = null;
				} catch(TypeError) {}
				
				try {
					document.querySelector(".lockup-logo").style.backgroundImage = "url('" + browser.runtime.getURL("resources/logo.png") + "')";
					document.querySelector(".lockup-logo").style.marginRight = "2px";
				} catch(TypeError) {}
			}
			patentsTryReplacing(); // Needs to be run first time manually because MutationObserver won't

			var initialUrl = window.location.href;
			var domChangeObserver = new MutationObserver(function(mutations) {
				if(window.location.href != initialUrl) { // Page changed
					initialUrl = window.location.href;
					RunWhenReady([".logowrap > img", ".lockup-logo"], function (loadedElement) {
						patentsTryReplacing();
					});
				}
			});
			domChangeObserver.observe(document, {childList: true, subtree: true});
			break;
	}
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

/*
 * void CheckConfigKey(String key)
 * Returns true/false based on input key. If key does not exist, returns false
 */
function CheckConfigKey(key) {
	for(var i = 0; i < config.length; i++) {
		if(config[i][0] == key) {
			return config[i][1];
		}
	}
	return false;
}

})(); // End of async execution
