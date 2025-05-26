/*
 * AUTHOR: toydotgame
 * CREATED ON: 2024-06-14
 * Main class containing general methods; run when a Google domain is loaded.
 */

// Enables debug logging. Should be false in packed copies of this extension:
const DEBUG = true;

var logos = [
	{"id": "nav",                    "src": browser.runtime.getURL("/resources/google/nav.png")},
	{"id": "maps_favicon",           "src": browser.runtime.getURL("/resources/google/favicons/maps.ico")},
	{"id": "search_favicon",         "src": browser.runtime.getURL("/resources/google/favicons/search.ico")},
	{"id": "search_alt_favicon",     "src": browser.runtime.getURL("/resources/google/favicons/search_alt.ico")},
	{"id": "finance_favicon",        "src": browser.runtime.getURL("/resources/google/favicons/finance.ico")},
	{"id": "scholar_favicon",        "src": browser.runtime.getURL("/resources/google/favicons/scholar.ico")},
	{"id": "news_favicon",           "src": browser.runtime.getURL("/resources/google/favicons/news.ico")},
	{"id": "earth_favicon",          "src": browser.runtime.getURL("/resources/google/favicons/earth.ico")},
	{"id": "books",                  "src": browser.runtime.getURL("/resources/google/logos/books.png")},
	{"id": "finance_left",           "src": browser.runtime.getURL("/resources/google/logos/finance_left.png")},
	{"id": "finance_right",          "src": browser.runtime.getURL("/resources/google/logos/finance_right.png")},
	{"id": "g",                      "src": browser.runtime.getURL("/resources/google/logos/g.png")},
	{"id": "maps",                   "src": browser.runtime.getURL("/resources/google/logos/maps.png")},
	{"id": "maps_watermark_mono",    "src": browser.runtime.getURL("/resources/google/logos/maps_watermark_mono.png")},
	{"id": "maps_watermark",         "src": browser.runtime.getURL("/resources/google/logos/maps_watermark.png")},
	{"id": "news_left",              "src": browser.runtime.getURL("/resources/google/logos/news_left.png")},
	{"id": "news",                   "src": browser.runtime.getURL("/resources/google/logos/news.png")},
	{"id": "news_right",             "src": browser.runtime.getURL("/resources/google/logos/news_right.png")},
	{"id": "patents",                "src": browser.runtime.getURL("/resources/google/logos/patents.png")},
	{"id": "scholar",                "src": browser.runtime.getURL("/resources/google/logos/scholar.png")},
	{"id": "search",                 "src": browser.runtime.getURL("/resources/google/logos/search.png")},
	{"id": "shopping_left",          "src": browser.runtime.getURL("/resources/google/logos/shopping_left.png")},
	{"id": "shopping",               "src": browser.runtime.getURL("/resources/google/logos/shopping.png")},
	{"id": "shopping_right",         "src": browser.runtime.getURL("/resources/google/logos/shopping_right.png")},
	{"id": "trends",                 "src": browser.runtime.getURL("/resources/google/logos/trends.png")},
	{"id": "videos",                 "src": browser.runtime.getURL("/resources/google/logos/videos.png")},
	{"id": "earth",                  "src": browser.runtime.getURL("/resources/google/logos/earth.png")}
];

var supportedDomains = ["patents", "scholar", "books", "shopping", "news", "trends", "www", "images", "earth"];
var supportedPages = ["/maps", "/videohp", "/finance", "/travel", "/", "/webhp", "/imghp", "/search"];

var config;

var subdomain = window.location.host.split(".")[0];
var page = "/" + window.location.pathname.split("/")[1];

if(supportedDomains.includes(subdomain) || supportedPages.includes(page)) {
	Main();
} // End of execution if false

/*
 * void Main()
 * Run if page is on a supported domain. Runs unique replace.js methods to replace logos
 */
