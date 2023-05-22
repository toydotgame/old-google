/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * Main replacement script that handles boilerplate classes.
 */

var logourl = chrome.extension.getURL('resources/logo.png');
var favicon = chrome.extension.getURL('resources/favicon.ico');

var hplogo = "lnXdpd";
var gschlogo = "jfN4p";
var ischlogo = "TYpZOd";
var hplogodiv = "k1zIA";
var doodlestyle = "LLD4me";
var sharediv = "SuUcIb";

document.getElementsByTagName("head")[0].innerHTML += '<link rel="icon" href="' + favicon + '">';

var subdomain = window.location.host.split('.')[0];
var page = "/" + location.pathname.split('/')[1]; // Get root-most page in a backwards-compatible-with-`location.pathname` fashion.
var isch = false;
if(new URLSearchParams(window.location.search).get('tbm') == "isch") { // Query string `&tbm=isch` only present on Images results.
	isch = true;
}

switch(page) {
	case "/":
	case "/webhp":
	case "/imghp":
		HpLogoSwap();
		break;
	case "/search":
		SchLogoSwap();
	
}

/*
 * void HpLogoSwap()
 * Replaces Google Doodles and the regular logo image with the old logo on the Google homepages.
 * Throws TypeError (on non-Doodle days) as it tries to replace Doodles without validation.
 */
function HpLogoSwap() {
	console.log("hplogo");
	if(!(page == "/imghp" || subdomain == "images")) {
		document.getElementsByClassName(hplogodiv)[0].outerHTML = '<img class="' + hplogo + '">';
	}
	
	document.getElementsByClassName(hplogo)[0].src = logourl;
	document.getElementsByClassName(hplogo)[0].srcset = ""; // Clear override.
	// Override Doodle size styles:
	document.getElementsByClassName(doodlestyle)[0].classList.remove(doodlestyle);
	document.getElementsByClassName(hplogo)[0].width = "272";
	document.getElementsByClassName(hplogo)[0].height = "92";
	// Remove Doodle share button:
	document.getElementsByClassName(sharediv)[0].remove();
}

/*
 * void SchLogoSwap()
 * Replaces small logo on search pages.
 * TODO: Doodle compatibility.
 */
function SchLogoSwap() {
	console.log("splogo")
	if(!isch) {
		document.getElementsByClassName(gschlogo)[0].src = logourl;
		return;
	}
	
	console.log("isch running");
	document.getElementsByClassName(ischlogo)[0].outerHTML = document.getElementsByClassName(ischlogo)[0].outerHTML.replace(/svg/g, "img");
	document.getElementsByClassName(ischlogo)[0].height = "30"; // SVG proportions are 34px for some reason so override here.
	document.getElementsByClassName(ischlogo)[0].src = logourl;
}

