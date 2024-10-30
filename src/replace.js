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

	SetFavicon("search_favicon");

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
	SetFavicon("scholar_favicon");
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
		.gb_Ld.gb_Ec { /* Classic Books results logo */
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
	SetFavicon("search_favicon");
}

// No delay
function Replace_Ngrams() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.google-logo {
			content: url("` + GetResource("books") + `") !important;
			height: unset !important;
		}
		.ngrams-logo { /* "Books Ngram Viewer" text */
			padding-left: 2em !important;
			color: #009925 !important;
			font-family: "Arial", sans-serif !important;
			/* Clear content: */
			line-height: 0 !important;
			text-indent: -999999px;
		}
		.ngrams-logo::after {
			display: block;
			content: "Ngram Viewer";
			text-indent: 0;
		}
	`);
	SetFavicon("search_favicon");
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
	SetFavicon("search_favicon");
	if(GetConfig("squareBox")) {
		DebugLog("Enabling squareBox...");
		InjectCssAtHead(`
			.z86TMb { /* Search box */
				border-radius: 2px;
			}
			.fYz4Vc { /* Search suggestions dropdown */
				border-radius: 0 0 2px 2px;
			}
		`);
	}
}

// No delay
function Replace_News() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.gb_Ld.gb_3d { /* Logo */
			content: url("` + GetResource("news_left") + `");
			height: unset;
		}
		.gb_qd.gb_8c { /* Subtitle */
			content: url("` + GetResource("news_right") + `");
			height: 32px;
			padding-left: 0;
		}
	`);
	document.addEventListener("DOMContentLoaded", function() { // Like with Finance, News defers the favicon horribly too
		SetFavicon("news_favicon", true);
	});}

// No delay
function Replace_Trends() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.gb_Ld.gb_3d { /* Homepage logo */
			content: url("` + GetResource("trends") + `");
			height: unset;
			vertical-align: middle;
		}
		.gb_qd.gb_8c { /* Homepage subtitle */
			display:none;
		}
		.google-logo { /* Results logo and drawer logo */
			height: 32px;
			background-image: url("` + GetResource("trends") + `") !important;
			background-size: contain;
		}
	`);
	SetFavicon("search_favicon");
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
			background: url("` + GetResource("maps_watermark_mono") + `") no-repeat center;
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
	SetFavicon("search_alt_favicon");
	if(GetConfig("squareBox")) {
		DebugLog("Enabling squareBox...");
		InjectCssAtHead(`
			.RNNXgb { /* Search box */
				border-radius: 2px !important;
			}
			.aajZCb { /* Suggestions dropdown */
				border-radius: 0 0 2px 2px !important;
			}
		`);
	}
}

// No delay
function Replace_Finance() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.gb_Ld.gb_3d, .ForAd > img {
			content: url("` + GetResource("finance_left") + `");
			height: unset;
		}
		.gb_qd.gb_8c, .N27tdc {
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
	// Finance favicon is super deferred for some reason, and even then the
	// below patch sometimes doesn't work.
	document.addEventListener("DOMContentLoaded", function() {
		SetFavicon("finance_favicon", true);
	});
}

// No delay
function Replace_Travel() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		.gb_Ld.gb_3d {
			content: url("` + GetResource("search") + `");
			height: unset;
		}
	`);
	document.addEventListener("DOMContentLoaded", function() { // Google defers favicon load
		SetFavicon("search_favicon", true);
	});
}

