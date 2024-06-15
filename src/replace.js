/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * Contains specific methods for replacement for each search engine
 * Before every method, the trigger/delay for when the method is run is written
 */

// No delay
function Replace_Patents() {
	DebugLog("Running replacement...");
	/* Google Patents will usually use JS to replace the document body rather
	 * than redirect to unique search or homepage documents, completely unlike
	 * all other Google search engines. Therefore, we start a persistent
	 * MutationObserver to check if the URL has changed in any way, then use
	 * stylesheets to safely replace content regardless of the current document
	 */
	function InjectPatentsStyles() {
		InjectCssAtHead(`
			.logowrap > img { /* Homepage logo */
				width: 276px;
				height: unset;
				content: url("` + GetResource("patents") + `");
			}
			h1.style-scope.landing-page { /* Homepage subtitle */
				display: none;
			}
			.lockup-brand.style-scope.search-header { /* Results subtitle */
				display: none;
			}
			.lockup-logo.search-header { /* Results logo */
				background: no-repeat url("` + GetResource("patents") + `");
				background-size: contain;
			}
			.layout.horizontal.leftheader.style-scope.search-header { /* Results logo container */
				width: 79px;
			}
		`);
	}

	var currentURL = window.location.href;
	var pageChangeObserver = new MutationObserver(function(mutations, mutationInstance) {
		if(window.location.href != currentURL) {
			currentURL = window.location.href;
			InjectPatentsStyles();
		}
	});

	InjectPatentsStyles(); // MutationObserver does nothing on its own for the first run, hence manual invocation
	pageChangeObserver.observe(document, {childList: true, subtree: true});
}

// No delay
function Replace_Scholar() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		#gs_hdr_drw_lgo, #gs_hdr_lgo { /* Results logo */
			background: no-repeat url("` + GetResource("scholar") + `") 0 50%;
			background-size: contain;
			width: 149px;
			height: 63px;
			box-sizing: border-box;
			background-origin: content-box;
			padding: 15px;
		}
		#gs_ab_ico > .gs_ico { /* Tab bar mini icon */
			background: no-repeat url("` + GetResource("g") + `");
			background-size: contain;
		}
		#gs_hdr_hp_lgo { /* Homepage logo */
			width: 276px;
			content: url("` + GetResource("scholar") + `");
		}
		#gs_hdr_hp_lgow { /* Homepage logo container */
			margin-bottom: 40px;
		}
	`);
}

// No delay
function Replace_Books() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		#oc-search-image { /* Homepage logo */
			background: no-repeat url("` + GetResource("books") + `");
			background-size: contain;
		}
		#oc-search-logo { /* Homepage subtitle */
			display: none;
		}
		.gb_Oc.gb_Mc { /* Classic Books results logo */
			background: no-repeat url("` + GetResource("books") + `");
			background-size: contain;
			background-position: 0 0;
			width: 96px;
		}
		.outMi > img { /* New Books results logo */
			content: url("` + GetResource("books") + `");
			height: unset;
		}
		.B6Fq0e { /* New Books results subtitle */
			display: none;
		}
		.FYyaN { /* New Books results logo container */
			flex: unset !important;
		}
	`);
}

// No delay
function Replace_Ngrams() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.google-logo {
			content: url("` + GetResource("books") + `");
			height: unset;
		}
		.ngrams-logo { /* "Books Ngram Viewer" text */
			padding-left: 2em;
			color: #009925;
			font-family: "Arial", sans-serif;
			/* Clear content: */
			line-height: 0;
			text-indent: -999999px;
		}
		.ngrams-logo::after {
			display: block;
			content: "Ngram Viewer";
			text-indent: 0;
		}
	`);
}

// No delay
function Replace_Shopping() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.uiDkff.FAZYFf > .Ws3Esf {
			content: url("` + GetResource("shopping_left") + `");
			height: unset;
		}
		.jmaXG {
			content: url("` + GetResource("shopping_right") + `");
			height: 32px;
			padding-left: 0;
		}
	`);
}

function Replace_News() {
	DebugLog("Running replacement...");
}

function Replace_Trends() {
	DebugLog("Running replacement...");
}

function Replace_Maps() {
	DebugLog("Running replacement...");
}

function Replace_Videos1() {
	DebugLog("Running replacement...");
}

function Replace_Finance() {
	DebugLog("Running replacement...");
}

function Replace_Travel() {
	DebugLog("Running replacement...");
}

function Replace_Search() {
	DebugLog("Running replacement...");
}
