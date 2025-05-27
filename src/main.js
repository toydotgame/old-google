/*
 * AUTHOR: toydotgame
 * CREATED ON: 2024-06-14
 * Main class containing general methods; run when a Google domain is loaded.
 */

class Timings { // Store timings profiles for fun when debugging:
	// I'm aware a fully static class is a kind of spit in the face of OOP but
	// 1. I don't care, and
	// 2. it provides nice encapsulation and abstraction of methods and whatever
	//    and I like it
	static timers = {};

	/* static Timings
	 * Create "init" timer ASAP
	 */
	static {
		if(DEBUG) this.startTimer("init");
	}

	/* static void startTimer(string timer, boolean? restartable)
	 * Creates a timer starting now.
	 * - timer is the name of the timer, held in Timings.timers[<timer>]
	 * - restartable denotes if the timer can be restarted or not. If not,
	 *   subsequent calls to startTimer() or endTimer() with this name will
	 *   fail. Defaults to false
	 */
	static startTimer(timer, restartable=false) {
		if(!DEBUG) return;

		if(!this.timers[timer]) { // Create non-existent timers
			this.timers[timer] = {
				"start": Date.now(),
				"end": undefined,
				get delta() {return this.end-this.start},
				"canRestart": restartable
			};
			return;
		}

		if(!this.timers[timer].restartable) {
			log("Couldn't restart non-restartable timer \"" + timer + "\"!", "error");
			log("For reference, that timer last ended "
			  + ((Date.now()-this.timers[timer].end)/1000).toFixed(2)
			  + " seconds ago, with a delta of " + this.timers[timer].delta + " ms", "info");
			return;
		}

		// We have already checked above that we are allowed to restart:
		this.timers[timer].start = Date.now();
	}

	/* static int endTimer(string timer)
	 * Ends an existing timer. The elapsed time will become available in
	 * Timings.timers[<timer>] or as the return value of this method (in ms).
	 * Attempting to end an already ended timer will throw a console error but
	 * still return that timer's (past) delta value
	 * - timer is the name of the timer, held in Timings.timers[<timer>]
	 */
	static endTimer(timer) {
		if(!DEBUG) return null;

		if(!this.timers[timer]) {
			log("Couldn't end timer \"" + timer + "\" because it doesn't exist!", "error");
			return null;
		} else if(!this.timers[timer].canRestart && this.timers[timer].end) {
			log("Couldn't end non-restartable timer \"" + timer + "\"!", "error");
		} else this.timers[timer].end = Date.now();

		return this.timers[timer].delta;
	}
}

let logos = [
	{"id": "nav",                 "src": browser.runtime.getURL("/resources/google/nav.png")},
	{"id": "maps_favicon",        "src": browser.runtime.getURL("/resources/google/favicons/maps.ico")},
	{"id": "search_favicon",      "src": browser.runtime.getURL("/resources/google/favicons/search.ico")},
	{"id": "search_alt_favicon",  "src": browser.runtime.getURL("/resources/google/favicons/search_alt.ico")},
	{"id": "finance_favicon",     "src": browser.runtime.getURL("/resources/google/favicons/finance.ico")},
	{"id": "scholar_favicon",     "src": browser.runtime.getURL("/resources/google/favicons/scholar.ico")},
	{"id": "news_favicon",        "src": browser.runtime.getURL("/resources/google/favicons/news.ico")},
	{"id": "earth_favicon",       "src": browser.runtime.getURL("/resources/google/favicons/earth.ico")},
	{"id": "books",               "src": browser.runtime.getURL("/resources/google/logos/books.png")},
	{"id": "finance_left",        "src": browser.runtime.getURL("/resources/google/logos/finance_left.png")},
	{"id": "finance_right",       "src": browser.runtime.getURL("/resources/google/logos/finance_right.png")},
	{"id": "g",                   "src": browser.runtime.getURL("/resources/google/logos/g.png")},
	{"id": "maps",                "src": browser.runtime.getURL("/resources/google/logos/maps.png")},
	{"id": "maps_watermark_mono", "src": browser.runtime.getURL("/resources/google/logos/maps_watermark_mono.png")},
	{"id": "maps_watermark",      "src": browser.runtime.getURL("/resources/google/logos/maps_watermark.png")},
	{"id": "news_left",           "src": browser.runtime.getURL("/resources/google/logos/news_left.png")},
	{"id": "news",                "src": browser.runtime.getURL("/resources/google/logos/news.png")},
	{"id": "news_right",          "src": browser.runtime.getURL("/resources/google/logos/news_right.png")},
	{"id": "patents",             "src": browser.runtime.getURL("/resources/google/logos/patents.png")},
	{"id": "scholar",             "src": browser.runtime.getURL("/resources/google/logos/scholar.png")},
	{"id": "search",              "src": browser.runtime.getURL("/resources/google/logos/search.png")},
	{"id": "shopping_left",       "src": browser.runtime.getURL("/resources/google/logos/shopping_left.png")},
	{"id": "shopping",            "src": browser.runtime.getURL("/resources/google/logos/shopping.png")},
	{"id": "shopping_right",      "src": browser.runtime.getURL("/resources/google/logos/shopping_right.png")},
	{"id": "trends",              "src": browser.runtime.getURL("/resources/google/logos/trends.png")},
	{"id": "videos",              "src": browser.runtime.getURL("/resources/google/logos/videos.png")},
	{"id": "earth",               "src": browser.runtime.getURL("/resources/google/logos/earth.png")}
];

