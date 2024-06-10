/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * Main replacement script that handles boilerplate classes
 */

// For development only, not user accessible in production:
var debug = true;

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
DebugLog("Old Google initialised. Config loaded:\n" + config.join("\n").replace(/,/g, ": "));

RunWhenReady(["head"], function(loadedElement) {
	// TODO: Different favicons for different sites.
	loadedElement.append(Object.assign(document.createElement("link"),{rel:"icon", href:favicon}));
	DebugLog("Favicon set.");
});

RunWhenReady([ // Triggers when different search engines are detected:
	homepageLogo[1], searchLogo[0], searchLogo[1], // Google Search, Google Images
	".logowrap", ".lockup-logo", // Google Patents
	"#gs_hdr_hp_lgo", "#gs_hdr_hp_lgow", "#gs_hdr_drw_lgo", "#gs_hdr_lgo", "#gs_ab_ico", // Google Scholar
	".lmygoc", ".watermark" // Google Maps
], function(loadedElement) {
	Main();
});

/*
 * void Main()
 * Calls either function depending on what page is loaded right now
 */
function Main() {
	DebugLog("Valid logo element detected, running Main().\nsubdomain = \"" + subdomain + "\", page = \"" + page + "\"");
	switch(subdomain) {
		case "patents":
		case "scholar":
			SpecialHpLogo();
			break;
		case "www":
		case "images":
			switch(page) {
				case "/maps":
					subdomain = "maps"; // (Not) Experimental quick hax
					SpecialHpLogo();
					break;
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
	DebugLog("SwapHomepageLogo() run.");
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
	DebugLog("SwapResultsLogo() run. isImageSearch = " + isImageSearch);
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
	DebugLog("ModifyResultsPage() run.");
	// Green URLs and proper URL text:
	if(CheckConfigKey("greenUrls")) {
		DebugLog("Running greenUrls.");
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
		DebugLog("Running padding.");
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
		DebugLog("Running peopleAlsoSearchedFor.");
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
			DebugLog("Running removeRandRow");
			document.querySelector(randRow[0]).remove();
			document.querySelector(randRow[1]).style.height = "57px";
		});
	}

	// Square search box:
	if(CheckConfigKey("squareBox")) {
		DebugLog("Running squareBox.");
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
	DebugLog("SpecialHpLogo() run.");
	switch(subdomain) {
		case "patents":
			DebugLog("[Patents] Running case.");
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
					document.querySelector(".logowrap > img").src = browser.runtime.getURL('resources/patents.png');
					document.querySelector("h1.style-scope.landing-page").innerHTML = "";
				} catch(TypeError) {
					DebugLog("[Patents] NO homepage logo found! Assuming it's the search page.");
				}
				
				try {
					document.querySelector(".lockup-logo").style.backgroundImage = "url('" + browser.runtime.getURL('resources/logo.png') + "')";
					document.querySelector(".lockup-logo").style.marginRight = "2px";
				} catch(TypeError) {
					DebugLog("[Patents] NO search page logo found! Assuming it's the homepage.");
				}
			}
			patentsTryReplacing(); // Needs to be run first time manually because MutationObserver won't

			var initialUrl = window.location.href;
			var domChangeObserver = new MutationObserver(function(mutations) {
				if(window.location.href != initialUrl) { // Page changed
					initialUrl = window.location.href;
					RunWhenReady([".logowrap > img", ".lockup-logo"], function (loadedElement) {
						DebugLog("[Patents] Mutation detected and logo loaded. Attempting replacement.");
						patentsTryReplacing();
					});
				}
			});
			domChangeObserver.observe(document, {childList: true, subtree: true});
			break;
		case "scholar":
			DebugLog("[Scholar] Running case.");
			var scholarSchLogoStyle = document.createElement("style");
			scholarSchLogoStyle.appendChild(document.createTextNode(`
				#gs_hdr_drw_lgo, #gs_hdr_lgo {
					background: no-repeat url("` + browser.runtime.getURL('resources/scholar.png') + `") 0 50%;
					background-size: contain;
					width: 149px;
					height: 63px;
				}
				#gs_ab_ico > .gs_ico {
					background: no-repeat url("` + browser.runtime.getURL('resources/g.png') + `");
					background-size: contain;
				}
			`));
			document.head.append(scholarSchLogoStyle);
			if(page == "/" || page == "/schhp") {
				DebugLog("[Scholar] On the homepage.");
				document.querySelector("#gs_hdr_hp_lgo").src = browser.runtime.getURL('resources/scholar.png');
				document.querySelector("#gs_hdr_hp_lgo").srcset = "";
				document.querySelector("#gs_hdr_hp_lgo").style = "width:276px";
				document.querySelector("#gs_hdr_hp_lgow").style = "margin-bottom:36px";
			}
			break;
		case "maps":
			DebugLog("[Maps] Running case.");
			document.querySelector(".watermark").src = logoUrl;
			RunWhenReady([".lmygoc"], function(loadedElement) { // Hamburger menu logo isn't loaded 'till the user clicks it so we wait
				document.querySelector(".lmygoc").src = browser.runtime.getURL('resources/maps.png');
			});
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
	DebugLog("RunWhenReady() run. Running on: [\"" + selectors.join("\", \"") + "\"], code = ```\n" + code + "\n```");
	var loadedElement;
	var observer = new MutationObserver(function (mutations, mutationInstance) {
		for(var i = 0; i < selectors.length; i++) {
			if(document.querySelector(selectors[i]) != null) {
				DebugLog("[RunWhenReady] \"" + selectors[i] + "\" loaded. Running code.");
				loadedElement = document.querySelector(selectors[i]);
				code(loadedElement);
				mutationInstance.disconnect();
				break; // Not bothered returning an array so I'll return one object as loadedElement
			}
		}
	});

	for(var i = 0; i < selectors.length; i++) { // Preemptive run of the MutationObserver's code in case the page loads too fast.
		if(document.querySelector(selectors[i]) != null) {
			DebugLog("[RunWhenReady] \"" + selectors[i] + "\" loaded before MutationObserver could start. Running code.");
			loadedElement = document.querySelector(selectors[i]);
			code(loadedElement);
			return;
		}
	}
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

/*
 * void DebugLog(String message)
 * Sends a console log with the given message only if debug=true.
 */
function DebugLog(message) {
	if(debug) {
		console.log("%c[%cOld Google%c]%c " + message,
					"background-color:#4d90fe; color:#222",
					"background-color:#4d90fe; color:#fff",
					"background-color:#4d90fe; color:#222",
					"color:reset; background-color:reset");
	}
}

})(); // End of async execution
