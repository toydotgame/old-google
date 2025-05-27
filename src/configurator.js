/*
 * AUTHOR: toydotgame
 * CREATED ON: 2024-06-06
 * Listens to checkbox state changes in the toolbar window and updates storage.
 * Used primarily for user configuration in that popup, but also provides some
 * functions used in other modules for config loading and handling.
 * 
 * Because this is called by a <script> tag in popup.html that is placed AFTER
 * the page content, we can run right away with the assumption the page elements
 * are all loaded (because they are)
 */

let inputs = document.querySelectorAll("input");
let options = {
	"greenUrls": {
		"text": {
			"en": "Remove breadcrumbs and restore classic text colours"
		},
		"default": true
	},
	"removePills": {
		"text": {
			"en": "Remove pills row from the top of results"
		},
		"default": true
	},
	"squareBox": {
		"text": {
			"en": "Make search boxes & results favicons square"
		},
		"default": true
	},
	"cleanResults": {
		"text": {
			"en": "Decrease padding between results and remove useless results gimmicks"
		},
		"default": true
	},
	"peopleAlsoSearchedFor": {
		"text": {
			"en": "Remove \"People also searched for\""
		},
		"default": true
	},
	"udm14": {
		"text": {
			"en": "Auto-redirect general searches to <code>&udm=14</code> (Google's <i>Web</i> search filter)"
		},
		"default": false
	}
};
let lang = "en"; // Future feature for multiple language support

/* async void loadConfig()
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

/* void setupPopup()
 * Sets up the popup HTML. Quits if called anywhere other than from popup.html's
 * toolbar window
 */
function setupPopup() {
	if(window.location.protocol != "moz-extension:") return;

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

	// Set the text contents of elements on the page:
	for(let i = 0; i < inputs.length; i++) {
		let id = inputs[i].id;
		let label = document.querySelector('label[for="' + id + '"]');
		console.log("id: " + id + ", label: " + label + ", content: " + options[id].text[lang]);
		if(label) label.innerHTML = options[id].text[lang]; // Not unsafe because the options object is hardcoded
	}
	document.querySelector("#versionString").textContent = "v" + browser.runtime.getManifest().version;
}

setupPopup();
