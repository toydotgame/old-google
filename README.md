# Old Google
![Mozilla Add-on](https://img.shields.io/amo/users/old-google?label=Firefox%20Users) ![GitHub all releases](https://img.shields.io/github/downloads/toydotgame/old-google/total?color=blue&label=GitHub%20Downloads) ![GitHub repo size](https://img.shields.io/github/repo-size/toydotgame/old-google?label=Code%20Size) ![GitHub Release Date](https://img.shields.io/github/release-date/toydotgame/old-google?color=blue&label=Last%20Update)

Replaces the logo on various Google search engines to that of [the logo they had from 2010 to 2013](https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png), and also changes the favicon to that of [the 2012 one](https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Google_Icon_%282010-2015%29.svg/512px-Google_Icon_%282010-2015%29.svg.png). Dark theme compatible.

<div align="center"><h1><a href="https://addons.mozilla.org/en-US/firefox/addon/old-google/">Get it here!</a></h1><br></div>

Additionally, it has some features to further age the look of your results:
* Square search boxes
* Square favicons in results
* Denser results listing
* Removal of pills row, results gimmicks, and _People also searched for_
* Redirect automatically to [`&udm=14`](https://udm14.com/) results pages
* Remove URL breadcrumbs in results and make the URL text green

### _Why does it ask for so many permissions when installing?_
You can see what sites Old Google is asking permission to run on here in the manifest:
https://github.com/toydotgame/old-google/blob/2a569a41429e769bd7f54512362faa0c207ca540/manifest.json#L53-L58

Essentially, I can't just ask for `*://*.google.*/` domain permissions because for every TLD (.com, .co.uk, .org, etc), there could be a different owner. In practice, Google owns every `google.*` domain, but in theory `google.com` and `google.co.uk` are two distinct domains who can have completely different owners. Therefore, Manifest v2 (and v3) don't allow wildcards for the TLD, meaning I have to add in a specific entry for every known google.whatever domain. Doing just `google.com` only might break if you automatically get redirected to a `google.co.uk` or something like that!

## Support
Most issue/progress tracking is done on the [Issues](https://github.com/toydotgame/old-google/issues) and [Milestones](https://github.com/toydotgame/old-google/milestones) pages respectively. The below list maintained for historical purposes.
I am open to PRs for help on features and improvements if you would like to help!

<details>
	<summary>Goals/Project TODO <b>Archive</b></summary>

* [x] Favicon replacement
	* [x] Favicon replacement based on specific site
* [x] Allow Old Google to run on TLDs other than .com. (Currently removed functionality)
* [x] Sign, package, and distribute this extension on [AMO](https://addons.mozilla.org/)
* [x] Refactor
	* [x] Remove `&tbm=isch` for SVG google logo handling as Google has removed this search page
	* [x] Rename references to "random row" to "pills"—as Google likes to call them
	* [x] Rename references to green URL fixing to proper paths to say full URL instead of breadcrumbs
	* [x] Replace arrays of query selectors with some documentation of what means what. Keep array of `browser.runtime.getURL` objects for logos instead
* [x] Optimise regular Google Search CSS injection with a single `InjectCssAtHead()` run via just concatenating CSS strings for options into one big string then just running one injection
* [x] Change options text to reflect more up-to-date functionality
* [ ] Optimise the `&udm=14` redirector by using a `browser.onBeforeRequest` or similar faster trigger
</details>

Problems with unsupported/buggy display of pages on the list below may be [planned for fixes/implementation on the update roadmap](https://github.com/toydotgame/old-google/milestones). If they're not planned on the roadmap (i.e. updates being developed actively to be released soon), then [check the Issues tab](https://github.com/toydotgame/old-google/issues). Report new display issues/bugs there if they're not reported already!

### Site support status
This includes logo replacement where possible, and custom era-appropriate favicon (if applicable; otherwise, the generic old Google Search logo will be used).
* [x] Regular Google Search, Images, etc all accessible from [Google.com](https://www.google.com/)
* [x] [Videos](https://www.google.com/videohp)
* [x] [Patents](https://patents.google.com/)
* [x] [Scholar](https://scholar.google.com/)
* [x] [Books](https://books.google.com/)
	* [x] [Ngrams Viewer](https://books.google.com/ngrams/)
* [x] [Maps](https://www.google.com/maps)
* [ ] [Finance](https://www.google.com/finance/)
* [ ] [Shopping](https://shopping.google.com/)
* [ ] [News](https://news.google.com/home)
* [ ] [Travel](https://www.google.com/travel/) (including Google Flights)
* [ ] [Trends](https://trends.google.com/trends/)
* [x] [Google Earth](https://earth.google.com/web/) (support is rudimentary due to the fact that Google Earth is mostly a canvas, which isn't within the scope I can access)

## Testing and developing
### Requirements
* Firefox (obviously)
* Mozilla's `web-ext` tool (available on most Linux distributions as the `web-ext` package, or through `npm install --global web-ext` on Windows and non-supporting Linux distributions)

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
	* In Firefox, go to `about:debugging`, to _This Firefox_, then under the _Temporary Extensions_ heading, click _Load Temporary Add-on..._
	* After that, navigate to wherever you cloned the repo, then inside that `old-google/` folder, find `web-ext-artifacts/`, and in that, double-click to open `old_google-x.x.zip`

Alternatively, you can just load the `manifest.json` file into `about:debugging` to achieve the same functionality.

### Signing
Installing the extension as per [_Steps_](#Steps) will cause it to be removed after you close the browser window because that copy of the extension is **unsigned** (for development/testing only). You can alternatively download a **signed** copy of the compiled extension from the [Releases tab](https://github.com/toydotgame/old-google/releases)
* **`old-google-x.x.xpi`** is **signed**, meaning it can be installed in `about:addons` (then _Install Addon From File..._), and will remain permanently
* **`old-google-x.x-sources.xpi`** is **unsigned**, meaning it can only be installed temporarily through `about:debugging`, and will remain loaded only for that browser session. This XPI is the same file I upload to Mozilla for them to sign and publish to AMO
