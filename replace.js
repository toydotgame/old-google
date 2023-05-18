var imgclass = "lnXdpd";
var headerbgclass = "rISBZc";
var homedoodleclass = "ddlsv-svCta_";
var replacementurl = chrome.extension.getURL('resources/logo.png');
var favicon = chrome.extension.getURL('resources/favicon.ico');

document.getElementsByTagName("head")[0].innerHTML += '<link rel="icon" href="' + favicon + '">'; // Appends a HTML-based favicon to the `<head>` element.

var page = location.pathname; // Putting `location.pathname` in the `if()` causes a reload. Declaring it seperately does not cause a reload.
if(page == "/" || page == "/webhp" || page == "/imghp") {
	var img = document.getElementsByClassName(imgclass)[0];
	if(img == null) {
		img = document.getElementsByClassName(homedoodleclass)[0];
		img.style.background = "url(\"" + replacementurl + "\") no-repeat scroll 0% 0%";
	} else {
		img.srcset = "";
		img.src = replacementurl;
	}
} else if(page == "/search") { // Seperate code needs to be run for the search page, as the image is used in a completely different way by Google.
	var headerbg = document.querySelectorAll('.' + headerbgclass + ':not(#dimg_1)')[0];
	if(headerbg != null) {
		headerbg.remove();
	}
	
	// Replace svg logo used on the image search page.
	document.getElementsByTagName("svg")[0].outerHTML = '<img class="jfN4p" src="logo" style="background:none" alt="Google" data-atf="1" data-frt="0" width="92" height="30">';
	
	// Change logo's image source
	var img = document.getElementsByTagName("img")[0];
	img.src = replacementurl;
}