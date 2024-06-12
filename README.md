# Old Google
![Mozilla Add-on](https://img.shields.io/amo/users/old-google?label=Firefox%20Users) ![GitHub all releases](https://img.shields.io/github/downloads/toydotgame/old-google/total?color=blue&label=GitHub%20Downloads) ![GitHub repo size](https://img.shields.io/github/repo-size/toydotgame/old-google?label=Code%20Size) ![GitHub Release Date](https://img.shields.io/github/release-date/toydotgame/old-google?color=blue&label=Last%20Update)

Replaces the logo on various Google search engines to that of [the logo they had from 2010 to 2013](https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png), and also changes the favicon to that of [the 2012 one](https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Google_Icon_%282010-2015%29.svg/512px-Google_Icon_%282010-2015%29.svg.png). Dark theme compatible.

Additionally, it has some features to further age the look of your results:
* Square search boxes
* Square favicons in results
* Denser results listing
* Removal of pills row, results gimmicks, and _People also searched for_
* Redirect automatically to [`&udm=14`](https://udm14.com/) results pages
* Remove URL breadcrumbs in results and make the URL text green

### Supported Search Engines
* Google
* Google Images
* Google Videos
* Google Scholar
* Google Patents
* Google Books
	* Books Ngram Viewer
* Google Maps
* Google Finance
* Google News
* Google Shopping
* Google Travel
* Google Trends

## Goals/Project TODO
I am open to PRs for help on features and improvements if you would like to help!
* [x] Favicon replacement.
    * [ ] Favicon replacement based on specific site.
* [x] Allow Old Google to run on TLDs other than .com. (Currently removed functionality)
* [x] Sign, package, and distribute this extension on [AMO](https://addons.mozilla.org/).
* [x] Google Images support.
    * [x] [Additional Google search engines support.](https://github.com/toydotgame/old-google/issues/10)
    * [x] Google Doodle support.
	    * [x] Google Doodle search page support.
* [ ] Refactor.
    * [ ] Remove `&tbm=isch` for SVG google logo handling as Google has removed this search page.
    * [ ] Rename references to "random row" to "pills"—as Google likes to call them.
    * [ ] Rename references to green URL fixing to proper paths to say full URL instead of breadcrumbs.
    * [ ] Replace arrays of query selectors with some documentation of what means what. Keep array of `browser.runtime.getURL` objects for logos instead.

## Compiling for Testing
### Requirements:
* Firefox (obviously)
* Mozilla's `web-ext` tool. (Available on most Linux distributions as the `web-ext` package, or through `npm install --global web-ext` on Windows and non-supporting Linux distributions)

### Steps
1. Clone the GitHub repo:
	```sh
	git clone https://github.com/toydotgame/old-google.git
	cd old-google/
	```
2. Build the code:
	```sh
	web-ext build
	```
3. Install the addon temporarily in Firefox:
	* In Firefox, go to `about:debugging`, to _This Firefox_, then under the _Temporary Extensions_ heading, click _Load Temporary Add-on..._.
	* After that, navigate to wherever you cloned the repo, then inside that `old-google/` folder, find `web-ext-artifacts/`, and in that, double-click to open `old_google-x.x.zip`.

This way of installing the extension will cause it to be removed after you close the browser window.

Alternatively, you can just load the `manifest.json` file into `about:debugging` to achieve the same functionality.