function Main() {
	DebugLog(
		"Welcome to Old Google v" + browser.runtime.getManifest().version + "!\n" +
		"Copyright (c) 2021 toydotgame\n" +
		"subdomain = \"" + subdomain + "\", page = \"" + page + "\""
	, "info");
	
	LoadConfig().then(cachedConfig => {
		config = cachedConfig;
		DebugLog("Config loaded:", "info"); if(DEBUG) console.table(config);

		switch (subdomain) {
			case "patents":
				Replace_Patents();
				break;
			case "scholar":
				Replace_Scholar();
				break;
			case "books":
				if(page == "/ngrams") {
					Replace_Ngrams();
					break;
				}
				Replace_Books();
				break;
			case "shopping":
				Replace_Shopping();
				break;
			case "news":
				Replace_News();
				break;
			case "trends":
				Replace_Trends();
				break;
			case "earth":
				Replace_Earth();
				break;
			case "www":
			case "images":
				switch(page) {
					case "/maps":
						Replace_Maps();
						break;
					case "/videohp":
						Replace_Videos();
						break;
					case "/finance":
						Replace_Finance();
						break;
					case "/travel":
						Replace_Travel();
						break;
					case "/books":
						Replace_Books(); // New Books results page
						break;
					case "/":
					case "/webhp":
					case "/imghp":
						Replace_Search_Styles();
						Replace_Search_Home();
						break;
					case "/search":
						Replace_Search_Styles();
						Replace_Search_Results();
						break;
				}
		}
	}).catch(e => {
		DebugLog(
			"ERROR: Fatal error; exiting!\n" +
			e +
			" (" + e.fileName.substring(e.fileName.lastIndexOf("/") + 1) + ":" + e.lineNumber + "," + e.columnNumber + ")\n" + 
			e.stack
		);
	});
}

/*
 * String GetResource(String id)
 * Returns a moz-extension:// URI for the resource with the input
 * namespaced ID. Returns empty string if not found
 */
function GetResource(id) {
	try {
		return logos.find(x => x.id == id).src;
	} catch(TypeError) {
		return "";
	}
}

/*
 * boolean GetConfig(String id)
 * Returns true/false for given input setting ID
 * Returns false if key does not exist
 */
function GetConfig(id) {
	var value;
	try {
		value = config.find(x => x.id == id).value;
	} catch(TypeError) {
		value = false;
	}
	return value;
}

/*
 * string GetCaller(boolean verbose, number level)
 * Returns a trace of the format:
 *     <module>.js:<ln>:<col>
 * or:
 *     <function>(), <module>.js:<ln>:<col>
 * - verbose defaults to false, but when true it prints a full stack trace
 * - level refers to the number of levels up from the call the trace should be
 *   referring to, e.g. calling GetCaller(0) in function foo() returns a trace
 *   pointing within foo() (so no levels up), getCaller(0) refers to whomever
 *   called foo(), etc. Defaults to 1
 */
function GetCaller(verbose=false, level=1) {
	level++; let caller = "", trace, funct;
	let error = (new Error).stack.split("\n")
	/*
	 * string FormatLine(number index)
	 * Given the stack trace in `error` is an array of lines, FormatLine(index)
	 * formats the JS trace in the Old Google debug style, returning the trace
	 * at level `index`
	 */
	function FormatLine(i) {
		// Throw an error and use its stack trace to get line called from:
		trace = error[i].split("/");
		funct = trace[0].split("@")[0];
		if(funct) funct += "(), ";
		return funct + trace[4];
	}

	if(verbose)
		for(let i = level; i < error.length-1; i++) caller += FormatLine(i) + "\n";
	else caller = FormatLine(level);
	return caller;
}

/*
 * void DebugLog(string message, string? type, string? trace)
 * Fancy console.log() wrapper that only prints if the DEBUG const is true.
 * Prints an Old Google prefix alongside background colours for log types, and
 * a function/call trace to where this log was triggered from. Logs of type
 * "info" cannot have a trace—automatic nor manual
 * - type can be "log", "info", "warn", or "error". Defaults to "log"
 * - trace is a manual override for the auto-generated trace. Leaving it null
 *   auto-generates the trace
 */
