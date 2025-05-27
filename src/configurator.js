/*
 * AUTHOR: toydotgame
 * CREATED ON: 2024-06-06
 * Listens to checkbox state changes in the toolbar window and updates storage.
 * Because this is called by a <script> tag in popup.html that is placed AFTER
 * the page content, we can run right away with the assumption the page elements
 * are all loaded (because they are)
 */

let inputs = document.querySelectorAll("input");

/* 
 * async void loadConfig()
 * Loads the plugin config into the previously declared `config` array.
 * Bodges in defaults if no config is found
 */
async function loadConfig() {
	let config; // Initialise as null if storage.sync.get() fails to download
	config = await browser.storage.sync.get().then(result => {
		let values = Object.entries(result);
		for(let i = 0; i < values.length; i++)
			values[i] = {"id": values[i][0], "value": values[i][1][0]};
		return values;
	});
	if(config != null && config.length > 0) return config;
	
	// Default settings: (if no user config exists)
	browser.storage.sync.set({
		greenUrls:             [true],
		cleanResults:          [true],
		peopleAlsoSearchedFor: [true],
		removePills:           [true],
		squareBox:             [true],
		udm14:                 [false]
	});
	return [
		{"id": "greenUrls",             "value": true},
		{"id": "cleanResults",          "value": true},
		{"id": "peopleAlsoSearchedFor", "value": true},
		{"id": "removePills",           "value": true},
		{"id": "squareBox",             "value": true},
		{"id": "udm14",                 "value": false}
	];
}

if(window.location.protocol == "moz-extension:") { // Only run active code if its within the addon popup window
	// Get inputs from config and set "checked" value on page load:
	document.addEventListener("DOMContentLoaded", async ()=>{
		let config = await loadConfig();

		for(let i = 0; i < config.length; i++) {
			if(config[i].value) {
				try {document.querySelector("#" + config[i].id).checked = true}
				catch(TypeError) { // ID of found option is a legacy name not in use on the popup:
					log("User has legacy config option \"" + config[i].id + "\" in their browser! This will be ignored.", "warn");
				}
			}
		}
	});

	// Event listen for check changes and save to config:
	for(let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener("change", ()=>{
			browser.storage.sync.set({[this.id]: [this.checked]});
		});
	}

	document.querySelector("#versionString").textContent = "v" + browser.runtime.getManifest().version;
}