let supportedDomains = ["patents", "scholar", "books", "news", "trends", "www", "images", "earth"];
let supportedPages = ["/maps", "/videohp", "/finance", "/travel", "/", "/webhp", "/imghp", "/search", "/shopping"];

let subdomain = window.location.host.split(".")[0];
let page = "/" + window.location.pathname.split("/")[1];

if(supportedDomains.includes(subdomain) || supportedPages.includes(page)) main(); // End of execution if false

/* async void main()
 * Run if page is on a supported domain. Runs unique replace.js methods to replace logos
 */
async function main() {
	log(
		"Welcome to Old Google v" + browser.runtime.getManifest().version + "!\n" +
		"Copyright (c) 2021 toydotgame\n" +
		"subdomain = \"" + subdomain + "\", page = \"" + page + "\""
	, "info");
	
	try {
		config = await loadConfig();
		log("Config loaded:", "info"); if(DEBUG) console.table(config);
	} catch {
		log("Config loading failed catastrophically! Choosing to quit instead of continue");
		if(!DEBUG) return;
		// If debugging, continue execution, but enable a flag to warn whenever
		// config values are fetched:
		configFailed = true;
	}
	log("Addon initialisation finished after " + Timings.endTimer("init") + " ms", "info");

	Timings.startTimer("dispatch");
	dispatch();
	log("Old Google finished its processing after " + Timings.endTimer("dispatch") + " ms", "success");
	if(runningObservers.schedule || runningObservers.continuous)
		log("Setup is done, but some observers are still running. This is usually because some replacements require constant checks for page updates", "warn", "");
}

/* void dispatch()
 * Dispatches a replace.js function based on the values of globals `subdomain`
 * and `page`
 */
function dispatch() {
	replace_de_google_sans();
	switch(subdomain) {
		case "patents":
			replace_patents();
			break;
		case "scholar":
			replace_scholar();
			break;
		case "books":
			if(page == "/ngrams") {
				replace_ngrams();
				break;
			}
			replace_books();
			break;
		case "news":
			replace_news();
			break;
		case "trends":
			replace_trends();
			break;
		case "earth":
			replace_earth();
			break;
		case "www":
		case "images":
			switch(page) {
				case "/maps":
					replace_maps();
					break;
				case "/videohp":
					replace_videos();
					break;
				case "/finance":
					replace_finance();
					break;
				case "/travel":
					replace_travel();
					break;
				case "/books":
					replace_books(); // New Books results page
					break;
				case "/":
				case "/webhp":
				case "/imghp":
					replace_search_styles();
					replace_search_home();
					break;
				case "/search":
					replace_search_styles();
					replace_search_results();
					break;
				case "/shopping":
					replace_shopping();
					break;
			}
	}
}

/* string getResource(string id)
 * Returns a moz-extension:// URI for the resource with the input
 * namespaced ID. Returns empty string if not found
 */
function getResource(id) {
	try {
		return logos.find(x => x.id == id).src;
	} catch(TypeError) {return ""}
}

