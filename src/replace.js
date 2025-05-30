/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * Contains specific functions for replacement for each search engine
 * Before every method, the trigger/delay for when the method is run is written
 */

// No delay; this function is persistent
function replace_patents() {
	log("Running replacement...");

	/* Google Patents will usually use JS to replace the document body rather
	 * than redirect to unique search or homepage documents, completely unlike
	 * all other Google search engines. Therefore, we start a persistent
	 * MutationObserver to check if the URL has changed in any way, then use
	 * stylesheets to safely replace content regardless of the current document
	 */
	function injectPatents() {
		injectCss(`
			.logowrap > img { /* Homepage logo */
				width: 276px;
				height: unset;
				content: url("` + getResource("patents") + `");
			}
			h1.style-scope.landing-page { /* Homepage subtitle */
				display: none;
			}
			.product-name.style-scope.search-header { /* Results subtitle */
				display: none;
			}
			.google-logo.search-header { /* Results logo */
				background: no-repeat url("` + getResource("patents") + `");
				background-size: contain;
			}
		`);
	}

	setFavicon("search_favicon");

	let currentURL = window.location.href;
	let pageChangeObserver = new MutationObserver(()=>{
		if(window.location.href == currentURL) return;
		
		injectPatents();
		currentURL = window.location.href;
	});

	injectPatents(); // MutationObserver does nothing on its own for the first run, hence manual invocation
	pageChangeObserver.observe(document, {childList: true, subtree: true});
	runningObservers.continuous = true;
}

// No delay
function replace_scholar() {
	log("Running replacement...");

	injectCss(`
		#gs_hdr_drw_lgo, #gs_hdr_lgo { /* Results logo */
			background: no-repeat url("` + getResource("scholar") + `") 0 50%;
			background-size: contain;
			width: 149px;
			height: 63px;
			box-sizing: border-box;
			background-origin: content-box;
			padding: 15px;
		}
		#gs_ab_ico > .gs_ico { /* Tab bar mini icon */
			background: no-repeat url("` + getResource("g") + `");
			background-size: contain;
		}
		#gs_hdr_hp_lgo { /* Homepage logo */
			width: 276px;
			content: url("` + getResource("scholar") + `");
		}
		#gs_hdr_hp_lgow { /* Homepage logo container */
			margin-bottom: 40px;
		}
	`);
	setFavicon("scholar_favicon");
}

// No delay
function replace_books() {
	log("Running replacement...");

	injectCss(`
		#oc-search-image { /* Homepage logo */
			background: no-repeat url("` + getResource("books") + `");
			background-size: contain;
		}
		#oc-search-logo { /* Homepage subtitle */
			display: none;
		}
		.gb_Ld.gb_Ec { /* Classic Books results logo */
			background: no-repeat url("` + getResource("books") + `");
			background-size: contain;
			background-position: 0 0;
			width: 96px;
		}
		.outMi > img { /* New Books results logo */
			content: url("` + getResource("books") + `");
			height: unset;
		}
		.B6Fq0e { /* New Books results subtitle */
			display: none;
		}
		.FYyaN { /* New Books results logo container */
			flex: unset !important;
		}
	`);
	setFavicon("search_favicon");
}

