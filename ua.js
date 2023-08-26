      chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
	if(isRootPage(details.url) {
          for (var i = 0; i < details.requestHeaders.length; i++) {
            if (details.requestHeaders[i].name.toLowerCase() === "user-agent") {
              details.requestHeaders[i].value = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
            }
          }
          return { requestHeaders: details.requestHeaders };
        }
	},
        { urls: [details.url] },
        ["blocking", "requestHeaders"]
      );

function isRootPage(url) {
  var urlObj = new URL(url);
//  return urlObj.pathname === "/" || urlObj.pathname === "/webhp" || urlObj.pathname === "/imghp";
replace = urlObj.pathname === "/" || urlObj.pathname === "/webhp" || urlObj.pathname === "/imghp";
//search = urlObj.pathname === "/search";
alert("pathname: " + urlObj.pathname + ", pathname (split): " + urlObj.pathname.split('/')[1] + ", replacement: " + replace);
return replace;
}