/* boolean getConfig(string id)
 * Returns true/false for given input setting ID.
 * Returns false if key does not exist
 */
function getConfig(id) {
	if(configFailed) {
		log("Config previously failed to load! Returning default value of \"" + id + "\"...", "warn", getCaller());
		
		if(options[id]) return options[id].default;
		return false;
	}

	try {
		return config[id];
	} catch(TypeError) {
		log("Failed to get config value for \"" + id + "\"!", "error");
		return false;
	}
}

/* void schedule(string[] selectors | string selector, function code)
 * Takes querySelector() string(s) and runs the provided code once the earliest
 * element in the array (or just the single provided element) is loaded into DOM
 * Provides a DOMObject `loadedElement` for use in the code that corresponds to
 * the aforementioned first loaded element
 */
function schedule(selectors, code) {
	if(typeof selectors == "string") selectors = [selectors];
	let instanceName = "schedule(\"" + selectors.join("\", \"") + "\")"; // Used only for logging
	log(instanceName + " started by " + getCaller(), "info");

	let loadedElement, isLoaded = false;
	function getLoadedElement(mutationInstance=null) {
		for(let i = 0; i < selectors.length; i++) {
			try {
				loadedElement = document.querySelector(selectors[i])
			} catch(TypeError) {}
			if(loadedElement == null) continue;

			log(instanceName + ": Element found, executing code and terminating...", undefined, getCaller(3));
			code(loadedElement); // Pass loaded element to caller's arrow function

			if(mutationInstance != null) { // Running in observer:
				runningObservers.schedule = false;
				mutationInstance.disconnect();
				break;
			} // Running in function scope:
			isLoaded = true;
			break;
		}
	}

	getLoadedElement(); // Run check if the element has loaded before the observer can start
	if(isLoaded) return;

	let observer = new MutationObserver((mutations, mutationInstance) => {
		getLoadedElement(mutationInstance);
	});
	observer.observe(document, {childList: true, subtree: true});
	runningObservers.schedule = true;
}

/* void injectCss(string styles, boolean? quickReplace)
 * Appends the given inline styles to the <head> element in a safe manner. Runs
 * when the body starts loading, unless quickReplace is true.
 * - quickReplace is to be true if this method is called from within a
 *   schedule() function that guarantees <body> has started loading. Defaults to
 *   false, but it's best practice to set it to true whenever possible to avoid
 *   creating too many observers
 */
function injectCss(styles, quickReplace=false) {
	log("Injecting CSS into document...", undefined, getCaller());
	let tag = document.createElement("style");
	tag.appendChild(document.createTextNode(styles));

	if(quickReplace) {
		document.head.append(tag);
		return;
	}

	schedule("body", ()=>{
		document.head.append(tag);
	});	
}

/* void setFavicon(string id, string? mode)
 * Sets the favicon to the resource at the provided ID, safely.
 * - mode is a string that can be "normal", "quick", or "deferred". Defaults to
 *   "normal"
 *     - "normal" waits for <body> to begin loading before injecting the
 *       favicon into <head>
 *     - "quick" assumes everything is already in place, so injects the favicon
 *       into <head> without checks. Similar to injectCss()'s quickReplace
 *     - "deferred" is a nasty hack that is needed for some sites, because
 *       deleting the Google-provided favicons (or just their href property)
 *       doesn't allow our favicon to work. So instead, it mangles the href
 *       string of all `link[rel="icon"]`s it finds
 */
function setFavicon(id, mode="normal") {
	log("Setting favicon to " + id + "...", undefined, getCaller());
	let faviconElement = Object.assign(document.createElement("link"),
		{rel: "icon", href: getResource(id)}
	);

	switch(mode) {
		case "deferred": // Nasty
			let favicons = document.querySelectorAll('link[rel="icon"]');
			for(let i = 0; i < favicons.length; i++) favicons[i].href += ".old-google-removed";
			// Run on to do a normal replacement: _Can_ be quick for Finance,
			// but not News, etc. Doing normal for better reliability
		case "normal":
			schedule("body", ()=>{
				document.head.append(faviconElement);
			});
			break;
		case "quick":
			document.head.append(faviconElement);
			break;
		default:
			log("Invalid mode \"" + mode + "\" for setFavicon()!", "error", getCaller());
	}
}
