/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * Main replacement script that handles boilerplate classes.
 */

var logourl = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png";
var favicon = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Google_Icon_%282010-2015%29.svg/512px-Google_Icon_%282010-2015%29.svg.png";
//var logourl = chrome.extension.getURL('resources/logo.png');
//var favicon = chrome.extension.getURL('resources/favicon.ico');

var hplogo = "lnXdpd";
var gschlogo = "jfN4p";
var ischlogo = "TYpZOd";
var hplogodiv = "k1zIA";
var sharediv = "SuUcIb";
var randrow = ["zp6Lyf", "XtQzZd"]; // Classes of actual button div and then the navbar which is left too high.

const favicon_obs = new MutationObserver(function (mutations, mutationInstance) {
	if (document.getElementsByTagName("head")[0]) {
		document.getElementsByTagName("head")[0].innerHTML += '<link rel="icon" href="' + favicon + '">';
		mutationInstance.disconnect();
	}
});
favicon_obs.observe(document, {childList: true, subtree: true});

var subdomain = window.location.host.split('.')[0];
var page = "/" + location.pathname.split('/')[1]; // Get root-most page in a backwards-compatible-with-`location.pathname` fashion.
var isch = false;
if(new URLSearchParams(window.location.search).get('tbm') == "isch") { // Query string `&tbm=isch` only present on Images results.
	isch = true;
}

const logo_obs = new MutationObserver(function (mutations, mutationInstance) {
	var obs_hplogo = document.getElementsByClassName(hplogodiv)[0];
	var obs_gschlogo = document.getElementsByClassName(gschlogo)[0];
	var obs_ischlogo = document.getElementsByClassName(ischlogo)[0];
	if (obs_hplogo || obs_gschlogo || obs_ischlogo) {
		Main();
		mutationInstance.disconnect();
	}
});
logo_obs.observe(document, {childList: true, subtree: true});

/*
 * void Main()
 * Only called once one of the logo divs is detected to have been loaded into DOM.
 */
function Main() {
	switch(page) {
		case "/":
		case "/webhp":
		case "/imghp":
			HpLogoSwap();
			break;
		case "/search":
			SchLogoSwap();
	}
}

/*
 * void HpLogoSwap()
 * Replaces Google Doodles and the regular logo image with the old logo on the Google homepages.
 */
function HpLogoSwap() {
	if(!(page == "/imghp" || subdomain == "images")) {
		document.getElementsByClassName(hplogodiv)[0].outerHTML = '<div style="margin-top:auto; max-height:92px;"><img class="' + hplogo + '"></div>';
	}

	document.getElementsByClassName(hplogo)[0].src = logourl;
	document.getElementsByClassName(hplogo)[0].srcset = ""; // Clear override.
	// Override Doodle size styles:
	document.getElementsByClassName(hplogo)[0].width = "272";
	document.getElementsByClassName(hplogo)[0].height = "92";
	// Remove share button (only present on Doodles):
	try {
		document.getElementsByClassName(sharediv)[0].remove();
	} catch(TypeError) {}
}

/*
 * void SchLogoSwap()
 * Replaces small logo on search pages.
 * TODO: Doodle compatibility.
 */
function SchLogoSwap() {
	if(!isch) {
		document.getElementsByClassName(gschlogo)[0].src = logourl;
		return;
	}
	
	document.getElementsByClassName(ischlogo)[0].outerHTML = document.getElementsByClassName(ischlogo)[0].outerHTML.replace(/svg/g, "img");
	document.getElementsByClassName(ischlogo)[0].height = "30"; // SVG proportions are 34px for some reason so override here.
	document.getElementsByClassName(ischlogo)[0].src = logourl;

	// Remove random bar of buttons Google thought'd be a good idea to add:
	document.getElementsByClassName(randrow[0])[0].remove();
	document.getElementsByClassName(randrow[1])[0].style.height = "57px";
}