// No delay
function replace_ngrams() {
	log("Running replacement...");

	injectCss(`
		.google-logo {
			content: url("` + getResource("books") + `") !important;
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
	setFavicon("search_favicon");
}

// No delay
function replace_shopping() {
	log("Running replacement...");

	injectCss(`
		.tY4xY { /* Logo */
			content: url("` + getResource("shopping_left") + `");
			height: 32px !important;
		}
		.nTJncc { /* Subtitle */
			content: url("` + getResource("shopping_right") + `");
			height: 32px;
			margin-left: 0 !important;
		}
		.KjnGid { /* Drawer logo */
			content: url("` + getResource("shopping") + `");
			height: 32px !important;
		}
		/* Random h2 that has no content and creates redundant padding. This is
		 * Google's fault. They suck. This is genuinely unneeded padding. Why?
		 * Not only that, but the id of the element is dynamic for some reason?
		 */
		.Z2z9ye h2[id] {
			display: none;
		}

		/* Styles taken from replace_search_styles(), as Shopping has the same search bar as Search */
		:root {
			color-scheme: light dark !important;
		}
		.RNNXgb { /* Search box */
			background-color: light-dark(#fff, #303134) !important;
		}
	`);
	setFavicon("search_alt_favicon");

	if(!getConfig("squareBox")) return;
	
	log("Enabling squareBox...");
	injectCss(`
		.RNNXgb { /* Search box */
			border-radius: 2px !important;
		}
		.aajZCb { /* Search suggestions dropdown */
			border-radius: 0 0 2px 2px !important;
		}
	`);
}

// No delay
function replace_news() {
	log("Running replacement...");

	injectCss(`
		.gb_Pd.gb_7d { /* Logo */
			content: url("` + getResource("news_left") + `");
			height: unset;
		}
		.gb_ud.gb_bd { /* Subtitle */
			content: url("` + getResource("news_right") + `");
			height: 32px;
			padding-left: 0;
		}
	`);

	setFavicon("news_favicon", "deferred");
}

// No delay
function replace_trends() {
	log("Running replacement...");

	injectCss(`
		.gb_Pd.gb_7d { /* Homepage logo */
			content: url("` + getResource("trends") + `");
			height: unset;
			vertical-align: middle;
		}
		.gb_ud.gb_bd { /* Homepage subtitle */
			display:none;
		}
		.google-logo { /* Results logo and drawer logo */
			height: 32px;
			background-image: url("` + getResource("trends") + `") !important;
			background-size: contain;
		}
	`);
	setFavicon("search_favicon");
}

// No delay
function replace_maps() {
	log("Running replacement...");

	injectCss(`
		.watermark { /* Map view watermark */
			content: url("` + getResource("maps_watermark") + `");
		}
		.watermark.nTFmr { /* Satellite view watermark */
			content: url("` + getResource("maps_watermark_mono") + `");
		}
		.lmygoc { /* Drawer logo */
			content: url("` + getResource("maps") + `");
		}
		#splash-logo {
			background: url("` + getResource("maps_watermark_mono") + `") no-repeat center;
			background-size: 324px;
		}
	`);
	setFavicon("maps_favicon", "deferred");
}

// No delay
function replace_videos() {
	log("Running replacement...");

	injectCss(`
		.lnXdpd { /* Homepage logo */
			content: url("` + getResource("videos") + `");
			height: 96px;
		}
		.T8VaVe { /* Homepage subtitle */
			display: none;
		}
	`);
	setFavicon("search_alt_favicon");

	if(!getConfig("squareBox")) return;
	
	log("Enabling squareBox...");
	injectCss(`
		.RNNXgb { /* Search box */
			border-radius: 2px !important;
		}
		.aajZCb { /* Suggestions dropdown */
			border-radius: 0 0 2px 2px !important;
		}
	`);
}

// No delay
function replace_finance() {
	log("Running replacement...");

	injectCss(`
		.gb_Pd.gb_7d, .ForAd > img { /* "Google", drawer "Google" */
			content: url("` + getResource("finance_left") + `");
			height: unset;
		}
		.gb_ud.gb_bd, .N27tdc { /* "Finance", drawer "Finance" */
			content: url("` + getResource("finance_right") + `");
			height: 32px;
			padding-left: 0;
		}
		.ForAd { /* Drawer logo container */
			position: relative;
			/* Parent is 48px high, this is 32.5px (img height+"Finance" padding
			 * height). (48-32.5)÷2 = 7.75px. Sad hack for vertical align middle
			 * because display for this element is flex
			 */
			top: 7.75px;
		}
		.ForAd > img { /* Drawer "Google" */
			height: 32px;
		}
		.N27tdc { /* Drawer "Finance" */
			padding-top: 0.5px;
		}
	`);


	setFavicon("finance_favicon", "deferred");
}

// No delay
function replace_travel() {
	log("Running replacement...");

	injectCss(`
		.gb_Pd.gb_7d {
			content: url("` + getResource("search") + `");
			height: unset;
		}
	`);

	setFavicon("search_alt_favicon", "deferred");
}

// No delay
function replace_earth() {
	log("Running replacement...");

	injectCss(`
		#earth-splashscreen {
			background-image: url("` + getResource("earth") + `"),
				url(https://www.gstatic.com/earth/images/00-earth-splash-1x-ltr.jpg),
				url(https://www.gstatic.com/earth/images/00-earth-splash-mask-ltr.svg),
				url(https://www.gstatic.com/earth/images/01-earth-splash-stars-ltr.webp);
			background-size: 324px, 1280px 463px, 1164px 380px, cover;
		}
	`);
	setFavicon("earth_favicon");
}

// No delay
function replace_search_styles() {
	log("Running replacement...");

	let css = `
		:root {
			/* Google forgets to specify color scheme on the hp (properly at
			 * least), and on results pages 2+ (when not reloading). Specifying
			 * a \`light dark\` color-scheme manually enables us to use
			 * \`light-dark()\` without error
			 */
			color-scheme: light dark !important;
		}

		/* Homepage Styles */
		.k1zIA { /* Homepage logo container */
			margin-top: auto;
			max-height: 92px;
		}
		.lnXdpd { /* Homepage logo */
			content: url("` + getResource("search") + `");
			width: 272px;
			height: 92px;
		}
		#hplogo, .SuUcIb { /* Doodle container, Homepage doodle share button */
			display: none;
		}
		.RNNXgb { /* Search box */
			background-color: light-dark(#fff, #303134) !important; /* Colour taken from dark mode :hover bg */
		}
		
		/* Results Page Styles */
		#logo, .logo > a > img { /* Regular results logo, Doodle logo */
			content: url("` + getResource("search") + `");
			width: 96px;
		}
		.IormK { /* Doodle background */
			display:none;
		}
	`;

	if(getConfig("squareBox")) {
		log("Enabling squareBox...");
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

	if(getConfig("cleanResults")) {
		log("Removing search box extra buttons...");
		css += `
			.dRYYxd { /* Search bar clear/mic/images button container */
				display: none !important;
			}
		`;
	}
	
	injectCss(css);
	setFavicon("search_favicon");
}

// Run after replace_search_styles()
function replace_search_home() {
	log("Running replacement...");

	injectCss(`
		.iblpc { /* Left-hand search icon */
			/* Same as the replace_search_results() equivalent, but we need this
			 * to apply without the selected class from the search box too
			 */
			padding-right: 10px !important;
		}
	`);
	
	if(subdomain != "www" || page == "/imghp") return;

	// Specifically images.google.*/imghp has an SVG logo for some reason:
	let newLogo = Object.assign(document.createElement("img"),
		{className: "lnXdpd"}
	);
	schedule(".k1zIA", loadedElement => {
		loadedElement.replaceChildren(newLogo);
	});
}

// Run after replace_search_styles(); this function is persistent
function replace_search_results() {
	log("Running replacement...");

	schedule("#fprs", typoNotif => {
		// Should be safe because replacement value is hardcoded
		typoNotif.innerHTML = typoNotif.innerHTML.replace("These are results for", "Showing results for");
	}); // Not optimal because this observer never closes on non-typo searches

	if(getConfig("udm14")) {
		if(!(new URLSearchParams(window.location.search).get("udm"))) {
			window.location.replace(window.location + "&udm=14");
			log("Redirected from non-udm=14 page");
		}
	}

	let css = `
		.FgNLaf { /* Search box narrow viewport logo container */
			content: url("` + getResource("g") + `");
			width: 24px !important;
			height: 24px !important;
			padding: 0 8px !important;
			filter: drop-shadow(1px 1px 3px #000);
		}
		.emcav .iblpc { /* Dropdown enabled search box class+left-hand search icon */
			padding-right: 10px !important;
		}

		/* Footer "Goooooooooogle" page selector */
		.SJajHc {
			background: url("` + getResource("nav") + `") no-repeat !important;
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

	if(getConfig("greenUrls")) {
		log("Enabling greenUrls...");
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
		
		/* void removeBreadcrumbs()
		 * Function called on every page update, replacing the fancy formatted
		 * page addresses in results with regular slashes. Old-formatted results
		 * are marked as .old-google-debreadcrumbed, and are thus ineligible for
		 * future passes/runs
		 */
		function removeBreadcrumbs() {
			let resultUrls = document.querySelectorAll(".ylgVCe.ob9lvb:not(.old-google-debreadcrumbed)");
			try {
				for(let i = 0; i < resultUrls.length; i++) {
					resultUrls[i].textContent = resultUrls[i].textContent.replace(/ › /g, "/");
					resultUrls[i].className += " old-google-debreadcrumbed";
				}
			} catch(TypeError) {} // No results found
		}
		let pageChangeObserver = new MutationObserver(()=>{
			removeBreadcrumbs();
		});

		// Defer initial breadcrumb removal to after the page has loaded
		// This _will_ cause a visual flash, but running an observer with
		// a for() loop whilst the page loads is a recipe for disaster
		removeBreadcrumbs(); // Hack for aforementioned flash
		document.addEventListener("DOMContentLoaded", ()=>{
			// Breadcrumb removal is continuous as the user scrolls, so it never stops
			removeBreadcrumbs();
			pageChangeObserver.observe(document, {childList: true, subtree: true});
			runningObservers.continuous = true;
		});
	}

	if(getConfig("cleanResults")) {
		log("Removing gimmicks and increasing density...");
		css += `
			.tF2Cxc.asEBEc, .vt6azd, .hlcw0c, .g {
				margin-bottom: 0 !important;
			}
			.MjjYud, .cUnQKe { /* General containers, People also searched for */
				margin-bottom: 16px !important;
			}
			.ULSxyf:nth-child(2), #appbar, #OotqVd, #taw, #nMJCib, .kb0PBd:has(div[role="list"]), .rLrQHf, .M8OgIe {
				/* Top result extract
				 * Appbar
				 * 404 yeti
				 * Definitions hint
				 * Define button
				 * Result pills row
				 * Search predictions gimmick area on the right
				 * Gemini response
				 */
				display: none;
			}
			.s6JM6d, .sBbkle { /* Results container, Results tabs */
				padding-left: 0;
			}
			.RNNXgb { /* Search box */
				/* Arbitrary limit on max width of search box, duplicated by the
				 * predictions container below. I think this limit comes from a
				 * genuine 2011–2013-era Google search box size. I think
				 */
				max-width: 565px;
				margin: unset !important;
			}
			.UUbT9 { /* Search predictions */
				max-width: 565px !important;
			}
			.DKV0Md { /* Result title gap below site info line */
				margin-top: 10px !important;
			}
		`;
	}

	if(getConfig("removeSearchButton")) {
		log("Removing search button...");
		css += `
			.Tg7LZd { /* Search bar search button */
				display: none;
			}
		`;
	}

	if(getConfig("peopleAlsoSearchedFor")) {
		log("Removing \"People also searched for\"...");
		css += `
			#bres, .cUnQKe, .oIk2Cb, div[data-hveid="CEMQAA"], .VjDLd {
				/* PASF buttons
				 * People also searched for
				 * PASF (button edition) (also removes other search gimmicks potentially)
				 * People also ask heading
				 * See results about right pane box
				 */
				display: none !important;
			}
			.hlcw0c { /* Always the result just before a results gimmick */
				margin-bottom: 0 !important;
			}
		`;
	}

	if(getConfig("removePills")) {
		log("Removing pills...");
		css +=`
			.IUOThf {
				display: none;
			}
			.XtQzZd {
				height: 57px;
			}
		`;
	}

	injectCss(css);
}

// Run first on all pages
function replace_de_google_sans() {
	log("Removing Google Sans...");

	let css = `
		/* Search box */
		#APjFqb, .aajZCb, #fprs, #oc-search-input, #ngram-query, #searchInput, .fontBodyMedium, .ZAGvjd, .KfXsid {
			/* Search area <textarea>,
			 * homepage suggestions dropdown
			 * "Showing results for" text
			 * Google Books search box
			 * Ngrams viewer search box
			 * Patents search box
			 * Maps search box & results
			 * News search box (placeholder and input elements' common class)
			 * News dropdown result text
			 */
			font-family: "Arial", sans-serif !important;
		}
		.UUbT9 b { /* Homepage dropdown bold suggestion text */
			font-family: unset !important;
		}
	`;

	injectCss(css);
}
