# Old Google
![Mozilla Add-on](https://img.shields.io/amo/users/old-google?label=Firefox%20Users) ![GitHub all releases](https://img.shields.io/github/downloads/toydotgame/old-google/total?color=blue&label=GitHub%20Downloads) ![GitHub repo size](https://img.shields.io/github/repo-size/toydotgame/old-google?label=Code%20Size) ![GitHub Release Date](https://img.shields.io/github/release-date/toydotgame/old-google?color=blue&label=Last%20Update)<br>
Replaces the logo on `google.com` and on the Google search page to that of [the logo they had from 2010 to 2013](https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png), and it also changes the favicon to that of [the 2012 one](https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Google_Icon_%282010-2015%29.svg/512px-Google_Icon_%282010-2015%29.svg.png). Works \[actually quite well\] with Google's dark theme, too.

## Goals
* [x] Implement favicon replacement.
* [x] Allow extension to only run on `www.google` subdomain, just in case other subdomains use similar IDs and the code is run on the wrong images unintentionally (which could potentially cause graphical errors in webpage rendering).
* [x] Sign, package, and distribute this extension on [AMO (`addons.mozilla.org`)](https://addons.mozilla.org/).
* [ ] Google Images support.

## Compiling for Testing
### Requirements:
* Firefox (obviously)
* Mozilla's `web-ext` tool. (Available on most Linux distributions as the `web-ext` package, or through `npm install --global web-ext` on Windows and non-supporting Linux distributions)

### Steps
1. Clone the GitHub repo:
	```sh
	git clone https://github.com/toydotgame/old-google.git
	cd old-google-logo/
	```
2. Build the code:
	```sh
	web-ext build
	```
3. Install the addon temporarily in Firefox:
	* In Firefox, go to `about:debugging`, to _This Firefox_, then under the _Temporary Extensions_ heading, click _Load Temporary Add-on..._.
	* After that, navigate to wherever you cloned the repo, then inside that `old-google-logo/` folder, find `web-ext-artifacts/`, and in that, double-click to open `old_google_logo-x.x.zip` (with `x.x` being the version number, such as _1.0_).

This way of installing the extension will cause it to be removed after you close the browser window, or when you press _Remove_ (at the bottom of the extension details box in the `about:debugging` page we were just on).
