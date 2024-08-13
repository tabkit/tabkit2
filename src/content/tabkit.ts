
/* Tab Kit 2
 *
 * Copyright (c) 2007-2010 John Mellor
 * Copyright (c) 2011-2012 Leung Ho Kuen <pikachuexe@gmail.com>
 *
 * This file is part of Tab Kit 2.
 * Tab Kit is free software you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation either version 2
 * of the License, or (at your option) any later version.
 *
 * Tab Kit 2 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

/* Note on the source code
 * -----------------------
 * This code is split into sections, separated by "//|##########################".
 *
 * The earlier sections, whose name is preceded by "//{### " provide services or abstraction
 * functions for later sections.
 *
 * The later sections, starting with "//{>>> " or "//{=== ", are where the important code is
 * (especially the >>> ones). These code sections are designed to be largely independent of
 * each other, and could often be removed without affecting the rest of the code.
 *
 * n.b. If you edit this in SciTE the //{ and //} cause the code to fold nicely.
 */

/*
 * Too tiring to "fix" this
*/
/* eslint strict: ["off"] */
/*
 * Too tiring to "fix" this
*/
/* eslint no-undef: ["off"] */

/* Temporarily ignore these rules otherwise too many warnings */
/* eslint no-redeclare: ["off"] */
/* eslint block-scoped-var: ["off"] */
/* eslint no-param-reassign: ["off"] */

// Too many warnings if `any` not used
/* eslint-disable @typescript-eslint/no-explicit-any */

// Necessary for method monkey patching
/* eslint-disable prefer-rest-params */



