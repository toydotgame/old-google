var imgclass = "lnXdpd";
var imgpos = 0;
var replacementurl = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png";

var img;
var page = location.pathname;
if(page == "/" || page == "/webhp") {
	console.log("[Old Google] Page is at root. Looking for `img.lnXdpd` and replacing.");
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
