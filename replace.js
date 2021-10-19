var imgclass = "lnXdpd";
var replacementurl = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png";

var img = document.getElementsByClassName(imgclass)[0];
img.srcset = ""; // TODO: Remove the `srcset` tag entirely. (For now we'll set it to a null value)
img.src = replacementurl;

