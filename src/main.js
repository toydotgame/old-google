/*
 * AUTHOR: toydotgame
 * CREATED ON: 2024-06-14
 * Main class containing general methods; run when a Google domain is loaded.
 */

// Enables verbose debug logging. Not for production
const debug = true;

var logos = [
	{"id": "maps_favicon",           "src": browser.runtime.getURL("/resources/google/favicons/maps.ico")},
	{"id": "search_favicon",         "src": browser.runtime.getURL("/resources/google/favicons/search.ico")},
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
	{"id": "videos",                 "src": browser.runtime.getURL("/resources/google/logos/videos.png")}
];

var supportedDomains = ["patents", "scholar", "books", "shopping", "news", "trends", "www", "images"];
var supportedPages = ["/maps", "/videohp", "/finance", "/travel", "/", "/webhp", "/imghp", "/search"];

var config;
var runningObservers = 0; // DEBUG CODE REMOVE FOR PRODUCTION

var subdomain = window.location.host.split(".")[0];
var page = "/" + window.location.pathname.split("/")[1];

if(supportedDomains.includes(subdomain) && supportedPages.includes(page)) {
	Main();
} // End of execution if false

/*
 * void Main()
 * Run if page is on a supported domain. Runs unique replace.js methods to replace logos
 */
function Main() {
	DebugLog(
		"Welcome to Old Google!\n" +
		"Copyright (c) 2021 toydotgame\n" +
		"subdomain = \"" + subdomain + "\", page = \"" + page + "\""
	);
	
	LoadConfig().then(config => {
		DebugLog("Config loaded:"); console.table(config);

		// ...
	}).catch(e => {
		DebugLog("ERROR: Config failed to load! Exiting.");
	});
}

/*
 * void GetResource(String id)
 * Returns a moz-extension:// URI for the resource with the input
 * namespaced ID. Returns undefined if not found
 */
function GetResource(id) {
	return logos.find(x => x.id == id).src;
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
 * void DebugLog(String message)
 * Fancy console.log() wrapper that only prints if the debug const is true
 * If you prepend "ERROR: " to your message string, the message prints in red
 */
function DebugLog(message) {
	if(debug) {
		var messageColor = "reset";
		var isErrorMessage = false;
		try {
			isErrorMessage = message.startsWith("ERROR: ");
		} catch(TypeError) {}
		if(isErrorMessage) {
			message = message.replace(/ERROR: /, "");
			messageColor = "#f00";
		}
		var caller = "";
		if(DebugLog.caller.name.length != 0) {
			caller = "[" + DebugLog.caller.name + "()] ";
		}
		console.log("%c[%cOld Google%c]%c " + caller + message,
			"background-color:#4d90fe; color:#222",
			"background-color:#4d90fe; color:#fff",
			"background-color:#4d90fe; color:#222",
			"color:" + messageColor + "; background-color:reset");
	}
}

/*
 * void RunWhenReady(String[] selectors | String selector, function code, [boolean persistent])
 * Takes querySelector() string(s) and runs the provided code once the earliest
 * element in the array (or just the single provided element) is loaded into DOM
 * Provides a DOMObject `loadedElement` for use in the code that corresponds to
 * the aforementioned first loaded element
 */
function RunWhenReady(selectors, code) {
	if(typeof selectors == "string") {
		selectors = [selectors];
	}
	DebugLog("RunWhenReady(): Running on [\"" + selectors.join("\", \"") + "\"], code = ```\n" + code + "\n```");

	var loadedElement, isLoaded;
	function GetLoadedElement(mutationInstance = null) {
		for(var i = 0; i < selectors.length; i++) {
			try {
				loadedElement = document.querySelector(selectors[i])
			} catch(TypeError) {}
			if(loadedElement != null) {
				DebugLog("RunWhenReady(): Element with selector \"" + selectors[i] + "\" loaded...");
				code(loadedElement);
				if(mutationInstance != null) { // Running in observer:
					runningObservers -= 1; // DEBUG CODE REMOVE FOR PRODUCTION
					DebugLog("Running observers = " + runningObservers); // DEBUG CODE REMOVE FOR PRODUCTION
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
		runningObservers += 1; // DEBUG CODE REMOVE FOR PRODUCTION
		DebugLog("Running observers = " + runningObservers); // DEBUG CODE REMOVE FOR PRODUCTION
		GetLoadedElement(mutationInstance);
	});
	observer.observe(document, {childList: true, subtree: true});
}
