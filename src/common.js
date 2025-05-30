/*
 * AUTHOR: toydotgame
 * CREATED ON: 2025-05-27
 * Common functions inherited by all other scripts in this addon
 */

// Enables debug logging. Should be false in packed copies of this extension:
const DEBUG = false;

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
	"removeSearchButton": {
		"text": {
			"en": "Remove the search button from the end of the search box"
		},
		"default": false
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
let subdomain, page, udm;
let config, configFailed = false;
let runningObservers = {
	"schedule": false,  // schedule() observers
	"continuous": false // Indefinite observers from replace.js
};

/* void log(string message, string? type, string? trace, boolean? ignoreDebug)
 * Fancy console.log() wrapper that only prints if the DEBUG const is true.
 * Prints an Old Google prefix alongside background colours for log types, and
 * a function/call trace to where this log was triggered from. Logs of type
 * "info" cannot have a trace—automatic nor manual
 * - type can be "log", "info", "warn", or "error". Defaults to "log"
 * - trace is a manual override for the auto-generated trace. Leaving it
 *   undefined auto-generates the trace. Leaving it as an empty string will
 *   prevent printing of the trace regardless of `type`
 * - ignoreDebug, when true, will print always regardless of the DEBUG state.
 *   Defaults to "false" (normal behaviour). An ignoreDebug message will be sent
 *   without a stack trace
 */
function log(message, type="log", trace=undefined, ignoreDebug=false) {
	if(!DEBUG && !ignoreDebug) return;

	let color = {
		"fg": "unset",
		"bg": "unset",
		"presets": {
			// Source: https://firefox-source-docs.mozilla.org/devtools-user/devtoolscolors/index.html
			"log": "unset",
			"info": "#4d90fe64",
			"warn": "#e5e60064", // -40% lightness
			"error": "#eb536864",
			"success": "#70bf5364",
			// Non-Mozilla palette:
			"googleblue": "#4d90fe",
			"gray": "#222222",
			"white": "#ffffff"
		}		
	};
	let css = {
		get reset() {
			return "color:reset;background-color:reset;";
		},
		get logo() {
			return "color:" + color.presets.gray + ";background-color:" + color.presets.googleblue + ";";
		},
		get logotext() {
			return "color:" + color.presets.white + ";background-color:" + color.presets.googleblue + ";";
		},
		get currentType() {
			return "color:unset;background-color:" + color.presets[type] + ";";
		}
	};

	if(trace == undefined) trace = getCaller(); // Returns "NOT DEBUGGING" if !DEBUG
	if(trace != "")        trace = "\n\n%c" + trace;
	if(type == "info"      // Make sure no trace is providable for info-based logs:
	|| type == "success"
	|| trace == ""
	|| ignoreDebug)        trace = "%c";

	console.log(
		"%c[%cOld Google%c]%c %c" + message + trace,
		css.logo, css.logotext, css.logo, // Prefix styles
		css.reset, css.currentType,       // Message styles
		css.reset                         // Caller styles:
		+ "font-size:9px;"
		+ "color:" + color.presets.googleblue + ";" 
		+ "background-color:" + color.presets.white + "11;"
		+ "text-decoration:underline;"
	);
}

/* string getCaller(boolean? verbose, number? level)
 * Returns a trace of the format:
 *     <module>.js:<ln>:<col>
 * or:
 *     <function>(), <module>.js:<ln>:<col>
 * - verbose defaults to false, but when true it prints a full stack trace
 * - level refers to the number of levels up from the call the trace should be
 *   referring to, e.g. calling GetCaller(0) in function foo() returns a trace
 *   pointing within foo() (so no levels up), getCaller(0) refers to whomever
 *   called foo(), etc. Defaults to 1
 */
function getCaller(level=1, verbose=false) {
	if(!DEBUG) return "NOT DEBUGGING";
	
	level++; let caller = "", trace, funct;
	let error = (new Error).stack.split("\n");
	/* string FormatLine(number index)
	 * Given the stack trace in `error` is an array of lines, FormatLine(index)
	 * formats the JS trace in the Old Google debug style, returning the trace
	 * at level `index`
	 */
	function FormatLine(i) {
		// Throw an error and use its stack trace to get line called from:
		trace = error[i].split("/");
		funct = trace[0].split("@")[0];
		if(funct) funct += "(), ";
		return funct + trace[4];
	}

	if(verbose)
		for(let i = level; i < error.length-1; i++) caller += FormatLine(i) + "\n";
	else caller = FormatLine(level);
	return caller;
}
