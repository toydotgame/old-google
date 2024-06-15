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
		.uiDkff.FAZYFf > .Ws3Esf { /* Logo */
			content: url("` + GetResource("shopping_left") + `");
			height: unset;
		}
		.jmaXG { /* Subtitle */
			content: url("` + GetResource("shopping_right") + `");
			height: 32px;
			padding-left: 0;
		}
	`);
	if(GetConfig("squareBox")) {
		DebugLog("Enabling squareBox...");
		InjectCssAtHead(`
			.z86TMb { /* Search box */
				border-radius: 2px;
			}
			.fYz4Vc { /* Search suggestions dropdown */
				border-radius: 0 0 2px 2px;
			}
		`, true);
	}
}

// No delay
function Replace_News() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.gb_Oc.gb_6d { /* Logo */
			content: url("` + GetResource("news_left") + `");
			height: unset;
		}
		.gb_pd.gb_gd { /* Subtitle */
			content: url("` + GetResource("news_right") + `");
			height: 32px;
			padding-left: 0;
		}
	`);
}

// No delay
function Replace_Trends() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.gb_Oc.gb_6d, .gb_jd { /* Homepage logo */
			content: url("` + GetResource("trends") + `");
			height: unset;
			vertical-align: middle;
		}
		.gb_pd.gb_gd { /* Homepage subtitle */
			display:none;
		}
		.google-logo { /* Results logo and drawer logo */
			height: 32px;
			background-image: url("` + GetResource("trends") + `") !important;
			background-size: contain;
		}
	`);
}

// No delay
function Replace_Maps() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.watermark { /* Map view watermark */
			content: url("` + GetResource("maps_watermark") + `");
		}
		.watermark.nTFmr { /* Satellite view watermark */
			content: url("` + GetResource("maps_watermark_mono") + `");
		}
		.lmygoc { /* Drawer logo */
			content: url("` + GetResource("maps") + `");
		}
		#splash-logo {
			background: url("moz-extension://059a35c4-2334-4d45-9ba1-53f4ab1c8641/resources/google/logos/maps_watermark_mono.png") no-repeat center;
			background-size: 324px;
		}
	`);
	RunWhenReady('link[rel="shortcut icon"', function(loadedElement) { // Maps defers its favicon for some reason so we wait for it (because CSS injection is too fast)
		SetFavicon("maps_favicon", true);
	});
}

// No delay
function Replace_Videos() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.lnXdpd { /* Homepage logo */
			content: url("` + GetResource("videos") + `");
			height: 96px;
		}
		.T8VaVe { /* Homepage subtitle */
			display: none;
		}
	`);
	if(GetConfig("squareBox")) {
		DebugLog("Enabling squareBox...");
		InjectCssAtHead(`
			.RNNXgb { /* Search box */
				border-radius: 2px !important;
			}
			.aajZCb { /* Suggestions dropdown */
				border-radius: 0 0 2px 2px !important;
			}
		`, true);
	}
}

// No delay
function Replace_Finance() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.gb_Oc.gb_6d, .ForAd > img {
			content: url("` + GetResource("finance_left") + `");
			height: unset;
		}
		.gb_pd.gb_gd, .N27tdc {
			content: url("` + GetResource("finance_right") + `");
			height: 32px;
			padding-left: 0;
		}
		.ForAd > img {
			height: 32px;
		}
		.N27tdc {
			padding-top: 1px;
		}
	`);
}

function Replace_Travel() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.gb_Oc.gb_6d {
			content: url("` + GetResource("search") + `");
			height: unset;
		}
	`);
}

function Replace_Search_Styles() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.k1zIA { /* Homepage logo container */
			margin-top: auto;
			max-height: 92px;
		}
		.lnXdpd { /* Homepage logo */
			content: url("` + GetResource("search") + `");
			width: 272px;
			height: 92px;
		}
		.SuUcIb { /* Homepage doodle share button */
			display: none;
		}
	`);

	if(subdomain == "www" && (page == "/" || page == "/webhp")) {
		var newLogo = Object.assign(
			document.createElement("img"),
			{className: "lnXdpd"}
		);
		RunWhenReady(".k1zIA", function(loadedElement) {
			loadedElement.replaceChildren(newLogo);
		});
	}

	if(GetConfig("squareBox")) {
		DebugLog("Enabling squareBox...");
		InjectCssAtHead(`
			/* In respective order:
			 * /webhp: Homepage search box
			 * /imghp: Upload container, upload textarea, upload search button,
			 *         inner upload container
			 */
			.RNNXgb, .ea0Lbe, .cB9M7, .Qwbd3, .gIYJUc {
				border-radius: 2px !important;
			}
			.aajZCb { /* Homepage suggestions dropdown */
				border-radius: 0 0 2px 2px !important;
			}
		`, true);
	}
}

function Replace_Search_Results() {
	DebugLog("Running replacement...");
}
