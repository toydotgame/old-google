/*
 * AUTHOR: toydotgame
 * CREATED ON: 2024-06-14
 * Main class containing general methods; run when a Google domain is loaded.
 */

// Enables verbose debug logging. Not for production
const debug = false;

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

/*
 * void GetResource(String id)
 * Returns a moz-extension:// URI for the resource with the input
 * namespaced ID. Returns undefined if not found
 */
function GetResource(id) {
	return logos.find(x => x.id == id).src;
}