function DebugLog(message, type="log", trace="") {
	if(!DEBUG) return;

	let color = {
		"fg": "unset",
		"bg": "unset",
		"presets": {
			// Source: https://firefox-source-docs.mozilla.org/devtools-user/devtoolscolors/index.html
			"log": "unset",
			"info": "#4d90fe64",
			"warn": "#e5e60064", // -40% lightness
			"error": "#eb536864",
			// Non-Mozilla palette:
			"googleblue": "#4d90fe",
			"gray": "#222222",
			"white": "#ffffff"
		}		
	};
	let css = {
		get reset() {
			return "color:reset;background-color:reset;";
		},
		get logo() {
			return "color:" + color.presets.gray + ";background-color:" + color.presets.googleblue + ";";
		},
		get logotext() {
			return "color:" + color.presets.white + ";background-color:" + color.presets.googleblue + ";";
		},
		get currentType() {
			return "color:unset;background-color:" + color.presets[type] + ";";
		}
	};

	if(!trace) trace = GetCaller();
	trace = "\n\n%c" + trace;
	if(type == "info") trace = "%c"; // Make sure no trace is providable for info logs

	console.log(
		"%c[%cOld Google%c]%c %c" + message + trace,
		css.logo, css.logotext, css.logo, // Prefix styles
		css.reset, css.currentType,       // Message styles
		css.reset                         // Caller styles:
		+ "font-size:9px;"
		+ "color:" + color.presets.googleblue + ";" 
		+ "background-color:" + color.presets.white + "11;"
		+ "text-decoration:underline;"
	);
}

/*
 * void RunWhenReady(String[] selectors | String selector, function code)
 * Takes querySelector() string(s) and runs the provided code once the earliest
 * element in the array (or just the single provided element) is loaded into DOM
 * Provides a DOMObject `loadedElement` for use in the code that corresponds to
 * the aforementioned first loaded element
 */
function RunWhenReady(selectors, code) {
	if(typeof selectors == "string") {
		selectors = [selectors];
	}
	try {
		DebugLog("RunWhenReady(\"" + selectors.join("\", \"") + "\"):", undefined, GetCaller());
	} catch(TypeError) {
		DebugLog("RunWhenReady(\"" + selectors.join("\", \"") + "\"): Running...");
	}

	var loadedElement, isLoaded;
	function GetLoadedElement(mutationInstance = null) {
		for(var i = 0; i < selectors.length; i++) {
			try {
				loadedElement = document.querySelector(selectors[i])
			} catch(TypeError) {}
			if(loadedElement != null) {
				DebugLog("RunWhenReady(\"" + selectors.join("\", \"") + "\"): Loaded.");
				code(loadedElement);
				if(mutationInstance != null) { // Running in observer:
					mutationInstance.disconnect();
					break;
				} // Running in function scope:
				isLoaded = true;
				break;
			}
		}
	}

	GetLoadedElement(); // Run check if the element has loaded before the observer can start
	if(isLoaded)
		return;

	var observer = new MutationObserver(function (mutations, mutationInstance) {
		GetLoadedElement(mutationInstance);
	});
	observer.observe(document, {childList: true, subtree: true});
}

/*
 * void InjectCssAtHead(String styles, boolean? quickReplace)
 * Appends the given inline styles to the <head> element in a safe manner
 * Runs when the body starts loading, unless quickReplace is true
 * quickReplace is to be true if this method is called from within a
 * RunWhenReady() function that guarantees <body> has started loading
 */
function InjectCssAtHead(styles, quickReplace = false) {
	DebugLog("Injecting CSS into document...");
	var styleElement = document.createElement("style");
	styleElement.appendChild(document.createTextNode(styles));
	if(quickReplace) {
		document.head.append(styleElement);
		return;
	}
	RunWhenReady("body", function(loadedElement) {
		document.head.append(styleElement);
	});	
}

/*
 * void SetFavicon(String id, boolean? quickReplace)
 * Sets the favicon to the resource at the provided ID, safely
 * Like in InjectCssAtHead, the same quickReplace option is available here
 */
function SetFavicon(id, quickReplace = false) {
	DebugLog("Setting favicon to " + id + "...");
	var faviconElement = Object.assign(
		document.createElement("link"),
		{rel: "icon", href: GetResource(id)}
	);
	if(quickReplace) {
		document.head.append(faviconElement);
		return;
	}
	RunWhenReady("body", function(loadedElement) {
		document.head.append(faviconElement);
	});		
}
