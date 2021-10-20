# Old Google
Replaces the logo on `google.com` and on the Google search page to that of [the logo they had from 2010 to 2013](https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png), and it also changes the favicon to that of [the 2012 one](https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Google_Icon_%282010-2015%29.svg/512px-Google_Icon_%282010-2015%29.svg.png).

## Goals
* [x] Make boilerplate code at least somewhat easily update-able.
* [x] Implement favicon replacement.
* [ ] Allow plugin to only run on `www.google` and `images.google` subdomains, just in case other subdomains use similar IDs and the code is run on the wrong images unintentionally (which could potentially cause graphical errors in webpage rendering).
* [ ] Sign, package, and distribute this extension on [AMO (`addons.mozilla.org`)](https://addons.mozilla.org/).