(function (window) {
  // Primarily just a 'namespace' to hide our stuff in
  // @ts-ignore
  window.tabkit = new function _tabkit() {

    //|##########################
    //{### Basic Constants
    //|##########################

    /// Private globals:
    // Functions passed as parameters lose their this, as do nested functions, and tabkit is a bit long(!), so store it in 'tk'
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const tk          = this

    const XUL_NS      = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"

    const { classes: Cc, interfaces: Ci, utils: Cu } = Components

    const PREF_BRANCH = "extensions.tabkit."


    const TAB_MIN_WIDTH = 50


    const { Preferences } = Cu.import("resource://gre/modules/Preferences.jsm", {})
    const { RecentWindow } = Cu.import("resource:///modules/RecentWindow.jsm", {})
    // FF 45.x only
    // Since we cannot assign twice to a `const`
    // We create a closure to generate the value for assignment
    const TabStateFlusher = (function() {
      let result
      try {
        result = Cu.import("resource:///modules/sessionstore/TabStateFlusher.jsm", {}).TabStateFlusher
      }
      catch (e) {
        // Do nothing
      }
      return result
    })()


    //}##########################
    //{### Services
    //|##########################

    // Make sure we can use gPrefService from now on (even if this isn't a browser window!)
    if (typeof gPrefService === "undefined" || gPrefService == null)
      gPrefService = Cc["@mozilla.org/preferences-service;1"]
      .getService(Ci.nsIPrefBranch)

    /// Private globals:
    const _console = Cc["@mozilla.org/consoleservice;1"]
    .getService(Ci.nsIConsoleService)

    const _ios = Cc["@mozilla.org/network/io-service;1"]
    .getService(Ci.nsIIOService)

    const _prefs = Cc["@mozilla.org/preferences-service;1"]
    .getService(Ci.nsIPrefService)
    .getBranch(PREF_BRANCH)

    this.localPrefService = _prefs

    const _ps = Cc["@mozilla.org/embedcomp/prompt-service;1"]
    .getService(Ci.nsIPromptService)

    const _sm = Cc["@mozilla.org/scriptsecuritymanager;1"]
    .getService(Ci.nsIScriptSecurityManager)

    let _ss: any = null
    // For tk.get/setWindowValue // TODO=P1: Remove if redundant
    const _winvars: {[key: string]: string} = {}
    if ("@mozilla.org/browser/sessionstore;1" in Cc) {
      _ss = Cc["@mozilla.org/browser/sessionstore;1"]
      .getService(Ci.nsISessionStore)
    }

    const _sound = Cc["@mozilla.org/sound;1"]
    .getService(Ci.nsISound)

    const _wm = Cc["@mozilla.org/appshell/window-mediator;1"]
    .getService(Ci.nsIWindowMediator)

    // References:
    // - https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Using_the_clipboard
    // Create a constructor for the built-in transferable class
    const nsTransferable = Components.Constructor("@mozilla.org/widget/transferable;1", "nsITransferable")
    // Create a wrapper to construct an nsITransferable instance and set its source to the given window, when necessary
    function Transferable(source: any) {
      const res = nsTransferable()
      let final_source = source
      if ("init" in res) {
        // When passed a Window object, find a suitable privacy context for it.
        if (final_source instanceof Ci.nsIDOMWindow)
          // Note: in Gecko versions >16, you can import the PrivateBrowsingUtils.jsm module
          // and use PrivateBrowsingUtils.privacyContextFromWindow(sourceWindow) instead
          final_source = final_source.QueryInterface(Ci.nsIInterfaceRequestor)
          .getInterface(Ci.nsIWebNavigation)

        res.init(final_source)
      }
      return res
    }

    //}##########################
    //{### Utility Functions
    //|##########################

    // The property "hidden" of a tab is read-only, therefore assigning to this property does not work. See Firefox's source code, browser/base/content/tabbrowser.xml
    this.tabSetHidden = function tabSetHidden(tab: Tab, hidden: boolean) {
      if (hidden)
        gBrowser.hideTab(tab)
      else
        gBrowser.showTab(tab)
    }

    // A log of all reported errors is kept, in case the Error Console loses them!
    this.logs = {
      dump: [],
      log: [],
      debug: [],
    }

    // For errors or warnings, with automatic line numbers, call stack, etc.
    this.dump = function dump(error: any, actualException: any = null) {
      try {
        let stack: any
        if (_prefs.getBoolPref("debug")) {
          const scriptError = Cc["@mozilla.org/scripterror;1"]
          .createInstance(Ci.nsIScriptError)

          if (!actualException && typeof error === "object")
            actualException = error
          const haveException = !!actualException
          if (haveException && actualException.stack) {
            stack = actualException.stack
          }
          else {
            stack = new Error().stack // Get call stack (could use Components.stack.caller instead)
            stack = stack.substring(stack.indexOf("\n", stack.indexOf("\n")+1)+1) // Remove the two lines due to calling this
          }
          const message = "TK Error: \"" + error + "\"\nat:\u00A0" + stack.replace("\n@:0", "").replace(/\n/g, "\n    ") // \u00A0 is a non-breaking space
          const sourceName   = (haveException && "fileName"  in actualException && actualException.fileName)   ? actualException.fileName  : Components.stack.caller.filename
          const sourceLine   = (haveException && "sourceLine"   in actualException && actualException.sourceLine)   ? actualException.sourceLine   : Components.stack.caller.sourceLine // Unfortunately this is probably null
          const lineNumber   = (haveException && "lineNumber"   in actualException && actualException.lineNumber)   ? actualException.lineNumber   : Components.stack.caller.lineNumber // error.lineNumber isn't always accurate, unfortunately - sometimes might be better to just ignore it
          const columnNumber = (haveException && "columnNumber" in actualException && actualException.columnNumber) ? actualException.columnNumber : 0
          const flags = haveException ? scriptError.errorFlag : scriptError.warningFlag
          const category = "JavaScript error" // TODO-P6: TJS Check this
          scriptError.init(message, sourceName, sourceLine, lineNumber, columnNumber, flags, category)
          tk.logs.dump.push(scriptError)
          _console.logMessage(scriptError)
        }
        else {
          tk.logs.dump.push(String(error) + "\n" + tk.quickStack())
        }
      }
      catch (ex) {
        // Do nothing
      }
    }

    // For logging information (no line numbers, call stack, etc.)
    this.log = function log(message: string) {
      try {
        tk.logs.log.push(message)
        if (_prefs.getBoolPref("debug")) {
          const msg = "TK: " + message
          _console.logStringMessage(msg)
        }
      }
      catch (ex) {
        // Do nothing
      }
    }

    // For minor/normal information that could still be interesting
    this.debug = function debug(message: string) {
      try {
        tk.logs.debug.push(message)
        if (_prefs.getBoolPref("debug") && _prefs.getBoolPref("debugMinorToo")) {
          const msg = "TK Debug: " + message
          _console.logStringMessage(msg)
        }
      }
      catch (ex) {
        // Do nothing
      }
    }

    /* USAGE:
     *   tk.assert('true !== false', function(e) eval(e), "True should not equal false")
     */
    this.assert = function assert(condition: string, localEval: ((s: string) => boolean), message: string) {
      if (!_prefs.getBoolPref("debug") || localEval(condition))
        return

      let title = "Assert Failed: '" + condition + "' in " + Components.stack.caller.name + "("
      // Append arguments to title
      if (arguments.callee.caller.arguments.length > 0)
        title += (uneval(arguments.callee.caller.arguments[0]) as any).toString()
      for (let i = 1; i < arguments.callee.caller.arguments.length; i++)
        title += ", " + (uneval(arguments.callee.caller.arguments[i]) as any).toString()
      title += ")"

      const msg = (message ? message + "\n\n" : "") + "Stacktrace:\n" + tk.quickStack()

      tk.dump(title + "\n\n" + msg)

      // quickprompt requires my (currently unreleased) QuickPrompt extension
      if ("quickprompt" in window)
        window.quickprompt(localEval, title, msg, "help()")
    }


    this.startsWith = function startsWith(str: string, start: string) {
      return str.indexOf(start) === 0
    }

    this.endsWith = function endsWith(str: string, end: string) {
      const startPos = str.length - end.length
      if (startPos < 0)
        return false
      return str.lastIndexOf(end, startPos) === startPos
    }


    this.rawMD5 = function rawMD5(str: string) {
      const converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"]
      .createInstance(Ci.nsIScriptableUnicodeConverter)
      converter.charset = "UTF-8"
      // result is an out parameter, result.value will contain the array length
      const result = {}
      // data is an array of bytes
      const data = converter.convertToByteArray(str, result)
      const ch = Cc["@mozilla.org/security/hash;1"]
      .createInstance(Ci.nsICryptoHash)
      ch.init(ch.MD5)
      ch.update(data, data.length)
      return ch.finish(false)
    }

    // Returns a random integer between min and max
    // Using Math.round() will give you a non-uniform distribution!
    // Thanks to http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Math:random
    this.randInt = function randInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    this.getWindowValue = function getWindowValue(aKey: string) {
      if (_ss)
        return _ss.getWindowValue(window, aKey)
      else
        return (aKey in _winvars ? _winvars[aKey] : "")
    }

    this.setWindowValue = function setWindowValue(aKey: string, aStringValue: string) {
      if (_ss)
        _ss.setWindowValue(window, aKey, aStringValue)
      else
        _winvars[aKey] = aStringValue
    }

    this.deleteWindowValue = function removeWindowValue(aKey: string) {
      if (_ss)
        _ss.deleteWindowValue(window, aKey)
      else
        delete _winvars[aKey]
    }




    this.addDelayedEventListener = function addDelayedEventListener(target: any, eventType: string, listener: (...args: any[]) => void) {
      if (typeof listener === "object") {
        target.addEventListener(eventType, function __delayedEventListener(event: mozEvent) {
          window.setTimeout(function(listener2: any) { listener2.handleEvent(event) }, 0, listener)
        }, false)
      }
      else {
        target.addEventListener(eventType, function __delayedEventListener(event: mozEvent) {
          window.setTimeout(function(listener2: any) { listener2(event) }, 0, listener)
        }, false)
      }
    }


    // TODO=P4: GCODE scrollOneExtra should also apply with a single-row horizontal tab bar
    // TODO=P3: GCODE Could always keep selected tab in centre of tabbar instead (whether horizontal or vertical?)
    this.scrollToElement = function scrollToElement(overflowPane: any, targetItem: any) { // TODO-P6: TJS cleanup code? [based on toomanytabs]
      const scrollbar = overflowPane.mVerticalScrollbar
      if (!scrollbar) {
        /*
        // Alternative way to scroll things (can only scroll within an <xul:scrollbox> though)
        if (overflowPane.localName !== "scrollbox")
          overflowPane = overflowPane.parentNode
        if (overflowPane.localName === "scrollbox") {
          const nsIScrollBoxObject = overflowPane.boxObject.QueryInterface(Ci.nsIScrollBoxObject)
          nsIScrollBoxObject.ensureElementIsVisible(element)
        }
        //TODO: Make sure overflowPane is never scrolled halfway across elements at both the top and bottom
        //TODO: _prefs.getBoolPref("scrollOneExtra")
        */
        return
      }

      const container = targetItem.parentNode

      // Sometimes it is null, Don't know what happen
      // Just ignore it at he moment
      if (container == null) return

      let firstChild = container.firstChild
      // tk.log("scrollToElement "+firstChild.nodeName)
      while (firstChild.hidden) // visibility of a tab
        firstChild = firstChild.nextSibling
      let lastChild = container.lastChild
      while (lastChild.hidden) // visibility of a tab
        lastChild = lastChild.previousSibling

      let curpos = parseInt(scrollbar.getAttribute("curpos"))
      if (isNaN(curpos)) {
        tk.debug("curpos was NaN")
        curpos = 0
      }
      const firstY = firstChild.boxObject.y
      const targetY = targetItem.boxObject.y
      const lastY = lastChild.boxObject.y
      const height = targetItem.boxObject.height
      const relativeY = targetY - firstY
      const paneHeight = overflowPane.boxObject.height


      // Make sure overflowPane is never scrolled halfway across elements at both the top and bottom
      if ((lastY - firstY) % height === 0 && curpos % height !== 0 && (curpos + paneHeight + firstY - lastY) % height !== 0) {
        curpos = height * Math.round(curpos / height)
      }

      let minpos = relativeY
      if (_prefs.getBoolPref("scrollOneExtra") && minpos > 0 && lastY - firstY > height) {
        minpos -= height
      }
      if (minpos < curpos) {
        curpos = minpos // Set it to minpos
      }
      else {
        let maxpos = relativeY + height - paneHeight
        // tk.debug("relativeY = "+relativeY)
        // tk.debug("height = "+height)
        // tk.debug("paneHeight = "+paneHeight)
        // tk.debug("maxpos = "+maxpos)
        // tk.debug("curpos = "+curpos)
        if (_prefs.getBoolPref("scrollOneExtra") && targetY < lastY && lastY - firstY > height) {
          maxpos += height
        }
        if (maxpos > curpos) {
          curpos = maxpos // Set it to maxpos
        }
      }
      scrollbar.setAttribute("curpos", curpos)
    }


    this.moveBefore = function moveBefore(tabToMove: Tab, target: Tab) {
      try {
        let newIndex = target._tPos
        if (newIndex > tabToMove._tPos)
          newIndex--
        if (newIndex !== tabToMove._tPos)
          gBrowser.moveTabTo(tabToMove, newIndex)
      }
      catch (ex) {
        tk.dump(ex)
      }
    }

    this.moveAfter = function moveAfter(tabToMove: Tab, target: Tab) {
      try {
        let newIndex = target._tPos + 1
        if (newIndex > tabToMove._tPos)
          newIndex--
        if (newIndex !== tabToMove._tPos)
          gBrowser.moveTabTo(tabToMove, newIndex)
      }
      catch (ex) {
        tk.dump(ex)
      }
    }

    this.moveTabGroupToWindow = function moveTabGroupToWindow(tabToMove: Tab, targetTabId: string) {
      tk.copyTabGroupToWindow(tabToMove, targetTabId)
      tk.closeGroup(tabToMove)
    }

    this.copyTabGroupToWindow = function copyTabGroupToWindow(tabToMove: Tab, targetTabId: string) {
      // Find window by tab ID
      const windowsEnumerator = _wm.getEnumerator("navigator:browser")
      let targetWindow = null as null | Window
      while(windowsEnumerator.hasMoreElements()) {
        const win = windowsEnumerator.getNext()
        if (window !== win && tk.getTabId(win.gBrowser.selectedTab) === targetTabId) {
          targetWindow = win
          break
        }
      }
      const targetTab = targetWindow.gBrowser.selectedTab

      const gid = tabToMove.getAttribute("groupid")
      if (!gid) { return }

      const group = tk.getGroupById(gid)


      // Tab was copied or from another window, so tab will be recreated instead of moved directly

      // Move/copy the tab(s)
      const tabsToAdd = group.slice() // Copy
      const newTabs = [] as Tab[]
      const newIndex = targetTab._tPos + 1
      tabsToAdd.forEach((tab: Tab, idx: number) => {
        const added_tab_type  = "unrelated"
        const parent_tab  = null as null
        const should_keep_added_tab_position = true

        targetWindow.tabkit.addingTab({
          added_tab_type: added_tab_type,
          parent_tab:     parent_tab,
          should_keep_added_tab_position: true,
        })

        const copiedTab = targetWindow.tabkit._duplicateTab(tab)
        targetWindow.gBrowser.moveTabTo(copiedTab, newIndex + idx)

        newTabs.push(copiedTab)
        targetWindow.tabkit.addingTabOver({
          added_tab_type: added_tab_type,
          added_tab:      copiedTab,
          parent_tab:     parent_tab,
          should_keep_added_tab_position: should_keep_added_tab_position,
        })

        // Backup attributes at this time, so we can restore them later if needed
        const tab_attributes_backup = targetWindow.tabkit.getTabAttributesForTabKit(copiedTab)

        // In FF 45.x (and later maybe)
        // The attributes are restored again asynchronously
        // So we need to restore the attributes after that operation
        if (typeof TabStateFlusher === "object" &&
        "flush" in TabStateFlusher &&
        typeof TabStateFlusher.flush === "function") {

          const browser = tab.linkedBrowser
          TabStateFlusher.flush(browser).then(() => {
            targetWindow.tabkit.setTabAttributesForTabKit(copiedTab, tab_attributes_backup)
          })
        }
      })

      // region possibleparent

      // Create a new groupid
      const newGid = ":oG-copiedGroupOrSubtree-" + tk.generateId()
      const tabIdMapping = {} as {[key: string]: string}
      newTabs.forEach((newTab, i) => {
        // Map tabids of original tabs to tabids of their clones
        tabIdMapping[tk.getTabId(tabsToAdd[i])] = tk.getTabId(newTab)

        let tpp = tabsToAdd[i].getAttribute("possibleparent")
        if (tpp in tabIdMapping) {
          tpp = tabIdMapping[tpp]
        }
        newTab.setAttribute("possibleparent", tpp)
        tk.setGID(newTab, newGid)
      })

      // endregion possibleparent

      targetWindow.tabkit.updateIndents()
      targetWindow.focus()
    }


    this.quickStack = function quickStack() {
      // Intended mainly for outputting to the console
      let func = arguments.callee.caller.caller
      let stack = ""
      for (let i = 1; func && i < 8; i++) {
        stack += " " + i + ". " + func.name
        func = func.caller
      }
      return stack
    }

    this.beep = function beep() {
      _sound.beep()
    }

    this.getTabId = function (tab: Tab) {
      if (!tab.hasAttribute("tabid")) {
        tk.generateNewTabId(tab)
      }

      return tab.getAttribute("tabid")
    }

    this.generateNewTabId = function (tab: Tab) {
      const new_id = tk.generateId()
      tab.setAttribute("tabid", new_id)

      return new_id
    }

    this.getTabGroupId = function (tab: Tab) {
      if (!tab.hasAttribute("groupid")) {
        return null
      }

      return tab.getAttribute("groupid")
    }

    this.TabBar = this.TabBar || {}
    this.TabBar.Mode = this.TabBar.Mode || {}
    // @return [Boolean] if vertical mode, true
    this.TabBar.Mode.getIsVerticalMode = function getIsVerticalMode () {
      return gBrowser.hasAttribute("vertitabbar")
    }


    this.DomUtility = this.DomUtility || {}
    this.DomUtility.insertBefore = function insertBefore(referenceNode: Element, newNode: Element) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode)
    }
    this.DomUtility.insertAfter = function insertAfter(referenceNode: Element, newNode: Element) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
    }

    this.VerticalTabBarScrollbar = this.VerticalTabBarScrollbar || {}
    this.VerticalTabBarScrollbar.getElement = function () {
      if (!tk.TabBar.Mode.getIsVerticalMode()) {
        return null
      }

      const innerBox = (document as mozDocument).getAnonymousElementByAttribute(
        gBrowser.tabContainer.mTabstrip._scrollbox,
        "class",
        "box-inherit scrollbox-innerbox",
      )

      return (innerBox as any).mVerticalScrollbar
    }

    //}##########################
    //{### Initialisation
    //|##########################

    // USAGE: this.*InitListeners.push(this.*Init*)

    /// Globals:
    this.preInitListeners = [
    ] as Array<(e: mozEvent) => void>

    this.initListeners = [
    ] as Array<(e: mozEvent) => void>

    this.postInitListeners = [
    ] as Array<(e: mozEvent) => void>

    /// Private Globals:

    /// Methods:
    this.tryListener = function tryListener(type: string, listener: (e: mozEvent) => void, event: mozEvent) {
      try {
        listener(event)
      }
      catch (ex) {
        const listenerString = "name" in listener ? listener.name : listener.toSource().substring(0, 78)
        tk.dump(type + " listener '" + listenerString + "' failed with exception:\n" + ex, ex)
      }
    }

    /// Event Listeners:
    // This gets called for new browser windows, once the DOM tree is loaded
    this.onDOMContentLoaded = function onDOMContentLoaded(event: mozEvent) {
      if ((event.originalTarget as any) !== document)
        return // Sometimes in Fx3+ there's a random HTMLDocument that fires a DOMContentLoaded before the main window does

      window.removeEventListener("DOMContentLoaded", tk.onDOMContentLoaded, false)

      // Run First Run Wizard if appropriate
      if (!_prefs.getBoolPref("firstRunWizardDone")) {
        window.setTimeout(function __startfirstRunWizard() {
          gBrowser.selectedTab = gBrowser.addTab("chrome://tabkit/content/firstRunWizard.xul")
        }, 1500)
      }

      // Run module early initialisation code (before any init* listeners, and before most extensions):
      tk.preInitListeners.forEach(function(listener: (e: mozEvent) => void) {
        tk.tryListener("DOMContentLoaded", listener, event)
      })
    }

    // This gets called for new browser windows, once they've completely finished loading
    this.onLoad = function onLoad(event: mozEvent) {
      if ((event.originalTarget as any) !== document)
        return

      window.removeEventListener("load", tk.onLoad, false)

      // Run module specific initialisation code, such as registering event listeners:
      tk.initListeners.forEach(function(listener: (e: mozEvent) => void) {
        tk.tryListener("load", listener, event)
      })

      window.setTimeout(function __runPostInitListeners() {
        // Run module specific late initialisation code (after all init* listeners, and after most extensions):
        tk.postInitListeners.forEach(function(listener: (e: mozEvent) => void) {
          listener(event)
        })
      }, 0)
    }


    //}##########################
    //{### CSS
    //|##########################

    this.UAStyleSheets = [ "chrome://tabkit/content/ua.css" ]

    this.preInitUAStyleSheets = function preInitUAStyleSheets() {
      // [Fx3only] it seems
      const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService)
      const ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)
      tk.UAStyleSheets.forEach(function(s: string) {
        const uri = ios.newURI(s, null, null)
        if (!sss.sheetRegistered(uri, sss.AGENT_SHEET))
          sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET)
      })
    }
    this.preInitListeners.push(this.preInitUAStyleSheets)

    // Return (or delete) a style rule object by selector
    // Based on http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript
    this.getCSSRule = function getCSSRule(ruleName: string, deleteIt = false) {
      ruleName = ruleName.toLowerCase()
      for (let i = 0; i < document.styleSheets.length; i++) {
        const styleSheet = (document.styleSheets[i] as any)
        for (let j = 0; j < styleSheet.cssRules.length; j++) {
          const cssRule = styleSheet.cssRules[j]
          if ("selectorText" in cssRule && cssRule.selectorText && cssRule.selectorText.toLowerCase() === ruleName) {
            if (deleteIt) {
              styleSheet.deleteRule(j)
              return true
            }

            return cssRule
          }
        }
      }
      return false
    }

    //}##########################
    //{### Useful shortcuts
    //|##########################

    /*
    Warning on using shortcuts!!!!
    PikachuEXE:
    There are so many minor bugs are caused by these shortcuts
    I am not talking about not using them at all
    But avoid using them when you call something dynamic
    For example, if a scrollbar only appears (created) when there are too many tabs,
    you should avoid calling its parent through shortcuts, since the "shortcut" seems to be "outdated"

    2012-05-14: _tabstrip cause Multirow buggy, hence shortcut removed (_tabContainer seems fine though)
    */



    /// Private Globals:
    let _tabContainer: any
    let _tabs: any
    let _tabBar: any

    /// Initialisation:
    this.preInitShortcuts = function preInitShortcuts() {
      //tk.assert('window.location === "chrome://browser/content/browser.xul"', function(e) eval(e), "preInitShortcuts should only be run in browser windows, as tabkit.js is only loaded into browser.xul")
      if(window.location.toString() !== "chrome://browser/content/browser.xul")
        tk.dump("preInitShortcuts should only be run in browser windows, as tabkit.js is only loaded into browser.xul")

      // `getBrowser` is a deprecated which just return `gBrowser`
      // No need to call it
      //tk.assert('gBrowser', function(e) eval(e), "gBrowser must not be null after preInitShortcuts!")
      if(!gBrowser)
        tk.dump("gBrowser must not be null after preInitShortcuts!")

      _tabContainer = gBrowser.tabContainer
      _tabs = gBrowser.tabs
      _tabBar = document.getElementById("TabsToolbar")
    }
    this.preInitListeners.push(this.preInitShortcuts)

    //}##########################
    //{### Prefs Observers
    //|##########################

    /// Private globals:
    type LocalPrefListenerFunc = (changedPref: string) => any
    interface GlobalPrefObserver {
      listeners: Array<LocalPrefListenerFunc>
      observe: (aSubject: any, aTopic: string, aData: any) => void
    }

    const _globalPrefObservers : Map<string, GlobalPrefObserver> = new Map()

    const _localPrefListeners : Map<string, Array<LocalPrefListenerFunc>> = new Map()

    /// Initialisation:
    this.preInitPrefsObservers = function preInitPrefsObservers() {
      // Make sure we can use addObserver on this
      gPrefService.QueryInterface(Ci.nsIPrefBranch)

      // Do this in preInit just in case something expects their init prefListener to work 'instantly'
      tk.addGlobalPrefListener(PREF_BRANCH, tk.localPrefsListener)
    }
    this.preInitListeners.push(this.preInitPrefsObservers)

    /// Pref Listeners:
    // This listener checks all changes to the extension's pref branch, and delegates them to their registered listeners
    // Presumeably more efficient than simply adding a global observer for each one...
    this.localPrefsListener = function localPrefsListener(changedPref: string) {
      changedPref = changedPref.substring(PREF_BRANCH.length) // Remove prefix for these local prefs

      _localPrefListeners.forEach((listeners, prefName) => {
        if (changedPref.substring(0, prefName.length) !== prefName) {
          return
        }

        listeners.forEach(function(listener) {
          listener(changedPref)
        })
      })
    }

    /// Methods:
    this.addGlobalPrefListener = function addGlobalPrefListener(prefString: string, prefListener:LocalPrefListenerFunc) {
      let the_global_pref_observer = _globalPrefObservers.get(prefString)

      if (!the_global_pref_observer) {
        the_global_pref_observer = {
          listeners: [] as Array<LocalPrefListenerFunc>,

          observe: function(aSubject, aTopic, aData) {
            if (aTopic !== "nsPref:changed") return
            // aSubject is the nsIPrefBranch we're observing (after appropriate QI)
            // aData is the name of the pref that's been changed (relative to aSubject)
            this.listeners.forEach(function(listener: LocalPrefListenerFunc) {
              listener(aData)
            })
          },
        } as GlobalPrefObserver

        gPrefService.addObserver(prefString, the_global_pref_observer, false)
        window.addEventListener(
          "unload",
          function() {
            gPrefService.removeObserver(prefString, the_global_pref_observer)
          },
          false,
        )
      }

      the_global_pref_observer.listeners.push(prefListener)
      _globalPrefObservers.set(prefString, the_global_pref_observer)
    }

    this.addPrefListener = function addPrefListener(
      prefName: string,
      listener: LocalPrefListenerFunc,
    ): void {
      let the_local_pref_listeners = _localPrefListeners.get(prefName)

      if (!the_local_pref_listeners) {
        the_local_pref_listeners = []
      }
      the_local_pref_listeners.push(listener)
      _localPrefListeners.set(prefName, the_local_pref_listeners)
    }

    // ##########################
    // ### Tab Kit Data I/O
    // ##########################

    const TK_DATA_KEY = "tabkit_data"

    this.TKData = {}

    // Read data from an object
    this.TKData.getDataWithKey = function(obj: any, key: string) {
      if (obj === null || typeof obj === "undefined") {
        tk.dump("obj is blank")
        return {status: "failed", data: null}
      }
      if (typeof key !== "string") {
        tk.dump("key is NOT a string")
        return {status: "failed", data: null}
      }

      if (!(TK_DATA_KEY in obj)) {
        return {status: "success", data: null}
      }

      const tk_data = obj[TK_DATA_KEY]
      if (typeof tk_data !== "object") {
        tk.dump("obj." + TK_DATA_KEY + " is NOT an object")
        // No cleaning operation here, since this method is for reading only

        return {status: "failed", data: null}
      }

      if (!(key in tk_data)) {
        return {status: "success", data: null}
      }

      // This can still be `null` or `undefined`
      return {status: "success", data: tk_data[key]}
    }

    // Write data to an object
    this.TKData.setDataWithKey = function(obj: any, key: string, data: any) {
      if (obj === null || typeof obj === "undefined") {
        tk.dump("obj is blank")
        return {status: "failed"}
      }
      if (typeof key !== "string") {
        tk.dump("key is NOT a string")
        return {status: "failed"}
      }
      // We don't check data
      // Since we could intentionally set the data to `null` or even `undefined`

      // It's normal that there is no property in the object yet
      if (!(TK_DATA_KEY in obj)) {
        obj[TK_DATA_KEY] = {}
      }

      const tk_data = obj[TK_DATA_KEY]
      if (typeof tk_data !== "object") {
        tk.dump("obj." + TK_DATA_KEY + " is NOT an object")
        tk.debug("Resetting obj." + TK_DATA_KEY + " to an object")
        obj[TK_DATA_KEY] = {}

        return {status: "failed"}
      }

      tk_data[key] = data

      // This can still be `null` or `undefined`
      return {status: "success"}
    }

    // Delete data to an object
    this.TKData.removeDataWithKey = function(obj: any, key: string) {
      if (obj === null || typeof obj === "undefined") {
        tk.dump("obj is blank")
        return {status: "failed", data: null}
      }
      if (typeof key !== "string") {
        tk.dump("key is NOT a string")
        return {status: "failed", data: null}
      }
      // We don't check data
      // Since we could intentionally set the data to `null` or even `undefined`

      // It's normal that there is no property in the object yet
      if (!(TK_DATA_KEY in obj)) {
        return {status: "success", data: null}
      }

      const tk_data = obj[TK_DATA_KEY]
      if (typeof tk_data !== "object") {
        tk.dump("obj." + TK_DATA_KEY + " is NOT an object")
        tk.debug("Resetting obj." + TK_DATA_KEY + " to an object")
        obj[TK_DATA_KEY] = {}

        return {status: "failed", data: null}
      }

      // This can still be `null` or `undefined`
      return {
        status: "success",
        data: tk_data[key],
      }
    }

    //}##########################
    //{### Pref-attribute Mapping
    //|##########################

    this.mapPrefToAttribute = function mapPrefToAttribute(prefName: string, test: (s: string) => string | null, node: Element, attributeName: string) {
      const listener = function() {
        const value = test(prefName)
        if (value != null) {
          node.setAttribute(attributeName, value)
        }
        else {
          node.removeAttribute(attributeName)
        }
      }

      tk.addPrefListener(prefName, listener)

      // Call it once on start
      listener()
    }

    this.mapBoolPrefToAttribute = function mapBoolPrefToAttribute(prefName: string, node: Element, attributeName: string) {
      tk.mapPrefToAttribute(prefName, function() { return _prefs.getBoolPref(prefName) ? "true" : null }, node, attributeName)
    }

    //}##########################
    //{>>> Sorting & Grouping
    //|##########################

    // TODO=P3: UVOICE Allow viewing tabs in sorted order without reordering them OR undoing sorts
    // TODO=P4: GCODE Check outoforder is set as appropriate (tabs that have been moved or added contrary to the prevailing sort and should be ignored when placing new tabs by sort order)
    // TODO=P5: ??? Back to the tab the current tab is opened from, by the "Back" button Forward to tabs opened from the current tab, by the "Forward" button

    /// Enums:
    this.Sorts = {
      creation:   "tabid",      // == Firefox: new tabs to far right
      lastLoaded: "lastLoadedKey",
      lastViewed: "lastViewedKey",  // == Visual Studio: last used tabs to far left (except they go to the right for consistency :/)
      origin:  "possibleparent", // == Tabs Open Relative [n.b. possibleparent is _not_ a key, it is special cased]
      title:    "label",
      uri:    "uriKey",
    }

    this.Groupings = {
      none:    "",
      opener:  "openerGroup", // Can be internally sorted by origin
      domain:  "uriGroup",   // Can be internally sorted by uri
    }

    this.RelativePositions = {
      left:        1,
      right:        2,
      rightOfRecent:    3,    // Right of consecutive tabs sharing a possibleparent marked recent all recent tabs are reset on TabSelect
      rightOfConsecutive: 4,    // Right of consecutive tabs sharing a possibleparent
    }

    // Sort keys in here will have larger items sorted to the top/left of the tabbar
    this.ReverseSorts = new Map()
    //this.ReverseSorts["lastLoaded"] = true // TODO=P5: GCODE pref
    //this.ReverseSorts["lastViewed"] = true // TODO=P5: GCODE pref

    // Sort keys listed here should be converted to numbers before comparison
    this.NumericSorts = new Map()
    this.NumericSorts.set("lastLoaded", true)
    this.NumericSorts.set("lastViewed", true)

    //~ // Sort keys listed here are dates, so groups should probably be positioned by most recent instead of median
    //~ this.DateSorts = {}
    //~ this.DateSorts["creation"] = true
    //~ this.DateSorts["lastLoaded"] = true
    //~ this.DateSorts["lastViewed"] = true

    /// Globals:
    this.__defineGetter__("activeSort", function __get_activeSort() {
      let sortName = _prefs.getCharPref("lastActiveSort")

      if (!(sortName in tk.Sorts)) {
        sortName = "creation"
      }

      return sortName
    })
    this.__defineSetter__("activeSort", function __set_activeSort(sortName: string) {
      if (sortName in tk.Sorts) {
        _prefs.setCharPref("lastActiveSort", sortName)
      }
      else {
        tk.dump("activeSort - invalid sort name: " + sortName)
      }
      return sortName
    })

    this.__defineGetter__("activeGrouping", function __get_activeGrouping() {
      let groupingName = _prefs.getCharPref("lastActiveGrouping")

      if (!(groupingName in tk.Groupings)) {
        groupingName = "none"
      }

      return groupingName
    })
    this.__defineSetter__("activeGrouping", function __set_activeGrouping(groupingName: string) {
      if (groupingName in tk.Groupings) {
        _prefs.setCharPref("lastActiveGrouping", groupingName)
      }
      else {
        tk.dump("activeGrouping - invalid grouping name: " + groupingName)
      }
      return groupingName
    })

    this.__defineGetter__("openRelativePosition", function __get_openRelativePosition() {
      let positionName = _prefs.getCharPref("openRelativePosition")
      if (!(positionName in tk.RelativePositions))
        positionName = "rightOfRecent"
      return positionName
    })
    this.__defineSetter__("openRelativePosition", function __set_openRelativePosition(positionName: string) {
      if (positionName in tk.RelativePositions) {
        _prefs.setCharPref("openRelativePosition", positionName)
      }
      else {
        tk.dump("openRelativePosition - invalid position name: " + positionName)
      }
      return positionName
    })

    this.__defineGetter__("newTabPosition", function __get_newTabPosition() {
      const position = _prefs.getIntPref("newTabPosition")
      if (position >= 0 && position <= 2) {
        return position
      }
      else {
        tk.log("newTabPosition - invalid pref value: " + position)
        return 0
      }
    })
    this.__defineSetter__("newTabPosition", function __set_newTabPosition(position: number) {
      if (position >= 0 && position <= 2) {
        _prefs.setIntPref("newTabPosition", position)
      }
      else {
        tk.dump("newTabPosition - invalid position: " + position)
        return position
      }
    })

    this.__defineGetter__("autoGroupNewTabs", function __get_autoGroupNewTabs() {
      return _prefs.getBoolPref("autoGroupNewTabs")
    })
    this.__defineSetter__("autoGroupNewTabs", function __set_autoGroupNewTabs(bool: boolean) {
      _prefs.setBoolPref("autoGroupNewTabs", bool)
      return bool
    })


    /// Initialisation:
    this.initSortingAndGrouping = function initSortingAndGrouping() {

      tk.detectTheme()

      // Add event listeners:
      _tabContainer.addEventListener("TabOpen", tk.sortgroup_onTabAdded, false)
      _tabContainer.addEventListener("TabSelect", tk.sortgroup_onTabSelect, true)
      gBrowser.addEventListener("DOMContentLoaded", tk.sortgroup_onTabLoading, true)
      gBrowser.addEventListener("load", tk.sortgroup_onTabLoaded, true)
      // TODO=P3: GCODE See https://developer.mozilla.org/En/Listening_to_events_on_all_tabs for better ways to listen for tab loads in Fx3.5+
      // This is called just before the tab starts loading its content, use SSTabRestored for once that's finished
      document.addEventListener("SSTabRestoring", tk.sortgroup_onSSTabRestoring, false)
      _tabContainer.addEventListener("TabMove", tk.sortgroup_onTabMoved, false)
      _tabContainer.addEventListener("TabClose", tk.sortgroup_onTabRemoved, false)

      // gBrowser.mStrip.addEventListener("mousedown", tk.sortgroup_onTabMousedown, true)
      // gBrowser.mStrip.addEventListener("click", tk.sortgroup_onClickTab, true)
      // gBrowser.mStrip.addEventListener("dblclick", tk.sortgroup_onDblclickTab, true)

      gBrowser.tabContainer.addEventListener("mousedown", tk.sortgroup_onTabMousedown, true)
      gBrowser.tabContainer.addEventListener("click", tk.sortgroup_onClickTab, true)
      gBrowser.tabContainer.addEventListener("dblclick", tk.sortgroup_onDblclickTab, true)

      const el_menupopup_tabkit_sortgroup = document.getElementById("menupopup_tabkit-sortgroup")
      if (el_menupopup_tabkit_sortgroup != null) {
        el_menupopup_tabkit_sortgroup.addEventListener("popupshowing", tk.updateSortGroupMenu, true)
      }

      tk.addPrefListener("forceThemeCompatibility", tk.detectTheme)
      tk.addPrefListener("colorTabNotLabel", tk.detectTheme)
      tk.addPrefListener("disableTabGroupColor", tk.detectTheme)
      tk.addPrefListener("minSaturation", tk.regenSaturationLightness)
      tk.addPrefListener("maxSaturation", tk.regenSaturationLightness)
      tk.addPrefListener("minLightness", tk.regenSaturationLightness)
      tk.addPrefListener("maxLightness", tk.regenSaturationLightness)
      tk.addPrefListener("indentedTree", tk.toggleIndentedTree)
      tk.addPrefListener("maxTreeLevel", tk.updateIndents)
      tk.addPrefListener("indentAmount", tk.updateIndents)
      tk.addPrefListener("autoCollapse", tk.updateAutoCollapse)

      // Bool value and attribute existence are inversed
      tk.mapPrefToAttribute("colorTabNotLabel", function() {
        return _prefs.getBoolPref("colorTabNotLabel") ? null : "true"
      }, gBrowser.tabContainer, "tabkit-color-label-not-tab")

      // Set attributes for tabs that opened before we were able to register our listeners (in particular the initial xul:tab never fires a TabOpen event, and may never load either if it remains blank, but sometimes other tabs load first too)
      for (let i = 0; i < _tabs.length; i++) {
        tk.sortgroup_onTabAdded({ target: _tabs[i], fromInitSortingAndGrouping: true })
        _tabs[i].setAttribute(tk.Sorts.lastLoaded, Date.now().toString())
      }
      // Set attributes for the selected tab (as it never fires a TabSelect event)
      window.setTimeout(function __selectInitial() {
        tk.sortgroup_onTabSelect({target: gBrowser.selectedTab})
        if (!gBrowser.selectedTab.hasAttribute("groupid"))
          tk.updateAutoCollapse()
      }, 0)

      // Move Sorting and Grouping menu to the tab context menu (from the Tools menu)
      const tabContextMenu = gBrowser.tabContextMenu
      tabContextMenu.insertBefore(document.getElementById("menu_tabkit-sortgroup"), tabContextMenu.childNodes[1])

      // Fix: Faviconize is now ignored on grouped tabs (Issue 51)
      // First injected statement required a leading space to make it work, don't know why (probably JS syntax)
      // https://github.com/ktakayama/faviconizetab/blob/master/content/addon/quick_fav.js
      ;(function() {
        "use strict"

        if (!("faviconize" in window) ||
            !("quickFav" in window.faviconize) ||
            typeof window.faviconize.quickFav.dblclick !== "function") {
          tk.debug("faviconize.quickFav.dblclick doesn't exists, replacing function failed")
          return
        }

        const old_func = window.faviconize.quickFav.dblclick
        // Function signature should be valid for FF 38.x & 45.x
        window.faviconize.quickFav.dblclick = function(e: Event) {
          "use strict"
          let result

          tk.debug(">>> faviconize.quickFav.dblclick >>>")
          const tab = e.target as Tab
          if (tab.hasAttribute("groupid") && tk.localPrefService.getBoolPref("doubleClickCollapseExpand")) {
            tk.debug("faviconize cancelled")
            return
          }
          else {
            result = old_func.apply(this, arguments)
          }
          tk.debug("<<< faviconize.quickFav.dblclick <<<")

          return result
        }
      })()
    }
    this.initListeners.push(this.initSortingAndGrouping)

    this.getTabAttributesForTabKit = function(tab: Tab) {
      if (typeof tab !== "object" || typeof tab.getAttribute !== "function") {
        return
      }

      const data = {} as {[key: string]: string}

      const attr_names = [
        "tabid",
        "possibleparent",
        "outoforder",
        "groupid",
        "singletonid",
        "groupcollapsed",
      ]
      attr_names.forEach(function(attr_name) {
        if (tab.hasAttribute(attr_name)) {
          data[attr_name] = tab.getAttribute(attr_name)
        }
      })

      for (const key in tk.Sorts) {
        const attr_name = tk.Sorts[key]
        if (tk.endsWith(attr_name, "Key")) {
          data[attr_name] = tab.getAttribute(attr_name)
        }
      }
      for (const key in tk.Groupings) {
        const attr_name = tk.Groupings[key]
        if (tk.endsWith(attr_name, "Group")) {
          data[attr_name] = tab.getAttribute(attr_name)
        }
      }

      return data
    }

    this.setTabAttributesForTabKit = function(tab: Tab, tab_attributes: {[key: string]: string}) {
      if (typeof tab !== "object" || typeof tab.setAttribute !== "function") {
        return
      }
      if (typeof tab_attributes !== "object") {
        return
      }

      const attr_names = [
        "tabid",
        "possibleparent",
        "outoforder",
        "groupid",
        "singletonid",
        "groupcollapsed",
      ]
      attr_names.forEach(function(attr_name) {
        if (attr_name in tab_attributes) {
          tab.setAttribute(attr_name, tab_attributes[attr_name])
        }
      })

      for (const key in tk.Sorts) {
        const attr_name = tk.Sorts[key]
        if (tk.endsWith(attr_name, "Key")) {
          if (attr_name in tab_attributes) {
            tab.setAttribute(attr_name, tab_attributes[attr_name])
          }
        }
      }
      for (const key in tk.Groupings) {
        const attr_name = tk.Groupings[key]
        if (tk.endsWith(attr_name, "Group")) {
          if (attr_name in tab_attributes) {
            tab.setAttribute(attr_name, tab_attributes[attr_name])
          }
        }
      }
    }

    this.postInitSortingAndGrouping = function postInitSortingAndGrouping() {
      // Persist Attributes
      if (_ss) {
        _ss.persistTabAttribute("tabid")
        _ss.persistTabAttribute("possibleparent")
        // n.b. we deliberately don't persist recentlyadded
        _ss.persistTabAttribute("outoforder")
        //_ss.persistTabAttribute("hidden") // This will get overwritten anyway
        for (const key in tk.Sorts) {
          const attr_name = tk.Sorts[key]
          if (tk.endsWith(attr_name, "Key"))
            _ss.persistTabAttribute(attr_name)
        }
        _ss.persistTabAttribute("groupid")
        _ss.persistTabAttribute("singletonid")
        _ss.persistTabAttribute("groupcollapsed")
        for (const key in tk.Groupings) {
          const attr_name = tk.Groupings[key]
          if (tk.endsWith(attr_name, "Group"))
            _ss.persistTabAttribute(attr_name)
        }
      }

      // This is for search item in context menu only
      // Not sure if `BrowserSearch.loadSearch` should be patched as well
      (function init_BrowserSearch_loadSearchFromContext() {
        "use strict"

        if (!("loadSearchFromContext" in BrowserSearch) || typeof BrowserSearch.loadSearchFromContext !== "function") {
          tk.debug("BrowserSearch.loadSearchFromContext doesn't exists, replacing function failed")
          return
        }

        const old_func = BrowserSearch.loadSearchFromContext
        // Function signature should be valid for FF 38.x & 45.x
        BrowserSearch.loadSearchFromContext = function(_terms: any) {
          "use strict"
          let result

          tk.debug(">>> BrowserSearch.loadSearchFromContext >>>")
          const selected_tab_before_operation = gBrowser.selectedTab
          tk.addingTab({
            added_tab_type: "unrelated",
            parent_tab: selected_tab_before_operation,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "unrelated",
              parent_tab: selected_tab_before_operation,
            })
          }
          tk.debug("<<< BrowserSearch.loadSearchFromContext <<<")

          return result
        }
      })()

      // This is for search item in context menu only
      // Not sure if `BrowserSearch.loadSearch` should be patched as well
      // Present in Fx 38.x & 45.x
      ;(function init_BrowserSearch_loadAddEngines() {
        "use strict"

        if (typeof BrowserSearch !== "object" || typeof BrowserSearch.loadAddEngines !== "function") {
          tk.debug("BrowserSearch.loadAddEngines doesn't exists, replacing function failed")
          return
        }

        const old_func = BrowserSearch.loadAddEngines
        // Function signature should be valid for FF 38.x & 45.x
        BrowserSearch.loadAddEngines = function() {
          "use strict"
          let result

          tk.debug(">>> BrowserSearch.loadAddEngines >>>")
          const selected_tab_before_operation = gBrowser.selectedTab
          tk.addingTab({
            added_tab_type: "unrelated",
            parent_tab: selected_tab_before_operation,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "unrelated",
              parent_tab: selected_tab_before_operation,
            })
          }
          tk.debug("<<< BrowserSearch.loadAddEngines <<<")

          return result
        }
      })()

      // For opening new tab with history entry of current tab
      ;(function init_gotoHistoryIndex() {
        "use strict"

        if (!("gotoHistoryIndex" in window) || typeof window.gotoHistoryIndex !== "function") {
          tk.debug("window.gotoHistoryIndex doesn't exists, replacing function failed")
          return
        }

        const old_func = window.gotoHistoryIndex
        // Function signature should be valid for FF 38.x & 45.x
        window.gotoHistoryIndex = function(_aEvent: Event) {
          "use strict"
          let result

          tk.debug(">>> window.gotoHistoryIndex >>>")
          const selected_tab_before_operation = gBrowser.selectedTab
          tk.addingTab({
            added_tab_type: "related",
            parent_tab: selected_tab_before_operation,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "related",
              parent_tab: selected_tab_before_operation,
            })
          }
          tk.debug("<<< window.gotoHistoryIndex <<<")

          return result
        }
      })()

      // For opening new tab with history entry of current tab
      ;(function init_BrowserBack() {
        "use strict"

        if (!("BrowserBack" in window) || typeof window.BrowserBack !== "function") {
          tk.debug("window.BrowserBack doesn't exists, replacing function failed")
          return
        }

        const old_func = window.BrowserBack
        // Function signature should be valid for FF 38.x & 45.x
        window.BrowserBack = function(_aEvent) {
          "use strict"
          let result

          tk.debug(">>> window.BrowserBack >>>")
          const selected_tab_before_operation = gBrowser.selectedTab
          tk.addingTab({
            added_tab_type: "related",
            parent_tab: selected_tab_before_operation,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "related",
              parent_tab: selected_tab_before_operation,
            })
          }
          tk.debug("<<< window.BrowserBack <<<")

          return result
        }
      })()

      // For opening new tab with history entry of current tab
      ;(function init_BrowserForward() {
        "use strict"

        if (!("BrowserForward" in window) || typeof window.BrowserForward !== "function") {
          tk.debug("window.BrowserForward doesn't exists, replacing function failed")
          return
        }

        const old_func = window.BrowserForward
        // Function signature should be valid for FF 38.x & 45.x
        window.BrowserForward = function(_aEvent) {
          "use strict"
          let result

          tk.debug(">>> window.BrowserForward >>>")
          const selected_tab_before_operation = gBrowser.selectedTab
          tk.addingTab({
            added_tab_type: "related",
            parent_tab: selected_tab_before_operation,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "related",
              parent_tab: selected_tab_before_operation,
            })
          }
          tk.debug("<<< window.BrowserForward <<<")

          return result
        }
      })()

      // For duplicating tab?
      ;(function init_BrowserReloadOrDuplicate() {
        "use strict"

        if (!("BrowserReloadOrDuplicate" in window) || typeof window.BrowserReloadOrDuplicate !== "function") {
          tk.debug("window.BrowserReloadOrDuplicate doesn't exists, replacing function failed")
          return
        }

        const old_func = window.BrowserReloadOrDuplicate
        // Function signature should be valid for FF 38.x & 45.x
        window.BrowserReloadOrDuplicate = function(_aEvent) {
          "use strict"
          let result

          tk.debug(">>> window.BrowserReloadOrDuplicate >>>")
          const selected_tab_before_operation = gBrowser.selectedTab
          tk.addingTab({
            added_tab_type: "related",
            parent_tab: selected_tab_before_operation,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "related",
              parent_tab: selected_tab_before_operation,
            })
          }
          tk.debug("<<< window.BrowserReloadOrDuplicate <<<")

          return result
        }
      })()

      // For loading a search result
      ;(function init_BrowserSearch_loadSearch() {
        "use strict"

        if (!("loadSearch" in BrowserSearch) || typeof BrowserSearch.loadSearch !== "function") {
          tk.debug("BrowserSearch.loadSearch doesn't exists, replacing function failed")
          return
        }

        const old_func = BrowserSearch.loadSearch
        // Function signature should be valid for FF 38.x & 45.x
        BrowserSearch.loadSearch = function(searchText: string, useNewTab: boolean, purpose: string) {
          "use strict"
          let result

          tk.debug(">>> BrowserSearch.loadSearch >>>")
          const selected_tab_before_operation = gBrowser.selectedTab
          tk.addingTab({
            added_tab_type: "related",
            parent_tab: selected_tab_before_operation,
          })
          try {
            result = old_func.apply(this, [searchText, useNewTab, purpose])
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "related",
              parent_tab: selected_tab_before_operation,
            })
          }
          tk.debug("<<< BrowserSearch.loadSearch <<<")

          return result
        }
      })()

      // The search bar behaviour
      ;(function init_searchbar_handleSearchCommand() {
        "use strict"

        // This can be `null` when there is no search bar
        // `BrowserSearch.searchBar` is just a shortcut
        // https://searchfox.org/mozilla-esr38/source/browser/base/content/browser.js#3527
        // https://searchfox.org/mozilla-esr45/source/browser/base/content/browser.js#3746
        const searchbar = BrowserSearch.searchBar
        if (typeof searchbar !== "object" ||
            searchbar === null ||
            !("handleSearchCommand" in searchbar) ||
            typeof searchbar.handleSearchCommand !== "function") {
          tk.debug("searchbar.handleSearchCommand doesn't exists, replacing function failed")
          return
        }

        const old_func = searchbar.handleSearchCommand
        // Function signature should be valid for FF 38.x & 45.x
        searchbar.handleSearchCommand = function(aEvent: Event, aEngine: any, aForceNewTab: any) {
          "use strict"
          let result

          tk.debug(">>> searchbar.handleSearchCommand >>>")
          tk.addingTab({
            added_tab_type: "unrelated",
            parent_tab: gBrowser.selectedTab,
          })
          try {
            result = old_func.apply(this, [aEvent, aEngine, aForceNewTab])
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "unrelated",
            })
          }
          tk.debug("<<< searchbar.handleSearchCommand <<<")

          return result
        }
      })()

      // Not sure what is this
      // This is converted from code brought from Tab Kit 1
      ;(function init_window_middleMousePaste() {
        "use strict"

        if (!("middleMousePaste" in window) || typeof window.middleMousePaste !== "function") {
          tk.debug("window.middleMousePaste doesn't exists, replacing function failed")
          return
        }

        const old_func = window.middleMousePaste
        // Function signature should be valid for FF 38.x & 45.x
        window.middleMousePaste = function(_event) {
          "use strict"
          let result

          tk.debug(">>> window.middleMousePaste >>>")
          tk.addingTab({
            added_tab_type: "newtab",
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "newtab",
            })
          }
          tk.debug("<<< window.middleMousePaste <<<")

          return result
        }
      })()

      // Some drag & drop action, but not sure where
      ;(function init_window_newTabButtonObserver_onDrop() {
        "use strict"

        if (!("newTabButtonObserver" in window) ||
            typeof window.newTabButtonObserver !== "object" ||
            !("onDrop" in window.newTabButtonObserver) ||
            typeof window.newTabButtonObserver.onDrop !== "function") {
          tk.debug("window.newTabButtonObserver.onDrop doesn't exists, replacing function failed")
          return
        }

        const old_func = window.newTabButtonObserver.onDrop
        // Function signature should be valid for FF 38.x & 45.x
        window.newTabButtonObserver.onDrop = function(_event) {
          "use strict"
          let result

          tk.debug(">>> window.newTabButtonObserver.onDrop >>>")
          tk.addingTab({
            added_tab_type: "newtab",
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "newtab",
            })
          }
          tk.debug("<<< window.newTabButtonObserver.onDrop <<<")

          return result
        }
      })()

      // Properly new tab button and/or Ctrl-T
      ;(function init_window_BrowserOpenTab() {
        "use strict"

        if (!("BrowserOpenTab" in window) ||
            typeof window.BrowserOpenTab !== "function") {
          tk.debug("window.BrowserOpenTab doesn't exists, replacing function failed")
          return
        }

        const old_func = window.BrowserOpenTab
        // Function signature should be valid for FF 38.x & 45.x
        window.BrowserOpenTab = function(optional_options) {
          "use strict"
          let result
          // Default value
          let added_tab_type = "newtab"
          if (typeof optional_options === "object" &&
              "tab_kit_options" in optional_options &&
              typeof optional_options.tab_kit_options === "object" &&
              "added_tab_type" in optional_options.tab_kit_options &&
              typeof optional_options.tab_kit_options.added_tab_type === "string"
          ) {
            added_tab_type = optional_options.tab_kit_options.added_tab_type
          }
          // Default value
          let parent_tab = gBrowser.selectedTab
          if (typeof optional_options === "object" &&
              "tab_kit_options" in optional_options &&
              typeof optional_options.tab_kit_options === "object" &&
              "parent_tab" in optional_options.tab_kit_options &&
              typeof optional_options.tab_kit_options.parent_tab !== "undefined"
          ) {
            parent_tab = optional_options.tab_kit_options.parent_tab
          }

          tk.debug(">>> window.BrowserOpenTab >>>")
          tk.addingTab({
            added_tab_type: added_tab_type,
            parent_tab:     parent_tab,
          })
          try {
            result = old_func.apply(this, [])
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: added_tab_type,
              parent_tab:     parent_tab,
            })
          }
          tk.debug("<<< window.BrowserOpenTab <<<")

          return result
        }
      })()

      // Not sure which one uses it
      ;(function init_window_delayedOpenTab() {
        "use strict"

        if (!("delayedOpenTab" in window) ||
            typeof window.delayedOpenTab !== "function") {
          tk.debug("window.delayedOpenTab doesn't exists, replacing function failed")
          return
        }

        const old_func = window.delayedOpenTab
        // Function signature should be valid for FF 38.x & 45.x
        window.delayedOpenTab = function(aUrl, aReferrer, aCharset, aPostData, aAllowThirdPartyFixup) {
          "use strict"
          let result

          tk.debug(">>> window.delayedOpenTab >>>")
          tk.addingTab({
            added_tab_type: "newtab",
          })
          try {
            result = old_func.apply(this, [aUrl, aReferrer, aCharset, aPostData, aAllowThirdPartyFixup])
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "newtab",
            })
          }
          tk.debug("<<< window.delayedOpenTab <<<")

          return result
        }
      })()

      // Not sure which one uses it
      ;(function init_window_gURLBar_handleCommand() {
        "use strict"

        if (!("gURLBar" in window) ||
            typeof window.gURLBar !== "object" ||
            !("handleCommand" in window.gURLBar) ||
            typeof window.gURLBar.handleCommand !== "function") {
          tk.debug("window.gURLBar.handleCommand doesn't exists, replacing function failed")
          return
        }

        const old_func = window.gURLBar.handleCommand
        // Function signature should be valid for FF 38.x & 45.x
        window.gURLBar.handleCommand = function(aTriggeringEvent: any) {
          "use strict"
          let result
          let finalTriggeringEvent = aTriggeringEvent

          tk.debug(">>> window.gURLBar.handleCommand >>>")
          tk.addingTab({
            added_tab_type: "newtab",
          })
          try {
            // Open new tab for address bar by default if preference set
            if (_prefs.getBoolPref("openTabsFrom.addressBar")) {
              if (aTriggeringEvent instanceof KeyboardEvent) {
                // Creates a new event object from the old one with some properties modified
                // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
                finalTriggeringEvent = new KeyboardEvent(aTriggeringEvent.type, {
                  key:          aTriggeringEvent.key,
                  code:         aTriggeringEvent.code,
                  location:     aTriggeringEvent.location,
                  ctrlKey:      aTriggeringEvent.ctrlKey,
                  shiftKey:     aTriggeringEvent.shiftKey,

                  // The main reason why we need a new event object
                  altKey:       !aTriggeringEvent.altKey,

                  metaKey:      aTriggeringEvent.metaKey,
                  repeat:       aTriggeringEvent.repeat,
                  isComposing:  aTriggeringEvent.isComposing,

                  // Following properties are deprecated
                  charCode:     aTriggeringEvent.charCode,
                  keyCode:      aTriggeringEvent.keyCode,
                  which:        aTriggeringEvent.which,

                  // From https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/UIEvent
                  detail:               aTriggeringEvent.detail,
                  view:                 aTriggeringEvent.view,

                  // From https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
                  bubbles:              aTriggeringEvent.bubbles,
                  cancelable:           aTriggeringEvent.cancelable,
                })
              }
              else if (aTriggeringEvent instanceof MouseEvent) {
                // Creates a new event object from the old one with some properties modified
                // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent
                finalTriggeringEvent = new MouseEvent(aTriggeringEvent.type, {
                  screenX:        aTriggeringEvent.screenX,
                  screenY:        aTriggeringEvent.screenY,
                  clientX:        aTriggeringEvent.clientX,
                  clientY:        aTriggeringEvent.clientY,
                  ctrlKey:        aTriggeringEvent.ctrlKey,
                  shiftKey:       aTriggeringEvent.shiftKey,

                  // The main reason why we need a new event object
                  altKey:         !aTriggeringEvent.altKey,

                  metaKey:        aTriggeringEvent.metaKey,
                  button:         aTriggeringEvent.button,
                  buttons:        aTriggeringEvent.buttons,
                  relatedTarget:  aTriggeringEvent.relatedTarget,

                  // From https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/UIEvent
                  detail:               aTriggeringEvent.detail,
                  view:                 aTriggeringEvent.view,

                  // From https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
                  bubbles:              aTriggeringEvent.bubbles,
                  cancelable:           aTriggeringEvent.cancelable,
                })
              }
            }
            result = old_func.apply(this, [finalTriggeringEvent])
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "newtab",
            })
          }
          tk.debug("<<< window.gURLBar.handleCommand <<<")

          return result
        }
      })()

      // Some kind of cleanup function or remove tab callback
      ;(function init_window_gBrowser__endRemoveTab() {
        "use strict"

        if (!("gBrowser" in window) ||
            typeof window.gBrowser !== "object" ||
            !("_endRemoveTab" in window.gBrowser) ||
            typeof window.gBrowser._endRemoveTab !== "function") {
          tk.debug("window.gBrowser._endRemoveTab doesn't exists, replacing function failed")
          return
        }

        const old_func = window.gBrowser._endRemoveTab
        // Function signature should be valid for FF 38.x & 45.x
        window.gBrowser._endRemoveTab = function(_aTab: Tab) {
          "use strict"
          let result

          tk.debug(">>> window.gBrowser._endRemoveTab >>>")
          tk.addingTab({
            added_tab_type: "newtab",
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "newtab",
            })
          }
          tk.debug("<<< window.gBrowser._endRemoveTab <<<")

          return result
        }
      })()


      // Function called by context menu item
      // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/nsContextMenu.js#894
      // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#979
      ;(function() {
        "use strict"

        if (!("nsContextMenu" in window) ||
            typeof window.nsContextMenu !== "function" ||
            typeof window.nsContextMenu.prototype.openLinkInTab !== "function") {
          tk.debug("window.nsContextMenu.prototype.openLinkInTab doesn't exists, replacing function failed")
          return
        }

        const old_func = window.nsContextMenu.prototype.openLinkInTab
        // Function signature should be valid for FF 38.x & 45.x
        window.nsContextMenu.prototype.openLinkInTab = function() {
          "use strict"
          let result

          tk.debug(">>> window.nsContextMenu.prototype.openLinkInTab >>>")
          tk.addingTab({
            added_tab_type: "related",
            parent_tab: gBrowser.selectedTab,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "related",
            })
          }
          tk.debug("<<< window.nsContextMenu.prototype.openLinkInTab <<<")

          return result
        }
      })()

      // Function called by adding new tab
      ;(function() {
        "use strict"

        if (!("openLinkIn" in window) ||
            typeof window.openLinkIn !== "function") {
          tk.debug("window.openLinkIn doesn't exists, replacing function failed")
          return
        }

        const old_func = window.openLinkIn
        // https://dxr.mozilla.org/mozilla-release/search?q=function+openLinkIn&redirect=false
        window.openLinkIn = function(url, where, _params) {
          "use strict"
          let result

          tk.debug(">>> window.openLinkIn >>>")
          if (where === "tab") {
            tk.addingTab({
              added_tab_type: "related",
              parent_tab: gBrowser.selectedTab,
            })
          }
          try {
            result = old_func.apply(this, [url, where, _params])
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            if (where === "tab") {
              tk.addingTabOver({
                added_tab_type: "related",
              })
            }
          }
          tk.debug("<<< window.openLinkIn <<<")

          return result
        }
      })()

      // Function called by context menu item
      // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/nsContextMenu.js#926
      // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#1011
      ;(function() {
        "use strict"

        if (!("nsContextMenu" in window) ||
            typeof window.nsContextMenu !== "function" ||
            typeof window.nsContextMenu.prototype.openFrameInTab !== "function") {
          tk.debug("window.nsContextMenu.prototype.openFrameInTab doesn't exists, replacing function failed")
          return
        }

        const old_func = window.nsContextMenu.prototype.openFrameInTab
        // Function signature should be valid for FF 38.x & 45.x
        window.nsContextMenu.prototype.openFrameInTab = function() {
          "use strict"
          let result

          tk.debug(">>> window.nsContextMenu.prototype.openFrameInTab >>>")
          tk.addingTab({
            added_tab_type: "related",
            parent_tab: gBrowser.selectedTab,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "related",
            })
          }
          tk.debug("<<< window.nsContextMenu.prototype.openFrameInTab <<<")

          return result
        }
      })()

      // Function called by context menu item
      // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/nsContextMenu.js#1080
      // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#1182
      ;(function() {
        "use strict"

        if (!("nsContextMenu" in window) ||
            typeof window.nsContextMenu !== "function" ||
            typeof window.nsContextMenu.prototype.viewBGImage !== "function") {
          tk.debug("window.nsContextMenu.prototype.viewBGImage doesn't exists, replacing function failed")
          return
        }

        const old_func = window.nsContextMenu.prototype.viewBGImage
        // Function signature should be valid for FF 38.x & 45.x
        window.nsContextMenu.prototype.viewBGImage = function(_e: any) {
          "use strict"
          let result

          tk.debug(">>> window.nsContextMenu.prototype.viewBGImage >>>")
          tk.addingTab({
            added_tab_type: "related",
            parent_tab: gBrowser.selectedTab,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "related",
            })
          }
          tk.debug("<<< window.nsContextMenu.prototype.viewBGImage <<<")

          return result
        }
      })()

      // Function called by context menu item
      // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/nsContextMenu.js#1560
      // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#1650
      ;(function() {
        "use strict"

        if (!("nsContextMenu" in window) ||
            typeof window.nsContextMenu !== "function" ||
            typeof window.nsContextMenu.prototype.addDictionaries !== "function") {
          tk.debug("window.nsContextMenu.prototype.addDictionaries doesn't exists, replacing function failed")
          return
        }

        const old_func = window.nsContextMenu.prototype.addDictionaries
        // Function signature should be valid for FF 38.x & 45.x
        window.nsContextMenu.prototype.addDictionaries = function() {
          "use strict"
          let result

          tk.debug(">>> window.nsContextMenu.prototype.addDictionaries >>>")
          tk.addingTab({
            added_tab_type: "related",
            parent_tab: gBrowser.selectedTab,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "related",
            })
          }
          tk.debug("<<< window.nsContextMenu.prototype.addDictionaries <<<")

          return result
        }
      })()

      // Function called by context menu item
      // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/nsContextMenu.js#1031
      // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#1133
      ;(function() {
        "use strict"

        if (!("nsContextMenu" in window) ||
            typeof window.nsContextMenu !== "function" ||
            typeof window.nsContextMenu.prototype.viewMedia !== "function") {
          tk.debug("window.nsContextMenu.prototype.viewMedia doesn't exists, replacing function failed")
          return
        }

        const old_func = window.nsContextMenu.prototype.viewMedia
        // Function signature should be valid for FF 38.x & 45.x
        // https://searchfox.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#1133
        window.nsContextMenu.prototype.viewMedia = function(_e: any) {
          "use strict"
          let result

          tk.debug(">>> window.nsContextMenu.prototype.viewMedia >>>")
          tk.addingTab({
            added_tab_type: "related",
            parent_tab: gBrowser.selectedTab,
          })
          try {
            result = old_func.apply(this, arguments)
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: "related",
            })
          }
          tk.debug("<<< window.nsContextMenu.prototype.viewMedia <<<")

          return result
        }
      })()


      // Function called by ... Browser access?
      // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/browser.js#4666
      // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/browser.js#4983
      ;(function() {
        "use strict"

        if (!("nsBrowserAccess" in window) ||
            typeof window.nsBrowserAccess !== "function" ||
            typeof window.nsBrowserAccess.prototype.openURI !== "function") {
          tk.debug("window.nsBrowserAccess.prototype.openURI doesn't exists, replacing function failed")
          return
        }

        const old_func = window.nsBrowserAccess.prototype.openURI
        // Function signature should be valid for FF 38.x & 45.x
        window.nsBrowserAccess.prototype.openURI = function(aURI: any, aOpener: any, aWhere: any, aContext: any) {
          "use strict"
          let result

          tk.debug(">>> window.nsBrowserAccess.prototype.openURI >>>")
          const added_tab_type = aContext === Ci.nsIBrowserDOMWindow.OPEN_EXTERNAL ? "unrelated" : "related"
          tk.addingTab({
            added_tab_type: added_tab_type,
            parent_tab: gBrowser.selectedTab,
          })
          try {
            result = old_func.apply(this, [aURI, aOpener, aWhere, aContext])
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabOver({
              added_tab_type: added_tab_type,
            })
          }
          tk.debug("<<< window.nsBrowserAccess.prototype.openURI <<<")

          return result
        }
      })()


      // Function called by ... Browser access?
      // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#1414
      // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#1439
      ;(function() {
        "use strict"

        if (!("loadTabs" in gBrowser) ||
            typeof gBrowser.loadTabs !== "function") {
          tk.debug("gBrowser.loadTabs doesn't exists, replacing function failed")
          return
        }

        const old_func = gBrowser.loadTabs
        // Function signature should be valid for FF 38.x & 45.x
        gBrowser.loadTabs = function(aURIs: string[], aLoadInBackground: boolean, aReplace: boolean) {
          "use strict"
          let result

          tk.addingTabs({
            first_tab: aReplace ? gBrowser.selectedTab : null,
          })
          try {
            result = old_func.apply(this, [aURIs, aLoadInBackground, aReplace])
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            tk.addingTabsOver()
          }

          return result
        }
      })()

      // Function called by dragover event handler
      // Disable the sliding effect of tab dragging until here is an preference
      // Defined in
      // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#4112
      // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#4959
      ;(function() {
        "use strict"

        if (typeof gBrowser.tabContainer !== "object" ||
            typeof gBrowser.tabContainer._animateTabMove !== "function") {
          tk.debug("gBrowser.tabContainer._animateTabMove doesn't exists, replacing function failed")
          return
        }

        // Function signature should be valid for FF 38.x & 45.x
        gBrowser.tabContainer._animateTabMove = function() {
          "use strict"

          this._handleTabSelect()
        }
      })()
    }
    this.postInitListeners.push(this.postInitSortingAndGrouping)

    /// More globals (for group by opener):
    this.nextType        = null
    this.isBookmarkGroup = false
    this.nextParent      = null
    this.lastParent      = null
    this.dontMoveNextTab = false
    this.ignoreOvers     = 0 // TODO=P5: TJS Auto unset this after a timeout?
    this.addedTabs       = []

    /// Method Hooks (for group by opener):
    this.preInitSortingAndGroupingMethodHooks = function preInitSortingAndGroupingMethodHooks() {
      (function() {
        // "use strict"

        if (typeof gBrowser.addTab !== "function") {
          tk.debug("gBrowser.addTab doesn't exists, replacing function failed")
          return
        }

        const old_func = gBrowser.addTab
        // Function signature should be valid for FF 38.x & 45.x
        gBrowser.addTab = function(_aURI: string, _aReferrerURI: any, _aCharset: string, _aPostData: any, _aOwner: any, _aAllowThirdPartyFixup: boolean) {
          // "use strict"
          let aSkipAnimation = false

          // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#1810
          // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#1888
          if (arguments.length === 2 &&
              typeof _aReferrerURI === "object" &&
              ("skipAnimation" in _aReferrerURI)) {
            aSkipAnimation = _aReferrerURI.skipAnimation
          }

          if (aSkipAnimation && !tk.isBookmarkGroup) {
            tk.addingTab({
              added_tab_type: "sessionrestore",
              should_keep_added_tab_position: true,
            })
          }
          const result = old_func.apply(this, arguments)
          const tab = result
          if (aSkipAnimation && !tk.isBookmarkGroup && tab != null) {
            tk.addingTabOver({
              added_tab:  tab,
              added_tab_type: "sessionrestore",
              should_keep_added_tab_position: true,
            })
          }

          return result
        }
      })()

      // And an attribute based related tab source:
      const reportPhishing = document.getElementById("menu_HelpPopup_reportPhishingtoolmenu")
      if (typeof reportPhishing === "object" && reportPhishing != null && "setAttribute" in reportPhishing) {
        const original_command_str = reportPhishing.getAttribute("oncommand")
        reportPhishing.
        setAttribute(
          "oncommand",
          "tk.addingTab({ \
            added_tab_type: 'related', \
            parent_tab: gBrowser.selectedTab \
          }) try {" + original_command_str + "} \
          finally { \
            tk.addingTabOver({ \
              added_tab_type: 'related' \
            }) \
          }"
        )
      }


      // And an attribute based history tab source:
      let goMenu: Element | undefined = document.getElementById("history-menu")
      if (!(typeof goMenu === "object" && goMenu != null && "setAttribute" in goMenu)) {
        goMenu = document.getElementById("go-menu")
      }
      if (typeof goMenu === "object" && goMenu != null && "setAttribute" in goMenu) {
        const original_command_str = goMenu.getAttribute("oncommand")
        goMenu.
        setAttribute(
          "oncommand",
          "tk.addingTab({ \
            added_tab_type: 'history', \
            parent_tab: gBrowser.selectedTab \
          }) try {" + original_command_str + "} \
          finally { \
            tk.addingTabOver({ \
              added_tab_type: 'history' \
            }) \
          }"
        )
      }
    }
    this.preInitListeners.push(this.preInitSortingAndGroupingMethodHooks)

    // See globalPreInitSortingAndGroupingMethodHooks in tabkit-global.js

    /// Methods dealing with new tabs:
    this.addingTab = function addingTab(type_or_options: string | {
      added_tab_type?: string,
      parent_tab?: Tab,
      should_keep_added_tab_position?: boolean,
    }, parent: Tab, dontMoveNextTab: any) {
      try {
        // Already got type?
        // Then ignore addingTabOver processing
        if (tk.nextType) {
          tk.ignoreOvers++
          return
        }

        if (typeof type_or_options === "object") {
          const options = type_or_options

          if (("added_tab_type" in options) && options.added_tab_type != null) {
            tk.nextType = options.added_tab_type
          }
          // This is special: will assign to `null` if provided
          if (("parent_tab" in options) && typeof options.parent_tab !== "undefined") {
            tk.nextParent = options.parent_tab
          }
          if (("should_keep_added_tab_position" in options) && options.should_keep_added_tab_position != null) {
            // Will convert to `bool`
            tk.dontMoveNextTab = options.should_keep_added_tab_position
          }
        }
        else {
          tk.nextType = type_or_options
          tk.isBookmarkGroup = false
          tk.nextParent = parent != null ? parent : gBrowser.selectedTab
          // Will convert to `bool`
          tk.dontMoveNextTab = !!dontMoveNextTab
        }
      }
      catch (ex) {
        tk.dump(ex)
      }
    }

    // For adding one tab
    // There is another function named addingTabsOver for multiple tabs
    this.addingTabOver = function addingTabOver(options?: {
      added_tab?: Tab
      added_tab_type?: string
      should_keep_added_tab_position?: boolean
      parent_tab?: Tab,
    }) {
      let added_tabs_from_params_or_global: Tab[]
      let parent_tab_from_params_or_global = null
      let added_tab_type_from_params_or_global: string
      let should_keep_added_tab_position_from_params_or_global: boolean

      if (typeof options === "object" && ("added_tab" in options) && options.added_tab != null) {
        added_tabs_from_params_or_global = [options.added_tab]
      }
      else {
        added_tabs_from_params_or_global = tk.addedTabs
      }

      if (typeof options === "object" && ("added_tab_type" in options) && options.added_tab_type != null) {
        added_tab_type_from_params_or_global = options.added_tab_type
      }
      else {
        added_tab_type_from_params_or_global = tk.nextType
      }

      // sessionrestore tabs have no parent
      // unrelated tabs? Let it be (What)
      if (added_tab_type_from_params_or_global === "sessionrestore") {
        // parent_tab_from_params_or_global = null
      }
      else {
        if (typeof options === "object" && ("parent_tab" in options) && options.parent_tab != null) {
          parent_tab_from_params_or_global = options.parent_tab
        }
        else {
          parent_tab_from_params_or_global = tk.nextParent
        }
      }

      if (typeof options === "object" && ("should_keep_added_tab_position" in options) && options.should_keep_added_tab_position != null) {
        should_keep_added_tab_position_from_params_or_global = options.should_keep_added_tab_position
      }
      else {
        should_keep_added_tab_position_from_params_or_global = tk.dontMoveNextTab
      }

      try {
        if (tk.ignoreOvers > 0) {
          // tk.ignoreOvers will be decremented in the finally clause at the end of this function
          return
        }

        if (added_tabs_from_params_or_global.length > 1) { // Shouldn't happen
          tk.dump("addingTabsOver: More than one tab was added (" + added_tabs_from_params_or_global.length + " tabs, to be precise)!")
          tk.addingTabsOver()
          return
        }

        if (added_tabs_from_params_or_global.length === 1) {
          let type = added_tab_type_from_params_or_global
          // The first tab restored from session also has no parent
          const parent = parent_tab_from_params_or_global
          const tab = added_tabs_from_params_or_global.pop()

          // Keep recentlyadded tags up to date
          if (!parent || parent !== tk.lastParent)
            for (let i = 0; i < _tabs.length; i++)
              _tabs[i].removeAttribute("recentlyadded")
          tk.lastParent = tk.nextParent

          // We do *nothing else* for sessionrestore tabs, as they will (hopefully) be dealt with later after a sortgroup_onSSTabRestoring
          if (type === "sessionrestore") {
            return
          }

          // Get pid, set possibleparent
          const pid = parent ? tk.getTabId(parent) : null
          if (pid != null) {
            tab.setAttribute("possibleparent", pid)
          }
          else if (type !== "unrelated") {
            tk.dump("addingTabOver: no parent for " + (type || "") + " tab")
          }

          // Adjust openerGroup sensitivity
          if (type === "bookmark" && _prefs.getBoolPref("bookmarkTabsAreRelated")) {
            type = "related"
          }
          else if (type === "history" && _prefs.getBoolPref("historyTabsAreRelated")) {
            type = "related"
          }
          else if (type === "newtab" && _prefs.getBoolPref("newTabsAreRelated")) {
            type = "related"
          }
          else if (type === "sessionrestore") {
            type = "unrelated"
          }

          // Set openerGroup (reused later if autoGroupNewTabs and activeGrouping === "opener")
          let openerGroup = ""
          let ogAttr = null as any
          if (type === "related" && pid && parent) {
            ogAttr = tk.Groupings.opener
            openerGroup = parent.getAttribute(ogAttr)
            if (openerGroup) {
              tab.setAttribute(ogAttr, openerGroup)
            }
            else {
              openerGroup = ":oG-" + pid
              parent.setAttribute(ogAttr, openerGroup)
              tab.setAttribute(ogAttr, openerGroup)
            }
          }

          let tabNeedsPlacing = !should_keep_added_tab_position_from_params_or_global

          if (tk.autoGroupNewTabs) {
            if (!tabNeedsPlacing
              && tab.previousSibling
              && tab.nextSibling
              && tab.previousSibling.getAttribute("groupid")
              && tab.previousSibling.getAttribute("groupid") === tab.nextSibling.getAttribute("groupid"))
            {
              if (type === "unrelated") {
                tk.keepGroupsTogether()
              }
              else {
                const gid = tab.previousSibling.getAttribute("groupid")
                tk.setGID(tab, gid)
                tab.setAttribute("outoforder", "true")
              }
            }
            else if (tk.activeGrouping === "opener") {
              if (type === "related" && pid && parent) {
                const pgid = parent.getAttribute("groupid")
                let nearbyTabHasSameParentGroup: boolean
                if (pgid) {
                  nearbyTabHasSameParentGroup =
                    (tab.previousSibling && tab.previousSibling.getAttribute("groupid") === pgid) ||
                    (tab.nextSibling && tab.nextSibling.getAttribute("groupid") === pgid)
                }
                else {
                  nearbyTabHasSameParentGroup =
                    (tab.previousSibling && tab.previousSibling === parent) ||
                    (tab.nextSibling && tab.nextSibling === parent)
                }
                // If tabNeedsPlacing or is already in place
                if (tabNeedsPlacing || nearbyTabHasSameParentGroup) {
                  // Group tab
                  let grouped = false
                  if (pgid) {
                    // TODO=P4: ??? allow forcing all groups to act as openergroups?
                    //if (pgid.indexOf(openerGroup) !== -1 || pgid.indexOf(":tmpOG-") !== -1) {
                    if (pgid.indexOf(":oG-") !== -1 || pgid.indexOf(":tmpOG-") !== -1) { // So :oG-bookmarkGroup- works as intended
                      tk.setGID(tab, pgid)
                      grouped = true
                    }
                  }
                  else if (!pgid) {
                    if (tk.getGroupById(openerGroup).length !== 0 || tk.getUngroupedTabsByAttr(ogAttr, openerGroup).length !== 2) {
                      openerGroup = ":tmpOG-" + pid
                    }
                    tk.setGID(parent, openerGroup)
                    tk.setGID(tab, openerGroup)
                    grouped = true
                  }

                  // If we have permission to move the tab
                  if (tabNeedsPlacing && grouped) {
                    // Position tab
                    const gid = parent.getAttribute("groupid")

                    const newPos = tk.newTabPosition
                    const autoSortOpenerGroups = _prefs.getBoolPref("autoSortOpenerGroups")
                    if ((autoSortOpenerGroups && (tk.countGroups(gid) === 1 || tk.activeSort === "origin")) // We can't really autosort merged groups
                      || newPos === 1
                      || (newPos === 2 && tk.activeSort === "origin"))
                    { // Next to current
                      switch (tk.openRelativePosition) {
                        case "left":
                          tk.moveBefore(tab, parent)
                          break
                        case "right":
                          tk.moveAfter(tab, parent)
                          break
                        default: { //case "rightOfRecent": case "rightOfConsecutive":
                          let target = parent
                          while (target.nextSibling && target.nextSibling.getAttribute("groupid") === gid && target.nextSibling.hasAttribute("recentlyadded"))
                            target = target.nextSibling
                          tk.moveAfter(tab, target)
                          tab.setAttribute("recentlyadded", "true")
                        }
                      }
                      tab.setAttribute("outoforder", "true")
                    }
                    else if (newPos === 0) { // At far right
                      let target = parent
                      while (target.nextSibling && target.nextSibling.getAttribute("groupid") === gid)
                        target = target.nextSibling
                      tk.moveAfter(tab, target)
                      tab.setAttribute("outoforder", "true")
                    }
                    else { // By last sort (newPos === 2)
                      tk.insertTab(tab, gid)
                    }

                    tabNeedsPlacing = false
                  }
                }
              }
            }
            else if (tk.activeGrouping === "domain") {
              let domain = tab.getAttribute(tk.Groupings.domain)
              if (domain) {
                let group = tk.getGroupById(domain)
                let nearbyTabHasSameDomain: boolean
                if (group.length > 0) {
                  nearbyTabHasSameDomain =
                    (tab.previousSibling && tab.previousSibling.getAttribute("groupid").indexOf(domain) !== -1)
                    || (tab.nextSibling && tab.nextSibling.getAttribute("groupid").indexOf(domain) !== -1)
                }
                else {
                  nearbyTabHasSameDomain =
                    (tab.previousSibling && tab.previousSibling.getAttribute(tk.Groupings.domain) === domain) ||
                    (tab.nextSibling && tab.nextSibling.getAttribute(tk.Groupings.domain) === domain)
                }
                // If tabNeedsPlacing or is already in place
                if (tabNeedsPlacing || nearbyTabHasSameDomain) {
                  // Group tab
                  if (group.length === 0) {
                    group = tk.getUngroupedTabsByAttr(tk.Groupings.domain, domain)
                    if (group.length === 2) // TODO=P2: GCODE Replace this simplistic check with an attribute remembering whether tabs were explicitly ungrouped, or are happy to be made into a domain group
                      for (let i = 0; i < group.length; i++)
                        tk.setGID(group[i], domain)
                    else
                      group = []
                  }
                  else {
                    domain = group[0].getAttribute("groupid")
                    tk.setGID(tab, domain)
                  }
                  // If we have permission to move the tab
                  if (tabNeedsPlacing && group.length > 0) {
                    // Position tab
                    const autoSortDomainGroups = _prefs.getBoolPref("autoSortDomainGroups")
                    if (autoSortDomainGroups && tk.countGroups(domain) === 1) { // We can't really autosort merged groups
                      tk.insertTab(tab, domain, "uri")
                    }
                    else {
                      let newPos = tk.newTabPosition
                      if (newPos === 2)
                        newPos = (tk.activeSort === "origin") ? 1 : (autoSortDomainGroups ? 0 : newPos)
                      if (newPos === 1 && (!pid || parent && parent.getAttribute("groupid").indexOf(domain) === -1))
                        newPos = 0
                      if (newPos === 1) { // Next to current
                        switch (tk.openRelativePosition) {
                          case "left":
                            tk.moveBefore(tab, parent)
                            break
                          case "right":
                            tk.moveAfter(tab, parent)
                            break
                          default: { //case "rightOfRecent": case "rightOfConsecutive":
                            let target = parent
                            if (target == null) {
                              break
                            }
                            while (target.nextSibling && target.nextSibling.getAttribute("groupid") === domain && target.nextSibling.hasAttribute("recentlyadded"))
                              target = target.nextSibling
                            tk.moveAfter(tab, target)
                            tab.setAttribute("recentlyadded", "true")
                          }
                        }
                        tab.setAttribute("outoforder", "true")
                      }
                      else if (newPos === 0 && parent) { // At far right
                        const gid = parent.getAttribute("groupid")
                        let target = parent
                        while (target.nextSibling && target.nextSibling.getAttribute("groupid") === gid)
                          target = target.nextSibling
                        tk.moveAfter(tab, target)
                        tab.setAttribute("outoforder", "true")
                      }
                      else { // By last sort (newPos === 2)
                        tk.insertTab(tab, domain)
                      }
                    }

                    tabNeedsPlacing = false
                  }
                }
              }
            }
          }

          if (tabNeedsPlacing) {
            let newPos = tk.newTabPosition
            if (newPos === 2 && tk.activeSort === "origin")
              newPos = 1
            if (newPos === 1 && !pid)
              newPos = 0
            switch (newPos) {
              case 1: { // Next to current
                let target = parent
                if (parent == null || target == null) {
                  break
                }
                const pagid = parent.getAttribute("groupid")
                // First exit any groups
                if (tk.openRelativePosition === "left") {
                  if (pagid)
                    while (target.previousSibling && target.previousSibling.getAttribute("groupid") === pagid)
                      target = target.previousSibling
                  tk.moveBefore(tab, target)
                } else {
                  if (pagid)
                    while (target.nextSibling && target.nextSibling.getAttribute("groupid") === pagid)
                      target = target.nextSibling
                  while (tk.openRelativePosition !== "right" && target.nextSibling && !target.nextSibling.hasAttribute("groupid") && target.nextSibling.hasAttribute("recentlyadded"))
                    target = target.nextSibling
                  tk.moveAfter(tab, target)
                  if (tk.openRelativePosition !== "right")
                    tab.setAttribute("recentlyadded", "true")
                }
                tab.setAttribute("outoforder", "true")
                break
              }
              case 2: // By last sort
                tk.insertTab(tab)
                break
              default: //case 0: // At far right
                // No need to move it, since it is already in the right place
                tab.setAttribute("outoforder", "true")
            }
          }
        }
      }
      catch (ex) {
        tk.dump(ex)
      }
      finally {
        // Don't reset until counter ends
        if (tk.ignoreOvers > 0) {
          tk.ignoreOvers--
        }
        else {
          // Reset
          tk.nextType = null
          tk.isBookmarkGroup = false
          tk.nextParent = null
          tk.dontMoveNextTab = false
        }
      }
    }

    this.addingTabs = function addingTabs(options: {first_tab?: Tab} = {}) {
      const first_tab = options.first_tab

      try {
        if (tk.nextType) { // Unlikely
          tk.ignoreOvers++
          return
        }

        if (first_tab) {
          tk.addedTabs = [first_tab]
          tk.nextType = "loadOneOrMoreURIs"
        }
        else {
          tk.nextType = "loadTabs"
          tk.nextParent = gBrowser.selectedTab // To make addingTabOver happy!
        }
      }
      catch (ex) {
        tk.dump(ex)
      }
    }

    this.addingTabsOver = function addingTabsOver() {
      if (tk.ignoreOvers > 0) {
        tk.ignoreOvers--
        return
      }

      try {
        if (tk.addedTabs.length > 1) {
          // We always do loadOneOrMoreURIs, thanks to sortgroup_onTabAdded
          const firstTab = tk.addedTabs[0]
          const pid = firstTab.getAttribute("possibleparent")
          let openerGroup = firstTab.getAttribute(tk.Groupings.opener)
          let gid = firstTab.getAttribute("groupid")
          if (!openerGroup) {
            openerGroup = ":oG-bookmarkGroup-" + tk.getTabId(firstTab)
            firstTab.setAttribute(tk.Groupings.opener, openerGroup)
            if (tk.autoGroupNewTabs && !gid) {
              gid = openerGroup
              tk.setGID(firstTab, gid)
            }
          }
          else if (tk.autoGroupNewTabs && !gid) {
            gid = ":oG-bookmarkGroup-" + tk.generateId() // Pretend to be an openerGroup )
            tk.setGID(firstTab, gid)
          }
          for (let i = tk.addedTabs.length - 1; i >= 1; i--) {
            const tab = tk.addedTabs[i]
            tk.moveAfter(tab, firstTab) // n.b. this is sometimes redundant since loadTabs already moves the tabs if loadOneOrMoreURIs (from Fx2)
            if (tk.autoGroupNewTabs)
              tk.setGID(tab, gid)
            if (pid) {
              tab.setAttribute("possibleparent", pid)
              tk.updateIndents()
            }
            tab.setAttribute(tk.Groupings.opener, openerGroup)
            //tab.setAttribute("outoforder", "true") // Hmm, this will generally be the case...
          }
        }

        for (let i = 0; i < _tabs.length; i++)
          _tabs[i].removeAttribute("recentlyadded")
        //tk.lastParent = null // Irrelevant since we've already cleared recentlyadded...
      }
      catch (ex) {
        tk.dump(ex)
      }
      finally {
        tk.nextType = null
        tk.isBookmarkGroup = false
        tk.nextParent = null // For good measure
        tk.dontMoveNextTab = false // For good measure
        tk.addedTabs.length = 0 // Clear added tabs
      }
    }

    // A collection of stack signatures we use to classify tab sources (see the end of sortgroup_onTabAdded)
    // Note: This can't replace cases where an explicit parent tab must be set
    // TODO=P4: GCODE Use sourceTypes for more tab sources
    this.sourceTypes = [ // TODO=P3: TJS Store full stack signatures here (even if only the last element is used)
      { depth: 5, name: "goup_up",         type: "related" }, //postInitype: if ("goup_up" in window && window.goup_up) tk.wrapMethodCode('window.goup_up', 'tk.addingTab("related") try {', '} finally { tk.addingTabOver() }')
      { depth: 4, name: "diggerLoadURL",     type: "related" }, //diggerLoadURL
      { depth: 3, name: "mlb_common_Utils_openUrlInNewTab", type: "related" }, //Mouseless Browsing mlb_common.Utils.openUrlInNewTab (but only after Tab Kit assigns a name to the function in postInitSortingAndGroupingMethodHooks!) [[[1. win_open 2. open 3. mlb_common_Utils_openUrlInNewTab 4.  5. ]]]
      { depth: 3, name: "activateLinks",     type: "related" }, //Snap Links Plus [[[1. openTabs 2. executeAction 3. activateLinks 4. eventMouseUp]]]
      { depth: 3, name: "gotoHistoryIndex",   type: "related" }, //gotoHistoryIndex [[[1. loadOneTab 2. openUILinkIn 3. gotoHistoryIndex 4. anonymous 5. checkForMiddleClick 6. onclick]]]
      { depth: 3, name: "BrowserBack",       type: "related" }, //BrowserBack [[[1. loadOneTab 2. openUILinkIn 3. BrowserBack 4. anonymous 5. checkForMiddleClick 6. onclick]]]
      { depth: 3, name: "BrowserForward",   type: "related" }, //BrowserForward [[[1. loadOneTab 2. openUILinkIn 3. BrowserForward 4. anonymous 5. checkForMiddleClick 6. onclick]]]
      { depth: 3, name: "BrowserReloadOrDuplicate", type: "related" }, //BrowserReloadOrDuplicate [[[1. loadOneTab 2. openUILinkIn 3. BrowserReloadOrDuplicate 4. anonymous 5. checkForMiddleClick]]]]
      { depth: 2, name: "BrowserSearch_search",  type: "related" }, //BrowserSearch.loadSearch
      { depth: 3, name: "handleLinkClick",     type: "related" }, //handleLinkClick [[[1. loadOneTab 2. openNewTabWith 3. handleLinkClick 4. contentAreaClick 5. onclick]]]
      { depth: 1, name: "webdeveloper_generateDocument", type: "related" }, //webdeveloper_generateDocument (WebDeveloper extension)
      { depth: 1, name: "openSelectedLinks",   type: "related" }, //Tab Kit openSelectedLinks [[[1: openSelectedLinks]]]

      { depth: 5, name: "BM_onCommand",     type: "newtab" }, //BM_onCommand [[[1. loadOneTab 2. openUILinkIn 3. PU_openNodeIn 4. PU_openNodeWithEvent 5. BM_onCommand]]]
      { depth: 5, name: "ondragdrop",     type: "newtab" }, //newTabButtonObserver.onDrop [[[1. loadOneTab 2. openNewTabWith 3.  4.  5. ondragdrop]]] // Could make unrelated if from a different window?
      { depth: 4, name: "middleMousePaste",   type: "newtab" }, //middleMousePaste
      { depth: 4, name: "handleCommand",     type: "newtab" }, //[Fx3.5+] gURLBar.handleCommand [[[1.loadOneTab 2. openUILinkIn 3. openUILink 4. handleCommand 5. onclick]]]
      { depth: 2, name: "BrowserOpenTab",   type: "newtab" }, //BrowserOpenTab [[[1. loadOneTab 2. BrowserOpenTab 3. oncommand]]] // Amongst other traces
      { depth: 2, name: "delayedOpenTab",   type: "newtab" }, //delayedOpenTab
      { depth: 2, name: "handleCommand",     type: "newtab" }, //[Fx3.5+] gURLBar.handleCommand [[[1.loadOneTab 2. handleCommand 3. anonymous 4. fireEvent 5. onTextEntered]]]
      { depth: 1, name: "_endRemoveTab",     type: "newtab" }, //[Fx3.5+] gBrowser._endRemoveTab [[[1. _endRemoveTab 2. removeTab 3. removeCurrentTab 4. BrowserCloseTabOrWindow 5. oncommand]]]

      { depth: 4, name: "openReleaseNotes",   type: "unrelated" }, //openReleaseNotes [[[1. loadOneTab 2. openUILinkIn 3. openUILink 4. openReleaseNotes 5. anonymous 6. checkForMiddleClick 7. onclick]]]

      { depth: 1, name: "sss_duplicateTab",   type: "sessionrestore", DontMoveTab: true }, //sss_duplicateTab [[[1. sss_duplicateTab 2. duplicateTab ...]]]
      { depth: 1, name: "sss_undoCloseTab",   type: "sessionrestore", DontMoveTab: true }, //sss_undoCloseTab [[[1. sss_undoCloseTab 2. undoCloseTab 3. undoCloseTab 4. oncommand]]]
      { depth: 1, name: "sss_restoreWindow",   type: "sessionrestore", DontMoveTab: true },  //sss_restoreWindow, Firefox 14 or below
    ]
    this.sourceTypes.sort(function __compareSourceDepths(a: {depth: number}, b: {depth: number}) { return b.depth - a.depth }) // Sort by decreasing d(epth)

    /// Event Handlers:
    this.sortgroup_onTabAdded = function sortgroup_onTabAdded(event: {target: Tab, fromInitSortingAndGrouping?: boolean}) {
      const tab = event.target as Tab

      const tid = tk.generateNewTabId(tab)

      // Set keys
      tab.setAttribute(tk.Sorts.lastViewed, new Date().setFullYear(2030).toString()) // Set never viewed tabs as viewed in the future!
      tab.setAttribute(tk.Sorts.lastLoaded, new Date().setFullYear(2030).toString()) // Set never loaded tabs as loaded in the future!
      tk.setTabUriKey(tab)

      // Sort/group
      if (tk.nextType) {
        tk.addedTabs.push(tab)
        // A quick hack to avoid code duplication: we use addingTabOver to position
        // the first tab, then we can treat the rest as a loadOneOrMoreURIs
        if (tk.nextType === "loadTabs" && tk.addedTabs.length === 1) {
          tk.nextType = tk.isBookmarkGroup ? "bookmark" : "newtab"
          tk.dontMoveNextTab = false
          tk.addingTabOver({
            added_tab: tab,
            added_tab_type: tk.isBookmarkGroup ? "bookmark" : "newtab",
            should_keep_added_tab_position: false,
          })
          tk.addedTabs = [tab]
          tk.nextType = "loadTabs" // But it can now be treated as "loadOneOrMoreURIs"
        }
      }
      else if (!("fromInitSortingAndGrouping" in event)) {
        // Should be buggy if this statement is true
        if (!tk.nextType) {
          tk.debug("No nextType for added tab: " + tid)
          tk.nextType = "newtab"
        }

        tk.isBookmarkGroup = false
        tk.addingTabOver({
          parent_tab: gBrowser.selectedTab,
          added_tab:  tab,
        })
      }

    }

    this.sortgroup_onTabSelect = function sortgroup_onTabSelect(event: Event) {
      const tab = event.target as Tab
      tab.setAttribute(tk.Sorts.lastViewed, Date.now().toString())

      // Arguably should only apply if select outside of the last parent's children
      if (tk.openRelativePosition === "rightOfRecent")
        for (let i = 0; i < _tabs.length; i++)
          _tabs[i].removeAttribute("recentlyadded")

      if (_prefs.getBoolPref("autoCollapse")) {
        // Auto-collapse inactive groups
        if (tab.hasAttribute("groupid"))
          tk.updateAutoCollapse()
        // Else leave the last used group uncollapsed, so you can drag tabs into it, etc.
      }
      else if (tab.hidden && tab.hasAttribute("groupcollapsed")) { // visibility of a tab
        // Auto-expand groups when a hidden tab is accessed (note that normal methods of switching tabs skip these)
        tk.toggleGroupCollapsed(tab)
      }
    }

    // TODO=P3: GCODE Call updateAutoCollapse on restore if selected before the groupid is restored
    this.updateAutoCollapse = function updateAutoCollapse(group?: Tab[]) {
      if (!_prefs.getBoolPref("autoCollapse"))
        return

      // Autocollapse inactive groups
      if (!group || !("length" in group)) {
        const all_groups = tk.getAllGroups()
        for (const gid in all_groups) {
          const g = all_groups[gid]
          tk.updateAutoCollapse(g)
        }
        return
      }

      const gid = gBrowser.selectedTab.getAttribute("groupid")
      const fixIndents = tk.subtreesEnabled()
      const indent = _prefs.getIntPref("indentAmount")
      if (group[0].getAttribute("groupid") === gid) {
        group.forEach(function(t: Tab) {
          t.removeAttribute("groupcollapsed")
          tk.tabSetHidden(t, false) // visibility of a tab
          if (fixIndents && ("treeLevel" in t))
            t.style.setProperty("margin-left", (indent * t.treeLevel) + "px", "important")
        })
      }
      else {
        const visible = [] as Tab[]
        group.forEach(function(t: Tab) {
          if (!t.hidden) // visibility of a tab
            visible.push(t)
          if (fixIndents)
            t.style.marginLeft = ""
        })
        if (visible.length === 0) {
          group.sort(tk.compareTabViewedExceptUnread)
          tk.tabSetHidden(group[group.length - 1], false) // visibility of a tab
        }
        else if (visible.length > 1) {
          visible.sort(tk.compareTabViewedExceptUnread)

          //1. hide them all first
          visible.forEach(function(t) {
            tk.tabSetHidden(t, true) // visibility of a tab
          })

          //2. decide which to show: First tab in group or last viewed tab
          const firstTab = group[0]
          const targetTab = _prefs.getCharPref("collapsedGroupVisibleTab") === "selected" ? visible.pop() : firstTab  //which tab to show? decision here

          //3. show it
          tk.tabSetHidden(targetTab, false) // visibility of a tab

        }
        group.forEach(function(t) {
          //The attribute application must at last to avoid being blocked by a fix for Issue 11
          t.setAttribute("groupcollapsed", "true")
        })
      }
    }

    this.sortgroup_onTabLoading = function sortgroup_onTabLoading(event: mozEvent) {
      try {
        const index = gBrowser.getBrowserIndexForDocument(event.originalTarget)
        const tab = _tabs[index]

        const uriKey = tab.getAttribute(tk.Sorts.uri)

        tk.setTabUriKey(tab)

        // Allow autogrouping tabs by domain when loading a page into an about:blank tab
        if (event.originalTarget.nodeName === "#document" // Ignore image loads (especially favicons!)
          && uriKey === "zzzzzzzzzzzzzzz/about/blank"   // Tab was blank...
          && uriKey !== tab.getAttribute(tk.Sorts.uri)  // ...but now has a url
          && !tab.hasAttribute("groupid")
          && tk.autoGroupNewTabs
          && tk.activeGrouping === "domain")
        {
          const pid = tab.getAttribute("possibleparent")
          tk.nextType = pid ? "pageload" : "unrelated"
          tk.dontMoveNextTab = false
          tk.nextParent = pid ? tk.getTabById(pid) : null
          tk.isBookmarkGroup = false
          tk.addedTabs = [tab]
          tk.addingTabOver()
        }
      }
      catch (ex) {
        // Maybe there was a frameset or something, in which case we didn't need to update stuff anyway...
      }
    }

    this.sortgroup_onTabLoaded = function sortgroup_onTabLoaded(event: mozEvent) {
      try {
        if (event.originalTarget.nodeName === "#document") { // Ignore image loads (especially favicons!)
          const index = gBrowser.getBrowserIndexForDocument(event.originalTarget)
          const tab = _tabs[index]
          tab.setAttribute(tk.Sorts.lastLoaded, Date.now().toString())
        }
      }
      catch (ex) {
        // Maybe there was a frameset or something...
      }
    }

    interface ListerTimeoutPair {
      listener: () => void
      timeout: number
    }
    const _sortgroup_onSSTabRestoring_timers = [] as ListerTimeoutPair[]
    this.sortgroup_onSSTabRestoring = function sortgroup_onSSTabRestoring(event: mozEvent) {
      const tab = event.originalTarget as Tab

      // Prevent restoring the lastViewedKey from overwriting the fact that the tab is currently being viewed
      if (tab.getAttribute("selected") === "true")
        tab.setAttribute(tk.Sorts.lastViewed, Date.now().toString())

      // Delay __sortgroup_onTabRestored timers until sortgroup_onSSTabRestoring stops getting called
      _sortgroup_onSSTabRestoring_timers.forEach(function(lt: ListerTimeoutPair) {
        window.clearTimeout(lt.timeout)
        lt.timeout = window.setTimeout(function(lt2: ListerTimeoutPair) {lt2.listener()}, 100, lt)
      })

      // TODO=P4: GCODE Check tabs are restored correctly (and test groupcollapsed and hidden)
      // The timeout is because this might be the first tab of a group to be restored, and we'd rather not waste time marking it as a singleton then turning it back into a group (sss_restoreHistory calls itself with a timeout of 0 between each added tab)
      tab.groupNotChecked = true
      const listener = (function __sortgroup_onTabRestored() {
        _sortgroup_onSSTabRestoring_timers.shift()

        let gid = tab.getAttribute("groupid")
        if (!gid) {
          gid = tab.getAttribute("singletonid")
          if (gid) {
            tk.setGID(tab, gid)
          }
        }
        if (gid) {
          const group = tk.getGroupById(gid, true) // True to include singletons

          if (group.length === 1) {
            tk.removeGID(tab, true)
          }
          else {
            // The group might be split up, and it may even be splitting up another group. Fix it!
            let last = null
            let before = true
            for (let i = 0; i < group.length; i++) {
              const t = group[i]
              if (t === tab) {
                if (last)
                  break
                before = false
              }
              else if (!("groupNotChecked" in t)) {
                last = t
                if (!before)
                  break
              }
            }
            if (last) {
              // Note: It might be better to properly merge it using insertTab (extend insertTab for origin to look for possibleparent and if not move to end, and take advantage of this in groupTabsBy too)
              if (last._tPos < tab._tPos) {
                let target = last
                while (target.nextSibling
                     && target.nextSibling !== tab
                     && target.nextSibling.getAttribute("groupid") === gid)
                {
                  target = target.nextSibling
                }
                if (target.nextSibling !== tab)
                  tk.moveAfter(tab, last)
              }
              else {
                // This bit is important! If we just move tab before last, then tab could be
                // wrongly moved after tabs in between, just because they happenned to get
                // restored later (e.g. if last was the selected tab so got restored first)
                let target = last
                while (target.previousSibling
                     && target.previousSibling !== tab
                     && target.previousSibling.getAttribute("groupid") === gid)
                {
                  target = target.previousSibling
                }
                if (target.previousSibling !== tab)
                  tk.moveBefore(tab, last)
              }

              if (last.hasAttribute("groupcollapsed")) {
                tab.setAttribute("groupcollapsed", "true")
                if (tab.getAttribute("selected") === "true") {
                  group.forEach(function(t: Tab) {
                    tk.tabSetHidden(t, true) // visibility of a tab
                  })
                  tk.tabSetHidden(tab, false) // visibility of a tab
                }
                else {
                  tk.tabSetHidden(tab, true) // visibility of a tab
                }
              }
              else {
                tk.tabSetHidden(tab, false) // visibility of a tab
              }
            }
            else {
              // This tab is where the group will congregate, so make sure it's not in the middle of a group!
              tk.keepGroupsTogether()

              tk.tabSetHidden(tab, false) // visibility of a tab
            }
          }
        }
        if (tab.hasAttribute("groupid")) {
          tk.colorizeTab(tab) // Maintain tab color
        }
        else if (tk.ignoreOvers === 0) {
          // See if this tab needs grouping (but don't move it!)
          tk.nextType = "unrelated"
          tk.nextParent = null
          tk.dontMoveNextTab = true
          tk.addedTabs = [tab]
          tk.addingTabOver()
        }
        tk.colorizeTab(tab) // Maintain tab color
        tk.updateIndents()

        delete tab.groupNotChecked
      })
      _sortgroup_onSSTabRestoring_timers.push({
        listener: listener,
        timeout:  window.setTimeout(function(listener2: () => void) {listener2()}, 100, listener),
      }) // TODO=P5: TJS Tweak timeout - lower values cause less jumping, but may slow down restoring an entire window
    }

    this.sortgroup_onTabMoved = function sortgroup_onTabMoved(event: Event) {
      const tab = event.target as Tab

      if (tab.hasAttribute("groupid"))
        tk.colorizeTab(tab) // Maintain/update tab color, as it gets lost after a move

      tk.keepGroupsTogether() // TODO=P5: ??? Intelligently adjust groups on move into or out of group? (with timeout of course, so as not to duplicate my existing code for dragged tabs etc.)

      tk.updateIndents()

    }

    /* [Close Order]
     * 0 (auto):  Go right unless that would involve going down a level or leaving the group [right->left depending on tk.openRelativePosition]
     * 1 (g-left):  Go left unless that would involve leaving the group
     * 2 (g-right): Go right unless that would involve leaving the group
     * 3 (left):  Go left
     * 4 (right):   Go right
     */
    this.sortgroup_onTabRemoved = function sortgroup_onTabRemoved(event: Event) {
      const tab = event.target as Tab
      const gid = tab.getAttribute("groupid")
      const tid = tk.getTabId(tab)
      const pid = tab.getAttribute("possibleparent")

      // Choose next tab
      // Note that this happens before pickNextIndex/_blurTab is called by removeTab
      tk.chosenNextTab = tk.chooseNextTab(tab)

      // Update possibleparents
      for (let i = 0; i < _tabs.length; i++) {
        const t = _tabs[i]
        if (t.getAttribute("possibleparent") === tid) {
          t.setAttribute("possibleparent", pid)
        }
      }
      tk.updateIndents()

      // Ungroup singleton groups
      if (gid) {
        if (!tab.previousSibling || tab.previousSibling.getAttribute("groupid") !== gid) {
          const next = tab.nextSibling
          if (!next || next.getAttribute("groupid") !== gid)
            tk.dump("Group was already a singleton?! (no next)")
          else if (!next.nextSibling || next.nextSibling.getAttribute("groupid") !== gid)
            tk.removeGID(next, true)
        }
        else if (!tab.nextSibling || tab.nextSibling.getAttribute("groupid") !== gid) {
          const prev = tab.previousSibling
          if (!prev || prev.getAttribute("groupid") !== gid)
            tk.dump("Group was already a singleton?! (no prev)")
          else if (!prev.previousSibling || prev.previousSibling.getAttribute("groupid") !== gid)
            tk.removeGID(prev, true)
        }
      }

      if (tab.hasAttribute("groupcollapsed") && !tab.hidden) { // visibility of a tab
        // Make sure collapsed groups don't get totally hidden!
        window.setTimeout(function __uncollapseTab(gid2: string, next2: Tab | undefined, prev2: Tab | undefined) {
          if (gBrowser.selectedTab.getAttribute("groupid") !== gid2) {
            if (next2 && next2.getAttribute("groupid") === gid2)
              tk.tabSetHidden(next2, false) // visibility of a tab
            else if (prev2 && prev2.getAttribute("groupid") === gid2) // Almost always true
              tk.tabSetHidden(prev2, false) // visibility of a tab
          }
        }, 0, gid, tab.nextSibling, tab.previousSibling)

      }

    }

    this.sortgroup_onTabMousedown = function sortgroup_onTabMousedown(event: mozMouseEvent) {
      if ((event.target as Element).localName !== "tab")
        return

      const tab = event.target as Tab
      if (tab.hasAttribute("groupid")
        && tab.hasAttribute("groupcollapsed")
        && event.originalTarget.className === "tab-icon-image"
        && event.button === 0
        && !event.ctrlKey && !event.shiftKey && !event.altKey)
      {
        tk.toggleGroupCollapsed(event.target)

        event.stopPropagation()
        event.preventDefault()
      }
    }

    this.sortgroup_onClickTab = function sortgroup_onClickTab(event: mozMouseEvent) {
      if ((event.target as Element).localName !== "tab")
        return

      const tab = event.target as Tab
      if (tab.hasAttribute("groupid")
        && (event.button === 1 || event.button === 0
          && (event as any).originalTarget.getAttribute("anonid") === "close-button")
        && !event.altKey
        && navigator.platform.indexOf("Mac") === -1 ? event.ctrlKey : event.metaKey)
      {
        if (event.shiftKey)
          tk.closeChildren(event.target)
        else
          tk.closeGroup(event.target)

        event.stopPropagation()
        event.preventDefault()
      }
    }
    this.sortgroup_onDblclickTab = function sortgroup_onDblclickTab(event: mozMouseEvent) {
      const tab = event.target as Tab
      if (tab.localName === "tab") {
        if (event.originalTarget.getAttribute("anonid") === "close-button")
        {
          if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey
            && tk.TabBar.Mode.getIsVerticalMode()) {
            // The user expected to close two tabs by clicking on a close button,
            // then clicking on the close button of the tab below it (which will
            // by now have risen up by one), so do this.
            // Note: to avoid dataloss, we don't allow this when closing a group or subtree at a time
            // TODO=P3: GCODE Test on Linux (where close tab might happen on mousedown instead of mouseup?)
            gBrowser.removeTab(tab)
            event.stopPropagation()
          }
        }
        else if (tab.hasAttribute("groupid")
             && _prefs.getBoolPref("doubleClickCollapseExpand"))
        {
          // Warn novices about collapsing groups
          if (!tab.hasAttribute("groupcollapsed") && _prefs.getBoolPref("warnOnDoubleClickCollapse")) {
            // Focus the window before prompting.
            // This will raise any minimized window, which will
            // make it obvious which window the prompt is for and will
            // solve the problem of windows "obscuring" the prompt.
            // See bug #350299 for more details
            window.focus()
            const check = { value: false }
            const strings = (document.getElementById("bundle_tabkit") as any)
            if (strings != null) {
              _ps.alertCheck(
                window, //aParent
                strings.getString("tab_kit"), //aDialogTitle
                strings.getString("doubleclickcollapse_warning"), //aText
                strings.getString("doubleclickcollapse_dont_mention_again"), //aCheckMsg
                check //aCheckState
              )
            }
            if (check.value)
              _prefs.setBoolPref("warnOnDoubleClickCollapse", false)
          }

          tk.toggleGroupCollapsed(tab)
          event.stopPropagation()
        }
      }
    }

    this.updateSortGroupMenu = function updateSortGroupMenu(event: Event) {
      if (event.target !== event.currentTarget) return

      const popup = event.target
      const contextTab = gBrowser.mContextTab ? gBrowser.mContextTab : gBrowser.selectedTab

      // Set appropriate text for Mark As Read/Unread
      const menu_item_tabkit_tab_toggleUnread = document.getElementById("menu_tabkit-tab-toggleUnread")
      const bundle_tabkit_el = (document.getElementById("bundle_tabkit") as any)
      if (menu_item_tabkit_tab_toggleUnread != null && bundle_tabkit_el != null) {
        menu_item_tabkit_tab_toggleUnread
        .setAttribute("label", bundle_tabkit_el.getString(contextTab.hasAttribute("read") ? "mark_as_unread" : "mark_as_read"))
      }

      // Only enable Make Group if contextTab isn't selectedTab
      (document.getElementById("cmd_tabkit-sortgroup-tab-makeGroup") as any).setAttribute("disabled", (contextTab === gBrowser.selectedTab))

      // Show/hide items that only apply to groups
      const isGroup = contextTab.hasAttribute("groupid")
      const groupsOnly = (popup as any).getElementsByAttribute("groupsonly", "true")
      for (let i = groupsOnly.length - 1; i >= 0; i--) {
        groupsOnly[i].hidden = !isGroup
      }
      const couldBeSubtree = (isGroup && tk.subtreesEnabled())
      ;(document.getElementById("menu_tabkit-sortgroup-group-closeChildren") as any).hidden = !couldBeSubtree
      const isSubtree = (couldBeSubtree && tk.getSubtreeFromTab(contextTab).length > 1)
      ;(document.getElementById("cmd_tabkit-sortgroup-group-closeChildren") as any).setAttribute("disabled", !isSubtree)

      // Show Collapse or Expand as appropriate
      if (isGroup) {
        const groupCollapsed = contextTab.hasAttribute("groupcollapsed")
        ;(document.getElementById("menu_tabkit-sortgroup-group-collapse") as any).collapsed = groupCollapsed
        ;(document.getElementById("menu_tabkit-sortgroup-group-expand") as any).collapsed = !groupCollapsed
      }

      // region multi-window

      const windowsEnumerator = _wm.getEnumerator("navigator:browser")
      const otherWindows = []
      while(windowsEnumerator.hasMoreElements()) {
        const win = windowsEnumerator.getNext()
        if (window !== win) {
          otherWindows.push(win)
        }
      }
      const isMultiWindow = otherWindows.length > 0
      const multiWindowOnly = (popup as any).getElementsByAttribute("multiwindowonly", "true")
      const multiWindowOnlyShouldBeShown = isMultiWindow && isGroup
      for (let i = multiWindowOnly.length - 1; i >= 0; i--) {
        multiWindowOnly[i].hidden = !multiWindowOnlyShouldBeShown
      }

      const copyGroupToNewWindowMenuElement = document.getElementById("menu_tabkit-sortgroup-group-copyToNewWindow")
      // Clear content
      copyGroupToNewWindowMenuElement.innerHTML = ""
      if (multiWindowOnlyShouldBeShown) {
        const menu = copyGroupToNewWindowMenuElement
        const menupopup = document.createElement("menupopup")
        otherWindows.forEach((w) => {
          const menuitem = document.createElement("menuitem")
          menuitem.setAttribute("label", w.gBrowser.selectedTab.linkedBrowser.contentTitle || w.gBrowser.selectedTab.linkedBrowser.webNavigation.currentURI.spec)
          const tabid = tk.getTabId(w.gBrowser.selectedTab)
          menuitem.setAttribute("oncommand", `tabkit.copyTabGroupToWindow(TabContextMenu.contextTab, "${tabid}");`)
          menupopup.appendChild(menuitem)
        })
        menu.appendChild(menupopup)
      }

      const moveGroupToNewWindowMenuElement = document.getElementById("menu_tabkit-sortgroup-group-moveGroupToWindow")
      // Clear content
      moveGroupToNewWindowMenuElement.innerHTML = ""
      if (multiWindowOnlyShouldBeShown) {
        const menu = moveGroupToNewWindowMenuElement
        const menupopup = document.createElement("menupopup")
        otherWindows.forEach((w) => {
          const menuitem = document.createElement("menuitem")
          menuitem.setAttribute("label", w.gBrowser.selectedTab.linkedBrowser.contentTitle || w.gBrowser.selectedTab.linkedBrowser.webNavigation.currentURI.spec)
          const tabid = tk.getTabId(w.gBrowser.selectedTab)
          menuitem.setAttribute("oncommand", `tabkit.moveTabGroupToWindow(TabContextMenu.contextTab, "${tabid}");`)
          menupopup.appendChild(menuitem)
        })
        menu.appendChild(menupopup)
      }

      // endregion multi-window

      // Update radio buttons & checkboxes (esp. for new windows)
      switch (tk.newTabPosition === 2 ? tk.activeSort : "none") {
        case "uri": (document.getElementById("menu_tabkit-sortgroup-sortByUri") as any).setAttribute("checked", "true"); break
        case "lastLoaded": (document.getElementById("menu_tabkit-sortgroup-sortByLastLoaded") as any).setAttribute("checked", "true"); break
        case "lastViewed": (document.getElementById("menu_tabkit-sortgroup-sortByLastViewed") as any).setAttribute("checked", "true"); break
        case "creation": (document.getElementById("menu_tabkit-sortgroup-sortByCreation") as any).setAttribute("checked", "true"); break
        case "origin": (document.getElementById("menu_tabkit-sortgroup-sortByOrigin") as any).setAttribute("checked", "true"); break
        case "title": (document.getElementById("menu_tabkit-sortgroup-sortByTitle") as any).setAttribute("checked", "true"); break
        default: // Clear all radio buttons
          (document.getElementById("menu_tabkit-sortgroup-sortByUri") as any).removeAttribute("checked")
          ;(document.getElementById("menu_tabkit-sortgroup-sortByLastLoaded") as any).removeAttribute("checked")
          ;(document.getElementById("menu_tabkit-sortgroup-sortByLastViewed") as any).removeAttribute("checked")
          ;(document.getElementById("menu_tabkit-sortgroup-sortByCreation") as any).removeAttribute("checked")
          ;(document.getElementById("menu_tabkit-sortgroup-sortByOrigin") as any).removeAttribute("checked")
          ;(document.getElementById("menu_tabkit-sortgroup-sortByTitle") as any).removeAttribute("checked")
      }
      switch (tk.autoGroupNewTabs ? tk.activeGrouping : "none") {
        case "domain":
          (document.getElementById("menu_tabkit-sortgroup-groupByDomain") as any).setAttribute("checked", "true")
          ;(document.getElementById("menu_tabkit-sortgroup-groupByOpener") as any).removeAttribute("checked")
          break
        case "opener":
          (document.getElementById("menu_tabkit-sortgroup-groupByOpener") as any).setAttribute("checked", "true")
          ;(document.getElementById("menu_tabkit-sortgroup-groupByDomain") as any).removeAttribute("checked")
          break
        default: //case "none":
          (document.getElementById("menu_tabkit-sortgroup-groupByDomain") as any).removeAttribute("checked")
          ;(document.getElementById("menu_tabkit-sortgroup-groupByOpener") as any).removeAttribute("checked")
      }
      switch (tk.newTabPosition) {
        default: /*case 0:*/ (document.getElementById("menu_tabkit-sortgroup-newtabs-farRight") as any).setAttribute("checked", "true"); break
        case 1: (document.getElementById("menu_tabkit-sortgroup-newtabs-nextToCurrent") as any).setAttribute("checked", "true"); break
        case 2: (document.getElementById("menu_tabkit-sortgroup-newtabs-lastSort") as any).setAttribute("checked", "true")
      }
      if (tk.autoGroupNewTabs)
        (document.getElementById("menu_tabkit-sortgroup-newtabs-autoGroup") as any).setAttribute("checked", "true")
      else
        (document.getElementById("menu_tabkit-sortgroup-newtabs-autoGroup") as any).removeAttribute("checked")

      // TODO=P4: GCODE update text of menu_tabkit-sortgroup-newtabs-nextToCurrent depending on openRelativePosition
    }


    /// Helper functions and method hooks:
    let _keepGroupsTogether_timeoutID = -1
    this.keepGroupsTogether = function keepGroupsTogether() {
      if (_keepGroupsTogether_timeoutID !== -1) // Wait until this stops getting called
        window.clearTimeout(_keepGroupsTogether_timeoutID)
      _keepGroupsTogether_timeoutID = window.setTimeout(function () {
        // TODO=P4: GCODE Check for singletons too
        const all_groups = tk.getAllGroups()
        for (const gid in all_groups) {
          const group = all_groups[gid]
          for (let i = group.length - 2; i >= 0; i--)
            if (group[i].nextSibling !== group[i + 1])
              tk.moveBefore(group[i], group[i + 1])
        }
        _keepGroupsTogether_timeoutID = -1
      }, 250) // TODO=P5: GCODE Tweak timeout - lower values cause less jumping, but may slow down restoring an entire window
    }


    // Tab close focus direction
    this.preInitBlurTabModifications = function preInitBlurTabModifications() {
      (function() {
        "use strict"

        if (typeof gBrowser._blurTab !== "function") {
          tk.debug("gBrowser._blurTab doesn't exists, replacing function failed")
          return
        }

        const old_func = gBrowser._blurTab
        // Function signature should be valid for FF 38.x & 45.x
        gBrowser._blurTab = function(aTab: Tab) {
          "use strict"

          let result

          // This copied from the original method
          // We don't want to change selected tab if the closing tab is not selected
          // We used to patch the method so that `tk.blurTab` is only called after this condition check
          // But with new way of method patching we need to duplicate the condition check here
          if (!aTab.selected) {
            // Do nothing
          }
          // Select next selected tab according to TabKit preferences
          else if (tk.chosenNextTab != null) {
            tk.blurTab(aTab)
          }
          else {
            result = old_func.apply(this, arguments)
          }

          return result
        }
      })()
    }
    this.preInitListeners.push(this.preInitBlurTabModifications)

    this.chosenNextTab = null
    this.pickNextIndex = function pickNextIndex(index: number, tabCount: number) { // [Fx3.1b3-]
      if (tk.chosenNextTab) {
        const pos = tk.chosenNextTab._tPos
        tk.chosenNextTab = null
        return pos > index ? pos - 1 : pos // This is before _tPos gets updated
      }
      else {
        tk.dump("Hadn't chosen next tab!")
        return index === tabCount ? index - 1 : index
      }
    }

    this.blurTab = function blurTab() { // [Fx3.5b4+]
      if (tk.chosenNextTab) {
        gBrowser.selectedTab = tk.chosenNextTab
        tk.chosenNextTab = null
      }
      else {
        tk.debug("Hadn't chosen next tab!")
      }
    }

    this.chooseNextTab = function chooseNextTab(tab: Tab) {
      // Note that in Fx3.1b3- the tab still exists at this point, but won't by the time pickNextIndex is called
      let prev = tab.previousSibling
      let next = tab.nextSibling
      const gid = tab.getAttribute("groupid")

      // _removingTabs is [Fx3.5+ (not including 3.1b3)] (bug 462673)
      while (prev && "_removingTabs" in gBrowser && gBrowser._removingTabs.indexOf(prev) !== -1)
        prev = prev.previousSibling
      while (next && "_removingTabs" in gBrowser && gBrowser._removingTabs.indexOf(next) !== -1)
        next = next.nextSibling

      // Skip hidden tabs unless they're in the same group (or there's no alternative tab)
      const oldPrev = prev, oldNext = next
      while (prev && (prev.hidden && prev.getAttribute("groupid") !== gid // visibility of a tab
              || "_removingTabs" in gBrowser && gBrowser._removingTabs.indexOf(prev) !== -1))
        prev = prev.previousSibling
      while (next && (next.hidden && next.getAttribute("groupid") !== gid // visibility of a tab
              || "_removingTabs" in gBrowser && gBrowser._removingTabs.indexOf(next) !== -1))
        next = next.nextSibling
      if (!prev && !next) {
        prev = oldPrev
        next = oldNext
      }

      if (!next)
        return prev // returns null if !prev

      if (!prev)
        return next

      switch (_prefs.getIntPref("customCloseOrder")) {
        case 1: // G-Left
          if (!gid || prev.getAttribute("groupid") === gid || next.getAttribute("groupid") !== gid)
            return prev
          else
            return next
        case 2: // G-Right
          if (gid && next.getAttribute("groupid") !== gid && prev.getAttribute("groupid") === gid)
            return prev
          else
            return next
        case 3: // Left
          return prev
        case 4: // Right
          return next
        default: { //case 0: // Auto // TODO=P4: ??? Can I improve tree level in auto-sorted opener groups?
          const defaultTab = (tk.openRelativePosition === "left") ? prev : next
          if (!gid)
            return defaultTab
          if (next.getAttribute("groupid") !== gid) {
            if (prev.getAttribute("groupid") !== gid) {
              tk.log("Might have been a singleton group at position " + tab._tPos + " ?")
              return defaultTab
            } else {
              return prev
            }
          }
          if (prev.getAttribute("groupid") !== gid) {
            return next
          }
          if (gid.indexOf(":oG-") === -1 && gid.indexOf(":tmpOG-") === -1) {
            return defaultTab
          }
          // The tab and siblings share an opener based group, so see if we can use possibleparents to choose close order
          const tid = tk.getTabId(tab)
          const pid = tab.getAttribute("possibleparent")
          const openerGroup = tab.getAttribute(tk.Groupings.opener)
          if (prev.getAttribute(tk.Groupings.opener) === openerGroup) {
            if (next.getAttribute(tk.Groupings.opener) !== openerGroup) {
              return prev
            } else {
              // Both siblings are in the same openerGroup, so choose based on possibleparents
              // (i.e. return to parent/sibling unless the default direction takes you to a sibling/child)
              if (defaultTab === next) {
                if (next.getAttribute("possibleparent") === pid // sibling
                || next.getAttribute("possibleparent") === tid) // child
                {
                  return next
                } else {
                  return prev
                }
              } else {
                if (prev.getAttribute("possibleparent") === pid // sibling
                || prev.getAttribute("possibleparent") === tid) // child
                {
                  return prev
                } else {
                  return next
                }
              }
            }
          }
          if (next.getAttribute(tk.Groupings.opener) === openerGroup) {
            return next
          }
          return defaultTab
        }
      }
    }


    /// Methods Called From Menus:
    this.sortByUri = function sortByUri() {
      tk.sortTabsBy("uri")
    }
    this.sortByLastLoaded = function sortByLastLoaded() {
      tk.sortTabsBy("lastLoaded")
    }
    this.sortByLastViewed = function sortByLastViewed() {
      tk.sortTabsBy("lastViewed")
    }
    this.sortByCreation = function sortByCreation() {
      tk.sortTabsBy("creation")
    }
    this.sortByOrigin = function sortByOrigin() {
      tk.sortTabsBy("origin")
    }
    this.sortByTitle = function sortByTitle() {
      tk.sortTabsBy("title")
    }

    this.toggleGroupByDomain = function toggleGroupByDomain() {
      if (tk.autoGroupNewTabs && tk.activeGrouping === "domain")
        tk.activeGrouping = "none"
      else
        tk.groupTabsBy("domain")
    }
    this.toggleGroupByOpener = function toggleGroupByOpener() {
      if (tk.autoGroupNewTabs && tk.activeGrouping === "opener")
        tk.activeGrouping = "none"
      else
        tk.groupTabsBy("opener")
    }

    this.ungroupAll = function ungroupAll() {
      tk.activeGrouping = "none"
      for (let i = 0; i < _tabs.length; i++)
        tk.removeGID(_tabs[i])
    }

    this.openOptions = function openOptions() {
      let instantApply = false
      const dialog = _wm.getMostRecentWindow("mozilla:tabkitsettings")
      if (dialog) {
        dialog.focus()
        return
      }
      try {
        instantApply = Preferences.get("browser.preferences.instantApply")
      }
      catch (ex) {
        // Do nothing, default value already set
      }
      openDialog("chrome://tabkit/content/settings.xul", "_blank", "chrome,titlebar,toolbar,centerscreen,"
             + (instantApply ? "dialog=no" : "modal"))
    }


    this.placeNewTabsAtFarRight = function placeNewTabsAtFarRight() {
      tk.newTabPosition = 0
    }
    this.placeNewTabsNextToCurrent = function placeNewTabsNextToCurrent() {
      tk.newTabPosition = 1
    }
    this.placeNewTabsByLastSort = function placeNewTabsByLastSort() {
      tk.newTabPosition = 2
    }

    this.toggleAutoGroupNewTabs = function toggleAutoGroupNewTabs() {
      tk.autoGroupNewTabs = !tk.autoGroupNewTabs
    }


    this.openNewTabHere = function openNewTabHere(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab
      tk.addingTab("related", contextTab)
      BrowserOpenTab({
        tab_kit_options: {
          added_tab_type: "related",
          parent_tab: contextTab,
        },
      })
      const newTab = (document as mozDocument).getAnonymousElementByAttribute(gBrowser, "linkedpanel", gBrowser.mPanelContainer.lastChild.id)
      tk.addingTabOver()
      const gid = contextTab.getAttribute("groupid")
      if (tk.openRelativePosition === "left") {
        if (gid && contextTab.previousSibling && contextTab.previousSibling.getAttribute("groupid") === gid) {
          tk.setGID(newTab, gid)
          newTab.setAttribute("outoforder", "true")
        }
        tk.moveBefore(newTab, contextTab)
      }
      else {
        if (gid && contextTab.nextSibling && contextTab.nextSibling.getAttribute("groupid") === gid) {
          tk.setGID(newTab, gid)
          newTab.setAttribute("outoforder", "true")
        }
        tk.moveAfter(newTab, contextTab)
      }
    }
    this.duplicateTab = function duplicateTab(contextTab: Tab) {
      if (!contextTab) {
        contextTab = gBrowser.selectedTab
      }

      const newTab = tk._duplicateTab(contextTab)

      function runPostDuplicateTabOperations(new_tab: Tab, parent_tab: Tab) {
        tk.addingTabOver({
          added_tab_type: "related",
          added_tab:      new_tab,
          parent_tab:     parent_tab,
          should_keep_added_tab_position: false,
        })

        const gid = tk.getTabGroupId(parent_tab)
        if (gid && gid !== tk.getTabGroupId(new_tab)) {
          tk.setGID(new_tab, gid)
          new_tab.setAttribute("outoforder", "true")
        }
        if (tk.openRelativePosition === "left") {
          tk.moveBefore(new_tab, parent_tab)
        }
        else {
          tk.moveAfter(new_tab, parent_tab)
        }
      }

      runPostDuplicateTabOperations(newTab, contextTab)

      // Backup attributes at this time, so we can restore them later if needed
      const tab_attributes_backup = tk.getTabAttributesForTabKit(newTab)

      // In FF 45.x (and later maybe)
      // The attributes are restored again asynchronously
      // So we need to restore the attributes after that operation
      if (typeof TabStateFlusher === "object" &&
          "flush" in TabStateFlusher &&
          typeof TabStateFlusher.flush === "function") {

        const browser = contextTab.linkedBrowser
        TabStateFlusher.flush(browser).then(() => {
          tk.setTabAttributesForTabKit(newTab, tab_attributes_backup)
        })
      }

      gBrowser.selectedTab = newTab
    }
    this.makeGroup = function makeGroup(contextTab: Tab) {
      // TODO=P3: GCODE replace redundant .hidden calls
      if (!contextTab || contextTab === gBrowser.selectedTab)
        return

      tk.makeGroupBetweenTwoTabs(contextTab, gBrowser.selectedTab)
    }
    // TODO=P4: N/A merge left/right & split group features?

    // Make tabs between two tab group together
    // If they are the same tab then do nothing
    this.makeGroupBetweenTwoTabs = function makeGroupBetweenTwoTabs(tabA: Tab, tabB: Tab) {
      if (!tabA || !tabB) {
        return
      }
      if (tabA === tabB) {
        return
      }

      const start = Math.min(tabA._tPos, tabB._tPos)
      const end = Math.max(tabA._tPos, tabB._tPos)

      let reallyRegroup = false
      for (let i = start; i <= end; i++) {
        if (_tabs[i].hasAttribute("groupid")) {
          reallyRegroup = true
          if (_prefs.getBoolPref("warnOnRegroup")) {
            const warnOnRegroup = { value: true }
            // Focus the window before prompting.
            // This will raise any minimized window, which will
            // make it obvious which window the prompt is for and will
            // solve the problem of windows "obscuring" the prompt.
            // See bug #350299 for more details
            window.focus()
            const strings = (document.getElementById("bundle_tabkit") as any)
            if (strings != null) {
              reallyRegroup = _ps.confirmCheck(
                window,
                strings.getString("tab_kit"),
                strings.getString("regroup_warning"),
                strings.getString("regroup_warning_prompt_me"),
                warnOnRegroup
              )
            }
            // We don't set the pref unless they press OK and it's false
            if (!reallyRegroup)
              return
            if (!warnOnRegroup.value)
              _prefs.setBoolPref("warnOnRegroup", false)
            break
          }
        }
      }

      // Ungroup soon-to-be-singleton groups
      const first = _tabs[start]
      const firstGID = first.getAttribute("groupid")
      const firstPrev = first.previousSibling ? first.previousSibling.getAttribute("groupid") : ""
      const last = _tabs[end]
      const lastGID = last.getAttribute("groupid")
      const lastNext = last.nextSibling ? last.nextSibling.getAttribute("groupid") : ""
      if (firstGID !== lastGID
        || firstPrev !== firstGID
        || lastNext !== lastGID)
      {
        if (firstGID
          && firstPrev === firstGID
          && (!first.previousSibling.previousSibling
            || first.previousSibling.previousSibling.getAttribute("groupid") !== firstGID))
        {
          tk.removeGID(first.previousSibling, true)
        }
        if (lastGID
          && lastNext === lastGID
          && (!last.nextSibling.nextSibling
            || last.nextSibling.nextSibling.getAttribute("groupid") !== lastGID))
        {
          tk.removeGID(last.nextSibling, true)
        }
      }

      // Group the new group
      const gid = ":oG-manualGroup-" + tk.generateId() // Pretend this is an opener group!
      for (let i = start; i <= end; i++)
        tk.setGID(_tabs[i], gid)

      if (reallyRegroup)
        tk.keepGroupsTogether()
    }

    this.toggleUnread = function toggleUnread(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      if (contextTab.hasAttribute("read"))
        contextTab.removeAttribute("read")
      else
        contextTab.setAttribute("read", "true")
    }


    this.closeFromHereToCurrent = function closeFromHereToCurrent(contextTab: Tab) {
      if (!contextTab || contextTab === gBrowser.selectedTab)
        return

      const start = Math.min(contextTab._tPos, gBrowser.selectedTab._tPos)
      const end = Math.max(contextTab._tPos, gBrowser.selectedTab._tPos)


      const tabsToClose = []
      for (let i = start; i <= end; i++) {
        tabsToClose.push(gBrowser.tabs[i])
      }
      for (let i = tabsToClose.length - 1; i >= 0; i--) {
        if (tabsToClose[i] === gBrowser.selectedTab) {
          continue
        }
        gBrowser.removeTab(tabsToClose[i])
      }
    }


    // TODO=P4: ??? Left click on already selected collapsed tab shows group as menu (with expand option obviously) - or maybe on right-click? (see auto-collapse/expanding)
    this.toggleGroupCollapsed = function toggleGroupCollapsed(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      const group = tk.getGroupFromTab(contextTab)
      if (!group) {
        tk.dump("toggleGroupCollapsed: Group was null for tab in pos " + contextTab._tPos)
        return
      }

      if (contextTab.hasAttribute("groupcollapsed")) {
        group.forEach(function(tab: Tab) {
          tab.removeAttribute("groupcollapsed")
          tk.tabSetHidden(tab, false) // visibility of a tab
        })
      }
      else {
        const firstTab = group[0]
        const targetTab = _prefs.getCharPref("collapsedGroupVisibleTab") === "selected" ? contextTab : firstTab //which tab to show? decision here

        group.forEach(function(tab: Tab) {
          tab.setAttribute("groupcollapsed", "true")
          if (tab !== targetTab) {

            //select context tab if not selected (prevent not completely collepesed group)
            if (tab === gBrowser.selectedTab)
              gBrowser.selectedTab = targetTab

            tk.tabSetHidden(tab, true) // visibility of a tab */
          }
        })


      }

      tk.updateIndents()

      if (gBrowser.selectedTab.hidden) // visibility of a tab
        gBrowser.selectedTab = contextTab

      tk.updateMultiRowTabs()
    }
    // Cancel all the indent in a group
    // Read updateIndents to see how indent work
    this.flattenGroup = function flattenGroup(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      const group = tk.getGroupFromTab(contextTab)
      if (!group) {
        tk.dump("flattenGroup: Group was null for tab in pos " + contextTab._tPos)
        return
      }

      group.forEach(function(tab: Tab) {
        tab.removeAttribute("possibleparent")
        tab.treeLevel = 0
        tab.style.marginLeft = ""
      })
    }
    this.flattenSubGroup = function flattenSubGroup(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      const possibleparent = contextTab.getAttribute("possibleparent")

      const tabsToClose = tk.getSubtreeFromTab(contextTab)
      for (let i = tabsToClose.length - 1; i >= 0; i--) {
        const tab = tabsToClose[i]
        // No need to set parent for contentTab
        if (tab !== contextTab) {
          tab.setAttribute("possibleparent", possibleparent)
        }

        tab.treeLevel = contextTab.treeLevel || 0
        tab.style.marginLeft = contextTab.style.marginLeft || ""
      }
    }
    this.bookmarkGroup = function bookmarkGroup(contextTab: Tab) {
      // TODO=P3: GCODE Drag group/subtree onto bookmarks toolbar should create bookmark folder
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      const group = tk.getGroupFromTab(contextTab)
      if (!group) {
        tk.dump("bookmarkGroup: Group was null for tab in pos " + contextTab._tPos)
        return
      }

      if ("showBookmarkDialog" in PlacesUIUtils) {
        // Based on PlacesCommandHook.bookmarkCurrentPages
        const aURIList = group.map(function __getUri(tab: Tab) {
          return tab.linkedBrowser.webNavigation.currentURI
        })
        //Since Firefox removed the API
        //Got to do it ourselves (copied from old version of Firefox (showMinimalAddMultiBookmarkUI)
        //Comment: Why they remove the API?
        if (aURIList.length === 0)
          throw(new Error("bookmarkGroup expects a list of nsIURI objects"))
        const info = {
          action: "add",
          type: "folder",
          hiddenRows: ["description"],
          URIList: aURIList,
        }
        PlacesUIUtils.showBookmarkDialog(info, window.top, true)
      }
      else {
        tk.dump("showBookmarkDialog NOT in PlacesUIUtils.")
      }
    }
    this.reColorGroup = function reColorGroup(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      // Remove known color for the group and re color all tabs in group
      const tabGroupID = contextTab.getAttribute("groupid")
      if (!tabGroupID) {
        return
      }
      const knownColorKey = "knownColor:" + tabGroupID
      tk.deleteWindowValue(knownColorKey)

      tk.allocateColor(contextTab, true)


      tk.getGroupFromTab(contextTab).forEach(function(tab: Tab) {
        tk.colorizeTab(tab)
      })
    }
    this.reColorAllGroups = function reColorAllGroups() {
      // Delete all known colors first, then regenerate again
      const groups = tk.getAllGroups()

      for (const gid in groups) {
        const knownColorKey = "knownColor:" + gid
        tk.deleteWindowValue(knownColorKey)
      }

      Object.values(groups).forEach(function(g: Tab[]) {
        g.forEach((tab: Tab) => {
          tk.colorizeTab(tab)
        })
      })
    }
    this.copyGroupURIs = function copyGroupURIs(contextTab: Tab) {
      // TODO=P3: GCODE Drag group/subtree onto bookmarks toolbar should create bookmark folder
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      const group = tk.getGroupFromTab(contextTab)
      if (!group) {
        tk.dump("copyGroupURIs: Group was null for tab in pos " + contextTab._tPos)
        return
      }

      // Based on PlacesCommandHook.bookmarkCurrentPages
      const aURIList = group.map(function __getUri(tab: Tab) {
        return tab.linkedBrowser.webNavigation.currentURI
      })

      if (aURIList.length === 0)
        throw(new Error("copyGroupURIs expects a list of nsIURI objects"))

      let urisStringToCopy = "''"
      aURIList.forEach(function(uri: mozURI) {
        urisStringToCopy = urisStringToCopy + uri.spec + "\n"
      })

      // Code from http://stackoverflow.com/questions/218462/in-a-firefox-extension-how-can-i-copy-rich-text-links-to-the-clipboard
      // Extract to a method if you need this somewhere else

      const transferable = ((Transferable as any)() as any)
      const unicodeString = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString)
      const clipboardId = Components.interfaces.nsIClipboard
      const clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipboardId)

      unicodeString.data = urisStringToCopy

      transferable.addDataFlavor("text/unicode")
      transferable.setTransferData("text/unicode", unicodeString, urisStringToCopy.length * 2)

      clipboard.setData(transferable, null, clipboardId.kGlobalClipboard)
    }
    this.protectAllTabsForGroupOfTab = function protectAllTabsForGroupOfTab(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      const tabsInGroup = tk.getGroupFromTab(contextTab)
      for (let i = tabsInGroup.length - 1; i >= 0; i--) {
        tk.setTabProtected(tabsInGroup[i])
      }
    }
    this.unprotectAllTabsForGroupOfTab = function unprotectAllTabsForGroupOfTab(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      const tabsInGroup = tk.getGroupFromTab(contextTab)
      for (let i = tabsInGroup.length - 1; i >= 0; i--) {
        tk.setTabUnprotected(tabsInGroup[i])
      }
    }
    this.closeGroup = function closeGroup(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      const tabsToClose = tk.getGroupFromTab(contextTab)
      for (let i = tabsToClose.length - 1; i >= 0; i--) {
        gBrowser.removeTab(tabsToClose[i])
      }
    }
    this.closeSubGroup = function closeSubGroup(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      tk.closeChildren(contextTab)
      gBrowser.removeTab(contextTab)
    }
    this.closeChildren = function closeChildren(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      const tabsToClose = tk.getSubtreeFromTab(contextTab)
      for (let i = tabsToClose.length - 1; i >= 0; i--) {
        if (tabsToClose[i] !== contextTab) // Don't close parent
          gBrowser.removeTab(tabsToClose[i])
      }
    }
    this.ungroupGroup = function ungroupGroup(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab

      tk.getGroupFromTab(contextTab).forEach(function(tab: Tab) {
        tk.removeGID(tab)
      })
    }


    /// Utility Methods:
    this.compareTabCreated = function compareTabCreated(a: Tab, b: Tab) {
      if (Number(a.getAttribute(tk.Sorts.creation)) < Number(b.getAttribute(tk.Sorts.creation)))
        return -1
      if (Number(a.getAttribute(tk.Sorts.creation)) > Number(b.getAttribute(tk.Sorts.creation)))
        return 1
      return 0
    }
    this.compareTabViewed = function compareTabViewed(a: Tab, b: Tab) {
      return Number(a.getAttribute(tk.Sorts.lastViewed)) - Number(b.getAttribute(tk.Sorts.lastViewed))
    }
    this.compareTabViewedExceptUnread = function compareTabViewedExceptUnread(a: Tab, b: Tab) {
      const aV = Number(a.getAttribute(tk.Sorts.lastViewed))
      const bV = Number(b.getAttribute(tk.Sorts.lastViewed))
      if (Date.now() < aV && Date.now() >= bV)
        return -1
      if (Date.now() >= aV && Date.now() < bV)
        return 1
      return aV - bV
    }

    /* To sort domains:
     *
     * A simplistic approach is to sort by
     * domain.split(".").reverse().join("."), i.e. splitting the domain
     * up at the dots and sorting by the last part, then if these are
     * equal sorting by the part to the left, etc.
     *
     * This is a good first try, however sites which have multiple tlds,
     * e.g. google.com and google.co.uk, will have their domains spread
     * far apart, which spoils hopes of domains being grouped in
     * alphabetical order.
     *
     * So we need to treat the main part of the domain, e.g.
     * "google.com", as one entity. However how do we extract the main
     * part of the domain, when sometimes they end in a tld (e.g. .com,
     * .fr) but sometimes in a second level domain (e.g. .co.uk, .web.za)?
     *
     * Firefox 3 now provides
     * http://developer.mozilla.org/en/docs/nsIEffectiveTLDService
     * (http://wiki.mozilla.org/Gecko:Effective_TLD_Service)
     *
     * Before that though I implemented an approximation myself, and
     * still use that in Firefox 2.
     *
     * Rather than match against a mammoth list of these things, I
     * compiled a list of tlds which almost exclusively give out third
     * level domains (i.e. domain.ext.cc), and assumed that anything
     * ending in one of these 'cc's would have an 'ext' as well (unless
     * there's only one dot).
     *
     * This will be accurate 99% of the time, though there will be
     * exceptions, such as the ccTLDs I left off this list, for example
     * .sy, because although forms like .gov.sy and .org.sy are common,
     * many domains also just end in .sy
     */
    this.setTabUriKey = function setTabUriKey(aTab: Tab, options: {initial_uri?: string} = {}) { // TODO=P3: GCODE Listen for back/forwards
      if (typeof options !== "object") {
        // So we don't need to check the type of `options` below
        options = {}
      }

      let uri = aTab.linkedBrowser.currentURI
      let uriGroup : string | undefined
      let uriKey: string

      const initial_uri = "initial_uri" in options ? options.initial_uri : null
      if (initial_uri != null) {
        // `isBlankPageURL` is a utility function present in Fx 38.x & 45.x
        if (!uri || isBlankPageURL(uri.asciiSpec)) {
          // We can't just use _ios.newURI since sometimes initialURI can be things like google.com (without http:// or anything!)
          //
          // `mURIFixup` is a shortcut to some utility (I guess)
          // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#67
          // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#62
          //
          // `createFixupURI` is a `native` function for "fixing" URI
          // Declaration:
          // FF 38.x: https://searchfox.org/mozilla-esr38/source/docshell/base/nsIURIFixup.idl#117
          // FF 45.x: https://searchfox.org/mozilla-esr45/source/docshell/base/nsIURIFixup.idl#111
          // Flags:
          // FF 38.x: https://searchfox.org/mozilla-esr38/source/docshell/base/nsIURIFixup.idl#74
          // FF 45.x: https://searchfox.org/mozilla-esr45/source/docshell/base/nsIURIFixup.idl#74
          const mURIFixup = gBrowser.mURIFixup
          uri = mURIFixup.createFixupURI(initial_uri, mURIFixup.FIXUP_FLAGS_MAKE_ALTERNATE_URI)
        }
      }
      if (!uri)
        uri = _ios.newURI("about:blank", null, null)

      if (isBlankPageURL(uri.asciiSpec)) {
        uriKey = "zzzzzzzzzzzzzzz/about/blank" // Sort blank tabs to end
        // uriGroup isn't needed in this case
      }
      else if (uri.asciiHost === "") {

        // I shall use about:config as an example

        uriKey = uri.scheme + "/" + uri.path // e.g. /about/config
        uriGroup = uri.asciiSpec.replace(/^[^:]*:\/*([^/]+).*$/, "$1") // e.g. config // this could probably be improved on
      }
      else {
        try { /*[Fx3only]*/
          const eTLDService = Cc["@mozilla.org/network/effective-tld-service;1"]
          .getService(Ci.nsIEffectiveTLDService)

          // I shall use http://www.google.co.uk/webhp?hl=en&complete=1 as an example

          const baseDomain = eTLDService.getBaseDomain(uri) // e.g. google.co.uk
          const subDomain = uri.asciiHost.substring(0, uri.asciiHost.length - baseDomain.length) // e.g. www.

          uriKey = baseDomain + subDomain.split(".").reverse().join(".") + "/" + uri.scheme + "/" + uri.path // e.g. google.co.uk.www/http//webhp?hl=en&complete=1
          uriGroup = baseDomain.substring(0, baseDomain.indexOf(".")) // e.g. google

          // TODO=P4: TJS Make sure we only fall back to the old code in Firefox 2
        }
        catch (ex) {
          if (uri.asciiSpec !== "chrome://speeddial/content/speeddial.xul") // Don't bother logging this error on Fx2, as the Effective TLD Service doesn't exist
            tk.debug("Error using nsIEffectiveTLDService:\n"+ex)

          const parts = /^(.*\.)?(([^.]+)\.[^.]{2,8}\.(?:a[ru]|c[kory]|do|eg|fj|gu|i[dl]|k[hr]|lb|m[moty]|n[ipz]|p[aey]|sv|t[hr]|u[gky]|ve|yu|za))$|^(.*\.)?(([^.]+)\.[^.0-9]{2,})$|^(.*)$/i.exec(uri.asciiHost)
          /* // Explanation of parts:
          parts.index => The 0-based index of the match in the string, e.g. 0
          parts.input => The original string, e.g. "www.google.co.uk"
          parts[0] => The last matched characters, e.g. "www.google.co.uk"
          // Parenthesized substrings:
          parts[1] => subdomain (4th+ level), e.g. "www"
          parts[2] => domain (3rd level), e.g. "google.co.uk"
          parts[3] => site name (3rd level), e.g. "google"
          parts[4] => subdomain (3rd+ level), e.g. "www"
          parts[5] => domain (2nd level), e.g. "google.com"
          parts[6] => site name (2rd level), e.g. "google"
          parts[7] => hostname, e.g. "localhost" or "192.0.34.166"
          */
          const key = parts[2] ? (parts[1] ? parts[2] + parts[1].split(".").reverse().join(".")
            : parts[2])
            : parts[5] ? (parts[4] ? parts[5] + parts[4].split(".").reverse().join(".")
              : parts[5])
              : parts[7]
          /* // i.e.:
          const key
          if (parts[2]) {
            if (parts[1]) {
              key = parts[2] + parts[1].split(".").reverse().join(".")
            }
            else {
              key = parts[2]
            }
          }
          else {
            if (parts[5]) {
              if (parts[4]) {
                key = parts[5] + parts[4].split(".").reverse().join(".")
              }
              else {
                key = parts[5]
              }
            }
            else {
              key = parts[7]
            }
          }
          */

          uriKey = key + "/" + uri.scheme + "/" + uri.path
          uriGroup = parts[3] || parts[6] || parts[7] || uri.asciiSpec.replace(/^[^:]*:\/*([^/]+).*$/, "$1")
        }
      }

      aTab.setAttribute(tk.Sorts.uri, uriKey)

      if (uriKey === "zzzzzzzzzzzzzzz/about/blank")
        aTab.removeAttribute(tk.Groupings.domain) // Blank tabs should not get grouped together
      else
        aTab.setAttribute(tk.Groupings.domain, ":dG-" + (uriGroup || "") + ":") // Just to prevent domains that are substrings of each other matching
    }

    this.preInitListeners.push(function() {
      (function() {
        // "use strict"

        if (typeof gBrowser.addTab !== "function") {
          tk.debug("gBrowser.addTab doesn't exists, replacing function failed")
          return
        }

        const old_func = gBrowser.addTab
        // Function signature should be valid for FF 38.x & 45.x
        gBrowser.addTab = function(aURI: string, _aReferrerURI: any, _aCharset: string, _aPostData: any, _aOwner: any, _aAllowThirdPartyFixup: boolean) {
          // "use strict"
          let initialURI = aURI

          // `isBlankPageURL` is a utility function present in Fx 38.x & 45.x
          // `aURI === "about:customizing"` is a logic copied from `gBrowser.addTab` in Fx 38.x & 45.x
          // Which should mean some special tab
          // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#1810
          // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#1888
          if (aURI == null || isBlankPageURL(aURI) || aURI === "about:customizing") {
            // We don't need `initialURI` for a "blank" page
            initialURI = null
          }
          const result = old_func.apply(this, arguments)
          const tab = result
          if (tab != null) {
            tk.setTabUriKey(tab, {initial_uri: initialURI})
          }

          return result
        }
      })()
    })

    let _seed = 0 // Used to generate ids TODO-P6: TJS sync across windows to completely avoid duplicates
    this.generateId = function generateId() {
      return String(Date.now().toString()) + "-" + String(++_seed)
    }

    this.getTabById = function getTabById(tid: string) {
      for (let i = 0; i < _tabs.length; i++) {
        const tab = _tabs[i]
        if (tk.getTabId(tab) === tid)
          return tab
      }
      tk.debug("Tab id not found: " + tid + "\n" + tk.quickStack())
      return null
    }

    this.countGroups = function countGroups(gid: string) {
      const match = gid.match(/\|/g)
      return match ? match.length + 1 : 1
    }

    this.getUngroupedTabsByAttr = function getUngroupedTabsByAttr(attr: string, value: any) {
      const tabs = []
      for (let i = 0; i < _tabs.length; i++) {
        const t = _tabs[i]
        if (!t.hasAttribute("groupid") && (value ? t.getAttribute(attr) === value : t.hasAttribute(attr)))
          tabs.push(t)
      }
      return tabs
    }

    this.getGroupById = function getGroupById(gid: string,  lookForSingletons: boolean) {
      // To find the group for a new tab
      const group = []
      for (let i = 0; i < _tabs.length; i++) {
        const t = _tabs[i]
        if (t.getAttribute("groupid").indexOf(gid) !== -1) {
          group.push(t)
        }
        else if (lookForSingletons && t.getAttribute("singletonid").indexOf(gid) !== -1) {
          tk.setGID(t, gid)
          group.push(t)
          //lookForSingletons = false // Possible optimisation
        }
      }
      return group
    }

    /**
     * Returns the tab group containing tab, as an array of
     * tabs, or null if the tab is not part of a group.
     *
     * FROZEN since 0.4.3 - this method will not be changed.
     */
    this.getGroupFromTab = function getGroupFromTab(tab: Tab) {
      // To get an existing grouped tab's group
      const gid = tab.getAttribute("groupid")
      if (!gid) {
        tk.debug("getGroupFromTab called on an ungrouped tab (_tPos=" + tab._tPos + ") returning null\n" + tk.quickStack())
        return null
      }

      /*
      const group = []
      for (let i = 0; i < _tabs.length; i++) {
        const t = _tabs[i]
        if (t.getAttribute("groupid") === gid)
          group.push(t)
      }
      */
      // We use previous/nextSibling as an optimization, but *also*
      // because it must work across browser windows for onDrop
      const group = [ tab ]
      let cur = null as null | Tab
      while ((cur = group[group.length-1].previousSibling) && cur.getAttribute("groupid") === gid) {
        group.push(cur)
      }
      group.reverse() // Probably mildly faster than unshifting them in the first place
      while ((cur = group[group.length-1].nextSibling) && cur.getAttribute("groupid") === gid) {
        group.push(cur)
      }

      if (group.length <= 1)
        tk.dump("getGroupFromTab found a singleton group (_tPos=" + tab._tPos + ") returning [tab]\n" + tk.quickStack())
      return group
    }

    this.getAllGroups = function getAllGroups(): {[key: string]: Tab[]} {
      const groups = {} as {[key: string]: Tab[]}
      for (let i = 0; i < _tabs.length; i++) {
        const t = _tabs[i]
        const gid = t.getAttribute("groupid")
        if (!gid)
          continue
        if (gid in groups)
          groups[gid].push(t)
        else
          groups[gid] = [t]
      }
      return groups
    }

    this.setGID = function setGID(tab: Tab, gid: string) {
      if (!gid) {
        tk.dump("setGID: Bad groupid \"" + gid + "\"")
        return
      }

      tk.removeCollapsedTab(tab)

      for (let i = 0; i < _tabs.length; i++) {
        const t = _tabs[i]
        if (t.getAttribute("groupid") === gid) {
          if (t.hasAttribute("groupcollapsed")) {
            tab.setAttribute("groupcollapsed", "true")
            for (const st of tk.getGroupById(gid)) {
              if (!st.hidden) { // visibility of a tab
                if (st.getAttribute("selected") === "true") {
                  tk.tabSetHidden(tab, true) // visibility of a tab
                }
                else {
                  tk.tabSetHidden(st, true) // visibility of a tab
                }
                break
              }
            }
            // Note that if no tab is currently visible(!), then the tab we're adding will be correctly kept visible
          }
          break
        }
      }

      tab.removeAttribute("singletonid")
      tab.setAttribute("groupid", gid)
      tk.colorizeTab(tab)
      tk.updateIndents()
    }

    this.removeGID = function removeGID(tab: Tab, becauseSingleton: boolean) {
      tk.removeCollapsedTab(tab)

      if (becauseSingleton)
        tab.setAttribute("singletonid", tab.getAttribute("groupid"))
      else
        tab.removeAttribute("singletonid")
      tab.removeAttribute("groupid")
      tk.colorizeTab(tab)
      tk.updateIndents()
    }

    this.removeCollapsedTab = function removeCollapsedTab(tab: Tab) {
      if (tab.hasAttribute("groupcollapsed")) {
        tab.removeAttribute("groupcollapsed")

        const tgid = tab.getAttribute("groupid")
        if (tgid) { // Should always be true
          const oldGroup = []
          for (let i = 0; i < _tabs.length; i++) {
            const t = _tabs[i]
            if (t !== tab && t.getAttribute("groupid") === tgid)
              oldGroup.push(t)
          }
          if (oldGroup.length > 0)
            tk.ensureCollapsedGroupVisible(oldGroup)
        }
      }
      tk.tabSetHidden(tab, false)   // visibility of a tab
    }

    this.ensureCollapsedGroupVisible = function ensureCollapsedGroupVisible(group: Tab[]) {
      // TODO=P3: GCODE Optimize ensureCollapsedGroupVisible with a timeout and Set of gids to avoid processing groups repeatedly [O(n^2) time]
      const should_return = group.some(function(t) {
        return !t.hidden
      })
      if (should_return)
        return

      let mostRecent = group[0]
      for (let i = 1; i < group.length; i++)
        if (tk.compareTabViewedExceptUnread(group[i], mostRecent) > 0)
          mostRecent = group[i]
      tk.tabSetHidden(mostRecent, false) // visibility of a tab
    }

    this.subtreesEnabled = function subtreesEnabled() {
      return (tk.TabBar.Mode.getIsVerticalMode()
          && _prefs.getBoolPref("indentedTree"))
    }

    this.getSubtreeFromTab = function getSubtreeFromTab(tab: Tab) {
      if (!tk.subtreesEnabled())
        return [ tab ]

      const group = tk.getGroupFromTab(tab)
      if (!group)
        return [ tab ]
      const gid = tab.getAttribute("groupid")
      tk.updateIndents(group)
      const tabs = [ tab ]
      for (let t = tab.nextSibling; t && t.treeLevel && t.treeLevel > tab.treeLevel && t.getAttribute("groupid") === gid; t = t.nextSibling)
        tabs.push(t)
      return tabs
    }

    let _lastUpdateIndents = 0
    let _updateIndentsRequested = false
    // Incidentally this should work across browser windows so getSubtreeFromTab works for onDrop
    this.updateIndents = function updateIndents(group?: undefined | Tab[]) {
      const subtreesEnabled = tk.subtreesEnabled()

      if (!group) {
        if (!subtreesEnabled)
          return

        if (!_updateIndentsRequested) {
          // Limit this to once every 150ms
          const timeSinceLastUpdate = Date.now() - _lastUpdateIndents
          if (timeSinceLastUpdate >= 150) {
            for (let i = 0; i < _tabs.length; i++)
              _tabs[i].style.marginLeft = ""

            const all_groups = tk.getAllGroups()
            for (const gid in all_groups) {
              const g = all_groups[gid]
              tk.updateIndents(g)
            }
            _lastUpdateIndents = Date.now()
          }
          else {
            _updateIndentsRequested = true
            window.setTimeout(function __updateAllIndents() {
              _updateIndentsRequested = false
              tk.updateIndents()
            }, 150 - timeSinceLastUpdate)
          }
        }
        return
      }

      if (!group.length) {
        tk.debug("updateIndents called for zero length group: " + group.toString() + "\n" + tk.quickStack())
        return
      }

      const groupcollapsed = group[0].hasAttribute("groupcollapsed")
      if (groupcollapsed) {
        group.forEach(function(t) {
          t.style.marginLeft = ""
        })
      }

      let stack = [] as string[]
      const maxlevel = _prefs.getIntPref("maxTreeLevel")
      const indent = _prefs.getIntPref("indentAmount")
      group.forEach(function(tab: Tab) {
        const pp = tab.getAttribute("possibleparent")
        if (pp) {
          let j = stack.length - 1
          for (; j >= 0; j--) {
            if (stack[j] === pp) {
              stack.push(tk.getTabId(tab))
              tab.treeLevel = Math.min(j + 1, maxlevel) // For external use, e.g. dragging subtrees
              if (!groupcollapsed && subtreesEnabled) {
                tab.style.setProperty("margin-left", (indent * tab.treeLevel) + "px", "important")
              }
              break
            }
            stack.pop()
          }
          if (j >= 0)
            return
        }
        tab.treeLevel = 0
        tab.style.marginLeft = ""
        stack = [ tk.getTabId(tab) ]
      })
    }
    this.toggleIndentedTree = function toggleIndentedTree() {
      if (tk.TabBar.Mode.getIsVerticalMode() && _prefs.getBoolPref("indentedTree"))
        tk.updateIndents()
      else
        for (let i = 0; i < _tabs.length; i++)
          _tabs[i].style.marginLeft = ""
    }

    this.detectTheme = function detectTheme() {
      let forceThemeCompatibility = _prefs.getIntPref("forceThemeCompatibility") // 0: Never, 1: Auto, 2: Always
      let darkTheme: boolean

      // Auto mode forces compatibility unless the theme has been tested
      const theme = gPrefService.getCharPref("general.skins.selectedSkin")
      const goodThemes = { // Themes that work well
        // TODO=P4: GCODE Keep testing themes...
        "classic/1.0":        { platform: /Win32/ }, // Default Windows theme ("Strata" in Fx3, "Firefox (default)" in Fx2)
        "abstractPCNightly":  {},       // Abstract Classic
        "abstract_zune":      { dark: true }, // Abstract Zune     (n.b. current tab has solid black bg that hides groups)
        "aero_fox":           { dark: true }, // Aero Fox        (n.b. current tab has solid black bg that hides groups)
        "aero_silver_fox":    {},       // Aero Silver Fox Basic
        "aquatint_gloss":     { dark: true }, // Aquatint Black Gloss  (n.b. current tab has solid black bg that hides groups)
        "aquatintII":         {},       // Aquatint Redone
        "AzertyIII":          {},      // Azerty III
        "blackx":             {},       // BlackX 2
        "cfoxmodern":         {},       // CrystalFox Modern
        "kempelton":          {},      // Kempelton
        "MacOSX":             {},       // MacOSX Theme - https://addons.mozilla.org/en-US/firefox/addon/7172
        "pitchdark":          {},      // PitchDark
        "phoenityreborn":     {},       // Phoenity Reborn
        "qute":               {},       // Qute
        "vistaxp":            {},      // Vista on XP
        "xpvista":            {},        // XP on Vista
      } as {[key: string]: {platform?: RegExp, dark?: true}}
      const badThemes = { // Themes with solid tab backgrounds, a -moz-appearance, or other problems
        /* Anything not listed above is assumed to be a 'bad' theme, so it's only really
         * useful to list the dark ones, though Tango is obviously worth mentioning */
      //  "classic/1.0"   : { platform: /Linux/ }, // Default Linux theme ("Tango" in Fx3)
        "nasanightlaunch": { dark: true },    // NASA Night Launch - https://addons.mozilla.org/en-US/firefox/addon/4908
        "NG_Classic":      { dark: true },    // Newgrounds Classic
      } as {[key: string]: {platform?: RegExp, dark?: true}}
      if (theme in goodThemes && (!("platform" in goodThemes[theme]) || goodThemes[theme].platform.test(navigator.platform))) {
        if (forceThemeCompatibility === 1)
          forceThemeCompatibility = 0
        darkTheme = ("dark" in goodThemes[theme])
      }
      else {
        if (forceThemeCompatibility === 1)
          forceThemeCompatibility = 2
        darkTheme = (theme in badThemes) ? ("dark" in badThemes[theme]) : false
      }
      if (forceThemeCompatibility > 0)
        gBrowser.tabContainer.setAttribute("tk-forcethemecompatibility", "true")
      else
        gBrowser.tabContainer.removeAttribute("tk-forcethemecompatibility")

      if (darkTheme)
        gBrowser.tabContainer.setAttribute("tk-darktheme", "true")
      else
        gBrowser.tabContainer.removeAttribute("tk-darktheme")

      // Clear up old colorizeTab results and re-run colorizeTab for each tab
      if (_prefs.getBoolPref("colorTabNotLabel")) {
        for (let i = 0; i < gBrowser.tabs.length; i++) {
          const tab = gBrowser.tabs[i]
          tk.colorizeTab(tab)
        }
      }
      else {
        for (let i = 0; i < gBrowser.tabs.length; i++) {
          const tab = gBrowser.tabs[i]
          tk.colorizeTab(tab)
        }
      }
    }

    this.regenSaturationLightness = function regenSaturationLightness() {
      // Used to reset each group's saturation and lightness when the prefs are changed
      // TODO=P4: GCODE Make this deal with restored old groups too (perhaps require that the hsl values are within the right ranges, otherwise regen them)
      const groups = tk.getAllGroups()

      Object.keys(groups).forEach(function(gid) {
        try {
          const hue = /hsl\((\d+),/.exec(tk.getWindowValue("knownColor:" + gid))[1]
          const sat = tk.randInt(_prefs.getIntPref("minSaturation"), _prefs.getIntPref("maxSaturation"))
          const lum = tk.randInt(_prefs.getIntPref("minLightness"), _prefs.getIntPref("maxLightness"))
          tk.setWindowValue("knownColor:" + gid, "hsl(" + hue + ", " + sat + "%, " + lum + "%)")
          groups[gid].forEach((tab: Tab) => {
            tk.colorizeTab(tab)
          })
        }
        catch (ex) { // Shouldn't happen
          tk.dump(ex)
        }
      })
    }

    this.allocateColor = function allocateColor(tab: Tab, ignoreSurroundingGroups: boolean) {
      let hue: number

      if (ignoreSurroundingGroups == null) {
        ignoreSurroundingGroups = false
      }

      const tabGroupID = tab.getAttribute("groupid")
      if (!tabGroupID) {
        return ""
      }

      const knownColorKey = "knownColor:" + tabGroupID

      if (tk.getWindowValue(knownColorKey)) {
        return tk.getWindowValue(knownColorKey)
      }

      // Find neighbouring gids
      const gids = []
      const gidDist = {} as {[key: string]: number}
      // Get up to three gids before tab
      for (let i = tab._tPos - 1, n = 0; i >= 0 && n < 3; i--) {
        const gid = _tabs[i].getAttribute("groupid")
        if (gid && gids.indexOf(gid) === -1 && tk.getWindowValue("knownColor:" + gid)) {
          gids.push(gid)
          gidDist[gid] = n
          n++
        }
      }
      // Get up to three gids after tab
      for (let i = tab._tPos + 1, n = 0; i < _tabs.length && n < 3; i++) {
        const gid = _tabs[i].getAttribute("groupid")
        if (gid && gids.indexOf(gid) === -1 && tk.getWindowValue("knownColor:" + gid)) {
          gids.push(gid)
          gidDist[gid] = n
          n++
        }
      }

      // If there are no surrounding groups, just generate a new color
      if (gids.length < 1 || ignoreSurroundingGroups) {
        // TODO=P4: GCODE Should I give domain groups a consistent color even if it might be the same as nearby groups?
        hue = Math.floor(Math.random() * 360)
      }
      else {
        // Convert gids into colors
        const hues = [] as number[]
        const hueDistance = {} as {[key: number]: number}
        gids.forEach(function(gidInEach) {
          const match = /\d+/.exec(tk.getWindowValue("knownColor:" + gidInEach)) // Find first number
          const hueInEach = Number(match[0])
          hues.push(hueInEach)
          switch (gidDist[gidInEach]) {
            case 0: hueDistance[hueInEach] = 60; break // Neighbouring groups should be at least 60 apart in hue
            case 1: hueDistance[hueInEach] = 60; break // Groups one group away from each other should also be 60 apart
            case 2: hueDistance[hueInEach] = 45    // Groups two groups away from each other should be 45 apart
          }
        })

        // Sort hues
        hues.sort(function __compareNumbers(a: number, b: number) {
          return a - b
        })

        // Find greatest hue gap, or a random group with hues at least hueDistance[hue] away from other hues
        let chosenGapStart = hues[hues.length - 1]
        let chosenGapEnd = hues[0]
        let chosenGap = chosenGapEnd - chosenGapStart + 360 - hueDistance[chosenGapStart] - hueDistance[chosenGapEnd]
        let totalGap = chosenGap

        for (let i = 1; i < hues.length; i++) {
          const gapStart = hues[i - 1]
          const gapEnd = hues[i]
          const gap = gapEnd - gapStart - hueDistance[gapStart] - hueDistance[gapEnd]
          if (totalGap <= 0) {
            // We haven't yet found a large enough gap, so always switch to this one if it's better
            if (gap > chosenGap) {
              chosenGapStart = gapStart
              chosenGapEnd = gapEnd
              totalGap = chosenGap = gap
            }
          }
          else if (gap > 0) {
            // We already have a large enough gap, so decide at random whether to use this one instead,
            // such that the probability that a gap is picked is proportional to its size.
            totalGap += gap
            if (Math.random() < gap / totalGap) {
              chosenGapStart = gapStart
              chosenGapEnd = gapEnd
              chosenGap = gap
            }
          }
        }

        if (totalGap > 0) {
          // Pick a random hue from the gap
          chosenGapStart = (chosenGapStart + hueDistance[chosenGapStart]) % 360
          hue = (chosenGapStart + Math.floor(Math.random() * chosenGap)) % 360
        }
        else {
          // Pick the hue in the middle of the entire gap
          chosenGap += hueDistance[chosenGapStart] + hueDistance[chosenGapEnd]
          hue = Math.round(chosenGapStart + (chosenGap / 2)) % 360
        }
      }

      const saturation = tk.randInt(_prefs.getIntPref("minSaturation"), _prefs.getIntPref("maxSaturation"))
      const lightness = tk.randInt(_prefs.getIntPref("minLightness"), _prefs.getIntPref("maxLightness"))

      // TODO=P3: GCODE Stop memory-leaking known colors (for the duration of a session)
      const resultColor = "hsl(@hue, @saturation%, @lightness%)".replace("@hue", hue.toString()).replace("@saturation", saturation).replace("@lightness", lightness)
      tk.setWindowValue(knownColorKey, resultColor)
      return resultColor
    }

    // Give color to the tab
    //
    // @params [Object] tab The tab to give color to
    // @params [String] customColor Any custom color in format "hsl(@hue, @saturation%, @lightness%)"
    this.colorizeTab = function colorizeTab(tab: Tab) {
      try {
        const tabText = (tab.ownerDocument as mozDocument).getAnonymousElementByAttribute(tab, "class", "tab-text tab-label")
        let node = tab as Tab | HTMLElement
        if (!_prefs.getBoolPref("colorTabNotLabel")) {
          node = tabText
        }

        // Clear the style first anyway
        tab.style.removeProperty("background-image")
        tabText.style.removeProperty("background-image")

        //New option to disable coloring
        if (_prefs.getBoolPref("disableTabGroupColor")) {
          return
        }

        let bgColor = tk.allocateColor(tab)

        //add by Pika, coloring for Fx4+
        if (bgColor !== "") {
          bgColor = "-moz-linear-gradient(@HSL_Top, @HSL_Bottom)".replace("@HSL_Top",bgColor).replace("@HSL_Bottom",bgColor)
        }
        else {
          // bgColor = "-moz-linear-gradient(@HSL_Top,@HSL_Bottom)".replace("@HSL_Top","hsla(0, 0%, 100%,1)").replace("@HSL_Bottom","hsla(0, 0%, 100%,1)")
        }
        node.style.setProperty("background-image", bgColor, "important")
      }
      catch (ex) {
        tk.dump(ex)
      }
    }

    this.colorAllTabsMenuItem = function colorAllTabsMenuItem(tab: Tab, menuItem: HTMLElement) {
      // TODO=P4: GCODE Fx3: Make All Tabs prettier (since we mess things up a little by setting -moz-appearance: none)
      try {
        const bgSample = tab //new line by Pika, Fx2 related
        if (_prefs.getBoolPref("colorTabNotLabel")) {
          menuItem.style.backgroundImage = bgSample.style.backgroundImage
        }
        else if ((gBrowser.tabContainer.hasAttribute("tabkit-highlight-unread-tab") && !tab.hasAttribute("read"))
             || (gBrowser.tabContainer.hasAttribute("tabkit-highlight-current-tab") && tab.getAttribute("selected") === "true"))
        {
          const bgStyle = window.getComputedStyle(bgSample, null)
          menuItem.style.backgroundImage = bgStyle.backgroundImage
        }
        menuItem.style.appearance = "none"
        window.setTimeout(function __colorAllTabsMenuText(tabInTimeout: Tab, menuItemInTimeout: HTMLElement) {
          try {
            const menuText = (document as mozDocument).getAnonymousElementByAttribute(menuItemInTimeout, "class", "menu-iconic-text")
            if (menuText == null) { return }
            const style = ((menuText as any).style as any)
            style.fontStyle = tabInTimeout.hasAttribute("read") ? "normal" : "italic"
            const fgStyle = window.getComputedStyle(
              (document as mozDocument).getAnonymousElementByAttribute(
                tabInTimeout,
                "class",
                "tab-text tab-label",
              ), null,
            )
            style.setProperty("background-color", fgStyle.backgroundColor, "important")
            style.setProperty("color", fgStyle.color, "important")
          }
          catch (ex) {
            tk.dump(ex)
          }
        }, 20, tab, menuItem)
      }
      catch (ex) {
        tk.dump(ex)
      }
    }

    this.colorAllTabsMenu = function colorAllTabsMenu() {
      if (!gBrowser.mCurrentTab.mCorrespondingMenuitem)
        return
      for (let i = 0; i < _tabs.length; i++) {
        const tab = _tabs[i]
        if (tab.mCorrespondingMenuitem)
          tk.colorAllTabsMenuItem(tab, tab.mCorrespondingMenuitem)
      }
    }

    this.postInitAllTabsMenuColors = function postInitAllTabsMenuColors(event: Event) {

      // gBrowser.tabContainer.mAllTabsPopup could be null
      if (_tabContainer.mAllTabsPopup) {
        _tabContainer.mAllTabsPopup.addEventListener("popupshowing", tk.colorAllTabsMenu, false)
      }

      _tabContainer.addEventListener("TabClose", tk.colorAllTabsMenu, false)
      _tabContainer.addEventListener("TabSelect", tk.colorAllTabsMenu, false)

      //Need to run at the first time or they will missed out
      tk.colorAllTabsMenu(event)
    }
    this.postInitListeners.push(this.postInitAllTabsMenuColors)

    /// Public Methods:
    this.groupTabsBy = function groupTabsBy(groupingName: string) {
      const groupingAttr = tk.Groupings[groupingName]
      const newGroups = {} as {[key: string]: Tab[]}
      for (let i = 0; i < _tabs.length; i++) {
        const t = _tabs[i]
        if (!t.hasAttribute("groupid")) {
          const gid = t.getAttribute(groupingAttr)
          if (gid !== "") {
            const group = tk.getGroupById(gid)
            if (group.length > 0) {
              // TODO=P4: ??? move next to parent if it's in the group
              if (tk.newTabPosition === 2 && tk.activeSort !== "origin"
                && (groupingName !== "domain" || !_prefs.getBoolPref("autoSortDomainGroups")) // We're going to sort all the groups anyway
                && (groupingName !== "opener" || !_prefs.getBoolPref("autoSortOpenerGroups"))) // We're going to sort all the groups anyway
              {
                tk.insertTab(t, gid)
              }
              else {
                tk.moveAfter(t, group[group.length - 1])
              }
              tk.setGID(t, group[0].getAttribute("groupid"))
            }
            else {
              if (gid in newGroups)
                newGroups[gid].push(t)
              else
                newGroups[gid] = [t]
            }
          }
        }
      }

      for (const _gid in newGroups) {
        const group = newGroups[_gid]
        if (group.length > 1) {
          for (const tab in group) {
            tk.setGID(tab, _gid)
          }

          // Move all tabs to where the median positioned tab currently is // TODO=P4: TJS if tk.newTabPosition === 2 && tk.activeSort in tk.DateSorts move to most recent tab instead?
          const mi = group.length >> 1
          const median = group[mi]
          for (let i = 0; i < mi; i++)
            tk.moveBefore(group[i], median)
          for (let i = group.length - 1; i > mi; i--)
            tk.moveAfter(group[i], median)
        }
      }

      // Sort all groupingName groups
      if (groupingName === "domain") {
        if (_prefs.getBoolPref("autoSortDomainGroups")) {
          const groups = tk.getAllGroups()
          for (const gidInGroup in groups) {
            if (gidInGroup.indexOf(":dG-") !== -1)
              tk.sortTabsBy("uri", gidInGroup)
          }
        }
      }
      else if (groupingName === "opener") {
        if (_prefs.getBoolPref("autoSortOpenerGroups")) {
          const groups = tk.getAllGroups()
          for (const gidInGroup in groups) {
            if (gidInGroup.indexOf(":oG-") !== -1 || gidInGroup.indexOf(":tmpOG-") !== -1)
              tk.sortTabsBy("origin", gidInGroup)
          }
        }
      }

      if (groupingName !== tk.activeGrouping)
        tk.activeGrouping = groupingName
    }

    // If gid is specified, assumes the group is already together (else it will be arbitrarily positioned)
    this.sortTabsBy = function sortTabsBy(sortName: string, gid: string) { // gid is optional
      if (!(sortName in tk.Sorts)) {
        tk.dump("sortTabsBy: Bad sortName: \"" + sortName + "\"")
        return
      }

      const isReverse = tk.ReverseSorts.has(sortName)
      const isNumeric = tk.NumericSorts.has(sortName)
      //~ const isDate = (sortName in tk.DateSorts)
      const isOrigin = (sortName === "origin")
      let tabset = []
      let attr = ""

      if (isOrigin) {
        // We need to calculate a set of keys we can sort by
        if (gid) {
          tabset = tk.getGroupById(gid)
        }
        else {
          for (let i = 0; i < _tabs.length; i++)
            tabset.push(_tabs[i])
        }
        tabset.sort(tk.compareTabCreated)
        let lastParent = null as null | string
        let recentChildren = 0
        for (let i = 1; i < tabset.length; i++) {
          const pp = tabset[i].getAttribute("possibleparent")
          if (pp) {
            for (let j = i - 1; j >= 0; j--) {
              if (tk.getTabId(tabset[j]) === pp) {
                if (tk.openRelativePosition === "left") {
                  tabset.splice(j, 0, tabset.splice(i, 1)[0]) // Move i before j
                }
                else {
                  if (tk.openRelativePosition !== "right") { // rightOfRecent is treated as rightOfConsecutive, since we don't know about tab selections
                    if (lastParent === pp) {
                      j += recentChildren++
                    }
                    else {
                      lastParent = pp
                      recentChildren = 1
                    }
                  }
                  tabset.splice(j + 1, 0, tabset.splice(i, 1)[0]) // Move i after j & recentChildren
                }
                break
              }
            }
          }
        }
        for (let i = 0; i < tabset.length; i++) {
          tabset[i].key = i
        }
      }
      else {
        attr = tk.Sorts[sortName]
      }

      // Presort groups and calculate medians
      let groups = {} as {[key: string]: Tab[]}
      if (gid) {
        groups[gid] = tk.getGroupById(gid)
      }
      else {
        groups = tk.getAllGroups()
      }
      for (const groupid in groups) {
        const g = groups[groupid]

        // We need grouped tabs to have keys whether or not we intend to internally sort them, so we can set the medians
        if (!gid && !isOrigin)
          for (let i = 0; i < g.length; i++)
            g[i].key = isNumeric ? Number(g[i].getAttribute(attr)) : g[i].getAttribute(attr).toLowerCase()

        if (gid
          || tk.countGroups(groupid) !== 1
          || ((groupid.indexOf(":dG-") === -1 || !_prefs.getBoolPref("autoSortDomainGroups"))
            && ((groupid.indexOf(":oG-") === -1 && groupid.indexOf(":tmpOG-") === -1) || !_prefs.getBoolPref("autoSortOpenerGroups"))))
        {
          // Sort group (by insertion sort)
          for (let i = 1; i < g.length; i++) {
            const gi = g[i]

            let j = i - 1
            for (; j >= 0; j--) {
              if (isReverse ? g[j].key >= gi.key : g[j].key <= gi.key)
                break
              g[j + 1] = g[j]
            }
            g[j + 1] = gi

            gi.removeAttribute("outoforder")
          }
        }

        if (!gid) {
          // TODO=P4: ??? ignore outoforder tabs?
          let representative = "" as any
          if (sortName === "origin")
            representative = (tk.openRelativePosition === "left") ? g.concat().sort(tk.compareTabCreated)[0].key : g[0].key
          //~ else if (isDate) // TODO=P4: TJS Should I?
            //~ const representative = g[ g.length - 1 ].key
          else // Median
            representative = g[ g.length >> 1 ].key
          for (let k = 0; k < g.length; k++)
            g[k].key = representative
        }
      }

      if (gid) {
        // Just rearrange the group tabs
        const group = groups[gid]
        const firstTab = group[0]
        for (let i = 1; i < group.length; i++)
          tk.moveAfter(group[i], firstTab)
      }
      else {
        // Sort all tabs/groups (by insertion sort)
        for (let i = 0; i < _tabs.length; i++) {
          const ti = _tabs[i]
          const tig = ti.getAttribute("groupid")
          if (!tig && !isOrigin)
            ti.key = isNumeric ? Number(ti.getAttribute(attr)) : ti.getAttribute(attr).toLowerCase()

          let j = i - 1
          for (; j >= 0; j--) {
            if (isReverse ? _tabs[j].key >= ti.key : _tabs[j].key <= ti.key)
              break
          }

          if (!tig) {
            gBrowser.moveTabTo(ti, j + 1)
            ti.removeAttribute("outoforder")
          }
          else {
            const g = groups[tig]
            for (let k = 0; k < g.length; k++) {
              gBrowser.moveTabTo(g[k], j + k + 1)
              g[k].removeAttribute("outoforder")
            }
            i += g.length - 1
          }
        }

        if (tk.activeSort !== sortName)
          tk.activeSort = sortName
      }
    }

    /* Usage:
      - tk.insertTab(tab) inserts a tab into _tabs by tk.activeSort (ASSUMES tk.newTabPosition === 2 && tk.activeSort !== "origin")
      - tk.insertTab(tab, gid) inserts a tab into tk.getGroupById(gid) by tk.activeSort (ASSUMES tk.newTabPosition === 2 && tk.activeSort !== "origin")
      - tk.insertTab(tab, gid, sortName) inserts a tab into tk.getGroupById(gid) using sortName (ASSUMES sortName !== "origin") */
    this.insertTab = function insertTab(tab: Tab, gid: string, sortName: string) { // gid and grouping are optional
      let tabset = [] as Tab[]
      if (gid) {
        tabset = tk.getGroupById(gid)
      }
      else {
        for (let i = 0; i < _tabs.length; i++)
          tabset.push(_tabs[i])
      }
      const tabIndex = tabset.indexOf(tab)
      if (tabIndex !== -1)
        tabset.splice(tabIndex, 1)
      if (tabset.length === 0) {
        tk.dump("insertTab: tabset is empty!")
        return
      }

      if (!sortName)
        sortName = tk.activeSort
      if (!(sortName in tk.Sorts) || sortName === "origin") {
        tk.dump("Cannot insert by \"" + sortName + "\"")
        return
      }

      const isReverse = tk.ReverseSorts.has(sortName)
      const isNumeric = tk.NumericSorts.has(sortName)

      const attr = tk.Sorts[sortName]
      tab.key = isNumeric ? Number(tab.getAttribute(attr)) : tab.getAttribute(attr)

      let i = 0
      while (i < tabset.length) {
        const ti = tabset[i]
        if (!ti.hasAttribute("outoforder") && (gid || !ti.hasAttribute("groupid"))) {
          ti.key = isNumeric ? Number(ti.getAttribute(attr)) : ti.getAttribute(attr)
          if (isReverse ? ti.key < tab.key : ti.key > tab.key)
            break
        }
        i++
      }
      if (i < tabset.length)
        tk.moveBefore(tab, tabset[i])
      else
        tk.moveAfter(tab, tabset[tabset.length - 1])
      tab.removeAttribute("outoforder") // In case it was set
    }

    this.preInitListeners.push(function() {
      "use strict"

      ;(function() {
        "use strict"

        if (typeof gBrowser.createTooltip !== "function") {
          tk.debug("gBrowser.createTooltip doesn't exists, replacing function failed")
          return
        }

        const old_func = gBrowser.createTooltip
        // Function signature should be valid for FF 38.x & 45.x
        gBrowser.createTooltip = function(event: mozEvent) {
          "use strict"

          const tab = (document as mozDocument).tooltipNode
          // Logic copied from original function
          if (tab.localName !== "tab") {
            event.preventDefault()
            return
          }

          const result = old_func.apply(this, arguments)
          // Apply new label for collapsed grouped tabs
          // Show all tab titles in tooltip - one per line -
          // when hovering over a collapsed group (instead of just the visible tab)
          if ((tab as any).hasAttribute("groupcollapsed")) {
            const new_label =
              tk.getGroupFromTab(tab).map(function __getLabel(ctab: Tab) {
                return ctab === tab ? "> " + ctab.label : " - " + ctab.label
              }).join("\n")
            event.target.setAttribute("label", new_label)
          }

          return result
        }
      })()
    })

    /// Implement Bug 298571 - support tab duplication (using ctrl) on tab drag and drop
    this._duplicateTab = function _duplicateTab(aTab: Tab) {
      "use strict"

      if (typeof _ss !== "object" ||
          !("duplicateTab" in _ss) ||
          typeof _ss.duplicateTab !== "function") {
        return gBrowser.loadOneTab(gBrowser.getBrowserForTab(aTab).currentURI.spec) // [Fx3- since browser.sessionstore.enabled always on in 3.5+]
      }

      const newTab = _ss.duplicateTab(window, aTab)

      tk.generateNewTabId(newTab)
      tk.removeGID(newTab)

      return newTab
    }

    this._onDrop = function _onDrop(event: mozMouseEvent) { // [Fx4+]
      const dt = (event as any).dataTransfer
      const dropEffect = dt.dropEffect
      // if (dropEffect === "link")
      //   return gBrowser.old_onDrop(event)

      const targetTab = event.target.localName === "tab" ? event.target : null
      if (!targetTab || targetTab.hasAttribute("pinned"))
        return

      const draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0)
      if (!draggedTab || draggedTab === targetTab || draggedTab.hasAttribute("pinned"))
        return

      this._tabDropIndicator.collapsed = true

      const draggedGid = draggedTab.getAttribute("groupid")
      const dPrev = draggedTab.previousSibling
      const dNext = draggedTab.nextSibling

      let newIndex = tk._getDropIndex(event)
      let beforeTab = newIndex > 0 ? _tabs[newIndex - 1] : null
      let afterTab = newIndex < _tabs.length ? _tabs[newIndex] : null
      let bGid = beforeTab ? beforeTab.getAttribute("groupid") : null
      let aGid = afterTab ? afterTab.getAttribute("groupid") : null

      // To be called after everything is done
      // If we perform cleanup too early (like removing original tabs in case of dragging tab across window)
      // It affects the grouping of moved/copied tabs in new window
      const cleanupCallbacks = [] as Array<(() => void)>

      // Prevent accidentally dragging into a collapsed group
      if (aGid && aGid === bGid && afterTab && afterTab.hasAttribute("groupcollapsed")) {
        for (const t of tk.getGroupFromTab(afterTab)) {
          if (!t.hidden) { // visibility of a tab
            if (t._tPos < afterTab._tPos) {
              beforeTab = afterTab
              while (beforeTab.nextSibling && beforeTab.nextSibling.getAttribute("groupid") === aGid)
                beforeTab = beforeTab.nextSibling
              afterTab = beforeTab.nextSibling // May be null
              newIndex = beforeTab._tPos + 1
            }
            else {
              afterTab = (beforeTab as any)
              while (afterTab.previousSibling && afterTab.previousSibling.getAttribute("groupid") === bGid)
                afterTab = afterTab.previousSibling
              beforeTab = afterTab.previousSibling // May be null
              newIndex = afterTab._tPos
            }

            bGid = beforeTab ? beforeTab.getAttribute("groupid") : null
            aGid = afterTab ? afterTab.getAttribute("groupid") : null

            // tk.chosenNewIndex will be set to newIndex before calling old_onDrop
            break
          }
        }
      }

      // Determine if we're dealing with one tab or a group/subtree
      let tabs = [] as Tab[]
      let shiftDragSubtree = false

      const tabIsCopied = (dropEffect === "copy")
      const tabIsFromAnotherWindow = (draggedTab.parentNode !== gBrowser.tabContainer)

      if (draggedGid && (event.shiftKey && _prefs.getBoolPref("shiftDragGroups")
             || draggedTab.hasAttribute("groupcollapsed"))) {
        // User wants to drag a group/subtree

        shiftDragSubtree = _prefs.getBoolPref("shiftDragSubtrees")
                     && !draggedTab.hasAttribute("groupcollapsed")
                     && !tabIsFromAnotherWindow

        if (shiftDragSubtree) {
          /* Note that tk.getSubtreeFromTab checks tk.subtreesEnabled,
           * which checks `tk.TabBar.Mode.getIsVerticalMode()` &&
           * _prefs.getBoolPref("indentedTree")*/
          tabs = tk.getSubtreeFromTab(draggedTab)
          if (tabs.length < 2)
            shiftDragSubtree = false
        } else {
          tabs = tk.getGroupFromTab(draggedTab)
          // Calculate the treeLevels - we'll need these when copying
          // possibleparents (getSubtreeFromTab normally does this)
          tk.updateIndents(tabs)
        }
      }
      else {
        // User wants to drag a single tab
        tabs = [ draggedTab ]
      }

      const singleTab = (tabs.length === 1)
      // Move/copy the tab(s)
      const tabsReverse = tabs.slice() // Copy
      tabsReverse.reverse() // In-place reverse
      const newTabs = [] as Tab[]
      const tabIdMapping = {} as {[key: string]: string}
      const should_return_early = tabsReverse.some(function(tab: Tab) {
        if (tabIsCopied || tabIsFromAnotherWindow) {
          // Tab was copied or from another window, so tab will be recreated instead of moved directly

          // Only allow beforeTab not afterTab because addingTabOver only indents newTab if it is after draggedTab (since addingTabOver just sets possibleparent to the source tab)
          const added_tab_type  = singleTab && draggedTab === beforeTab ? "related" : "unrelated"
          const parent_tab      = singleTab && draggedTab === beforeTab ? draggedTab : null
          const should_keep_added_tab_position = true

          tk.addingTab({
            added_tab_type: added_tab_type,
            parent_tab:     parent_tab,
            should_keep_added_tab_position: should_keep_added_tab_position,
          })

          // tk.chosenNewIndex = newIndex
          // event.tab = tab
          // gBrowser.old_onDrop(event)
          const copiedTab = tk._duplicateTab(tab)
          gBrowser.moveTabTo(copiedTab, newIndex)

          newTabs.unshift(copiedTab)
          tk.addingTabOver({
            added_tab_type: added_tab_type,
            added_tab:      copiedTab,
            parent_tab:     parent_tab,
            should_keep_added_tab_position: should_keep_added_tab_position,
          })

          // Backup attributes at this time, so we can restore them later if needed
          const tab_attributes_backup = tk.getTabAttributesForTabKit(copiedTab)

          // In FF 45.x (and later maybe)
          // The attributes are restored again asynchronously
          // So we need to restore the attributes after that operation
          if (typeof TabStateFlusher === "object" &&
              "flush" in TabStateFlusher &&
              typeof TabStateFlusher.flush === "function") {

            const browser = tab.linkedBrowser
            TabStateFlusher.flush(browser).then(() => {
              tk.setTabAttributesForTabKit(copiedTab, tab_attributes_backup)
            })
          }


          if (tabIsFromAnotherWindow && !tabIsCopied) {
            // Code copied from addon SDK
            const draggedTabWindow = draggedTab.ownerDocument.defaultView

            if (draggedGid)
              cleanupCallbacks.push(function() {
                draggedTabWindow.tabkit.closeGroup(draggedTab)
              })
            else
              cleanupCallbacks.push(function() {
                draggedTabWindow.gBrowser.removeTab(draggedTab)
              })
          }

          if (singleTab && draggedTab === beforeTab) {
            return true // addingTabOver will already have grouped the tab etc, so skip ___onDropCallback
          }
        }
        else {
          // Tab will be moved directly

          // tk.chosenNewIndex = newIndex
          if (tab._tPos < newIndex)
            newIndex--
          // event.tab = tab
          // gBrowser.old_onDrop(event)
          gBrowser.moveTabTo(tab, newIndex)

          newTabs.unshift(tab) // Although not strictly a new tab, this allows copy and move to reuse code later
        }

        newTabs[0].originalTreeLevel = singleTab ? 0 : tab.treeLevel // Save the treeLevels

        return false
      })

      if (should_return_early) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (tabIsCopied || tabIsFromAnotherWindow)
        gBrowser.selectedTab = newTabs[0] // TODO=P3: TJS Is this necessary?

      window.setTimeout(function ___onDropCallback() { // TODO=P3: TJS Waiting may actually be unnecessary
        // This is now after the tabs have been restored

        if (tabIsCopied || tabIsFromAnotherWindow)
          for (let i = 0; i < newTabs.length; i++)
            // Map tabids of original tabs to tabids of their clones
            tabIdMapping[tk.getTabId(tabs[i])] = tk.getTabId(newTabs[i])

        // Group/indent the new/moved tabs
        let newGid = null as null | string
        let app = null as null | string
        const draggedIntoGroup = (aGid && aGid === bGid)
        const draggedIntoSameGroup = (draggedGid && (aGid === draggedGid || bGid === draggedGid))

        if (draggedIntoGroup || draggedIntoSameGroup) {
          if (draggedIntoSameGroup)
            newGid = draggedGid // We're in the same group we were before
          else // draggedIntoGroup is true
            newGid = aGid // Copy enclosing groupid

          // Get possible parent tab's ID in same group
          if (aGid) {
            // Inherit enclosing indentation (possibleparent)
            app = afterTab.getAttribute("possibleparent")
            // But only if afterTab's possibleparent is in the same group as it
            const parent = tk.getTabById(app)
            if (!parent || parent.getAttribute("groupid") !== aGid)
              app = null
          }
        }
        else if (singleTab) {
          if (newTabs[0].hasAttribute("groupid"))
            tk.removeGID(newTabs[0])
        }
        else if (tabIsCopied || tabIsFromAnotherWindow) {
          // Create a new groupid
          newGid = ":oG-copiedGroupOrSubtree-" + tk.generateId()
        }
        else {
          if (shiftDragSubtree)
            newGid = ":oG-draggedSubtree-" + tk.generateId() // Maintain subtree by creating a new opener group // TODO=P5: GCODE No need if the subtree was the entire group
        }
        for (let i = 0; i < newTabs.length; i++) {
          const newTab = newTabs[i]

          // Apply newGid
          if (newGid) {
            tk.setGID(newTab, newGid)
            if (draggedIntoGroup)
              newTab.setAttribute("outoforder", "true")
          }

          // Apply app, or copy from original if appropriate
          if (app && newTab.originalTreeLevel <= newTabs[0].originalTreeLevel) {
            // TODO=P3: N/A For consistency, use a temporary parent attribute so it's reset by sorts etc.
            newTab.setAttribute("possibleparent", app)
          }
          else if ((tabIsCopied || tabIsFromAnotherWindow) && !singleTab) {
            let tpp = tabs[i].getAttribute("possibleparent")
            if (tpp in tabIdMapping)
              tpp = tabIdMapping[tpp]
            newTab.setAttribute("possibleparent", tpp)
            // n.b. duplicated [single] tabs have their possibleparent set to the original because of the tk.addingTab("related", ...) above
          }

          delete newTab.originalTreeLevel
        }
        tk.updateIndents()

        // Make sure the old group isn't now a singleton
        if (singleTab) {
          if (draggedGid) {
            // TODO=P4: TJS Refactor out into a checkIfSingleton method
            if (dPrev && dPrev.getAttribute("groupid") === draggedGid
              && (!dPrev.previousSibling || dPrev.previousSibling.getAttribute("groupid") !== draggedGid)
              && (!dPrev.nextSibling || dPrev.nextSibling.getAttribute("groupid") !== draggedGid))
            {
              tk.removeGID(dPrev, true)
            }
            else if (dNext && dNext.getAttribute("groupid") === draggedGid
              && (!dNext.previousSibling || dNext.previousSibling.getAttribute("groupid") !== draggedGid)
              && (!dNext.nextSibling || dNext.nextSibling.getAttribute("groupid") !== draggedGid))
            {
              tk.removeGID(dNext, true)
            }
          }
        }
        else if (!(tabIsCopied || tabIsFromAnotherWindow)) {
          if (shiftDragSubtree) {
            // Make sure old group isn't now a singleton
            const group = tk.getGroupById(draggedGid)
            if (group.length === 1)
              tk.removeGID(group[0], true)
          }
        }
        /*else if (tabIsCopied || tabIsFromAnotherWindow) {
          if (shiftDragSubtree) {
            // No need to worry about this, as no tabs are moved (they only get removed, so the TabClose listener sorts this out)
        }*/

        for (let i = 0; i < cleanupCallbacks.length; i++) {
          const cleanupCallback = cleanupCallbacks[i]
          if (typeof cleanupCallback === "function")
            cleanupCallback()
        }

        cleanupCallbacks.length = 0
      }, 200)
    }

    // this.chosenNewIndex = null
    this.preInitTabDragModifications = function preInitTabDragModifications() {
      gBrowser.tabContainer.addEventListener("dragover", function(event: mozMouseEvent) {//for drop indicator
        const ind = this._tabDropIndicator.parentNode
        // if (!this.hasAttribute("multirow")) {
        //   ind.style.position = ""
        //   return
        // }
        ind.style.position = "fixed"
        ind.style.zIndex = 100

        const newIndex = tk._getDropIndex(event)
        const targetTab = this.childNodes[newIndex < this.childNodes.length ? newIndex : newIndex - 1]
        const isVertical = tk.TabBar.Mode.getIsVerticalMode()

        //When dragging over the tab itself, targetTab is undefined, so should just exit here
        if (typeof targetTab === "undefined" || !targetTab) {
          return
        }

        //DO NOT reuse newIndex
        if (isVertical) {
          if (event.screenY <= targetTab.boxObject.screenY + targetTab.boxObject.height / 2) {
            ind.style.top = targetTab.getBoundingClientRect().top - targetTab.boxObject.height + "px"
          }
          else {
            ind.style.top = targetTab.getBoundingClientRect().top + "px"
          }
        }
        else {
          // `top` still need to be calculated for multi-row mode
          ind.style.left = targetTab.getBoundingClientRect().left + "px"
          ind.style.top = targetTab.getBoundingClientRect().top + "px"
        }

        ind.style.lineHeight = targetTab.getBoundingClientRect().height + "px"
        ind.firstChild.style.verticalAlign = "bottom"
        this._tabDropIndicator.collapsed = false

        event.preventDefault()
        event.stopPropagation()
      }, true)

      gBrowser.tabContainer.addEventListener("dragexit", function() {
        this._tabDropIndicator.collapsed = true
      }, true)

      gBrowser.tabContainer.addEventListener("dragend", function() {
        this._tabDropIndicator.collapsed = true
      }, true)

      //contain important logic, but no use itself
      /* gBrowser.tabContainer.addEventListener("dragover", function(event: Event) {//setAttribute for after use I guess?
        const targetTab = event.target.localName === "tab" ? event.target : null
        if (!targetTab || targetTab.hasAttribute("pinned"))
          return

        const dt = event.dataTransfer
        const draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0)
        if (!draggedTab || draggedTab === targetTab || draggedTab.hasAttribute("pinned") || draggedTab.parentNode !== this)
          return

        const dropEffect = dt.dropEffect
        if (dropEffect === "link" || dropEffect === "copy") {
          targetTab.removeAttribute("dragover")
          return
        }

        const isVertical = tk.TabBar.Mode.getIsVerticalMode()
        const position = isVertical ? "screenY" : "screenX"
        const size = isVertical ? "height" : "width"
        const start = isVertical ? "top" : "left"
        const end = isVertical ? "bottom" : "right"

        // tk.log("event.screenX = "+event.screenX)
        // tk.log("targetTab.boxObject.screenX = "+targetTab.boxObject.screenX)
        // tk.log("targetTab.boxObject.width = "+targetTab.boxObject.width)

        // tk.log("event.screenY = "+event.screenY)
        // tk.log("targetTab.boxObject.screenY = "+targetTab.boxObject.screenY)
        // tk.log("targetTab.boxObject.height = "+targetTab.boxObject.height)

        // tk.log("event.position = "+eval("event."+position))
        // tk.log("targetTab.boxObject.position = "+eval("targetTab.boxObject."+position))
        // tk.log("targetTab.boxObject.size = "+eval("targetTab.boxObject."+size))

        // tk.log("targetTab.boxObject.position + targetTab.boxObject.size * .25 = "+(eval("targetTab.boxObject."+position) + eval("targetTab.boxObject."+size+" * .25")))
        // tk.log("targetTab.boxObject.position + targetTab.boxObject.size * .75 = "+(eval("targetTab.boxObject."+position) + eval("targetTab.boxObject."+size+" * .75")))
        if (eval("event."+position) <= (eval("targetTab.boxObject."+position) + eval("targetTab.boxObject."+size+" /2"))) {
          targetTab.setAttribute("dragover", start)
        } else if (eval("event."+position) > (eval("targetTab.boxObject."+position) + eval("targetTab.boxObject."+size+" /2"))) {
          targetTab.setAttribute("dragover", end)
        } else {
          //Dead Code MEDIC!
          targetTab.setAttribute("dragover", "center")
          // this._tabDropIndicator.collapsed = true
          event.preventDefault()
          event.stopPropagation()
        }
      }, true)  */

      gBrowser.tabContainer.addEventListener("drop", tk._onDrop, true)
    }
    this.preInitListeners.push(this.preInitTabDragModifications)
    this.postInitTabDragModifications = function postInitTabDragModifications() { // TODO=P4: TJS Test
      // if ("_onDrop" in gBrowser) { // [Fx3.5+]
      //   gBrowser.old_onDrop = gBrowser._onDrop
      //   gBrowser._onDrop = tk._onDrop
      // }
      // else {// [Fx4+]
      //   tk.debug("postInitTabDragModifications Fx4 Version Unavailable, Developer come!!")
      // }

    }
    this.postInitListeners.push(this.postInitTabDragModifications)

    this._getDropIndex = function _getDropIndex(event: mozMouseEvent) {  //since the default functions sucks on vertical mode
      const targetTab = event.target.localName === "tab" ? (event.target as Tab) : null
      if (!targetTab || targetTab.hasAttribute("pinned"))
        return

      const dt = (event as any).dataTransfer
      const draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0)
      if (!draggedTab || draggedTab === targetTab || draggedTab.hasAttribute("pinned"))
        return

      const isVertical = tk.TabBar.Mode.getIsVerticalMode()

      let resultIndex: number
      const targetPos = targetTab._tPos
      if (isVertical) {
        if (event.screenY <= targetTab.boxObject.screenY + targetTab.boxObject.height / 2) {
          resultIndex = targetPos
        }
        else {
          resultIndex = targetPos + 1
        }
      }
      else {
        if (event.screenX <= targetTab.boxObject.screenX + targetTab.boxObject.width / 2) {
          resultIndex = targetPos
        }
        else {
          resultIndex = targetPos + 1
        }
      }

      return resultIndex
    }



    /* TODO=P3: Let Ctrl-Tab switch tabs in most recently viewed order
    // I would put this under the Gestures section, but it relies on the sorting attributes set here

      <CHANGELOG>

        * - Can set Ctrl-Tab to switch tabs in most recently viewed order

      <HERE>

        ADD TO this.initSortingAndGrouping = function initSortingAndGrouping(event: Event) {

          ...

          //tk.updateCtrlTabStack()

          ...

          //window.addEventListener("keydown", tk.onKeyDown, true)
          window.addEventListener("keypress", tk.onKeyPress, true)
          window.addEventListener("keyup", tk.onKeyUp, true)

          ...

        }
        //this.updateCtrlTabStack = function updateCtrlTabStack(event: Event) {
        //  gBrowser.mTabBox.handleCtrlTab =
        //}
        this.compareTabViewedExceptUnreadOrSwitching = function compareTabViewedExceptUnreadOrSwitching(aV, bV) {
          if (Date.now() < aV && Date.now >= bV)
            return -1
          if (Date.now() >= aV && Date.now < bV)
            return 1
          return aV - bV
        }
        this.isCtrlTabSwitching = false
        //this.onKeyDown = function onKeyDown(event: Event) {
        //  if (!event.isTrusted)
        //    return
        //}
        this.onKeyPress = function onKeyPress(event: Event) {
          if (!event.isTrusted
            || event.keyCode !== event.DOM_VK_TAB
            || !event.ctrlKey
            || event.altKey
            || event.metaKey
            || !_prefs.getBoolPref("ctrlTabStack"))
          {
            return
          }

          const selectedLastViewed = Number(b.hasAttribute("tempLastViewedKey") ? b.getAttribute("tempLastViewedKey")
                                            : b.getAttribute(tk.Sorts.lastViewed))
          const beforeSelected
          const afterSelected
          var

          event.stopPropagation()
          event.preventDefault()
        }
        this.onKeyUp = function onKeyUp(event: Event) {
          if (!event.isTrusted
            || event.keyCode !== event.DOM_VK_CONTROL
            || !tk.isCtrlTabSwitching)
          {
            return
          }

          for (let i = 0; i < _tabs.length; i++)
            _tabs[i].removeAttribute("tempLastViewedKey")
          tk.isCtrlTabSwitching = false
        }

      <defaults.js>

        pref("extensions.tabkit.ctrlTabStack", false)

      <settings.xul>

        <preference id="ctrltabstack-pref" name="extensions.tabkit.ctrlTabStack" type="bool"/>

        <checkbox id="ctrltabstack" label="&ctrlTabStack.label"
          accesskey="&ctrlTabStack.accesskey" preference="ctrltabstack-pref"/>

      <settings.dtd>

        <!ENTITY ctrlTabStack.label "Ctrl-Tab switches tabs in most recently viewed order (no change to Ctrl-PageDown)">
        <!ENTITY ctrlTabStack.accesskey "W">
    */

    //}##########################
    //{=== Protected tabs
    //|##########################

    /* References
     * ----------
     * PermaTabs - https://addons.mozilla.org/en-US/firefox/addon/2558 / http://forums.mozillazine.org/viewtopic.php?f=48&t=587171&start=99999
     * Tab Mix Plus - http://www.tidycms.com/ocean/extensions/Tab_Mix_Plus/TMPHelp2.pdf
     */

    this.initProtectedTabs = function initProtectedTabs() {
      // Function called by removing tab
      // Prevent "protected" tabs to be closed
      // FF 38.x: https://searchfox.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#2017
      // FF 45.x: https://searchfox.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#2109
      (function() {
        "use strict"

        if (typeof gBrowser.removeTab !== "function") {
          tk.debug("gBrowser.removeTab doesn't exists, replacing function failed")
          return
        }

        const old_func = gBrowser.removeTab
        // Function signature should be valid for FF 38.x & 45.x
        gBrowser.removeTab = function(aTab: Tab, aParams?: any) {
          "use strict"
          let result

          if (tk.getTabIsProtected(aTab)) {
            tk.beep()
          }
          else {
            result = old_func.apply(this, [aTab, aParams])
          }

          return result
        }
      })()

      _tabContainer.addEventListener("click", tk.protectedTabs_onClick, true)

      const tabContextMenu = _tabContainer.contextMenu
      tabContextMenu.addEventListener("popupshowing", tk.protectedTabs_updateContextMenu, false)

      tk.context_closeTab = document.getElementById("context_closeTab")

    }
    this.initListeners.push(this.initProtectedTabs)

    this.postInitProtectedTabs = function postInitProtectedTabs() {
      // In firefox 15 session store module call must not be too early, reason unknown
      // Persist Attributes
      if (_ss)
        _ss.persistTabAttribute("protected")
    }
    this.postInitListeners.push(this.postInitProtectedTabs)

    this.protectedTabs_onClick = function protectedTabs_onClick(event: mozMouseEvent) {
      const isCloseButton = (event.originalTarget.className.indexOf("tab-close-button") > -1)
      const isMouseClick = (event.button === 0 || event.button === 1)
      const isProtectedTab = ((event.target.localName === "tab") && event.target.getAttribute("protected") === "true")

      if (isCloseButton && isMouseClick && isProtectedTab)
      {
        event.target.removeAttribute("protected")
        event.stopPropagation()
      }
    }

    this.protectedTabs_updateContextMenu = function protectedTabs_updateContextMenu() {
      const tab = gBrowser.mContextTab || gBrowser.selectedTab
      const isProtected = tab.getAttribute("protected") === "true"

      const el_menu_tabkit_tab_toggleProtected = document.getElementById("menu_tabkit-tab-toggleProtected")
      if (el_menu_tabkit_tab_toggleProtected != null) {
        (document.getElementById("menu_tabkit-tab-toggleProtected") as any).setAttribute("checked", isProtected)
      }
      if (tk.context_closeTab != null) {
        tk.context_closeTab.setAttribute("disabled", isProtected.toString())
      }
    }

    this.getTabIsProtected = function getTabIsProtected(contextTab: Tab) {
      if (!contextTab) {
        contextTab = gBrowser.selectedTab
      }

      return (contextTab.getAttribute("protected") === "true")
    }
    this.toggleProtected = function toggleProtected(contextTab: Tab) {
      if (!contextTab) {
        contextTab = gBrowser.selectedTab
      }

      if (tk.getTabIsProtected(contextTab)) {
        tk.setTabUnprotected(contextTab)
      }
      else {
        tk.setTabProtected(contextTab)
      }
    }
    this.setTabProtected = function setTabProtected(contextTab: Tab) {
      if (!contextTab) {
        contextTab = gBrowser.selectedTab
      }

      if (tk.getTabIsProtected(contextTab)) {
        return false
      }
      else {
        contextTab.setAttribute("protected", "true")
        return true
      }
    }
    this.setTabUnprotected = function setTabUnprotected(contextTab: Tab) {
      if (!contextTab) {
        contextTab = gBrowser.selectedTab
      }

      if (tk.getTabIsProtected(contextTab)) {
        contextTab.removeAttribute("protected")
        return true
      }
      else {
        return false
      }
    }

    //}##########################
    //{=== New tabs by default
    //|##########################

    // See globalPreInitNewTabsByDefault in tabkit-global.js

    this.postInitNewTabsByDefault = function postInitNewTabsByDefault() {
      (function() {
        "use strict"

        if (!("PlacesUIUtils" in window) ||
            typeof window.PlacesUIUtils._openNodeIn !== "function") {
          tk.debug("PlacesUIUtils._openNodeIn doesn't exists, replacing function failed")
          return
        }

        const old_func = window.PlacesUIUtils._openNodeIn
        // Return if method already patched
        if (tk.TKData.getDataWithKey(old_func, "patched").data) {
          return
        }
        // Function signature should be valid for FF 38.x & 45.x
        window.PlacesUIUtils._openNodeIn = function(aNode, aWhere, aWindow, aPrivate=false) {
          let result
          // Logic copied from https://searchfox.org/mozilla-esr45/source/browser/components/places/PlacesUIUtils.jsm#744
          const browserWindow =
            aWindow && aWindow.document.documentElement.getAttribute("windowtype") === "navigator:browser" ?
              aWindow : RecentWindow.getMostRecentBrowserWindow()
          const selected_tab_before_operation = browserWindow.gBrowser.selectedTab

          browserWindow.tabkit.debug(">>> PlacesUIUtils._openNodeIn >>>")
          browserWindow.tabkit.addingTab({
            added_tab_type: "bookmark",
            parent_tab: selected_tab_before_operation,
          })
          aWhere = browserWindow.tabkit.returnWhereWhenOpenPlaces(aWhere, aNode)
          try {
            result = old_func.apply(this, [aNode, aWhere, aWindow, aPrivate])
          }
          finally {
            // This might be called already
            // But this is called again since it contains code for cleaning up
            browserWindow.tabkit.addingTabOver({
              added_tab_type: "bookmark",
              parent_tab: selected_tab_before_operation,
            })
          }
          browserWindow.tabkit.debug("<<< PlacesUIUtils._openNodeIn <<<")

          return result
        }

        // Mark method as patched patched
        tk.TKData.setDataWithKey(window.PlacesUIUtils._openNodeIn, "patched", true)
      })()

      // Patch function for opening a "set" of URLs from bookmark
      ;(function() {
        "use strict"

        if (!("PlacesUIUtils" in window) ||
            typeof window.PlacesUIUtils._openTabset !== "function") {
          tk.debug("PlacesUIUtils._openTabset doesn't exists, replacing function failed")
          return
        }

        const old_func = window.PlacesUIUtils._openTabset
        // Return if method already patched
        if (tk.TKData.getDataWithKey(old_func, "patched").data) {
          return
        }
        // Function signature should be valid for FF 38.x & 45.x
        window.PlacesUIUtils._openTabset = function(aItemsToOpen, aEvent, aWindow) {
          "use strict"
          // Logic copied from https://searchfox.org/mozilla-esr45/source/browser/components/places/PlacesUIUtils.jsm#744
          const browserWindow =
            aWindow && aWindow.document.documentElement.getAttribute("windowtype") === "navigator:browser" ?
              aWindow : RecentWindow.getMostRecentBrowserWindow()

          browserWindow.tabkit.debug(">>> PlacesUIUtils._openTabset >>>")

          browserWindow.tabkit.isBookmarkGroup = true
          const result = old_func.apply(this, [aItemsToOpen, aEvent, aWindow])

          browserWindow.tabkit.debug("<<< PlacesUIUtils._openTabset <<<")

          return result
        }

        // Mark method as patched patched
        tk.TKData.setDataWithKey(window.PlacesUIUtils._openTabset, "patched", true)
      })()
    }
    this.postInitListeners.push(this.postInitNewTabsByDefault)

    this.returnWhereWhenOpenPlaces = function returnWhereWhenOpenPlaces(aWhere: string, aNode: any) {
      if (!gPrefService.getBoolPref("extensions.tabkit.openTabsFrom.places")) {
        return aWhere
      }

      /* bookmarklets*/
      if (aNode.uri.indexOf("javascript:") === 0) {
        return aWhere
      }


      // if ( // clicking on folder
      //   aEvent &&
      //   (
      //     ( // tree
      //       aEvent.target.localName == 'treechildren' &&
      //       aEvent.currentTarget.selectedNode &&
      //       !PlacesUtils.nodeIsURI(aEvent.currentTarget.selectedNode) &&
      //       PlacesUtils.nodeIsContainer(aEvent.currentTarget.selectedNode)
      //     ) ||
      //     ( // toolbar, menu
      //       aEvent.originalTarget &&
      //       aEvent.originalTarget.node &&
      //       PlacesUtils.nodeIsContainer(aEvent.originalTarget.node)
      //     )
      //   )
      // )
      // tk.debug("clicking on folder")return aWhere

      // Reverse bookmark open location: new tab <--> current tab
      if ((aWhere === "tab") || (aWhere === "tabshifted")) {
        // tk.debug("return current")
        return "current"
      }

      if (aWhere === "current") {
        // tk.debug("return tab")
        return "tab"
      }

      // Fallback (for window and othe values)
      return aWhere
    }

    //}##########################
    //{=== Tab Min Width
    //|##########################

    /// Initialisation:

    this.initTabMinWidth = function initTabMinWidth() {
      tk.addGlobalPrefListener("extensions.tabkit.tabs.tabMinWidth", tk.resetTabMinWidth)
      const ss = document.styleSheets
      for (let i = ss.length - 1; i >= 0; i--) {
        if (ss[i].href === "chrome://tabkit/content/variable.css") {
          tk.tabWidthStyleSheet = ss[i]
          break
        }
      }
    }
    this.initListeners.push(this.initTabMinWidth)

    /// Pref Listener/method:
    // Note: this is also used by multi-row tabs
    this.resetTabMinWidth = function resetTabMinWidth() {
      tk.setTabMinWidth(gPrefService.getIntPref("extensions.tabkit.tabs.tabMinWidth")) //Minimum minWidth of tab is 100, a built-in CSS rule
    }

    /// Methods:
    // Note: this is also used by multi-row tabs
    this.setTabMinWidth = function setTabMinWidth(minWidth: number) {
      // _tabContainer.mTabMinWidth = minWidth
      minWidth = Math.max(minWidth, TAB_MIN_WIDTH)
      for (let i = 0; i < _tabs.length; i++) {
        _tabs[i].minWidth = minWidth
        //the index may change, also be noticed first rule start @ 1, [0] is always undefined, don't ask me why, idk
        const style = (tk.tabWidthStyleSheet as any).cssRules[1].style
        style.setProperty("min-width", minWidth + "px", "important")
      }
      _tabContainer.adjustTabstrip()
    }

    //}##########################
    //{>>> Tab Bar position
    //|##########################

    // NOTE: Vertical tab dragging (inc. indicator position) is fixed by Multi-row tabs

    /// Enums:
    this.Positions = {
      TOP: 0,
      LEFT: 1,
      RIGHT: 2,
      BOTTOM: 3,
    }

    /// Initialisation:
    this.initTabbarPosition = function initTabbarPosition() {
      const tabs_toolbar = document.getElementById("TabsToolbar")

      tk.moveSidebar()
      tk.addPrefListener("tabbarPosition", tk.moveSidebar)

      tk.moveTabbar()
      tk.addPrefListener("tabbarPosition", tk.moveTabbar)

      _tabContainer.addEventListener("TabOpen", tk.positionedTabbar_onTabOpen, false)
      _tabContainer.addEventListener("TabSelect", tk.positionedTabbar_onTabSelect, false)
      _tabContainer.addEventListener("TabMove", tk.positionedTabbar_onTabSelect, false) // In case a tab is moved out of sight

      _tabBar.tkLastMouseover = Date.now() // Prevent strict errors if we get a mouseout before our first mouseover
      gBrowser.tabContainer.addEventListener("mouseover", tk.positionedTabbar_onMouseover, false)
      gBrowser.tabContainer.addEventListener("mouseout", tk.positionedTabbar_onMouseout, false)

      // DOM mutation event is deprecated
      // `MutationObserver` should be used instead
      // Ref:
      // - https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/Appendix_F:_Monitoring_DOM_changes
      // - https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events
      // - https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
      // - https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
      if (typeof MutationObserver === "function") {
        const tabs_toolbar_mutation_observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type !== "attributes") { return }
            if (mutation.attributeName !== "collapsed") { return }

            tk.positionedTabbar_onToggleCollapse({tabs_toolbar: tabs_toolbar})
          })
        })
        // Start observing
        tabs_toolbar_mutation_observer.observe(tabs_toolbar, {
          attributes: true,
          attributeFilter: ["collapsed"],
          attributeOldValue: true,
        })
      }

      //Special bug workaround by Pika
      _tabContainer.addEventListener("TabClose", tk.bug608589workaround, true)
    }
    this.initListeners.push(this.initTabbarPosition)

    this.TabBar = this.TabBar || {}
    this.TabBar.Callbacks = this.TabBar.Callbacks || {}

    /// Event listeners:
    this.bug608589workaround = function bug608589workaround() {
      //As stated in bug 608589, if animation is enabled,
      // there is a chance the animation cannot finish and the tab will disappear but not closed(since waiting for animation)
      // I can still reproduce this problem up to firefox nightly 10
      // this workaround will stay here until a real fix is released
      if (gPrefService.getBoolPref("browser.tabs.animate"))
        gPrefService.setBoolPref("browser.tabs.animate",false)
    }
    this.positionedTabbar_onTabOpen = function positionedTabbar_onTabOpen(event: Event) {
      const tab = event.target as Tab
      if (tk.TabBar.Mode.getIsVerticalMode() && document.getElementById("tabkit-splitter")) {

        tab.maxWidth = 9999
        tab.minWidth = 0

        // Ensure newly opened tabs can be seen (even if, in some cases, this may put the selected tab offscreen - TODO=P4: GCODE Make sure not to move selected tab offscreen if it is onscreen)
        window.setTimeout(function() {
          tk.scrollToElement((document as mozDocument).getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox"), tab)
        }, 0)
      }
      // make all ungrouped tabs white
      // this could be buggy and/or impact performance
      // tk.colorizeTab(tab)
    }
    this.positionedTabbar_onTabSelect = function positionedTabbar_onTabSelect() {
      const tab = gBrowser.selectedTab
      if (tk.TabBar.Mode.getIsVerticalMode()) {


        // Tabs on different rows shouldn't get before/afterselected attributes
        if (tab.previousSibling != null) {
          tab.previousSibling.removeAttribute("beforeselected")
        }
        if (tab.nextSibling != null) {
          tab.nextSibling.removeAttribute("afterselected")
        }



        // Ensure selected tabs become visible (and the tabs before/after if scrollOneExtra)
        // tk.scrollToElement((document as mozDocument).getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox"), tab)
        //Must use direct call instead of shortcut, or will cause error
        // tk.scrollToElement((document as mozDocument).getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox"), tab)
        window.setTimeout(function() {
          tk.scrollToElement((document as mozDocument).getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox"), tab)
        }, 50) //this timeout has to be after TabOpen to make it work normally (it seems)
      }
      tk.colorizeTab(tab)
    }
    this.positionedTabbar_onResize = function positionedTabbar_onResize() {
      const width = parseInt(_tabBar.width !== "" ? _tabBar.width : 250)  //temp default value, MEDIC!!
      _prefs.setIntPref("tabSidebarWidth", Math.min(width, 576)) // Upper limit on default width so can't be wider than maximised browser window, even on 800x600 screen
    }
    this.positionedTabbar_onMouseover = function positionedTabbar_onMouseover() {
      const splitter = document.getElementById("tabkit-splitter")
      if (!splitter || splitter.getAttribute("state") !== "collapsed")
        return

      // Increment counter, so __collapse can tell if there has been a mouseover since the timer was started
      _tabBar.tkLastMouseover = (_tabBar.tkLastMouseover || 0) + 1

      if (_tabBar.collapsed) {
        // Ensure tab bar has sensible width if we're showing it on hover (this
        // way it's ok to collapse it by dragging the splitter to zero width)
        _tabBar.width = Math.max(200, parseInt(_tabBar.width))

        // Show tab bar
        _tabBar.collapsed = false
      }
    }
    this.positionedTabbar_onMouseout = function positionedTabbar_onMouseout() {
      const splitter = document.getElementById("tabkit-splitter")
      if (!splitter || splitter.getAttribute("state") !== "collapsed")
        return

      window.clearTimeout(tk.positionedTabbar_collapseTimer)
      tk.positionedTabbar_collapseTimer = window.setTimeout(function __collapse(lastMouseover: number) {
        if (splitter.getAttribute("state") === "collapsed"
          && lastMouseover === _tabBar.tkLastMouseover)
        {
          _tabBar.collapsed = true
        }
      }, 333, _tabBar.tkLastMouseover)
    }
    this.positionedTabbar_onToggleCollapse = function positionedTabbar_onToggleCollapse(options: {tabs_toolbar?: HTMLElement} = {}) {
      // if (event.attrName !== "collapsed")
      //   return

      if (typeof options !== "object") {
        options = {}
      }

      const tabs_toolbar = options.tabs_toolbar
      // This should not happen, but to be safe we check it
      if (tabs_toolbar == null) { return }

      const tabs_toolbar_collapsed = tabs_toolbar.getAttribute("collapsed") === "true"

      const scrollbar = tk.VerticalTabBarScrollbar.getElement()
      if (scrollbar == null) { return }

      if (tabs_toolbar_collapsed) {
        tk.backupScrollBarPosition()
      }
      else {
        window.setTimeout(function () {
          tk.restoreScrollBarPosition()
        }, 100) // TODO: TJS Find more reliable way of setting this than 50 ms timeout...
      }
    }

    this.backupScrollBarPosition = function() {
      "use strict"
      const scrollbar = tk.VerticalTabBarScrollbar.getElement()
      const curpos = parseInt(scrollbar.getAttribute("curpos"))

      if (!isNaN(curpos) && curpos > 0) {
        // Restore the old scroll position, as collapsing the tab bar will have reset it
        tk.TKData.setDataWithKey(_tabBar, "scroll_bar_position", curpos)
      }
    }

    this.restoreScrollBarPosition = function() {
      "use strict"
      const scrollbar = tk.VerticalTabBarScrollbar.getElement()
      const curpos = tk.TKData.getDataWithKey(_tabBar, "scroll_bar_position").data

      if (scrollbar != null && !isNaN(curpos) && curpos > 0) {
        // Restore the old scroll position, as collapsing the tab bar will have reset it
        scrollbar.setAttribute("curpos", curpos)
      }
    }

    /// Methods:
    this.moveSidebar = function moveSidebar(tabbarPosition?: number) {
      if (typeof tabbarPosition !== "number") tabbarPosition = _prefs.getIntPref("tabbarPosition")

      // Strange behavior when put on top or bottom, remove those options
      let flip_direction = false
      if (tabbarPosition === tk.Positions.LEFT) {
        flip_direction = true
      }
      // Special support for extension "All-In-One Sidebar"
      // Totally non-scalable implmenetation
      const do_not_move_sidebar = "AiOS_HELPER" in window
      if (do_not_move_sidebar) {
        return
      }

      const need_move_sidebar = ((tabbarPosition === tk.Positions.LEFT) || (tabbarPosition === tk.Positions.RIGHT))

      // Calculate new orient attributes
      const fromHorizontal = "horizontal"
      const fromVertical = "vertical"
      const fromNormal = "normal"

      // Get some nodes
      const browser_border_start = document.getElementById("browser-border-start")
      const browser = document.getElementById("browser")
      if (browser == null ) {
        return
      }
      const sidebar_box = document.getElementById("sidebar-box")
      const sidebar_splitter = document.getElementById("sidebar-splitter")
      if (sidebar_box == null) { return }
      const sidebar_header = (sidebar_box.getElementsByTagName("sidebarheader")[0] as any)
      const appcontent = document.getElementById("appcontent")
      const normallyHorizontal = [
        browser,
        sidebar_splitter,
        sidebar_header,
      ]
      const normallyVertical = [
        sidebar_box,
        appcontent,
      ]
      const normallyNormal = [
        sidebar_box,
        sidebar_header,
      ]

      // Set new attributes
      const new_direction = flip_direction ? "reverse" : "normal"

      // Before we use browser.dir, but that screws up the direction
      // Now just move the sidebar element
      if (need_move_sidebar) {
        tk.DomUtility.insertAfter(appcontent, sidebar_box)
        tk.DomUtility.insertBefore(sidebar_box, sidebar_splitter)
      } else {
        tk.DomUtility.insertAfter(browser_border_start, sidebar_box)
        tk.DomUtility.insertAfter(sidebar_box, sidebar_splitter)
      }

      normallyNormal.forEach(function(node) {
        node.dir = fromNormal
      })

      sidebar_header.pack = "start"

      // Set orient attributes last or stuff messes up
      normallyHorizontal.forEach(function(node) {
        node.orient = fromHorizontal
      })
      normallyVertical.forEach(function(node) {
        (node as any).orient = fromVertical
      })

      // Now activate our css
      browser.removeAttribute("horizsidebar")
      browser.removeAttribute("vertisidebar")
      browser.setAttribute(fromVertical.substring(0, 5) + "sidebar", new_direction)
    }

    //Edited by PikachuEXE, NOT tested
    this.moveTabbar = function moveTabbar(pos?: number) {
      if (typeof pos !== "number") pos = _prefs.getIntPref("tabbarPosition")

      //Start Edit by Pika
      const tabsToolbar = document.getElementById("TabsToolbar") //FF4+ tabbar
      const appcontent = document.getElementById("appcontent")
      const browser = document.getElementById("browser")

      if (appcontent == null || tabsToolbar == null) {
        return
      }

      // Calculate new orient attributes
      const flipOrient = (pos === tk.Positions.LEFT || pos === tk.Positions.RIGHT)
      const fromHorizontal = flipOrient ? "vertical" : "horizontal"

      // Calculate new direction attribute
      const flipDirection = (pos === tk.Positions.RIGHT || pos === tk.Positions.BOTTOM)
      const newDirection = flipDirection ? "normal" : "reverse"

      // Now activate our css
      if (flipOrient) {
        (appcontent.parentNode as any).insertBefore(tabsToolbar, appcontent)
      }
      else if (pos === tk.Positions.TOP) {
        const menubar = document.getElementById("toolbar-menubar")
        if (menubar == null) {
          return
        }
        (menubar.parentNode as any).insertBefore(tabsToolbar, menubar)
      }
      else if (pos === tk.Positions.BOTTOM) {
        const a = document.getElementById("browser-bottombox")
        ;(a as any).parentNode.insertBefore(tabsToolbar, a)
      }
      (browser as any).dir = (newDirection as any)
      ;(tabsToolbar as any).orient = _tabContainer.mTabstrip.orient = fromHorizontal
      gBrowser.removeAttribute("horiztabbar")
      gBrowser.removeAttribute("vertitabbar")
      gBrowser.setAttribute(fromHorizontal.substring(0, 5) + "tabbar", newDirection)
      tabsToolbar.removeAttribute("horiztabbar")
      tabsToolbar.removeAttribute("vertitabbar")
      tabsToolbar.setAttribute(fromHorizontal.substring(0, 5) + "tabbar", newDirection)
      //add one more to mainPopupSet
      const mainPopupSet = document.getElementById("mainPopupSet")
      if (mainPopupSet == null) {
        return
      }
      mainPopupSet.removeAttribute("horiztabbar")
      mainPopupSet.removeAttribute("vertitabbar")
      mainPopupSet.setAttribute(fromHorizontal.substring(0, 5) + "tabbar", newDirection)

      // Toggle the splitter as appropriate
      let splitter = document.getElementById("tabkit-splitter") as Element | null
      if (flipOrient) {
        // Remove any space or flexible space in tab bar(which makes vertical tab bar works strange)
        for (let i = 0; i < tabsToolbar.children.length; i++) {
          const thisNode = tabsToolbar.children.item(i)
          if (thisNode.localName === "toolbarspacer" || thisNode.localName === "toolbarspring") {
            (thisNode.parentNode as any).removeChild(thisNode)  //if you remove here you affect the length and index of after objects, the next one will escape check, so need to decrease index
            i--
          }
        }

        if (!splitter) {
          splitter = document.createElementNS(XUL_NS, "splitter")
          splitter.id = "tabkit-splitter"
          splitter.setAttribute("collapse", "before")
          const grippy = document.createElementNS(XUL_NS, "grippy")
          grippy.id = "tabkit-grippy"
          splitter.appendChild(grippy)

          splitter.addEventListener("mouseover", tk.positionedTabbar_onMouseover, false)
          splitter.addEventListener("mouseout", tk.positionedTabbar_onMouseout, false)

          _tabBar.width = _prefs.getIntPref("tabSidebarWidth")
          for (let i = 0; i < _tabs.length; i++)
            _tabs[i].maxWidth = 9999
          tk.setTabMinWidth(0)
          gBrowser.mTabBox.addEventListener("resize", tk.positionedTabbar_onResize, false)
        }
        tk.DomUtility.insertBefore(appcontent, splitter)//add by Pika
        if ("toggleIndentedTree" in tk) {
          tk.toggleIndentedTree()
        }
      }
      else {
        if ("toggleIndentedTree" in tk) {
          tk.toggleIndentedTree()
        }
        if (splitter) {
          gBrowser.mTabBox.removeEventListener("resize", tk.positionedTabbar_onResize, false)
          for (let i = 0; i < _tabs.length; i++)
            _tabs[i].maxWidth = 250
          tk.resetTabMinWidth()
          ;(appcontent.parentNode as any).removeChild(splitter)//add by Pika
        }
      }

      tk.positionedTabbar_onTabSelect()
    }

    //}##########################
    //{>>> Multi-row tabs
    //|##########################

    /// Initialisation:
    this.initMultiRowTabs = function initMultiRowTabs() {
      _tabContainer.mTabstrip.addEventListener("overflow", tk._preventMultiRowFlowEvent, true)
      _tabContainer.mTabstrip.addEventListener("underflow", tk._preventMultiRowFlowEvent, true)

      tk.addPrefListener("tabRows", tk.updateMultiRowTabs)
      tk.addPrefListener("tabbarPosition", tk.updateMultiRowTabs)
      tk.addGlobalPrefListener("extensions.tabkit.tabs.tabMinWidth", tk.updateMultiRowTabs)
      tk.addGlobalPrefListener("extensions.tabkit.tabs.closeButtons", tk.updateMultiRowTabs)
      _tabContainer.addEventListener("TabOpen", tk.updateMultiRowTabs, false)
      tk.addDelayedEventListener(_tabContainer, "TabClose", tk.updateMultiRowTabs)
      document.addEventListener("SSTabRestoring", tk.updateMultiRowTabs, false) // "hidden" attributes might be restored!
      window.addEventListener("resize", tk.updateMultiRowTabs, false)

      _tabContainer.addEventListener("TabSelect", tk.multiRow_onTabSelect, false)
      _tabContainer.addEventListener("TabMove", tk.multiRow_onTabSelect, false) // In case a tab is moved out of sight

      tk.updateMultiRowTabs()

      //{=== Multi-row drop indicator

      // PikachuEXE: I have given up the drop indicator in multirow mode
      // Setup new drop indicator (this way it can be moved up and down as well as left and right)
      // const oldIndicatorBar = gBrowser.mTabBox.firstChild
      // const oldIndicator = oldIndicatorBar.firstChild
      // const oldBarStyle = tk.getCSSRule(".tab-drop-indicator-bar").style //[Fx3only]
      // const oldStyle = tk.getCSSRule(".tab-drop-indicator").style //[Fx3only]
      // const newDropIndicatorBar = document.createElementNS(XUL_NS, "hbox")
      // const newDropIndicator = document.createElementNS(XUL_NS, "hbox")
      // newDropIndicatorBar.id = "tabkit-tab-drop-indicator-bar"
      // if (oldIndicatorBar.hasAttribute("collapsed")) // [Fx3only]
      //   newDropIndicatorBar.setAttribute("collapsed", "true")
      // newDropIndicator.setAttribute("mousethrough", "always")
      // newDropIndicatorBar.style.height = oldBarStyle.height
      // newDropIndicatorBar.style.marginTop = oldBarStyle.marginTop
      // newDropIndicatorBar.style.position = "relative"
      // newDropIndicatorBar.style.top = newDropIndicatorBar.style.left = "0"
      // newDropIndicator.style.height = oldStyle.height
      // newDropIndicator.style.width = oldStyle.width
      // newDropIndicator.style.marginBottom = oldStyle.marginBottom
      // newDropIndicator.style.position = "relative"
      // newDropIndicator.style.backgroundColor = oldStyle.backgroundColor // Probably unnecessary
      // newDropIndicator.style.backgroundImage = oldStyle.backgroundImage
      // newDropIndicator.style.backgroundRepeat = oldStyle.backgroundRepeat
      // newDropIndicator.style.backgroundAttachment = oldStyle.backgroundAttachment // Probably unnecessary
      // newDropIndicator.style.backgroundPosition = "50% 50%" // This cannot be gotten from oldStyle, see https://bugzilla.mozilla.org/show_bug.cgi?id=316981
      // newDropIndicatorBar.appendChild(newDropIndicator)
      // stack.appendChild(newDropIndicatorBar)
      // gBrowser.__defineGetter__("mTabDropIndicatorBar", function __get_mTabDropIndicatorBar() {
      //   return document.getElementById("tabkit-tab-drop-indicator-bar")
      // })
      // oldIndicatorBar.removeAttribute("dragging")
      // oldIndicatorBar.setAttribute("collapsed", "true")

      //}
    }
    this.initListeners.push(this.initMultiRowTabs)

    /// Event Listeners:
    this.updateMultiRowTabs = function updateMultiRowTabs() {
      const tabbarPosition = _prefs.getIntPref("tabbarPosition")
      let needsDisabling = false
      let availWidth = 0
      let rows = 0
      let minWidth = null as null | number
      let needsScrolling = false

      // region close button visibility

      // Copied from
      // 0: Active tab only, 1: All tabs, 2: None

      const closeButtonsVisibilityPrefVal = gPrefService.getIntPref("extensions.tabkit.tabs.closeButtons")
      if (closeButtonsVisibilityPrefVal === 0) {
        gBrowser.tabContainer.setAttribute("tabkit-close-button-visibility", "active-tab-only")
      }
      else if (closeButtonsVisibilityPrefVal === 2) {
        gBrowser.tabContainer.setAttribute("tabkit-close-button-visibility", "none")
      }
      else {
        // closeButtonsVisibilityPrefVal === 1
        gBrowser.tabContainer.removeAttribute("tabkit-close-button-visibility")
      }

      // endregion close button visibility

      if ((tabbarPosition === tk.Positions.TOP || tabbarPosition === tk.Positions.BOTTOM) && _prefs.getIntPref("tabRows") > 1) {
        if (!gBrowser.getStripVisibility()) {
          rows = 0
        }
        else {
          let visibleTabs = _tabs.length
          for (let i = 0; i < _tabs.length; i++)
            if (_tabs[i].hidden) // visibility of a tab
              visibleTabs--
          //const newTabButton = _tabs[_tabs.length-1].boxObject.nextSibling // [Fx3.5+]
          //seems not needed in FF4+
          // if (newTabButton && newTabButton.className === "tabs-newtab-button")
          //   visibleTabs++ // Treat the new tab button as a tab for our purposes
          minWidth = _prefs.getIntPref("tabs.tabMinWidth")
          availWidth = _tabContainer.mTabstrip._scrollbox.boxObject.width
          const tabsPerRow = Math.floor(availWidth / Math.max(minWidth, TAB_MIN_WIDTH))  //Minimum minWidth of tab is 100, a built-in CSS rule
          rows = Math.ceil(visibleTabs / tabsPerRow)
        }
        if (rows > 1) {
          // Enable multi-row tabs
          if (_tabContainer.getAttribute("multirow") !== "true") {
            _tabContainer.setAttribute("multirow", "true")
            try {
              _tabContainer.mTabstrip._scrollBoxObject.scrollTo(0,0)
            }
            catch (ex) {
              // Do nothing
            }
          }

          const maxRows = _prefs.getIntPref("tabRows")
          if (rows > maxRows) {
            _tabContainer.setAttribute("multirowscroll", "true")

            // TODO=P3: GCODE Make sure tab borders and padding are properly taken into account...
            _tabContainer.mTabstrip.style.setProperty("min-height", 24 * maxRows + "px", "important")
            _tabContainer.mTabstrip.style.setProperty("max-height", 24 * maxRows + "px", "important")

            const scrollbar = tk.VerticalTabBarScrollbar.getElement()
            try {
              availWidth -= Math.max(scrollbar.boxObject.width, 22)
            }
            catch (ex) {
              tk.debug("Oops, the scrollbar hasn't been created yet... TODO-P6: TJS use a timeout")
              availWidth -= 22
            }
          }
          else {
            _tabContainer.removeAttribute("multirowscroll")

            _tabContainer.mTabstrip.style.setProperty("min-height", 24 * rows + "px", "important")
            _tabContainer.mTabstrip.style.setProperty("max-height", 24 * rows + "px", "important")
          }

          tk.setTabMinWidth(minWidth)
          // tk.setTabMinWidth(availWidth / tabsPerRow)

          if (rows > maxRows)
            tk.multiRow_onTabSelect() // Check if we need to scroll
        }
        else {
          // Disable multi-row tabs
          if (_tabContainer.getAttribute("multirow") === "true")
            needsDisabling = true
          needsScrolling = true
          _tabContainer.setAttribute("multirow", "false")
        }
      }
      else if (_tabContainer.hasAttribute("multirow")) {
        // Turn off multi-row tabs
        needsDisabling = true
        needsScrolling = (_tabContainer.getAttribute("multirow") === "true")
        _tabContainer.removeAttribute("multirow")
      }

      if (needsDisabling) {
        tk.resetTabMinWidth()

        if (needsScrolling) {
          try {
            if (gBrowser.selectedTab.nextSibling && _prefs.getBoolPref("scrollOneExtra")) {
              _tabContainer.mTabstrip._scrollBoxObject.ensureElementIsVisible(gBrowser.selectedTab.nextSibling)
            }
            _tabContainer.mTabstrip._scrollBoxObject.ensureElementIsVisible(gBrowser.selectedTab)
          }
          catch (ex) {
            // Do nothing
          }
        }

        _tabContainer.mTabstrip.style.removeProperty("min-height")
        _tabContainer.mTabstrip.style.removeProperty("max-height")
      }
    }

    this.multiRow_onTabSelect = function multiRow_onTabSelect() {
      if (_tabContainer.getAttribute("multirow") === "true") {
        const tab = gBrowser.selectedTab

        tk.scrollToElement((document as mozDocument).getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox"), tab)

        // Tabs on different rows shouldn't get before/afterselected attributes
        if (tab.previousSibling != null && tab.boxObject.y !== tab.previousSibling.boxObject.y) {
          tab.previousSibling.removeAttribute("beforeselected")
        }
        if (tab.nextSibling != null && tab.boxObject.y !== tab.nextSibling.boxObject.y) {
          tab.nextSibling.removeAttribute("afterselected")
        }
      }
    }

    /// Private Methods
    this._preventMultiRowFlowEvent = function _preventMultiRowFlowEvent(event: Event) {
      if (_tabContainer.hasAttribute("multirow")) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    //}##########################
    //{>>> Search bar
    //|##########################

    // Old bug that went away as of 3.6.10 (or earlier): Sometimes tabs remembered that the search bar was focused, and would confusingly focus it when you switch to them (in the same way as they used to remember whether the address bar was focused on a per-tab basis). Tabs no longer seem to remember this (nor for the address bar).

    /// Initialisation:
    this.initSearchBar = function initSearchBar() {
      const strings = (document.getElementById("bundle_tabkit") as any)

      const vbox = document.createElementNS(XUL_NS, "vbox")
      vbox.setAttribute("id", "tabkit-filtertabs-box")
      _tabBar.insertBefore(vbox, _tabBar.firstChild)

      const textbox = document.createElementNS(XUL_NS, "textbox")
      textbox.setAttribute("id", "tabkit-filtertabs-query")
      textbox.setAttribute("type", "search")
      textbox.setAttribute("emptytext", strings.getString("search_tabs"))
      textbox.setAttribute("tooltiptext", strings.getString("search_tabs"))
      textbox.setAttribute("clickSelectsAll", "true")
      textbox.setAttribute("newlines", "replacewithspaces")
      textbox.addEventListener("command", function() {
        tk.filterTabs(this.value)
      })
      textbox.addEventListener("input", function() {
        const el_tabkit_filtertabs_includetext = document.getElementById("tabkit-filtertabs-includetext")
        if (el_tabkit_filtertabs_includetext == null) { return }
        (el_tabkit_filtertabs_includetext as any).collapsed = !this.value
      })
      textbox.addEventListener("blur", function() {
        // Clearing the query doesn't always trigger an input event, so additionally check when it gets blurred
        const el_tabkit_filtertabs_includetext = document.getElementById("tabkit-filtertabs-includetext")
        if (el_tabkit_filtertabs_includetext == null) { return }

        (el_tabkit_filtertabs_includetext as any).collapsed = !this.value
      })
      vbox.appendChild(textbox)

      const checkbox = document.createElementNS(XUL_NS, "checkbox")
      checkbox.setAttribute("id", "tabkit-filtertabs-includetext")
      checkbox.setAttribute("label", strings.getString("include_page_text"))
      checkbox.addEventListener("command", function() {
        tk.filterTabs((document.getElementById("tabkit-filtertabs-query") as any).value)
      })
      checkbox.setAttribute("collapsed", "true")
      vbox.appendChild(checkbox)

      //Option for on/off search bar
      tk.mapBoolPrefToAttribute("disableSearchBar", document.getElementById("tabkit-filtertabs-box"), "hidden")

      // Workaround for tab disappearing bug
      // See https://github.com/tabkit/tabkit2/issues/197
      tk.filterTabs(" ")
    }
    this.initListeners.push(this.initSearchBar)

    this.filterTabs = function filterTabs(query: string) {
      // Expand collapsed groups during search
      if (query && typeof tk._groupsToReExpandAfterSearch === "undefined") {
        tk._groupsToReExpandAfterSearch = []

        Object.values(tk.getAllGroups()).forEach(function(g: Tab[]) {
          if (g[0].hasAttribute("groupcollapsed")) {
            tk.toggleGroupCollapsed(g[0])
            tk._groupsToReExpandAfterSearch.push(g[0].getAttribute("groupid"))
          }
        })
      }

      const terms = query.split(/\s+/g)
      const el_tabkit_filtertabs_includetext = document.getElementById("tabkit-filtertabs-includetext")
      if (el_tabkit_filtertabs_includetext == null) { return }
      const includePageText = (el_tabkit_filtertabs_includetext as any).checked

      // Filter tabs
      for (let t = 0; t < _tabs.length; t++) {
        const tab = _tabs[t]

        const foundTerms = {} as {[key: number]: boolean}

        // Try to match title/uri
        let uri = null
        //if (tab.getAttribute("tk_frozen") === "true") {
        //  let entry = tk.getActiveTabDataEntry(tab)
        //  if (entry)
        //    uri = entry.url
        // }
        uri = tab.linkedBrowser.currentURI.spec
        try {
          uri = decodeURI(uri)
        } catch (ex) {
          // Do nothing
        }
        const title = tab.label
        const details = (title + " " + uri).toLowerCase()
        for (let i = 0; i < terms.length; i++) {
          if (details.indexOf(terms[i]) > -1) {
            foundTerms[i] = true
          }
        }

        let match = true
        for (let i = 0; i < terms.length; i++) {
          if (!(i in foundTerms)) {
            match = false
            break
          }
        }

        // Try to match text
        if (!match && includePageText) {
          // Get frames
          const frames = []
          const frameQueue = [ tab.linkedBrowser.contentWindow ]
          while (frameQueue.length > 0) {
            const f = frameQueue.pop()
            for (let i = 0; i < f.frames.length; i++)
              frameQueue.push(f.frames[i])
            frames.push(f)
          }

          // Search each frame
          for (let i = 0; i < frames.length; i++) {
            if (!frames[i].document || !frames[i].document.body)
              continue
            const body = frames[i].document.body
            const count = body.childNodes.length
            const range = document.createRange()
            range.setStart(body, 0)
            range.setEnd(body, count)
            const start = document.createRange()
            start.setStart(body, 0)
            start.setEnd(body, 0)
            const end = document.createRange()
            end.setStart(body, count)
            end.setEnd(body, count)
            const finder = Cc["@mozilla.org/embedcomp/rangefind;1"]
            .createInstance()
            .QueryInterface(Components.interfaces.nsIFind)
            finder.caseSensitive = false

            for (let j = 0; j < terms.length; j++) {
              if (!(j in foundTerms)) {
                if (finder.Find(terms[j], range, start, end) != null)
                  foundTerms[j] = true
              }
            }
          }

          match = true
          for (let i = 0; i < terms.length; i++) {
            if (!(i in foundTerms)) {
              match = false
              break
            }
          }
        } // end if (!match && includePageText)

        // Show only matching tabs
        tk.tabSetHidden(tab, !match) // visibility of a tab
      } // end for (let t = 0; t < gBrowser.tabs.length; t++)

      // Recollapse expanded groups after search
      if (!query && typeof tk._groupsToReExpandAfterSearch === "object") {
        tk._groupsToReExpandAfterSearch.forEach(function(gid: string) {
          const g = tk.getGroupById(gid)
          if (!g[0].hasAttribute("groupcollapsed")) {
            tk.toggleGroupCollapsed(g[0])
          }
        })

        delete tk._groupsToReExpandAfterSearch
      }
    }

    //}##########################
    //{=== Mouse Gestures
    //|##########################

    /// Private Globals:

    /// Initialisation:
    this.initMouseGestures = function initMouseGestures() {
      // event `wheel` is supported since Firefox 17, but was buggy (tested on 38.3.0)
      // It's not always fired
      // https://developer.mozilla.org/en-US/docs/Web/Events/wheel
      //
      // We keep using event `DOMMouseScroll`. It's deprecated but more reliable.
      // https://developer.mozilla.org/en-US/docs/Web/Events/DOMMouseScroll
      gBrowser.tabContainer.addEventListener("wheel", tk.onTabWheelGesture, true)

      // Move Close Tab Before/After to the tab context menu (from the Tools menu)
      const tabContextMenu = gBrowser.tabContextMenu
      const closeAllTabsButButton = document.getElementById("context_closeOtherTabs")
      if (closeAllTabsButButton){
        tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsToLeft"), closeAllTabsButButton)
        tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsToRight"), closeAllTabsButButton)
        tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsAbove"), closeAllTabsButButton)
        tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsBelow"), closeAllTabsButButton)

        tk.mapBoolPrefToAttribute("closeBeforeAfterNotOther", document.getElementById("mainPopupSet"), "closebeforeafternotother")
      }
      else
        tk.dump("Could not find removeAllTabsBut")
    }
    this.initListeners.push(this.initMouseGestures)

    this.onTabWheelGesture = function onTabWheelGesture(event: mozWheelEvent) {
      if (!event.isTrusted)
        return

      let isUsingTabSheelSwitch = false
      try {
        // The external preference key entry(s) could be missing, so we use try catch here
        isUsingTabSheelSwitch = gPrefService.getBoolPref("extensions.tabkit.mouse-gestures.tabWheelSwitchHover")
      } catch(ex) {
        // Do nothing
      }

      const name = event.originalTarget.localName
      // If scroll on scrollbar or similar thing, scroll,
      // otherwise only scroll when it is not used for switching tabs
      if (!isUsingTabSheelSwitch ||
        (name === "scrollbar" || name === "scrollbarbutton" || name === "slider" || name === "thumb")) {
        // Scrollwheeling above an overflow scrollbar should still scroll 3 lines if vertical or 2 lines if multi-row tab bar
        const scrollbar = tk.VerticalTabBarScrollbar.getElement()
        if (!scrollbar) {
          tk.dump("tabInnerBox.mVerticalScrollbar is null - so what scrollbar did we scroll over?!")
          return
        }

        let delta = 0
        if (tk.TabBar.Mode.getIsVerticalMode())
          delta = (Math.abs(event.deltaY) !== 1 ? event.deltaY : (event.deltaY < 0 ? -3 : 3)) * 24
        else if (gBrowser.tabContainer.getAttribute("multirow") === "true")
          delta = event.deltaY < 0 ? -48 : 48 // 2*24
        else
          return

        let curpos = scrollbar.getAttribute("curpos")
        curpos = isNaN(curpos) ? 0 : Number(curpos)
        const maxpos = Number(scrollbar.getAttribute("maxpos"))
        const newpos = Math.min(maxpos, Math.max(0, curpos + delta))
        scrollbar.setAttribute("curpos", newpos)

        event.preventDefault()
        event.stopPropagation()
      }
    }

    this.removeTabsBefore = function removeTabsBefore(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab
      for (let i = contextTab._tPos - 1; i >= 0; i--)
        gBrowser.removeTab(_tabs[i])
    }
    this.removeTabsAfter = function removeTabsAfter(contextTab: Tab) {
      if (!contextTab)
        contextTab = gBrowser.selectedTab
      for (let i = _tabs.length - 1; i > contextTab._tPos; i--)
        gBrowser.removeTab(_tabs[i])
    }

    //}##########################
    //{=== Scrollbars not arrows
    //|##########################

    // TODO=P4: UVOICE Bug 345378 - tab preview from all tabs menupopup
    // TODO=P4: N/A Middle/right-click All Tabs menu, drag & drop
    // TODO=P5: N/A Double-click scroll buttons -> scroll to start/end

    /// Private Globals:
    let _allTabsInnerBox = null as null | Element

    /// Initialisation:
    this.initScrollbarsNotArrows = function initScrollbarsNotArrows() {
      //tk.mapBoolPrefToAttribute("scrollbarsNotArrows", document.documentElement, "scrollbarsnotarrows") // disabling the attribute didn't disable the overflow auto, so it's best to only apply changes to new windows
      if (_prefs.getBoolPref("scrollbarsNotArrows"))
        (document.documentElement as any).setAttribute("scrollbarsnotarrows", "true")
      tk.addDelayedEventListener(_tabContainer.mAllTabsPopup, "popupshowing", tk.scrollAllTabsMenu)
    }
    this.initListeners.push(this.initScrollbarsNotArrows)

    /// Event Listeners:
    this.scrollAllTabsMenu = function scrollAllTabsMenu() {
      if (!_allTabsInnerBox) {
        const arrowScrollBox = _tabContainer.mAllTabsPopup.popupBoxObject.firstChild
        if (!arrowScrollBox) {
          tk.dump("_tabContainer.mAllTabsPopup.popupBoxObject.firstChild is null")
          return
        }
        _allTabsInnerBox = (document as mozDocument).getAnonymousElementByAttribute(arrowScrollBox._scrollbox, "class", "box-inherit scrollbox-innerbox")
      }
      tk.scrollToElement(_allTabsInnerBox, gBrowser.selectedTab.mCorrespondingMenuitem)
    }

    //}##########################
    //{=== Open Selected Links
    //|##########################

    /// Initialisation:
    this.initOpenSelectedLinks = function initOpenSelectedLinks() {
      tk.addDelayedEventListener(document.getElementById("contentAreaContextMenu"), "popupshowing", tk.openSelectedLinks_onPopupShowing)
    }
    this.initListeners.push(this.initOpenSelectedLinks)

    /// Event Listeners:
    // TODO=P4: GCODE Localize Open Selected Links
    this.openSelectedLinks_onPopupShowing = function openSelectedLinks_onPopupShowing() {
      const topMenuItem = (document.getElementById("context_tabkit-opentopselectedlinks") as any)
      const menuItem = (document.getElementById("context_tabkit-openselectedlinks") as any)
      const textMenuItem = (document.getElementById("context_tabkit-openselectedtextlinks") as any)

      if (topMenuItem == null || menuItem == null || textMenuItem == null) {
        return
      }

      topMenuItem.hidden = menuItem.hidden = textMenuItem.hidden = true
      topMenuItem.tabkit_selectedLinks = menuItem.tabkit_selectedLinks = textMenuItem.tabkit_selectedLinks = null

      if (!_prefs.getBoolPref("openSelectedLinks"))
        return

      const oneItemOnly = !_prefs.getBoolPref("openSelectedLinks.showAll")

      const [uris, topUris] = tk.openSelectedLinks_getURIs()

      if (topUris.length > 0 && topUris.length < uris.length) {
        const s = topUris.length > 1 ? "s" : ""
        topMenuItem.setAttribute("label", "Open Main " + topUris.length + " Link" + s + " in New Tab" + s)
        topMenuItem.tabkit_selectedLinks = topUris
        topMenuItem.tabkit_linkSource = window.content.document.documentURI // TODO=P4: TJS Should this be focusedWindow?
        topMenuItem.hidden = false
        if (oneItemOnly)
          return
      }

      if (uris.length > 0) {
        const s = uris.length > 1 ? "s" : ""
        const all = topUris.length < uris.length ? "All " : ""
        menuItem.setAttribute("label", "Open " + all + uris.length + " Link" + s + " in New Tab" + s)
        menuItem.tabkit_selectedLinks = uris
        menuItem.tabkit_linkSource = window.content.document.documentURI // TODO-P4: TJS Should this be focusedWindow?
        menuItem.hidden = false
        if (oneItemOnly)
          return
      }

      const textUris = tk.openSelectedLinks_getTextURIs()

      if (textUris.length > 0) {
        const s = textUris.length > 1 ? "s" : ""
        textMenuItem.setAttribute("label", "Open " + textUris.length + " Text Link" + s + " in New Tab" + s)
        textMenuItem.tabkit_selectedLinks = textUris
        textMenuItem.tabkit_linkSource = window.content.document.documentURI // TODO-P4: TJS Should this be focusedWindow?
        textMenuItem.hidden = false
      }
    }

    this.openSelectedLinks_getURIs = function openSelectedLinks_getURIs() {
      let focusedWindow = (document as any).commandDispatcher.focusedWindow // Support frames
      if (focusedWindow === window)
        focusedWindow = window.content

      const selection = focusedWindow.getSelection()

      const uris = [], topUris = []

      let largestSize = 0

      for (let i = 0; i < selection.rangeCount; i++) {
        const treeWalker = focusedWindow.document.createTreeWalker(
          selection.getRangeAt(i).cloneContents(),
          NodeFilter.SHOW_ELEMENT,
          {
            acceptNode: function(node: Attr) {
              return node.localName.toLowerCase() === "a" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
            },
          },
          true
        )

        while (treeWalker.nextNode()) {
          const node = treeWalker.currentNode

          if (!node.href
            || (node.href.indexOf("http") !== 0
              && node.href.indexOf("file") !== 0
              && node.href.indexOf("ftp") !== 0))
          {
            continue
          }

          const uri = node.href
          /*
          uri = gBrowser.mURIFixup.createFixupURI(uri, gBrowser.mURIFixup.FIXUP_FLAGS_MAKE_ALTERNATE_URI)
          if (uri == null)
            continue
          uri = uri.spec
          */
          if (uris.indexOf(uri) === -1)
            uris.push(uri)

          const size = parseInt(focusedWindow.getComputedStyle(node, null).getPropertyValue("font-size"))
          if (size > largestSize) {
            largestSize = size
            topUris.length = 0 // Clear previous uris
          }
          else if (size < largestSize)
            continue

          if (topUris.indexOf(uri) === -1)
            topUris.push(uri)
        }
      }

      return [uris, topUris]
    }

    this.openSelectedLinks_getTextURIs = function openSelectedLinks_getTextURIs() {
      let focusedWindow = (document as any).commandDispatcher.focusedWindow // Support frames
      if (focusedWindow === window)
        focusedWindow = window.content

      const selectedText = focusedWindow.getSelection().toString()
      return tk.detectURIsFromText(selectedText)
    }

    this.openSelectedLinks = function openSelectedLinks(menuItem: any) {
      if (!menuItem.tabkit_selectedLinks)
        return
      const uris = menuItem.tabkit_selectedLinks.filter(function __uriSecurityCheck(uri: mozURI) {
        // URL Loading Security Check
        try {
          const linkSourceURI = _ios.newURI(menuItem.tabkit_linkSource, null, null)
          const linkSourcePrinciple = _sm.getCodebasePrincipal(linkSourceURI)

          _sm.checkLoadURIStrWithPrincipal(linkSourcePrinciple, uri, _sm.STANDARD)
          return true
        }
        catch (ex) {
          return false
        }
      })

      const selected_tab_before_operation = gBrowser.selectedTab

      tk.addingTab({
        parent_tab: selected_tab_before_operation,
        added_tab_type: "related",
      })
      const first_tab = gBrowser.addTab(uris.shift())
      tk.addingTabOver({
        added_tab: first_tab,
        added_tab_type: "related",
        parent_tab: selected_tab_before_operation,
        should_keep_added_tab_position: false,
      })

      uris.forEach(function(uri: mozURI) {
        tk.addingTab({
          parent_tab: selected_tab_before_operation,
          added_tab_type: "related",
        })
        const new_tab = gBrowser.addTab(uri)
        tk.addingTabOver({
          added_tab: new_tab,
          added_tab_type: "related",
          parent_tab: selected_tab_before_operation,
          should_keep_added_tab_position: false,
        })
      })

      if (!gPrefService.getBoolPref("browser.tabs.loadInBackground")) {
        gBrowser.selectedTab = first_tab
      }
    }

    // Open the URL(s) in clipboard & create a group with opened tabs (if > 1)
    this.openClipboardLinks = function openClipboardLinks() {
      let unicodeString = ""

      try {
        const transferable = ((Transferable as any)() as any)
        const clipboard = Components.classes["@mozilla.org/widget/clipboard;1"]
        .createInstance(Components.interfaces.nsIClipboard)

        // Store the transferred data
        const unicodeStringObject = {}
        const unicodeStringLengthObject = {}

        transferable.addDataFlavor("text/unicode")
        clipboard.getData(transferable, clipboard.kGlobalClipboard)
        transferable.getTransferData("text/unicode", unicodeStringObject, unicodeStringLengthObject)

        if (unicodeStringObject) {
          unicodeString = (unicodeStringObject as any).value.QueryInterface(Components.interfaces.nsISupportsString).toString()
        }
      } catch (ex) {
        return
      }

      const uris = tk.detectURIsFromText(unicodeString)
      tk.debug("uris: ")
      tk.debug(uris.toString())

      if (uris.length === 0) {
        return
      }

      const firstTab = gBrowser.addTab(uris.shift())
      let lastTab = firstTab

      uris.forEach(function(uri: mozURI) {
        lastTab = gBrowser.addTab(uri)
      })


      if (!gPrefService.getBoolPref("browser.tabs.loadInBackground")) {
        gBrowser.selectedTab = firstTab
      }
      // Even has one tab, lastTab === firstTab so this method would do nothing
      tk.makeGroupBetweenTwoTabs(firstTab, lastTab)
    }

    // @return [Array]
    this.detectURIsFromText = function detectURIsFromText(textToDetect: string) {
      const uris = [] as string[]
      if (textToDetect === "")
        return uris

      // Using regex from http://www.regexguru.com/2008/11/detecting-urls-in-a-block-of-text/
      // This matches anything starting with www., ftp., http://, https:// or ftp://
      // and containing common URL characters, but the final character is restricted (for
      // example URLs mustn't end in brackets, dots, or commas). It will however correctly
      // recognise urls such as http://en.wikipedia.org/wiki/Rock_(disambiguation) by
      // specifically permitting singly-nested matching brackets.
      const matches = textToDetect.match(/\b(?:(?:https?|ftp):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])/ig)
      if (matches == null) {
        return uris
      }

      for (let i = 0; i < matches.length; i++) {
        const uri = (gBrowser.mURIFixup.createFixupURI(matches[i], gBrowser.mURIFixup.FIXUP_FLAGS_MAKE_ALTERNATE_URI) as mozURI | null)
        if (uri == null)
          continue
        const uri_str = uri.spec
        if (uris.indexOf(uri_str) === -1)
          uris.push(uri_str)
      }

      return uris
    }

    //}##########################
    //{=== Modification for Fx4+
    //|##########################
    this.postInitFx4Modifications = function postInitFx4Modifications() {
      // Not sure if pinned tab works in horizontal mode, but still BAM!
      (function() {
        "use strict"

        if (typeof gBrowser.pinTab !== "function") {
          tk.debug("gBrowser.pinTab doesn't exists, replacing function failed")
          return
        }

        const old_func = gBrowser.pinTab
        // Function signature should be valid for FF 38.x & 45.x
        gBrowser.pinTab = function(_aTab: Tab) {
          "use strict"
          let result

          if (tk.TabBar.Mode.getIsVerticalMode()) {
            alert("Sorry, Tab Kit 2 does not support App Tabs in Vertical mode")
          }
          else {
            result = old_func.apply(this, arguments)
          }

          return result
        }
      })()

      // Issue 22, some weird behavior by the new animation related functions which mess with tabs' maxWidth
      ;(function() {
        "use strict"

        if (typeof gBrowser.tabContainer._lockTabSizing !== "function") {
          tk.debug("gBrowser.tabContainer._lockTabSizing doesn't exists, replacing function failed")
          return
        }

        const old_func = gBrowser.tabContainer._lockTabSizing
        // Function signature should be valid for FF 38.x & 45.x
        gBrowser.tabContainer._lockTabSizing = function(_aTab: Tab) {
          "use strict"

          const result = old_func.apply(this, arguments)
          // Reset max-width
          const numPinned = this.tabbrowser._numPinnedTabs as number
          const tabs = this.tabbrowser.visibleTabs
          for (let i = numPinned; i < tabs.length; i++) {
            const tab = tabs[i]
            // clear the value
            tab.style.setProperty("max-width", "")
          }

          return result
        }
      })()
    }
    this.postInitFx4TabEffects = function postInitFx4TabEffects() {
      // https://developer.mozilla.org/en-US/docs/Web/Events/fullscreen
      window.addEventListener("fullscreen", tk.onFullScreenToggle, false)
    }
    this.postInitListeners.push(this.postInitFx4Modifications)
    this.postInitListeners.push(this.postInitFx4TabEffects)

    // Good for HTML5 full screen video viewing
    this.onFullScreenToggle = function onFullScreenToggle() {
      const tabsToolbar = document.getElementById("TabsToolbar") //FF4+ tabbar

      if (tabsToolbar == null) {
        return
      }

      // This value is the value before switch, tested in FF 31.1.0 & 36.0.1
      let isFullScreenBeforeEvent = window.fullScreen
      if (_prefs.getCharPref("tabbar_fullscreen_value_meaning_in_callback") === "value_after_change") {
        isFullScreenBeforeEvent = !isFullScreenBeforeEvent
      }

      const willBeFullScreen = !isFullScreenBeforeEvent
      const splitter = document.getElementById("tabkit-splitter")
      const appcontent = document.getElementById("appcontent")

      // Type: String
      // Values:
      // - `auto_collapse_with_spitter_visible`
      // - `auto_collapse_with_spitter_hidden`
      // - `do_nothing`
      const full_screen_behaviour_preference_value = _prefs.getCharPref("tabbarFullscreenBehaviour")
      const should_hide_spitter_on_collapse = (full_screen_behaviour_preference_value === "auto_collapse_with_spitter_hidden")

      if (!splitter) {
        //only collapsed splitter in vertical mode
        return
      }
      if (full_screen_behaviour_preference_value === "do_nothing") {
        // Nothing needs to be done
        return
      }

      if (willBeFullScreen) {
        tk.debug("gonna set splitter collapsed")
        splitter.setAttribute("state", "collapsed")
        tabsToolbar.setAttribute("collapsed", "true")

        if (should_hide_spitter_on_collapse) {
          tk.debug("gonna set splitter hidden")
          splitter.setAttribute("hidden", "true")
        }
        // For unknown reason(s) the appcontent is also collapsed with the tab bar
        // So we "fix" it by reverting it
        appcontent.setAttribute("collapsed", "false")
      }
      else {
        tk.debug("gonna set splitter open")
        splitter.setAttribute("state", "open")
        tabsToolbar.removeAttribute("collapsed")

        if (should_hide_spitter_on_collapse) {
          tk.debug("gonna set splitter visible")
          splitter.removeAttribute("hidden")
        }
        // For unknown reason(s) the appcontent is also collapsed with the tab bar
        // So we "fix" it by reverting it
        appcontent.setAttribute("collapsed", "false")
      }
    }

    this.onPrefTabsonTopChanged = function onPrefTabsonTopChanged() {
      if (tk.localPrefService.getBoolPref("firefox.tabsontop.force_disable.enabled") === false) {
        return
      }
      if (gPrefService.getBoolPref("browser.tabs.onTop") === true) {
        gPrefService.setBoolPref("browser.tabs.onTop", false)
      }
    }
    this.initOnPrefTabsonTopChanged = function initOnPrefTabsonTopChanged() {
      tk.addGlobalPrefListener("browser.tabs.onTop", tk.onPrefTabsonTopChanged)

      // Run it once on start
      tk.onPrefTabsonTopChanged()
    }
    this.initListeners.push(this.initOnPrefTabsonTopChanged)


    //}##########################
    //{=== DPI
    //|##########################


    // ### Panorama Related
    this.Panorama = this.Panorama || {}
    this.Panorama.Initializers = this.Panorama.Initializers || {}
    this.Panorama.Initializers.addMethodHookOnPostInit = function addMethodHookOnPostInit() {
      // Disable Panorama, why use Panorama when you have Tabkit?
      // This feature is removed from 45.x
      (function() {
        "use strict"

        if (typeof TabView !== "object" ||
            TabView == null ||
            (typeof TabView.toggle) !== "function") {
          tk.debug("TabView.toggle doesn't exists, replacing function failed")
          return
        }

        const old_func = TabView.toggle
        // Function signature should be valid for FF 38.x & 45.x
        TabView.toggle = function() {
          "use strict"
          let result

          tk.debug(">>> TabView.toggle >>>")
          if (tk.localPrefService.getBoolPref("panorama.enabled") === false) {
            alert("Sorry, but Tabkit 2 does not support Panorama (They use the same API). Why use Panorama when you have Tabkit 2? :)")
          }
          else {
            result = old_func.apply(this, arguments)
          }
          tk.debug("<<< TabView.toggle <<<")

          return result
        }
      })()
    }
    this.postInitListeners.push(this.Panorama.Initializers.addMethodHookOnPostInit)

    //}##########################
    //{### Debug Aids
    //|##########################

    // Allows external access to private members of tabkit to aid debugging
    // this._eval = function _eval(exp) {
    //   return eval(exp)
    // }

    //Cannot find this extension, so no use
    /* this.preInitDebugAids = function preInitDebugAids(event: Event) {
      // quickprompt requires my (currently unreleased) QuickPrompt extension (I use this for debugging)
      if ("quickprompt" in window) {
        window.tkprompt = function tkprompt() {
          quickprompt(tk._eval, "Tab Kit QuickPrompt", help(), "")
        }
        document.getElementById("cmd_quickPrompt").addEventListener("command", function() {
          tkprompt()
        })
      }
    }
    this.preInitListeners.push(this.preInitDebugAids) */


    // region API

    this.api = {
      getParentTab: function(tab: Tab) {
        // Only tab in group has parent
        if (tk.getTabGroupId(tab) == null)  { return null }

        const tabs_in_group = tk.getGroupFromTab(tab)
        // Should not happen just be safe
        if (tabs_in_group == null)  { return null }

        const possible_parent_tab_id = tab.getAttribute("possibleparent")

        return tabs_in_group.find((tab_in_group: Tab) => {
          if (tab_in_group === tab) { return false }

          return tk.getTabId(tab_in_group) === possible_parent_tab_id
        })
      },
      getChildTabs: function(tab: Tab) {
        // Only tab in group has children
        if (tk.getTabGroupId(tab) == null)  { return null }

        const tabs_in_group = tk.getGroupFromTab(tab)
        // Should not happen just be safe
        if (tabs_in_group == null)  { return null }

        const tab_id = tk.getTabId(tab)

        return tabs_in_group.filter((tab_in_group: Tab) => {
          if (tab_in_group === tab) { return false }

          return tab_in_group.getAttribute("possibleparent") === tab_id
        })
      },
      addChildTabs: function(tab: Tab, new_child_tabs: Tab[]) {
        // For now we only allow adding tabs to an already grouped tabs
        const tab_group_id = tk.getTabGroupId(tab)
        if (tab_group_id == null)  { return }

        const tabs_in_group = tk.getGroupFromTab(tab)
        // Should not happen just be safe
        if (tabs_in_group == null)  { return }

        const tab_id = tk.getTabId(tab)

        new_child_tabs.forEach((new_child_tab) => {
          new_child_tab.setAttribute("possibleparent", tab_id)
        })
        // Not calling `updateIndents` for performance
        // Expose it later if necessary
        // tk.updateIndents()
      },
      resetTab: function(tab: Tab) {
        // Only call this before removing a tab AND
        // children tabs have been handled manually (using API methods defined)
        //
        // Calling this should disable our built-in tree processing
        // in event listeners like `sortgroup_onTabRemoved`
        tab.removeAttribute("groupid")
        tab.removeAttribute("tabid")
        tab.removeAttribute("possibleparent")
      },
    }

    // endregion API


    //}##########################
    //|### End of tabkit object
    //|##########################

  }
// `this` in FF 45 is a `Sandbox` not a `ChromeWindow`
// Using reference `window` ensures it is a `ChromeWindow`
// Tested in FF 45.0 & 38.7.0
})(window)



window.addEventListener("DOMContentLoaded", window.tabkit.onDOMContentLoaded, false)
window.addEventListener("load", window.tabkit.onLoad, false)
