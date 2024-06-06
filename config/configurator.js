/*
 * AUTHOR: toydotgame
 * CREATED ON: 2024-06-06
 * Event listener for checkbox changes and save/load functionality
 * for user preferences
 */

var inputs = document.querySelectorAll("input");

/*
 * async void RestoreOptions()
 * Fetches user preferences from synced browser storage and sets the checkboxes
 * in the HTML accordingly
 */
async function RestoreOptions() {
	var config = await browser.storage.sync.get().then((result) => {
		var values = Object.entries(result);
		for(var i = 0; i < values.length; i++) {
			values[i][1] = values[i][1][0];
		}
		return values;
	});
	if(config == null || config.length == 0) { // Set all config options to true if no config exists
		for(var i = 0; i < inputs.length; i++) {
			document.querySelector("#" + inputs[i].id).checked = true;
			browser.storage.sync.set({
				[inputs[i].id]: [inputs[i].checked] // For whatever reason setting it to `true` doesn't work
			});
		}
	} else { // If config exists, just set checked state of <input>s
		for(var i = 0; i < config.length; i++) {
			if(config[i][1] == true) {
				document.querySelector("#" + config[i][0]).checked = true;
			}
		}
	}
}

// Get inputs from config and set "checked" value on page load:
document.addEventListener("DOMContentLoaded", RestoreOptions);

// Event listen for check changes and save to config:
for(var i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener("change", function() {
		browser.storage.sync.set({
			[this.id]: [this.checked]
		});
	});
}
