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
let lang = "en"; // Future feature for multiple language support

/* async object loadConfig()
 * Returns an object of the user's configuration (v3.1+ format). If no user
 * configuration is found, will set the user's config to the defaults and return
 * that.
 * Also handles migration from pre-v3.1 format for legacy users, and cleansing
 * unused/legacy/invalid config keys
 */
async function loadConfig() {
	let config; // Initialise as null if storage.sync.get() fails
	config = await browser.storage.sync.get();
	// If config is null, storage.sync.get() failed. If the length of the object
	// is falsy, then there's no config for this user. Ergo, if this is true and
	// truthy respectively, there must be a user config, which we return.
	// getConfig() in main.js handles missing config keys—we're just loading it
	if(config != null && Object.keys(config).length) {
		config = migrate(config);
		return config;
	}
	
	// Return defaults if no user config exists:
	for(let key in options) config[key] = options[key].default;
	await browser.storage.sync.set(config); // Save defaults to user config
	return config;
}

/* object migrate(object config)
 * Given the user's configuration (object yielded from storage.sync.get()),
 * migrates v2.x config names to v3.0 names, and migrates pre-v3.1 config
 * structure to v3.1 structure. This can be run on outdated/
 * partially-out-of-date/up-to-date config objects to ensure format
 */
function migrate(config) {
	/* void updateName(string oldKey, string newKey)
	 * Sets newKey to the value of oldKey (migrating from an old name to a new
	 * name). If newKey exists, oldKey and its value are discarded instead
	 */
	function updateName(oldKey, newKey) {
		if(!config[oldKey]) return; // oldKey doesn't exist

		log("Migrating legacy config option \"" + oldKey + "\" to \"" + newKey + "\"");
		if(!config[newKey]) config[newKey] = config[oldKey];
		delete config[oldKey];
	}

	updateName("padding", "cleanResults");
	updateName("removeRandRow", "removePills");

	// Old config options were stored as boolean[] of length 1. We only adapt
	// the entries we know are Arrays because4 they are 
	for(let key in config)
		if(Array.isArray(config[key]))
			config[key] = config[key][0];

	return config;
}

/* void setupPopup()
 * Sets up the popup HTML. Quits if called anywhere other than from popup.html's
 * toolbar window
 */
async function setupPopup() {
	if(window.location.protocol != "moz-extension:") return;

	// Get inputs from config and set "checked" value on page load:
	let config = await loadConfig();

	for(let key in config) {
		if(config[key]) {
			try {document.querySelector("#" + key).checked = true}
			catch(TypeError) {
				log("Invalid config option \"" + key + "\"!", "error");
			}
		}
	}

	// Event listen for check changes and save to config:
	for(let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener("change", ()=>{
			// inputs[i].id|checked is evaluated at event dispatch time, so each
			// input does correctly get their respective storage.sync.set() cmd:
			browser.storage.sync.set({[inputs[i].id]: inputs[i].checked});
		});
	}

	// Set the text contents of elements on the page:
	for(let i = 0; i < inputs.length; i++) {
		let id = inputs[i].id;
		let label = document.querySelector('label[for="' + id + '"]');
		if(label) label.innerHTML = options[id].text[lang]; // Not unsafe because the options object is hardcoded
	}
	document.querySelector("#versionString").textContent = "v" + browser.runtime.getManifest().version;
}

setupPopup();
