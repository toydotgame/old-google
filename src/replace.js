/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * Contains specific methods for replacement for each search engine
 */

function Replace_Patents() {
	DebugLog("Running replacement...");
	/* Google Patents will usually use JS to replace the document body rather
	 * than redirect to unique search or homepage documents, completely unlike
	 * all other Google search engines. Therefore, we start a persistent
	 * MutationObserver to check if the URL has changed in any way, then run a
	 * generic replacement script that is safe to run on either the homepage
	 * or the search page.
	 */
	function AttemptReplace() {
		try {
			document.querySelector(".logowrap > img").src = GetResource("patents");
			document.querySelector("h1.style-scope.landing-page").remove();
			DebugLog("Logo replaced for homepage.");
			return;
		} catch(TypeError) {}
		try {
			document.querySelector(".lockup-brand.style-scope.search-header").remove();
			InjectCssAtHead(`
				.lockup-logo.search-header {
					background: no-repeat url("` + GetResource("patents") + `");
					background-size: contain;
				}
				.layout.horizontal.leftheader.style-scope.search-header {
					width: 79px;
				}
			`, true);
			DebugLog("Logo replaced for search page.");
		} catch(TypeError) {}
	}

	var currentURL = window.location.href;
	var pageChangeObserver = new MutationObserver(function(mutations, mutationInstance) {
		if(window.location.href != currentURL) {
			currentURL = window.location.href;
			RunWhenReady([".logowrap > img", ".lockup-logo"], function(loadedElement) {
				DebugLog("Page change detected. Attempting replacement...");
				AttemptReplace();
			});
		}
	});

	AttemptReplace(); // MutationObserver does nothing on its own for the first run, hence manual invocation
	pageChangeObserver.observe(document, {childList: true, subtree: true});
}

function Replace_Scholar() {
	DebugLog("Running replacement...");
	InjectCssAtHead(`
		#gs_hdr_drw_lgo, #gs_hdr_lgo {
			background: no-repeat url("` + GetResource("scholar") + `") 0 50%;
			background-size: contain;
			width: 149px;
			height: 63px;
			box-sizing: border-box;
			background-origin: content-box;
			padding: 15px;
		}
		#gs_ab_ico > .gs_ico {
			background: no-repeat url("` + GetResource("g") + `");
			background-size: contain;
		}
		#gs_hdr_hp_lgo {
			width: 276px;
		}
		#gs_hdr_hp_lgow {
			margin-bottom: 40px;
		}
	`);
	
	if(page == "/" || page == "/schhp") {
		RunWhenReady("#gs_hdr_hp_lgo", function(loadedElement) {
			loadedElement.src = GetResource("scholar");
			loadedElement.srcset = "";
		});
	}
}

function Replace_Books() {
	DebugLog("Running replacement...");
}

function Replace_Shopping() {
	DebugLog("Running replacement...");
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