// No delay
function Replace_Earth() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		#earth-splashscreen {
			background-image: url("` + GetResource("earth") + `"),
				url(https://www.gstatic.com/earth/images/00-earth-splash-1x-ltr.jpg),
				url(https://www.gstatic.com/earth/images/00-earth-splash-mask-ltr.svg),
				url(https://www.gstatic.com/earth/images/01-earth-splash-stars-ltr.webp);
			background-size: 324px, 1280px 463px, 1164px 380px, cover;
		}
	`);
	SetFavicon("earth_favicon");
}

// No delay
function Replace_Search_Styles() {
	DebugLog("Running replacement...");
	var css = `
		/* Homepage Styles */
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
		
		/* Results Page Styles */
		#logo, .logo > a > img { /* Regular results logo, Doodle logo */
			content: url("` + GetResource("search") + `");
			width: 96px;
		}
		.IormK { /* Doodle background */
			display:none;
		}
	`;
	if(GetConfig("squareBox")) {
		DebugLog("Enabling squareBox...");
		css += `
			/* Homepage Styles */
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
			/* Results Page Styles */
			.H9lube, .UnOTSe img { /* Two styles of results favicon */
				border-radius: 2px !important;
			}
			.IvHA0 { /* Pill container around site name */
				padding: unset !important;
				background-color: unset !important;
			}
		`;
	}
	
	InjectCssAtHead(css);
	SetFavicon("search_favicon");
}

// Run after Replace_Search_Styles()
function Replace_Search_Home() {
	DebugLog("Running replacement...");
	if(subdomain == "www" && page != "/imghp") {
		var newLogo = Object.assign(
			document.createElement("img"),
			{className: "lnXdpd"}
		);
		RunWhenReady(".k1zIA", function(loadedElement) {
			loadedElement.replaceChildren(newLogo);
		});
	}
}

// Run after Replace_Search_Styles()
function Replace_Search_Results() {
	DebugLog("Running replacement...");

	if(GetConfig("udm14")) {
		if(new URLSearchParams(window.location.search).get("udm") == null) {
			window.location.replace(window.location + "&udm=14");
			DebugLog("Redirected from non-udm=14 page.");
		}
	}

	var css = `
		/* Footer "Goooooooooogle" page selector */
		.SJajHc {
			background: url("` + GetResource("nav") + `") no-repeat !important;
		}		
		.d6cvqb.BBwThe:first-child > .SJajHc { /* G (page 1 only) */
			background-position: -24px 0 !important;
		}
		a#pnprev > .SJajHc.NVbCr { /* < G (page 2+) */
			background-position: 0 0 !important;
		}
		td.YyVfkd > .SJajHc { /* o (selected) */
			background-position: -53px 0 !important;
		}
		a.fl > .SJajHc.NVbCr { /* o (unselected) */
			background-position: -74px 0 !important;
		}
		a#pnnext > .SJajHc.NVbCr { /* gle > (pages 1-penultimate) */
			background-position: -96px 0 !important;
			width: 78px !important;
		}
		.d6cvqb.BBwThe:last-child > .SJajHc { /* gle (last page) */
			background-position: -96px 0 !important;
			width: 52px !important;
		}
		
		.YmvwI { /* Results tabs text */
			font-family: "Arial", sans-serif-medium, sans-serif;
		}
	`;

	if(GetConfig("greenUrls")) {
		DebugLog("Enabling greenUrls...");
		css += `
			cite.tjvcx, .ylgVCe.ob9lvb { /* Domain text, page text */
				color: light-dark(#093, #3c6);
			}
			a:link h3, #botstuff a:link { /* Result link text, Page nav link text */
				color: light-dark(#12c, #5a67f2) !important;
				text-decoration: underline !important; /* This is overridden for nav link intentionally */
			}
			a:visited h3, #botstuff a:visited { /* Purple result link text */
				color: light-dark(#61c, #9e5af2);
			}
			/* Goooooooooogle link styling */
			td.YyVfkd, a.fl { /* o (unselected and selected) */
				text-decoration: none !important;
			}
			a.fl:hover { /* o (unselected) */
				text-decoration: underline !important;
			}
			a#pnprev, a#pnnext { /* Previous and Next */
				font-weight: bold;
			}
		`;
		
		function RemoveBreadcrumbs() {
			var resultUrls = document.querySelectorAll(".ylgVCe.ob9lvb:not(.old-google-debreadcrumbed)");
			try {
				for(var i = 0; i < resultUrls.length; i++) {
					resultUrls[i].textContent = resultUrls[i].textContent.replace(/ › /g, "/");
					resultUrls[i].className += " old-google-debreadcrumbed";
				}
			} catch(TypeError) {} // No results found
		}
		var pageChangeObserver = new MutationObserver(function(mutations, mutationInstance) {
			RemoveBreadcrumbs();
		});

		// Defer initial breadcrumb removal to after the page has loaded
		// This _will_ cause a visual flash, but running an observer with
		// a for() loop whilst the page loads is a recipe for disaster
		document.addEventListener("DOMContentLoaded", function() {
			// Breadcrumb removal is continuous as the user scrolls, so it never stops
			RemoveBreadcrumbs();
			pageChangeObserver.observe(document, {childList: true, subtree: true});
		});
	}

	if(GetConfig("cleanResults")) {
		DebugLog("Removing gimmicks and increasing density...");
		css += `
			.tF2Cxc.asEBEc, .vt6azd, .hlcw0c, .g {
				margin-bottom: 0 !important;
			}
			.MjjYud, .cUnQKe { /* General containers, People also searched for */
				margin-bottom: 16px !important;
			}
			.ULSxyf:nth-child(2), #appbar, #OotqVd, #taw, #nMJCib { /* Top result extract, appbar, 404 yeti, definitions hint, Define button */
				display: none;
			}
			.s6JM6d, .sBbkle { /* Results container, Results tabs */
				margin-left: calc(var(--center-abs-margin) / 1.5);
				padding-left: 0;
			}
			.RNNXgb { /* Search box */
				max-width: 565px;
				margin: unset !important;
			}
			.UUbT9 { /* Search predictions */
				width: 567px !important;
				margin-top: -2px !important;
			}
			.rLrQHf, .M8OgIe { /* Search predictions gimmick area on the right, Gemini response */
				display: none;
			}
			.DKV0Md { /* Result title gap below site info line */
				margin-top: 10px !important;
			}
			.PHj8of { /* Results tabs container that has extra padding by default */
				padding-bottom: 0;
			}
		`;
	}

	if(GetConfig("peopleAlsoSearchedFor")) {
		DebugLog("Removing \"People also searched for\"...");
		css += `
			#bres, .cUnQKe, .oIk2Cb, div[data-hveid="CEMQAA"], .VjDLd { /* PASF buttons, People also searched for, PASF (button edition) (also removes other search gimmicks potentially), People also ask heading, See results about right pane box */
				display: none !important;
			}
			.hlcw0c { /* Always the result just before a results gimmick */
				margin-bottom: 0 !important;
			}
		`;
	}

	if(GetConfig("removePills")) {
		DebugLog("Removing pills...");
		css +=`
			.IUOThf {
				display: none;
			}
			.XtQzZd {
				height: 57px;
			}
		`;
	}

	// Deferred 'till body is loaded so that document.body is a valid object
	RunWhenReady("body", function(loadedElement) {
		// Manually add color-scheme value for greenUrls light-dark() CSS:
		if(getComputedStyle(document.body).getPropertyValue("background-color") != "rgb(255, 255, 255)") { // if(isDarkMode)
			css += `
				:root {
					/* Overridden by Google's JS anyway, but if results page > 1, Google forgets to add in the color-scheme value */
					color-scheme: dark;
				}
			`;
		}
		InjectCssAtHead(css, true);
	});
}
