var tabkitGlobal = new function _tabkitGlobal() { // Primarily just a 'namespace' to hide our stuff in

    //|##########################
    //{### Basic Constants
    //|##########################
    
    /// Private globals:
    const tkGlobal = this;
    
    const PREF_BRANCH = "extensions.tabkit.";
    
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    
    const Cc = Components.classes;
    const Ci = Components.interfaces;

    //}##########################
    //{### Services
    //|##########################
    
    // Make sure we can use gPrefService from now on (even if this isn't a browser window!)
    if (typeof gPrefService == "undefined" || !gPrefService)
        gPrefService = Cc["@mozilla.org/preferences-service;1"].
                       getService(Ci.nsIPrefBranch);
    
    /// Private globals:
    var _console = Cc["@mozilla.org/consoleservice;1"]
                   .getService(Ci.nsIConsoleService);
    
    var _prefs = Cc["@mozilla.org/preferences-service;1"]
                 .getService(Ci.nsIPrefService)
                 .getBranch(PREF_BRANCH);

    //}##########################
    //{### Utility Functions
    //|##########################
    
    // A log of all reported errors is kept, in case the Error Console loses them!
    this.logs = {
        dump: [],
        log: [],
        debug: []
    };

    // For errors or warnings, with automatic line numbers, call stack, etc.
    this.dump = function dump(error, actualException) {
        try {
            if (_prefs.getBoolPref("debug")) {
                var scriptError = Cc["@mozilla.org/scripterror;1"].
                                  createInstance(Ci.nsIScriptError);

                if (!actualException && typeof error == "object")
                    actualException = error;
                var haveException = actualException ? true : false;
                if (haveException && actualException.stack) {
                    var stack = actualException.stack;
                }
                else {
                    var stack = new Error().stack; // Get call stack (could use Components.stack.caller instead)
                    stack = stack.substring(stack.indexOf("\n", stack.indexOf("\n")+1)+1); // Remove the two lines due to calling this
                }
                var message = 'TK Error: "' + error + '"\nat:\u00A0' + stack.replace("\n@:0", "").replace(/\n/g, "\n      "); // \u00A0 is a non-breaking space
                var sourceName   = (haveException && "fileName"     in actualException && actualException.fileName)     ? actualException.fileName     : Components.stack.caller.filename;
                var sourceLine   = (haveException && "sourceLine"   in actualException && actualException.sourceLine)   ? actualException.sourceLine   : Components.stack.caller.sourceLine; // Unfortunately this is probably null
                var lineNumber   = (haveException && "lineNumber"   in actualException && actualException.lineNumber)   ? actualException.lineNumber   : Components.stack.caller.lineNumber; // error.lineNumber isn't always accurate, unfortunately - sometimes might be better to just ignore it
                var columnNumber = (haveException && "columnNumber" in actualException && actualException.columnNumber) ? actualException.columnNumber : 0;
                var flags = haveException ? scriptError.errorFlag : scriptError.warningFlag;
                var category = "JavaScript error"; // TODO-P6: Check this
                scriptError.init(message, sourceName, sourceLine, lineNumber, columnNumber, flags, category);
                tkGlobal.logs.dump.push(scriptError);
                _console.logMessage(scriptError);
            }
            else {
                tkGlobal.logs.dump.push(String(error) + "\n" + tkGlobal.quickStack());
            }
        }
        catch (ex) {
        }
    };
    
    // For logging information (no line numbers, call stack, etc.)
    this.log = function log(message) {
        try {
            tkGlobal.logs.log.push(message);
            if (_prefs.getBoolPref("debug")) {
                var msg = "TK: " + message;
                _console.logStringMessage(msg);
            }
        }
        catch (ex) {
        }
    };
    
    this.startsWith = function startsWith(str, start) {
        return str.indexOf(start) == 0;
    };
    
    this.quickStack = function quickStack() {
        // Intended mainly for outputting to the console
        var func = arguments.callee.caller.caller;
        var stack = "";
        for (var i = 1; func && i < 8; i++) {
            stack += " " + i + ". " + func.name;
            func = func.caller;
        }
        return stack;
    };

    //}##########################
    //{### Initialisation
    //|##########################
    
    /// Globals:
    this.globalPreInitListeners = [
    ];
    
    /// Methods:
    this.tryListener = function tryListener(type, listener, event) {
        try {
            listener(event);
        }
        catch (ex) {
            var listenerString = "name" in listener ? listener.name : listener.toSource().substring(0, 78);
            tkGlobal.dump(type + " listener '" + listenerString + "' failed with exception:\n" + ex, ex);
        }
    };

    /// Event Listeners:
    /* This gets called from:
     * chrome://browser/content/browser.xul,
     * chrome://browser/content/bookmarks/bookmarksManager.xul,
     * chrome://browser/content/bookmarks/bookmarksPanel.xul,
     * chrome://browser/content/history/history-panel.xul, and
     * chrome://browser/content/places/places.xul
     */
    this.onDOMContentLoaded_global = function onDOMContentLoaded_global(event) {
        if (event.originalTarget != document)
            return;
        
        window.removeEventListener("DOMContentLoaded", tkGlobal.onDOMContentLoaded_global, false);

        // Run module global early initialisation code (before any init* listeners, and before most extensions):
        // In browser windows, this could happen before or after tk.preInitListeners
        for each (var listener in tkGlobal.globalPreInitListeners) {
            tkGlobal.tryListener("DOMContentLoaded_global", listener, event);
        }
    };

    //}##########################
    //{### Method Hooks
    //|##########################

    /// Methods:
	/* parameter: length 3 array
	hook[0] : full path for the method
	hook[1] : old code
	hook[2] : new code, use $& for writing old code(instead of copying)*/
    this.addMethodHook = function addMethodHook(hook) {
        try {
			if (hook.length != 3)
				tk.dump("Who is so silly to use addMethodHook without reading the description!", null);return;
			
			var namespaces = hook[0].split(".");

			try {
				// try to get the target function without eval
				var object = window;
				while (namespaces.length > 1) {
					object = object[namespaces.shift()];
				}
			}
			catch (e) {
			  throw TypeError(hook[0] + " is not a function");
			}
			// Make backup, if requested
			// if (hook[1])
				// window[hook[1]] + "=" + hook[0]);
				
			// var code = eval(hook[0] + ".toString()");
			var method = namespaces.pop();
			var code = object[method].toString();
			
			var newCode = code.replace(hook[1], hook[2]);
			if (newCode == code) {
				tk.log("Method hook of \"" + hook[0] + "\" had no effect, when replacing:\n" + uneval(hook[1]) + "\nwith:\n" + uneval(hook[2]));
			}
			else {
				eval(hook[0]+"="+newCode);
			}
		}
		catch (ex) {
			tk.dump("Method hook of \"" + hook[0] + "\" failed with exception:\n" + ex, ex);
		}
    };

    // TODO=P4: prepend/append/wrapMethodCode could be done without modifying the actual method to preserve closures
    this.prependMethodCode = function prependMethodCode(methodname, codestring) {
        tkGlobal.addMethodHook([methodname, '{', '{' + codestring]);
    };

    this.appendMethodCode = function appendMethodCode(methodname, codestring) {
        tkGlobal.addMethodHook([methodname, /\}$/, codestring + '}']);
    };

    this.wrapMethodCode = function wrapMethodCode(methodname, startcode, endcode) {
        //tkGlobal.addMethodHook([methodname, /\{([^]*)\}$/, '{' + startcode + '$&' + endcode + '}']);
        tkGlobal.addMethodHook([methodname, '{', '{' + startcode, /\}$/, endcode + '}']);
    };

    //}##########################
    //{>>> Sorting & Grouping
    //|##########################
    
    this.globalPreInitSortingAndGroupingMethodHooks = function globalPreInitSortingAndGroupingMethodHooks(event) {
        if ("BookmarksCommand" in window) { // [Fx2only] // TODO=P4: Fx3: bookmarks are now unrelated - does that matter?
            tkGlobal.wrapMethodCode(
                'BookmarksCommand.openOneBookmark',
                'var topWin; if (aTargetBrowser.indexOf("tab") != -1) topWin = getTopWin(); if (topWin && topWin.tabkit) topWin.tabkit.addingTab("bookmark"); try {',
                '} finally { if (topWin && topWin.tabkit) topWin.tabkit.addingTabOver(); }'
            );
            
            tkGlobal.addMethodHook([
                'BookmarksCommand.openGroupBookmark',
				
                'if (aTargetBrowser == "current" || aTargetBrowser == "tab") {',
                'if (aTargetBrowser == "current" || aTargetBrowser == "tab") { \
                    var URIs = []; \
                    while (containerChildren.hasMoreElements()) { \
                       var res = containerChildren.getNext().QueryInterface(kRDFRSCIID); \
                        var target = BMDS.GetTarget(res, urlArc, true); \
                        if (target) \
                            URIs.push(target.QueryInterface(kRDFLITIID).Value); \
                    } \
                    var browser = w.document.getElementById("content"); \
                    var loadInBackground = PREF.getBoolPref("browser.tabs.loadBookmarksInBackground"); \
                    var replace = (aTargetBrowser == "current"); \
                    try { \
                        w.tabkit.isBookmarkGroup = true; \
                    } \
                    catch (ex) {} \
                    browser.loadTabs(URIs, loadInBackground, replace); \
                } \
                else if (false) {'
            ]);
        }
    };
    this.globalPreInitListeners.push(this.globalPreInitSortingAndGroupingMethodHooks);

    //}##########################
    //{=== New tabs by default
    //|##########################
    
    this.globalPreInitNewTabsByDefault = function globalPreInitNewTabsByDefault(event) {
    if ("PlacesUIUtils" in window) { // [Fx3+]
        tkGlobal.addMethodHook([//{
            'PlacesUIUtils.openNodeWithEvent',
			
            'this._openNodeIn(aNode, window.whereToOpenLink(aEvent), window);',
            'this._openNodeIn(aNode, window.whereToOpenLink(aEvent), window, aEvent);'
        ]);//}
        tkGlobal.addMethodHook([//{
            'PlacesUIUtils._openNodeIn',
			
            'openUILinkIn(aNode.uri, aWhere);',
            'if (arguments.length == 4 && gPrefService.getBoolPref("extensions.tabkit.openTabsFrom.places")) { \
                if (aWhere == "tab" || /^\\s*javascript:/.test(aNode.uri)) { \
                    aWhere = "current"; \
                } \
                else { \
                    var w = getTopWin(); \
                    var browser = w ? w.getBrowser().mCurrentTab.linkedBrowser : w; \
                    if (aWhere == "current"\
                         && (!browser \
                         || browser.webNavigation.currentURI.spec != "about:blank" \
                         || browser.webProgress.isLoadingDocument)) \
                    { \
                        aWhere = "tab"; \
                    } \
                } \
            } \
            $&'
        ]);//}
    }
    };
    // this.globalPreInitListeners.push(this.globalPreInitNewTabsByDefault);

    //}##########################
    //|##########################

}