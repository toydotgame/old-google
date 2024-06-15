/*
 * AUTHOR: toydotgame
 * CREATED ON: 2024-06-06
 * Listens to checkbox state changes in the toolbar window and updates storage
 */

var inputs = document.querySelectorAll("input");

/* 
 * async void LoadConfig()
 * Loads the plugin config into the previously declared `config` array.
 * Bodges in defaults if no config is found
 */
async function LoadConfig() {
	var config;
	config = await browser.storage.sync.get().then((result) => {
		var values = Object.entries(result);
		for(var i = 0; i < values.length; i++) {
			values[i] = {"id": values[i][0], "value": values[i][1][0]}
		}
		return values;
	});
	if(config == null || config.length == 0) {
		browser.storage.sync.set({
			greenUrls: [true],
			padding: [true],
			peopleAlsoSearchedFor: [true],
			removeRandRow: [true],
			squareBox: [true],
			udm14: [false]
		});
		config = [
			{"id": "greenUrls",                "value": true  },
			{"id": "padding",                  "value": true  },
			{"id": "peopleAlsoSearchedFor",    "value": true  },
			{"id": "removeRandRow",            "value": true  },
			{"id": "squareBox",                "value": true  },
			{"id": "udm14",                    "value": false }
		];
	}
	return config;
}

if(window.location.protocol == "moz-extension:") { // Only run active code if its within the addon popup window
	// Get inputs from config and set "checked" value on page load:
	document.addEventListener("DOMContentLoaded", async function () {
		var config = await LoadConfig();
		
		for(var i = 0; i < config.length; i++) {
			if(config[i][1] == true) {
				document.querySelector("#" + config[i][0]).checked = true;
			}
		}
	});

	// Event listen for check changes and save to config:
	for(var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener("change", function() {
			browser.storage.sync.set({
				[this.id]: [this.checked]
			});
		});
	}
}
