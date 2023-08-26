chrome.webNavigation.onBeforeNavigate.addListener(
  function(details) {
    if (isRootPage(details.url)) {
      chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
          for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === "User-Agent") {
              details.requestHeaders[i].value = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
              break;
            }
          }
          return { requestHeaders: details.requestHeaders };
        },
        { urls: [details.url] },
        ["blocking", "requestHeaders"]
      );
    }
  }
);

function isRootPage(url) {
  var urlObj = new URL(url);
  // The location.pathname.split() stability option is unavailable here. Fallback:
  return urlObj.pathname === "/" || urlObj.pathname === "/webhp" || urlObj.pathname === "/imghp";
}

