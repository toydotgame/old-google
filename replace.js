var imgclass = "lnXdpd";
var imgpos = 0;
var replacementurl = chrome.extension.getURL('resources/logo.png');
var favicon = chrome.extension.getURL('resources/favicon.ico');

var img;
var page = location.pathname;
if(page == "/" || page == "/webhp") {
	console.log("[Old Google] Page is at root. Looking for `img." + imgclass + "` and replacing.");
	img = document.getElementsByClassName(imgclass)[0];
	img.srcset = ""; // TODO: Remove the `srcset` tag entirely. (For now we'll set it to a null value)
	img.src = replacementurl;
} else if(page == "/search") {
	console.log("[Old Google] Page is at `/search`. Looking for `img[" + imgpos + "]` and replacing.");
	img = document.getElementsByTagName("img")[imgpos];
	img.src = replacementurl;
} else {
	console.log("[Old Google] Page is not known. Will not replace any images.");
}

document.getElementsByTagName("head")[0].innerHTML += '<link rel="icon" href="' + favicon + '">'; // Although this looks like boilerplate code, it isn't. There's only ever one `<head>` element. `.innerHTML +=` appends the text inside the element.

