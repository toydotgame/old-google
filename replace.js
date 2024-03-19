/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * Main replacement script that handles boilerplate classes
 */

var logourl = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png";
var favicon = "https://www.w3schools.com/favicon.ico";
//var logourl = chrome.extension.getURL('resources/logo.png');
//var favicon = chrome.extension.getURL('resources/favicon.ico');

var hplogo = "lnXdpd";
var gschlogo = "jfN4p";
var ischlogo = "TYpZOd";
var hplogodiv = "k1zIA";
var sharediv = "SuUcIb";
var randrow = ["zp6Lyf", "XtQzZd"]; // Classes of actual button div and then the navbar which is left too high

RunWhenReady([document.getElementsByTagName("head")[0]], function(objects) {
	objects[0].innerHTML += '<link rel="icon" href="' + favicon + '">';
});

var subdomain = window.location.host.split('.')[0];
var page = "/" + location.pathname.split('/')[1]; // Get root-most page in a backwards-compatible-with-`location.pathname` fashion
var isch = false;
if(new URLSearchParams(window.location.search).get('tbm') == "isch") { // Query string `&tbm=isch` only present on Images results
	isch = true;
}

RunWhenReady([
	document.getElementsByClassName(hplogodiv)[0],
	document.getElementsByClassName(gschlogo)[0],
	document.getElementsByClassName(ischlogo)[0]
], function(objects) {
	Main();
});

/*
 * void Main()
 * Only called once one of the logo divs is detected to have been loaded into DOM
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
 * Replaces Google Doodles and the regular logo image with the old logo on the Google homepages
 */
function HpLogoSwap() {
	if(!(page == "/imghp" || subdomain == "images")) {
		document.getElementsByClassName(hplogodiv)[0].outerHTML = '<div style="margin-top:auto; max-height:92px;"><img class="' + hplogo + '"></div>';
	}

	document.getElementsByClassName(hplogo)[0].src = logourl;
	document.getElementsByClassName(hplogo)[0].srcset = ""; // Clear override
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
 * Replaces small logo on search pages
 * TODO: Doodle compatibility
 */
function SchLogoSwap() {
	if(!isch) {
		document.getElementsByClassName(gschlogo)[0].src = logourl;
		return;
	}
	
	document.getElementsByClassName(ischlogo)[0].outerHTML = document.getElementsByClassName(ischlogo)[0].outerHTML.replace(/svg/g, "img");
	document.getElementsByClassName(ischlogo)[0].height = "30"; // SVG proportions are 34px for some reason so override here
	document.getElementsByClassName(ischlogo)[0].src = logourl;

	// Remove random bar of buttons Google thought'd be a good idea to add:
	document.getElementsByClassName(randrow[0])[0].remove();
	document.getElementsByClassName(randrow[1])[0].style.height = "57px";
}

/*
 * void RunWhenReady(Object[] objects, function code)
 * Takes code and runs it when at least one of the input DOM elements loads.
 * TODO: Asynchronously create a new thread to run this code.
 */
function RunWhenReady(objects, code) {
	console.log(code);
	var observer = new MutationObserver(function (mutations, mutationInstance) {
		if (objects.some(obj => obj)) {
			code(objects);
			mutationInstance.disconnect();
		}
	});
	observer.observe(document, {childList: true, subtree: true});
}
