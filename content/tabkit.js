/* Tab Kit 2nd Edition(Tab Kit 2 for short) - http://code.google.com/p/tabkit-2nd-edition/
 *
 * Copyright (c) 2007-2010 John Mellor
 * Copyright (c) 2011-2012 Leung Ho Kuen <pikachuexe@gmail.com>
 *
 * This file is part of Tab Kit 2.
 * Tab Kit is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * TabKit 2 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
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

/* Changelog
 * ---------
 * v0.6 (2010-09-26)
 * - Add tab search bar
 * - Re-enable tabs on bottom (as the main bug has been fixed)
 * - Dropped compatibility with Fx3
 * v0.5.12 (2010-07-02)
 * - Use tab instead of modal dialog for First Run Wizard
 * - Fix: don't rely on old extensions manager interface which has been removed from Fx 4
 * v0.5.11 (2010-06-30)
 * - Fix: hovering over multi-row tab bar would cause rows to change height.
 * v0.5.10 (2010-06-29)
 * - Support Firefox 3.6
 * - Fix issue #16: Sidebar border shrinks/expands on mouseover => can't widen the sidebar by dragging
 * - Fix issue #94: Tab drop indicator not showing while setting tab bar position at top edge
 * - Fix Open Selected Links in Fx 3.6
 * - Fix gaps appearing when dragging groups around horizontal tab bar
 * v0.5.8 (2009-08-02)
 * - Fix issue #2: Dropping a tab from a 2 tab group onto itself causes weird behaviour
 * - Fix issue #11: "Use scrollbars instead of arrows on the Bookmarks and All Tabs menus" messes up various menus
 * - Fix issue #8: When grouping disabled tab color still set when use "Open X Links in New Tabs", or "Open All In Tabs" on bookmark folder
 * v0.5.7 (2009-07-06)
 * - Added de (German) locale (by Tom Fichtner)
 * - Fix bug closing the last tab when browser.tabs.closeWindowWithLastTab is false
 * v0.5.6 (2009-05-24)
 * - Updated zh-CN locale (by Renda)
 * - Changed Close Subtree to more versatile Close Children
 * - Tweaked Switch Tabs on Hover: now has delay even if your tabs are vertical
 * - Improved compatibility with Personas by making tabs more opaque (as group colours are important) and making Personas' background repeat vertically (to fill the vertical tab bar)
 * - Fix: Uncollapsing the tab drop indicator sometimes caused the tab bar to scroll
 * - Fix: Multiple tabs (like multiple homepages) open in the same place the equivalent single tab would have opened
 * - Added compatibility with Snap Links Plus (so tabs it opens are grouped)
 * v0.5.5 (2009-04-27)
 * - Fixed typo affecting closing tabs in Firefox 3.5b4
 * v0.5.4 (2009-04-27)
 * - Added activation delay to switch tabs on hover functionality (by fixing typo)
 * v0.5.3 (2009-04-26)
 * - Fixed multi-row tabs on Firefox 3
 * - Made the tab bar remember scroll position if collapsed while vertical
 * v0.5.2 (2009-04-23)
 * - Improved Ubuntu compatibility
 * - Made First Run Wizard fit smaller screens
 * v0.5.1 (2009-04-22)
 * - Fixed a bug that prevented 0.5 from working on most systems
 * v0.5 (2009-04-22)
 * - Made compatible with latest Firefox 3.5 betas; dropped compatibility with Firefox 2
 * - Added First Run Wizard to help users choose between tab tree, multi-row tabs, or just normal tab positioning
 * - Groups no longer expand on single-click - this just confused people. You now have to click the plus button, or double-click them, as before
 * - Option to make bookmarks/history open in new tabs by default (under Advanced)
 * - Option to switch tabs by hovering over them (under Controls)
 * - Turned "Emphasize current tab in black" off by default for aesthetic reasons
 * - Improved Open Selected Text Link url matching (now ignores closing brackets and punctuation)
 * - Added Chinese Traditional (zh-TW) locale, thanks to Hugo Chen (though needs updating slightly)
 * - Added Russian (ru) locale, thanks to Timur Timirkhanov (though needs updating slightly)
 * - Now compatible with extensions like Tab Clicking Options (https://addons.mozilla.org/en-US/firefox/addon/260) that replace double-click functionality
 * - Now detects tabs opened by the Mouseless Browsing extension
 * - Performance: no longer loads main Javascript file in non-browser windows
 * - When switching tabs, will no longer expand collapsed groups
 * - Fix: Ctrl-clicked bookmarks now open in the right place
 * - Fix: Prevent first group randomly collapsing and/or losing indents when restarting
 * - Fix: Using Group Tabs From Here To Current in the middle of a group now always causes inner group to be ejected from outer group
 * - Miscellaneous tweaks and fixes
 * v0.4.3 (2008-08-02)
 * - "Protect Tab" menuitem lets you mark tabs as protected, preventing them from being closed
 * - Options to make the address bar and/or search bar open into new tabs by default (press Alt to open in current tab)
 * - Collapsed groups now show a plus icon, and auto-expand when clicked on. Also, when hovering over them the tooltip shows all tab titles (one per line), instead of just the visible tab
 * - Added Chinese (zh-CN) locale, thanks to Renda
 * v0.4.2 (2008-07-16)
 * - Collapsed vertical tab bar will expand on hover
 * - When grouping tabs by domain, if you navigate to a new url in an ungrouped about:blank tab, that tab will now get grouped by domain
 * - In Firefox 3, Tab Kit now uses the Effective TLD Service when grouping tabs by domain, rather than my approximation
 * - Fix: URLs opened in new tabs using Alt+enter in the address bar are now correctly grouped by domain even if you miss off "http://" etc
 * v0.4.1 (2008-07-09)
 * - Much better theme compatibility
 * - Customisable saturation and lightness ranges for tab group colours
 * - Warns users about incompatibility with Tab Mix Plus
 * - Fix: Infinite loop possible when changing "color tabs not labels" option
 * v0.4 (2008-05-19)
 * - Added Open Selected Links (including text links) feature, see Tab Kit Options under Tabs for details
 * - Collapsed groups now always drag together as a group
 * - Various minor tweaks
 * v0.4pre (2008-05-07):
 * - Made compatible with Firefox 3. There may still be one or two odd behaviours. Note that while Tab Kit is largely unchanged, everything will be much faster due to improvements in Firefox.
 * - Vertical tabs splitter now allows the tabar to be temporarily collapsed by clicking the splitter
 * - Fix: with dark themes, you could sometimes end up with unreadable black text on black tabs
 * v0.3 (2007-11-06):
 * - Automatically picks group colors which are different from those of nearby groups
 * - Option to automatically collapse inactive groups
 * - Reworked tab dragging.
 * - o Shift-drag will drag a whole group together, even across windows
 * - o Ctrl-drag copies dragged tabs, and Ctrl-Shift-drag copies a group (n.b. Cmd instead of Ctrl on Mac)
 * - o Dragged tabs now gain the appropriate tree indentation (instead of resetting it) when in indented tree mode
 * - o There is now an option to make Shift-drag move subtrees instead of groups (when in indented tree mode)
 * - o Fix: Tab drop indicator no longer flashes (and sometimes prevents a drag) in vertical tab bar mode (unless you drag directly over the arrow - this is almost inevitable)
 * - New "Group Tabs From Here To Current" command will group tabs between the selected tab and the right-clicked tab (this replaces the broken and long-winded "Create New Group From Consecutive Tabs")
 * - Added "Close Subtree" command to close a tab and its child tabs
 * - Ctrl-middleclick on a tab group closes it, or alternatively Ctrl-click a tab's close button (n.b. Cmd instead of Ctrl on Mac)
 * - Similarly Ctrl-Shift-middleclick on a tab closes the subtree it is parent of, or alternatively Ctrl-Shift-click the close button
 * - Replaced "Close Other Tabs" with "Close Tabs Before" and "Close Tabs After" (optionally)
 * - Added Options button to Tab Kit tab context submenu for quick access
 * - Fix: Double-clicking tab close buttons (when closing several tabs in a row) now closes the tab instead of collapsing its group
 * - Fix: The splitter now hides if the tab bar is hidden (only one tab)
 * v0.2.1 (2007-08-07):
 * - Close buttons now show on tabs (if enabled) when the tab bar is vertical, and tab text is cropped appropriately.
 * - Vertical or multi-row tab bar will now autoscroll to make sure new (background) tabs are onscreen
 * - Fix: Context menu searches are now correctly grouped
 * - Fix: Tab bar and sidebar positions are now remembered even if they are on the bottom and right respectively
 * v0.2 (2007-08-02):
 * - First public version.
 */

/* Rough Todo List
 * ---------------
 * I keep todo notes in the form TODO=Px where x is a priority betweeen 1 (highest) and 5 (lowest).
 * Though I normally finish all the P1 and most of the P2 ones before making a release.
 * There are more todos in the source itself, search for: TODO=P
 * These todos are now being transitioned to two places, http://tabkit.uservoice.com/ for major enhancements, and
   http://code.google.com/p/tabkit/issues for bug reports, tasks, and small tweaks. Issues marked UVOICE have been
   moved to the former, issues marked GCODE are being moved to the latter. Issues marked ??? are undetermined,
   issues marked TJS will remain in this source code file for now, and issues marked N/A are no longer relevant.

 * TODO=P3: GCODE#1 Upload Tab Kit's Mercurial repository to Google Code
 * TODO=P3: GCODE Move these TODOs to the issue tracker

 * TODO=P2: GCODE#2 Bug: Drag child tab of parent-child group onto bottom half of parent tab (such that it wouldn't move!), and it'll lose its indent and the parent will be degrouped (but not the dragged tab!)
 * TODO=P3: GCODE Strongly discourage using together with Tree Style Tab (don't necessarily auto-disable, but at least show a first-run-tab)
 * TODO=P3: GCODE Recommend using with TabGroups Manager and/or TooManyTabs (until I implement workspaces), and Ctrl-Tab, Session Manager and Tab Clicking Options
 * TODO=P3: GCODE Fx3.5: Occasional bugs with subtree dragging
 * TODO=P4: GCODE Use, and hook, Firefox's new duplicateTab method (esp. reset tabid and remove gid) [partially done in sortgroup_onSSTabRestoring]
 * TODO=P4: GCODE _onDrop's 'document.getBindingParent(aEvent.originalTarget).localName != "tab"' should be 'aEvent.target.localName != "tab"' ?!

 Groups as persistent selections:
 * TODO=P3: UVOICE Make Ctrl+Click tab add any tab to the current group (moving it adjacent to the group if necessary, and creating a new group if the current tab was ungrouped), unless the clicked tab was already in the current group, in which case it is removed from the group (and moved out of the group if not already on the edge).
 * TODO=P3: UVOICE Make Shift+Click tab make a group from all tabs between the current and clicked tab inclusive (if the current tab was already in a group, any group tabs that aren't between the current and clicked tabs will stay in their old group instead of joining the new group). Then allow removing Group Tabs From Here To Current menuitem.
 * TODO=P3: ??? Document both the above in First Run Wizard? Nah, just show shortcuts on menuitems and people will pick them up?

 * TODO=P3: GCODE Refactor context menu. Move Global Actions into Tools, This Tab items into top level context menu, and This Group can stay as the submenu.
 * TODO=P3: GCODE Make context menu New Tab become New Tab Here, replacing that option, except when right-clicking empty parts of tab bar.
 * TODO=P3: GCODE Add Tab Bar Position to Global Actions (now in Tools), and other extremely common options. Also menuitem for Help and/or re-run First Run Wizard.
 * TODO=P3: UVOICE Add Move group to window >> Title 1 / Title 2 / Title 3 / [New Window] to This Group submenu. To workspaces instead?
 * TODO=P4: GCODE Add Close Other Tabs (not in this group) to This Group submenu (how does this interact with Close Left/Right?)

 * TODO=P3: UVOICE Workspaces [[[adding a dropdown button with: Store Away Current Tab/Group <sep> Store Away Current Window <sep> <list of saved tab/groups> (clicking opens then removes entry) <sep> Recently restored entries >> <sep> (gray comment:) Shift+click to delete an entry (without opening it). Auto-suggest title from TLDs, date & tab count. Sort by most recent and/or alphabetic (if alphabetic default put date at beginning of title suggestion)]]].
 * TODO=P3: UVOICE Idle Tabs functionality (possibly as separate extension) - make idle tabs (or startup tabs) be sessionstore stubs that only (re)load once viewed and/or clicked in

 * TODO=P3: GCODE Scroll up/down when tab dragging so can drag to anywhere rather than having to do it in bits
 * TODO=P3: GCODE Fx3+: Improve Fullscreen (F11) animation with vertical tab bar (c.f. bug 423014). Tree Style Tab does this well...
 * TODO=P3: GCODE Expand groups hovered over (for a while) during tab drags, so can drag into them (then make auto-collapse always collapse, even if select ungrouped tab). In the long run, am planning to show collapsed groups as favicon list, which you could drag straight into.
 * TODO=P3: UVOICE Allow dropping onto middle of tabs to make the dropped tab a child of the target tab, like Tree Style Tabs
 * TODO=P3: GCODE Optmisation: Use _tabContainer.getElementsByAttribute in many of the cases where I currently iterate through _tabs
 * TODO=P3: GCODE Shrink First Run Wizard image filesizes (use JPEGs if necessary)
 * TODO=P3: UVOICE Option which will prevent you from opening the same url twice (or tell you that you have this url already opened) [info bar?]
 * TODO=P3: UVOICE Search within all tabs' text c.f. Design Challenge Plans in Evernote
 * TODO=P3: UVOICE Only mark tab as read after ~1s delay, to avoid doing so while flicking through

 * TODO=P3: UVOICE Add Shortcuts dialog or options tab, with a 3/4 column table letting you 1) toggle whether things show in the tab context menu 2) allow setting keyboard shortcuts (with defaults of some kind (perhaps Alt+Shift ones) 3) ideally allow customisation of tab clicking options (assumes that context menu options correspond with possible commands). This could also take over letting people show Close Other Tabs and/or Close Left/Right tabs.

 * TODO=P3: UVOICE Reset background tabs as unread when their title changes (due to a load, or incoming Gmail message)
 * TODO=P3: GCODE Add "Tab Kit Options" button to Firefox Options -> Tabs, like Tab Mix Plus does (less important once Global Actions moved to Tools)
 * TODO=P3: UVOICE Protect (/Pin) Tab could save tabs across sessions, like PermaTabs did
 * TODO=P4: ??? Protect tab could lock navigation (no back/forward and links open in new tabs)

 * TODO=P3: ??? Make grouping bookmark groups optional?

 * TODO=P3: GCODE Colorpickers for unread/current/protected tab highlights, as in PermaTabs. Instead, could just make these prettier...

 * TODO=P3: GCODE Document the fact that Close buttons: 'Show on all tabs' depends on tab clip width

 * TODO=P3: GCODE Add double-click to close tab option (less important now no longer conflicts with Tab Clicking Options)

 * TODO=P3: GCODE Use preventChangeOfAttributes to set vertical tabbar increment (though not pageincrement)
 * TODO=P3: GCODE Fx3+: Update Sorting & Grouping method hooks

 * TODO=P3: GCODE Investigate http://piro.sakura.ne.jp/xul/_treestyletab.html.en
 * TODO=P3: UVOICE Collapse/expand any subtree, not just entire groups?
 * TODO=P3: UVOICE Slick arrows for collapsed/expanded
 * TODO=P3: ~UVOICE count showing # of hidden child tabs
 * TODO=P3: UVOICE better auto-hide tab bar
          o Can you make it so its just like that of the "Tree Style Tab"  where you can pick the exact size-width of the tab-bar by dragging it to the width of your liking, and also when and where you want it to pop out when you hover your mouse over to it 0-100Px from left etc
          o Also instead of moving the whole webpage over to the right to make room for the unhidden tab-bar (when its in vertical mode on the left), can you make it so the tab-bar just overlays on top of the webpage please..Like Tree Style Tab does..
          o And also have the tab-bar already in auto-hide mode every time Firefox starts up and also when the tab-bar first appears when a new tab is opened, have it autohide itself then too.

 * TODO=P3: GCODE Investigate http://paranoid-androids.com/tabgroups/

 * TODO=P3: GCODE Check compatibility with https://addons.mozilla.org/en-US/firefox/addon/3726 (Tab Overflow Scrollbar)

 * TODO=P3: UVOICE Preferences Wizard on first run offering sensible settings for multi-row / tab tree, etc.
 * TODO=P3: GCODE Automatic conflict checkings, e.g.
    * Disable gestures if FireGestures is installed - https://addons.mozilla.org/en-US/firefox/addon/6366
    * Investigate compatibility with Tab Mix Plus (for the minor features like progress bars on tabs & tab clicking options)
    * TreeStyleTab, tabgroups, etc.
    * New Tab Button on Tab Right is apparently incompatible

 * TODO=P3: UVOICE More flexible/intuitive tree drag&drop, letting you arbitrarily assign parents etc, and also make the indents etc more robust

 * TODO=P3: UVOICE Window/workspace merging
 * TODO=P3: GCODE .tabs-bottom color doesn't work in Fx3+ (and was never updated when closing a tab group)
 * TODO=P3: GCODE Fx3+: Bottom row of multirow tabs is 1px too tall
 * TODO=P4: GCODE Fx2: Can't drag scrollbar slider on bookmarks menu without closing menu (works in Fx3+)
 * TODO=P4: GCODE Look into possibility of displaying the sidebar beneath a vertical tab bar, so they share one column

 * TODO=P3: GCODE Implement lite version of LastTab Ctrl-Tab stack switching? Probably not since Ctrl-Tab is supposedly going to be incorporated into Fx3.6
 * TODO=P3: ??? Multi-row on hover (for more than ~1 second)
 * TODO=P3: ??? Multi-row: vertical splitter to adjust [max] no. of rows?

 * TODO=P3: GCODE BabelZilla

 * TODO=P3: UVOICE Fade old tabs with age, like Dao's Aging Tabs (https://addons.mozilla.org/en-US/firefox/addon/3542), or be compatible(!)
 * TODO=P3: GCODE Collapsed group underline is invisible for the active tab when emphasizecurrent is on
 * TODO=P3: GCODE Make All Tabs scroll to current tab (preferably vertically centered)

 * TODO=P3: GCODE Back forward rocker: "Any chance something was left out? I've found a bug, but I don't know if it occurs in Tab Kit or only in the snippet. Activating a rocker gesture while hovering over a link usually does not work. Rather, the left-click takes precedence. From some testing, it appears that the gesture does work when the previous/next page is already in the fastback cache. (Edit: Thus, it seems the problem is that normal left-click still occurs in addition to, and right after, the gesture.) I hope this helps track down the issue. Thanks." http://forums.mozillazine.org/viewtopic.php?p=3746475#p3746475
 * TODO=P3: UVOICE Under "When Closing Tabs", is it possible to add a "Last Selected Tab"?

 * TODO=P3: ~UVOICE Make collapsed groups more obvious, e.g. "(+N)" right-aligned text showing hidden count, heavy border (arguably expanded ones should have a minus too, but need to think about how that ties into the tree)
 * TODO=P4: GCODE Make collapsed group plus symbol work in Mac theme
 * TODO=P4: N/A Should auto-expanded collapsed groups recollapse when you leave (assuming auto-collapse inactive is off)?

 * TODO=P4: GCODE Option to hide All Tabs button

 * TODO=P4: GCODE Groups change colour when dragged (probably only when shift-drag subtrees is enabled)
 * TODO=P4: GCODE Disable Close Tabs Above/Below on first/last tab respectively
 * TODO=P4: GCODE Use existing tab duplication code in Fx3+ rather than reimplementing
 * TODO=P4: UVOICE Fisheye vertical tabs, c.f. https://addons.mozilla.org/en-US/firefox/addon/4845 (horizontal fisheye tabs)
 * TODO=P4: GCODE Fix mouse rocker back/forward on linux (where context menu is onmousedown)
 * TODO=P4: GCODE Make group start/end more obvious, e.g. with /--|---|--\ for colorblind people
 * TODO=P4: GCODE Fx2: Scrollbar on bookmarks menu used to cause artifacts (wheelscroll even worse), check this is fixed
 * TODO=P4: GCODE Check that shift-dragging a group and/or subtree into subtree never causes following tabs to reset indent
 */

(function (window) {
window.tabkit = new function _tabkit() { // Primarily just a 'namespace' to hide our stuff in

//|##########################
//{### Basic Constants
//|##########################

  /// Private globals:
  const tk          = this; // Functions passed as parameters lose their this, as do nested functions, and tabkit is a bit long(!), so store it in 'tk'

  const XUL_NS      = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

  const Cc          = Components.classes;
  const Ci          = Components.interfaces;
  const Cu          = Components.utils;

  const PREF_BRANCH = "extensions.tabkit.";


  const TAB_MIN_WIDTH = 50;


  const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
  const { Promise } = Cu.import("resource://gre/modules/Promise.jsm", {});
  // FF 45.x only
  try {
    const { TabStateFlusher } = Cu.import("resource:///modules/sessionstore/TabStateFlusher.jsm", {});
  }
  catch (e) {
    // Do nothing
  }


//}##########################
//{### Services
//|##########################

  // Make sure we can use gPrefService from now on (even if this isn't a browser window!)
  if (typeof gPrefService == "undefined" || !gPrefService)
    var gPrefService = Cc["@mozilla.org/preferences-service;1"].
             getService(Ci.nsIPrefBranch);

  /// Private globals:
  var _console = Cc["@mozilla.org/consoleservice;1"]
        .getService(Ci.nsIConsoleService);

  var _ds = Cc["@mozilla.org/file/directory_service;1"]
        .getService(Ci.nsIProperties);

  var _em = null;
  if ("@mozilla.org/extensions/manager;1" in Cc)
    _em = Cc["@mozilla.org/extensions/manager;1"]
        .getService(Ci.nsIExtensionManager);

  var _ios = Cc["@mozilla.org/network/io-service;1"]
        .getService(Ci.nsIIOService);

  var _os = Cc["@mozilla.org/observer-service;1"]
        .getService(Ci.nsIObserverService);

  var _prefs = Cc["@mozilla.org/preferences-service;1"]
         .getService(Ci.nsIPrefService)
         .getBranch(PREF_BRANCH);

  this.localPrefService = _prefs;

  var _ps = Cc["@mozilla.org/embedcomp/prompt-service;1"]
        .getService(Ci.nsIPromptService);

  var _sm = Cc["@mozilla.org/scriptsecuritymanager;1"]
        .getService(Ci.nsIScriptSecurityManager);

  var _ss = null;
  if ("@mozilla.org/browser/sessionstore;1" in Cc)
    _ss = Cc["@mozilla.org/browser/sessionstore;1"]
        .getService(Ci.nsISessionStore);
  else
    var _winvars = {}; // For tk.get/setWindowValue // TODO=P1: Remove if redundant

  var _sound = Cc["@mozilla.org/sound;1"]
         .getService(Ci.nsISound);

  var _wm = Cc["@mozilla.org/appshell/window-mediator;1"]
        .getService(Ci.nsIWindowMediator);

//}##########################
//{### Utility Functions
//|##########################

  // The property "hidden" of a tab is read-only, therefore assigning to this property does not work. See Firefox's source code, browser/base/content/tabbrowser.xml
  this.tabSetHidden = function tabSetHidden(tab, hidden) {
    if (hidden)
      gBrowser.hideTab(tab);
    else
      gBrowser.showTab(tab);
  };

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
        var message = 'TK Error: "' + error + '"\nat:\u00A0' + stack.replace("\n@:0", "").replace(/\n/g, "\n    "); // \u00A0 is a non-breaking space
        var sourceName   = (haveException && "fileName"  in actualException && actualException.fileName)   ? actualException.fileName  : Components.stack.caller.filename;
        var sourceLine   = (haveException && "sourceLine"   in actualException && actualException.sourceLine)   ? actualException.sourceLine   : Components.stack.caller.sourceLine; // Unfortunately this is probably null
        var lineNumber   = (haveException && "lineNumber"   in actualException && actualException.lineNumber)   ? actualException.lineNumber   : Components.stack.caller.lineNumber; // error.lineNumber isn't always accurate, unfortunately - sometimes might be better to just ignore it
        var columnNumber = (haveException && "columnNumber" in actualException && actualException.columnNumber) ? actualException.columnNumber : 0;
        var flags = haveException ? scriptError.errorFlag : scriptError.warningFlag;
        var category = "JavaScript error"; // TODO-P6: TJS Check this
        scriptError.init(message, sourceName, sourceLine, lineNumber, columnNumber, flags, category);
        tk.logs.dump.push(scriptError);
        _console.logMessage(scriptError);
      }
      else {
        tk.logs.dump.push(String(error) + "\n" + tk.quickStack());
      }
    }
    catch (ex) {
    }
  };

  // For logging information (no line numbers, call stack, etc.)
  this.log = function log(message) {
    try {
      tk.logs.log.push(message);
      if (_prefs.getBoolPref("debug")) {
        var msg = "TK: " + message;
        _console.logStringMessage(msg);
      }
    }
    catch (ex) {
    }
  };

  // For minor/normal information that could still be interesting
  this.debug = function debug(message) {
    try {
      tk.logs.debug.push(message);
      if (_prefs.getBoolPref("debug") && _prefs.getBoolPref("debugMinorToo")) {
        var msg = "TK Debug: " + message;
        _console.logStringMessage(msg);
      }
    }
    catch (ex) {
    }
  };

  /* USAGE:
   *   tk.assert('true != false', function(e) eval(e), "True should not equal false");
   */
  this.assert = function assert(condition, localEval, message) {
    if (!_prefs.getBoolPref("debug") || localEval(condition))
      return;

    var title = "Assert Failed: '" + condition + "' in " + Components.stack.caller.name + "(";
    // Append arguments to title
    if (arguments.callee.caller.arguments.length > 0)
      title += uneval(arguments.callee.caller.arguments[0]);
    for (var i = 1; i < arguments.callee.caller.arguments.length; i++)
      title += ", " + uneval(arguments.callee.caller.arguments[i]);
    title += ")";

    var msg = (message ? message + "\n\n" : "") + "Stacktrace:\n" + tk.quickStack();

    tk.dump(title + "\n\n" + msg);

    // quickprompt requires my (currently unreleased) QuickPrompt extension
    if ("quickprompt" in window)
      quickprompt(localEval, title, msg, "help()");
  };


  this.startsWith = function startsWith(str, start) {
    return str.indexOf(start) == 0;
  };

  this.endsWith = function endsWith(str, end) {
    var startPos = str.length - end.length;
    if (startPos < 0)
      return false;
    return str.lastIndexOf(end, startPos) == startPos;
  };


  this.rawMD5 = function rawMD5(str) {
    var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].
            createInstance(Ci.nsIScriptableUnicodeConverter);
    converter.charset = "UTF-8";
    // result is an out parameter, result.value will contain the array length
    var result = {};
    // data is an array of bytes
    var data = converter.convertToByteArray(str, result);
    var ch = Cc["@mozilla.org/security/hash;1"].
         createInstance(Ci.nsICryptoHash);
    ch.init(ch.MD5);
    ch.update(data, data.length);
    return ch.finish(false);
  };

  // Returns a random integer between min and max
  // Using Math.round() will give you a non-uniform distribution!
  // Thanks to http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Math:random
  this.randInt = function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  this.getWindowValue = function getWindowValue(aKey) {
    if (_ss)
      return _ss.getWindowValue(window, aKey);
    else
      return (aKey in _winvars ? _winvars[aKey] : "");
  };

  this.setWindowValue = function setWindowValue(aKey, aStringValue) {
    if (_ss)
      _ss.setWindowValue(window, aKey, aStringValue);
    else
      _winvars[aKey] = aStringValue;
  };

  this.deleteWindowValue = function removeWindowValue(aKey) {
    if (_ss)
      _ss.deleteWindowValue(window, aKey);
    else
      delete _winvars[aKey];
  };




  this.addDelayedEventListener = function addDelayedEventListener(target, eventType, listener) {
    if (typeof listener == "object") {
      target.addEventListener(eventType, function __delayedEventListener(event) {
        window.setTimeout(function(listener) { listener.handleEvent(event); }, 0, listener);
      }, false);
    }
    else {
      target.addEventListener(eventType, function __delayedEventListener(event) {
        window.setTimeout(function(listener) { listener(event); }, 0, listener);
      }, false);
    }
  };


  // TODO=P4: GCODE scrollOneExtra should also apply with a single-row horizontal tab bar
  // TODO=P3: GCODE Could always keep selected tab in centre of tabbar instead (whether horizontal or vertical?)
  this.scrollToElement = function scrollToElement(overflowPane, targetItem) { // TODO-P6: TJS cleanup code? [based on toomanytabs]
    var scrollbar = overflowPane.mVerticalScrollbar;
    if (!scrollbar) {
      /*
      // Alternative way to scroll things (can only scroll within an <xul:scrollbox> though)
      if (overflowPane.localName != "scrollbox")
        overflowPane = overflowPane.parentNode;
      if (overflowPane.localName == "scrollbox") {
        var nsIScrollBoxObject = overflowPane.boxObject.QueryInterface(Ci.nsIScrollBoxObject);
        nsIScrollBoxObject.ensureElementIsVisible(element);
      }
      //TODO: Make sure overflowPane is never scrolled halfway across elements at both the top and bottom
      //TODO: _prefs.getBoolPref("scrollOneExtra")
      */
      return;
    }

    var container = targetItem.parentNode;

    // Sometimes it is null, Don't know what happen
    // Just ignore it at he moment
    if (container == null) return;

    var firstChild = container.firstChild;
    // tk.log("scrollToElement "+firstChild.nodeName);
    while (firstChild.hidden) // visibility of a tab
      firstChild = firstChild.nextSibling;
    var lastChild = container.lastChild;
    while (lastChild.hidden) // visibility of a tab
      lastChild = lastChild.previousSibling;

    var curpos = parseInt(scrollbar.getAttribute("curpos"));
    if (isNaN(curpos)) {
      tk.debug("curpos was NaN");
      curpos = 0;
    }
    var firstY = firstChild.boxObject.y;
    var targetY = targetItem.boxObject.y;
    var lastY = lastChild.boxObject.y;
    var height = targetItem.boxObject.height;
    var relativeY = targetY - firstY;
    var paneHeight = overflowPane.boxObject.height;


    // Make sure overflowPane is never scrolled halfway across elements at both the top and bottom
    if ((lastY - firstY) % height == 0 && curpos % height != 0 && (curpos + paneHeight + firstY - lastY) % height != 0) {
      curpos = height * Math.round(curpos / height);
    }

    var minpos = relativeY;
    if (_prefs.getBoolPref("scrollOneExtra") && minpos > 0 && lastY - firstY > height) {
      minpos -= height;
    }
    if (minpos < curpos) {
      curpos = minpos; // Set it to minpos
    }
    else {
      var maxpos = relativeY + height - paneHeight;
      // tk.debug("relativeY = "+relativeY);
      // tk.debug("height = "+height);
      // tk.debug("paneHeight = "+paneHeight);
      // tk.debug("maxpos = "+maxpos);
      // tk.debug("curpos = "+curpos);
      if (_prefs.getBoolPref("scrollOneExtra") && targetY < lastY && lastY - firstY > height) {
        maxpos += height;
      }
      if (maxpos > curpos) {
        curpos = maxpos; // Set it to maxpos
      }
    }
    scrollbar.setAttribute("curpos", curpos);
  };


  this.moveBefore = function moveBefore(tabToMove, target) {
    try {
      var newIndex = target._tPos;
      if (newIndex > tabToMove._tPos)
        newIndex--;
      if (newIndex != tabToMove._tPos)
        gBrowser.moveTabTo(tabToMove, newIndex);
    }
    catch (ex) {
      tk.dump(ex);
    }
  };

  this.moveAfter = function moveAfter(tabToMove, target) {
    try {
      var newIndex = target._tPos + 1;
      if (newIndex > tabToMove._tPos)
        newIndex--;
      if (newIndex != tabToMove._tPos)
        gBrowser.moveTabTo(tabToMove, newIndex);
    }
    catch (ex) {
      tk.dump(ex);
    }
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

  this.beep = function beep() {
    _sound.beep();
  };

  this.getTabId = function (tab) {
    if (!tab.hasAttribute('tabid')) {
      tk.generateNewTabId(tab);
    }

    return tab.getAttribute('tabid');
  };

  this.generateNewTabId = function (tab) {
    var new_id = tk.generateId();
    tab.setAttribute("tabid", new_id);

    return new_id;
  };

  this.getTabGroupId = function (tab) {
    if (!tab.hasAttribute("groupid")) {
      return null;
    }

    return tab.getAttribute("groupid");
  };

  this.TabBar = this.TabBar || {};
  this.TabBar.Mode = this.TabBar.Mode || {};
  // @return [Boolean] if vertical mode, true
  this.TabBar.Mode.getIsVerticalMode = function getIsVerticalMode () {
    return gBrowser.hasAttribute("vertitabbar");
  };


  this.DomUtility = this.DomUtility || {};
  this.DomUtility.insertBefore = function insertBefore(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
  };
  this.DomUtility.insertAfter = function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };

  this.VerticalTabBarScrollbar = this.VerticalTabBarScrollbar || {};
  this.VerticalTabBarScrollbar.getElement = function () {
    if (!tk.TabBar.Mode.getIsVerticalMode()) {
      return null;
    }

    var innerBox = document.getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox");

    return innerBox.mVerticalScrollbar;
  };

//}##########################
//{### Initialisation
//|##########################

  // USAGE: this.*InitListeners.push(this.*Init*);

  /// Globals:
  this.preInitListeners = [
  ];

  this.initListeners = [
  ];

  this.postInitListeners = [
  ];

  /// Private Globals:

  /// Methods:
  this.tryListener = function tryListener(type, listener, event) {
    try {
      listener(event);
    }
    catch (ex) {
      var listenerString = "name" in listener ? listener.name : listener.toSource().substring(0, 78);
      tk.dump(type + " listener '" + listenerString + "' failed with exception:\n" + ex, ex);
    }
  };

  /// Event Listeners:
  // This gets called for new browser windows, once the DOM tree is loaded
  this.onDOMContentLoaded = function onDOMContentLoaded(event) {
    if (event.originalTarget != document)
      return; // Sometimes in Fx3+ there's a random HTMLDocument that fires a DOMContentLoaded before the main window does

    window.removeEventListener("DOMContentLoaded", tk.onDOMContentLoaded, false);

    // Find what version of Firefox we're using TODO=P4: TJS+GCODE Do this in a less hacky way. Or better still, just drop support for Fx2

    // Check compatibility with existing addons (only in Fx3+, as extensions.enabledItems doesn't exist before that, and not in Fx4+ since _em is unavailable)
    if (_prefs.getBoolPref("checkCompatibility")
      && _em != null
      && gPrefService.getPrefType("extensions.enabledItems") == gPrefService.PREF_STRING)
    {
      // TODO=P3: GCODE Only check compatibility on first loaded window; future windows should follow what the first window did
      var incompatible = [
        { id: "{dc572301-7619-498c-a57d-39143191b318}", name: "Tab Mix Plus" }
        // TODO: TJS Before adding more extensions here, change the neverCheckCompatibility pref so it's per extension instead of being global
      ];
      var enabledAddons = gPrefService.getCharPref("extensions.enabledItems");
      var needsRestart = false;
      for each (var addon in incompatible) {
        if (enabledAddons.indexOf(addon.id) != -1) {
          // Focus the window before prompting.
          // This will raise any minimized window, which will
          // make it obvious which window the prompt is for and will
          // solve the problem of windows "obscuring" the prompt.
          // See bug #350299 for more details
          window.focus();
          var check = { value: false };
          var strings = document.getElementById("bundle_tabkit");
          var flags = _ps.BUTTON_POS_0 * _ps.BUTTON_TITLE_IS_STRING
                + _ps.BUTTON_POS_1 * _ps.BUTTON_TITLE_IS_STRING
                + _ps.BUTTON_POS_2 * _ps.BUTTON_TITLE_IS_STRING;
          var button = _ps.confirmEx(
            window, //aParent
            strings.getString("tab_kit"), //aDialogTitle
            strings.getFormattedString("incompatible_warning", [ addon.name ]), //aText
            flags, // aButtonFlags
            strings.getFormattedString("incompatible_disable", [ addon.name ]), //aButton0Title
            strings.getString("incompatible_ignore"), //aButton1Title // This has to be button 1 due to Bug 345067 - Issues with prompt service's confirmEx - confirmEx always returns 1 when user closes dialog window using the X button in titlebar
            strings.getFormattedString("incompatible_disable", [ strings.getString("tab_kit") ]), //aButton2Title
            strings.getString("incompatible_dont_ask_again"), //aCheckMsg
            check //aCheckState
          );
          if (button == 0) { // Disable addon
            _em.disableItem(addon.id);
            needsRestart = true;
          }
          else if (button == 2) { // Disable Tab Kit
            _em.disableItem("tabkit@jomel.me.uk");
            window.removeEventListener("load", tk.onLoad, false);
            return; // Cancel load
          }
          else { // Ignore
            if (check.value)
              _prefs.setBoolPref("checkCompatibility", false);
          }
        }
      }

      if (needsRestart) {
        // TODO=P3: GCODE Try to disable incompatible extensions by disabling onLoad methods etc to avoid restarting / allow selective disabling
        window.focus();
        var strings = document.getElementById("bundle_tabkit"); // This line is technically redundant, but it's clearer like this
        var flags = _ps.BUTTON_POS_0 * _ps.BUTTON_TITLE_IS_STRING
              + _ps.BUTTON_POS_1 * _ps.BUTTON_TITLE_IS_STRING;
        var button = _ps.confirmEx(
          window,
          strings.getString("tab_kit"),
          strings.getString("incompatible_restart"),
          flags,
          strings.getString("incompatible_restart_now"),
          strings.getString("incompatible_restart_later"),
          "",  // No third button
          null, // No checkbox
          {value: false} // No checkbox
        );

        if (button == 0) {
          // Notify all windows that an application quit has been requested.
          var cancelQuit = Cc["@mozilla.org/supports-PRBool;1"]
                   .createInstance(Components.interfaces.nsISupportsPRBool);
          _os.notifyObservers(cancelQuit, "quit-application-requested", "restart");

          if (!cancelQuit.data) { // Quit unless we were told not to
            Cc["@mozilla.org/toolkit/app-startup;1"].getService(Ci.nsIAppStartup)
            .quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit);
          }
        }

        window.removeEventListener("load", tk.onLoad, false);
        return; // Cancel load if we haven't restarted
      }
    }

    // Run First Run Wizard if appropriate
    if (!_prefs.getBoolPref("firstRunWizardDone")) {
      window.setTimeout(function __startfirstRunWizard() {
        gBrowser.selectedTab = gBrowser.addTab("chrome://tabkit/content/firstRunWizard.xul");
      }, 1500);
    }

    // Run module early initialisation code (before any init* listeners, and before most extensions):
    for each (var listener in tk.preInitListeners) {
      tk.tryListener("DOMContentLoaded", listener, event);
    }
  };

  // This gets called for new browser windows, once they've completely finished loading
  this.onLoad = function onLoad(event) {
    if (event.originalTarget != document)
      return;

    window.removeEventListener("load", tk.onLoad, false);

    // Run module specific initialisation code, such as registering event listeners:
    for each (var listener in tk.initListeners) {
      tk.tryListener("load", listener, event);
    }

    window.setTimeout(function __runPostInitListeners() {
      // Run module specific late initialisation code (after all init* listeners, and after most extensions):
      for each (var listener in tk.postInitListeners) {
        listener(event);
      }
    }, 0);
  };


//}##########################
//{### CSS
//|##########################

  this.UAStyleSheets = [ "chrome://tabkit/content/ua.css" ];

  this.preInitUAStyleSheets = function preInitUAStyleSheets(event) {
    // [Fx3only] it seems
    var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
    var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
    for each (var s in tk.UAStyleSheets) {
      var uri = ios.newURI(s, null, null);
      if (!sss.sheetRegistered(uri, sss.AGENT_SHEET))
        sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    }
  };
  this.preInitListeners.push(this.preInitUAStyleSheets);

  // Return (or delete) a style rule object by selector
  // Based on http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript
  this.getCSSRule = function getCSSRule(ruleName, deleteIt) {
    ruleName = ruleName.toLowerCase();
    for (var i = 0; i < document.styleSheets.length; i++) {
      var styleSheet = document.styleSheets[i];
      for (var j = 0; j < styleSheet.cssRules.length; j++) {
        var cssRule = styleSheet.cssRules[j];
        if ("selectorText" in cssRule && cssRule.selectorText && cssRule.selectorText.toLowerCase() == ruleName) {
          if (deleteIt) {
            styleSheet.deleteRule(j);
            return true;
          }

          return cssRule;
        }
      }
    }
    return false;
  };

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
  var _tabContainer;
  //var _tabstrip;
  var _tabInnerBox;
  var _tabs;
  var _tabBar;

  /// Initialisation:
  this.preInitShortcuts = function preInitShortcuts(event) {
    //tk.assert('window.location == "chrome://browser/content/browser.xul"', function(e) eval(e), "preInitShortcuts should only be run in browser windows, as tabkit.js is only loaded into browser.xul");
    if(window.location != "chrome://browser/content/browser.xul")
      tk.dump("preInitShortcuts should only be run in browser windows, as tabkit.js is only loaded into browser.xul");

    // `getBrowser` is a deprecated which just return `gBrowser`
    // No need to call it
    //tk.assert('gBrowser', function(e) eval(e), "gBrowser must not be null after preInitShortcuts!");
    if(!gBrowser)
      tk.dump("gBrowser must not be null after preInitShortcuts!");

    _tabContainer = gBrowser.tabContainer;
    //_tabstrip = _tabContainer.mTabstrip;
    _tabInnerBox = document.getAnonymousElementByAttribute(_tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox");
    _tabs = gBrowser.tabs;
    _tabBar = document.getElementById("TabsToolbar");
  };
  this.preInitListeners.push(this.preInitShortcuts);

//}##########################
//{### Prefs Observers
//|##########################

  /// Private globals:
  var _globalPrefObservers = {};

  var _localPrefListeners = {};

  /// Initialisation:
  this.preInitPrefsObservers = function preInitPrefsObservers(event) {
    // Make sure we can use addObserver on this
    gPrefService.QueryInterface(Ci.nsIPrefBranch);

    // Do this in preInit just in case something expects their init prefListener to work 'instantly'
    tk.addGlobalPrefListener(PREF_BRANCH, tk.localPrefsListener);
  };
  this.preInitListeners.push(this.preInitPrefsObservers);

  /// Pref Listeners:
  // This listener checks all changes to the extension's pref branch, and delegates them to their registered listeners
  // Presumeably more efficient than simply adding a global observer for each one...
  this.localPrefsListener = function localPrefsListener(changedPref) {
    changedPref = changedPref.substring(PREF_BRANCH.length); // Remove prefix for these local prefs
    for (var prefName in _localPrefListeners) {
      if (changedPref.substring(0, prefName.length) == prefName) {
        for each (var listener in _localPrefListeners[prefName]) {
          listener(changedPref);
        }
      }
    }
  };

  /// Methods:
  this.addGlobalPrefListener = function addGlobalPrefListener(prefString, prefListener) {
    if (!_globalPrefObservers[prefString]) {
      _globalPrefObservers[prefString] = {
        listeners: [],

        observe: function(aSubject, aTopic, aData) {
          if (aTopic != "nsPref:changed") return;
          // aSubject is the nsIPrefBranch we're observing (after appropriate QI)
          // aData is the name of the pref that's been changed (relative to aSubject)
          for each (var listener in this.listeners) {
            listener(aData);
          }
        }
      };

      gPrefService.addObserver(prefString, _globalPrefObservers[prefString], false);
      window.addEventListener("unload", function() { gPrefService.removeObserver(prefString, _globalPrefObservers[prefString]); }, false);
    }

    _globalPrefObservers[prefString].listeners.push(prefListener);
  };

  this.addPrefListener = function addPrefListener(prefName, listener) {
    if (!_localPrefListeners[prefName]) {
      _localPrefListeners[prefName] = [];
    }
    _localPrefListeners[prefName].push(listener);
  };

// ##########################
// ### Tab Kit Data I/O
// ##########################

  const TK_DATA_KEY = "tabkit_data";

  this.TKData = {};

  // Read data from an object
  this.TKData.getDataWithKey = function(obj, key) {
    if (obj === null || typeof obj === "undefined") {
      tk.dump("obj is blank");
      return {status: "failed", data: undefined};
    }
    if (typeof key !== "string") {
      tk.dump("key is NOT a string");
      return {status: "failed", data: undefined};
    }

    if (!(TK_DATA_KEY in obj)) {
    return {status: "success", data: undefined};
    }

    let tk_data = obj[TK_DATA_KEY];
    if (typeof tk_data !== "object") {
      tk.dump("obj." + TK_DATA_KEY + " is NOT an object");
      // No cleaning operation here, since this method is for reading only

      return {status: "failed", data: undefined};
    }

    if (!(key in tk_data)) {
      return {status: "success", data: undefined};
    }

    // This can still be `null` or `undefined`
    return {status: "success", data: tk_data[key]};
  };

  // Write data to an object
  this.TKData.setDataWithKey = function(obj, key, data) {
    if (obj === null || typeof obj === "undefined") {
      tk.dump("obj is blank");
      return {status: "failed"};
    }
    if (typeof key !== "string") {
      tk.dump("key is NOT a string");
      return {status: "failed"};
    }
    // We don't check data
    // Since we could intentionally set the data to `null` or even `undefined`

    // It's normal that there is no property in the object yet
    if (!(TK_DATA_KEY in obj)) {
      obj[TK_DATA_KEY] = {};
    }

    let tk_data = obj[TK_DATA_KEY];
    if (typeof tk_data !== "object") {
      tk.dump("obj." + TK_DATA_KEY + " is NOT an object");
      tk.debug("Resetting obj." + TK_DATA_KEY + " to an object");
      obj[TK_DATA_KEY] = {};

      return {status: "failed"};
    }

    tk_data[key] = data;

    // This can still be `null` or `undefined`
    return {status: "success"};
  };

  // Delete data to an object
  this.TKData.removeDataWithKey = function(obj, key) {
    if (obj === null || typeof obj === "undefined") {
      tk.dump("obj is blank");
      return {status: "failed", data: undefined};
    }
    if (typeof key !== "string") {
      tk.dump("key is NOT a string");
      return {status: "failed", data: undefined};
    }
    // We don't check data
    // Since we could intentionally set the data to `null` or even `undefined`

    // It's normal that there is no property in the object yet
    if (!(TK_DATA_KEY in obj)) {
      return {status: "success", data: undefined};
    }

    let tk_data = obj[TK_DATA_KEY];
    if (typeof tk_data !== "object") {
      tk.dump("obj." + TK_DATA_KEY + " is NOT an object");
      tk.debug("Resetting obj." + TK_DATA_KEY + " to an object");
      obj[TK_DATA_KEY] = {};

      return {status: "failed", data: undefined};
    }

    // This can still be `null` or `undefined`
    return {
      status: "success",
      data: tk_data[key]
    };
  };

//}##########################
//{### Pref-attribute Mapping
//|##########################

  this.mapPrefToAttribute = function mapPrefToAttribute(prefName, test, node, attributeName) {
    var listener = function() {
      var value = test(prefName);
      if (value !== undefined) {
        node.setAttribute(attributeName, value);
      }
      else {
        node.removeAttribute(attributeName);
      }
    };

    tk.addPrefListener(prefName, listener);

    // Call it once on start
    listener();
  };

  this.mapBoolPrefToAttribute = function mapBoolPrefToAttribute(prefName, node, attributeName) {
    tk.mapPrefToAttribute(prefName, function() { return _prefs.getBoolPref(prefName) ? "true" : undefined; }, node, attributeName);
  };

//}##########################
//{### Method Hooks
//|##########################

  // USAGE: this.*MethodHooks.push([<original method>, <where to backup>, <search>, <replacement>]);
  // e.g. this.lateMethodHooks.push(['gBrowser.addTab', 'gBrowser._doAddTab', 't._tPos = position;', 't._tPos = position; alert("hi!");']);
  // Warning: if you make a backup of the original method and wish to call it, you must save it onto the same object as the original!
  // Warning: if you replace methods that deal with private variables they won't be able to access them anymore!

  /// Global
  this.earlyMethodHooks = [];
  this.lateMethodHooks = [];

  /// Initialisation:
  this.preInitMethodHooks = function preInitMethodHooks(event) {
    for each (var hook in tk.earlyMethodHooks)
      tk.addMethodHook(hook);
  };
  this.preInitListeners.push(this.preInitMethodHooks);

  this.postInitMethodHooks = function postInitMethodHooks(event) {
    for each (var hook in tk.lateMethodHooks)
      tk.addMethodHook(hook);
  };
  this.postInitListeners.push(this.postInitMethodHooks);

  /// Methods:
  /* parameter: length 3 array
  hook[0] : full path for the method
  hook[1] : old code
  hook[2] : new code, use $& for writing old code(instead of copying)
  hook[3] : as hook[1]
  hook[4] : as hook[2]
  so on...*/
  this.addMethodHook = function addMethodHook(hook) {
    try {
      if (hook.length % 2 != 1)
        tk.dump("Who use addMethodHook without reading the description!\n"+hook[0]+"\n"+hook[1]+"\n"+hook[2]+"\n", null);

      // var namespaces = hook[0].split(".");

      // try {
        // try to get the target function without eval
        // var object = window;
        // while (namespaces.length > 1) {
          // object = object[namespaces.shift()];
        // }
      // }
      // catch (e) {
        // throw TypeError(hook[0] + " is not a function");
      // }
      // Make backup, if requested
      // if (hook[1])
        // window[hook[1]] + "=" + hook[0]);

      // try to get the code string, but it might not exist
      try {
        var code = eval(hook[0] + ".toString()");
      } catch (ex) {
        tk.debug("Method target: \"" + hook[0] + "\" does not exist.", ex);
        return;
      }

      // var method = namespaces.pop();
      // var code = object[method].toString();

      for (var i = 1; i < hook.length; ) {
        var newCode = code.replace(hook[i++], hook[i++]);
        if (newCode == code) {
          tk.log("Method hook of \"" + hook[0] + "\" had no effect, when replacing:\n" + uneval(hook[i-2]) + "\nwith:\n" + uneval(hook[i-1]));
        }
        else {
          code = newCode;
        }
      }

      eval(hook[0]+"="+code);
      // object[method] = new function(code);
    }
    catch (ex) {
      tk.dump("Method hook of \"" + hook[0] + "\" failed with exception:\n" + ex + "\nCode: "+(code && code.substring(0,150)), ex);
    }
  };

//}##########################
//{>>> Sorting & Grouping
//|##########################

  // TODO=P3: UVOICE Allow viewing tabs in sorted order without reordering them OR undoing sorts
  // TODO=P4: GCODE Check outoforder is set as appropriate (tabs that have been moved or added contrary to the prevailing sort and should be ignored when placing new tabs by sort order)
  // TODO=P5: ??? Back to the tab the current tab is opened from, by the "Back" button; Forward to tabs opened from the current tab, by the "Forward" button

  /// Enums:
  this.Sorts = {
    creation:   "tabid",      // == Firefox: new tabs to far right
    lastLoaded: "lastLoadedKey",
    lastViewed: "lastViewedKey",  // == Visual Studio: last used tabs to far left (except they go to the right for consistency :/)
    origin:  "possibleparent", // == Tabs Open Relative [n.b. possibleparent is _not_ a key, it is special cased]
    title:    "label",
    uri:    "uriKey"
  };

  this.Groupings = {
    none:    "",
    opener:  "openerGroup", // Can be internally sorted by origin
    domain:  "uriGroup"   // Can be internally sorted by uri
  };

  this.RelativePositions = {
    left:        1,
    right:        2,
    rightOfRecent:    3,    // Right of consecutive tabs sharing a possibleparent marked recent; all recent tabs are reset on TabSelect
    rightOfConsecutive: 4    // Right of consecutive tabs sharing a possibleparent
  };

  // Sort keys in here will have larger items sorted to the top/left of the tabbar
  this.ReverseSorts = {};
  //this.ReverseSorts["lastLoaded"] = true; // TODO=P5: GCODE pref
  //this.ReverseSorts["lastViewed"] = true; // TODO=P5: GCODE pref

  // Sort keys listed here should be converted to numbers before comparison
  this.NumericSorts = {};
  this.NumericSorts["lastLoaded"] = true;
  this.NumericSorts["lastViewed"] = true;

  //~ // Sort keys listed here are dates, so groups should probably be positioned by most recent instead of median
  //~ this.DateSorts = {};
  //~ this.DateSorts["creation"] = true;
  //~ this.DateSorts["lastLoaded"] = true;
  //~ this.DateSorts["lastViewed"] = true;

  /// Globals:
  this.__defineGetter__("activeSort", function __get_activeSort() {
    var sortName = _prefs.getCharPref("lastActiveSort");

    if (!sortName in tk.Sorts) {
      sortName = "creation";
    }

    return sortName;
  });
  this.__defineSetter__("activeSort", function __set_activeSort(sortName) {
    if (sortName in tk.Sorts) {
      _prefs.setCharPref("lastActiveSort", sortName);
    }
    else {
      tk.dump("activeSort - invalid sort name: " + sortName);
    }
    return sortName;
  });

  this.__defineGetter__("activeGrouping", function __get_activeGrouping() {
    var groupingName = _prefs.getCharPref("lastActiveGrouping");

    if (!groupingName in tk.Groupings) {
      groupingName = "none";
    }

    return groupingName;
  });
  this.__defineSetter__("activeGrouping", function __set_activeGrouping(groupingName) {
    if (groupingName in tk.Groupings) {
      _prefs.setCharPref("lastActiveGrouping", groupingName);
    }
    else {
      tk.dump("activeGrouping - invalid grouping name: " + groupingName);
    }
    return groupingName;
  });

  this.__defineGetter__("openRelativePosition", function __get_openRelativePosition() {
    var positionName = _prefs.getCharPref("openRelativePosition");
      if (!positionName in tk.RelativePositions)
        positionName = "rightOfRecent";
    return positionName;
  });
  this.__defineSetter__("openRelativePosition", function __set_openRelativePosition(positionName) {
    if (positionName in tk.RelativePositions) {
      _prefs.setCharPref("openRelativePosition", positionName);
    }
    else {
      tk.dump("openRelativePosition - invalid position name: " + positionName);
    }
    return positionName;
  });

  this.__defineGetter__("newTabPosition", function __get_newTabPosition() {
    var position = _prefs.getIntPref("newTabPosition");
    if (position >= 0 && position <= 2) {
      return position;
    }
    else {
      tk.log("newTabPosition - invalid pref value: " + position);
      return 0;
    }
  });
  this.__defineSetter__("newTabPosition", function __set_newTabPosition(position) {
    if (position >= 0 && position <= 2) {
      _prefs.setIntPref("newTabPosition", position);
    }
    else {
      tk.dump("newTabPosition - invalid position: " + position);
      return position;
    }
  });

  this.__defineGetter__("autoGroupNewTabs", function __get_autoGroupNewTabs() {
    return _prefs.getBoolPref("autoGroupNewTabs");
  });
  this.__defineSetter__("autoGroupNewTabs", function __set_autoGroupNewTabs(bool) {
    _prefs.setBoolPref("autoGroupNewTabs", bool);
    return bool;
  });


  /// Initialisation:
  this.initSortingAndGrouping = function initSortingAndGrouping(event) {

    tk.detectTheme();

    // Add event listeners:
    _tabContainer.addEventListener("TabOpen", tk.sortgroup_onTabAdded, false);
    _tabContainer.addEventListener("TabSelect", tk.sortgroup_onTabSelect, true);
    gBrowser.addEventListener("DOMContentLoaded", tk.sortgroup_onTabLoading, true);
    gBrowser.addEventListener("load", tk.sortgroup_onTabLoaded, true);
    // TODO=P3: GCODE See https://developer.mozilla.org/En/Listening_to_events_on_all_tabs for better ways to listen for tab loads in Fx3.5+
    // This is called just before the tab starts loading its content, use SSTabRestored for once that's finished
    document.addEventListener("SSTabRestoring", tk.sortgroup_onSSTabRestoring, false);
    _tabContainer.addEventListener("TabMove", tk.sortgroup_onTabMoved, false);
    _tabContainer.addEventListener("TabClose", tk.sortgroup_onTabRemoved, false);

    // gBrowser.mStrip.addEventListener("mousedown", tk.sortgroup_onTabMousedown, true);
    // gBrowser.mStrip.addEventListener("click", tk.sortgroup_onClickTab, true);
    // gBrowser.mStrip.addEventListener("dblclick", tk.sortgroup_onDblclickTab, true);

    gBrowser.tabContainer.addEventListener("mousedown", tk.sortgroup_onTabMousedown, true);
    gBrowser.tabContainer.addEventListener("click", tk.sortgroup_onClickTab, true);
    gBrowser.tabContainer.addEventListener("dblclick", tk.sortgroup_onDblclickTab, true);

    document.getElementById("menupopup_tabkit-sortgroup").addEventListener("popupshowing", tk.updateSortGroupMenu, true);

    tk.addPrefListener("forceThemeCompatibility", tk.detectTheme);
    tk.addPrefListener("colorTabNotLabel", tk.detectTheme);
    tk.addPrefListener("disableTabGroupColor", tk.detectTheme);
    tk.addPrefListener("minSaturation", tk.regenSaturationLightness);
    tk.addPrefListener("maxSaturation", tk.regenSaturationLightness);
    tk.addPrefListener("minLightness", tk.regenSaturationLightness);
    tk.addPrefListener("maxLightness", tk.regenSaturationLightness);
    tk.addPrefListener("indentedTree", tk.toggleIndentedTree);
    tk.addPrefListener("maxTreeLevel", tk.updateIndents);
    tk.addPrefListener("indentAmount", tk.updateIndents);
    tk.addPrefListener("autoCollapse", tk.updateAutoCollapse);

    // Bool value and attribute existence are inversed
    tk.mapPrefToAttribute("colorTabNotLabel", function() {
      return _prefs.getBoolPref("colorTabNotLabel") ? undefined : "true";
    }, gBrowser.tabContainer, "tabkit-color-label-not-tab");

    // Set attributes for tabs that opened before we were able to register our listeners (in particular the initial xul:tab never fires a TabOpen event, and may never load either if it remains blank, but sometimes other tabs load first too)
    for (var i = 0; i < _tabs.length; i++) {
      tk.sortgroup_onTabAdded({ target: _tabs[i], fromInitSortingAndGrouping: true });
      _tabs[i].setAttribute(tk.Sorts.lastLoaded, Date.now());
    }
    // Set attributes for the selected tab (as it never fires a TabSelect event)
    window.setTimeout(function __selectInitial() {
      tk.sortgroup_onTabSelect({target: gBrowser.selectedTab});
      if (!gBrowser.selectedTab.hasAttribute("groupid"))
        tk.updateAutoCollapse();
    }, 0);

    // Move Sorting and Grouping menu to the tab context menu (from the Tools menu)
    var tabContextMenu = gBrowser.tabContextMenu;
    tabContextMenu.insertBefore(document.getElementById("menu_tabkit-sortgroup"), tabContextMenu.childNodes[1]);

    // Fix: Faviconize is now ignored on grouped tabs (Issue 51)
    // First injected statement required a leading space to make it work, don't know why (probably JS syntax)
    // https://github.com/ktakayama/faviconizetab/blob/master/content/addon/quick_fav.js
    (function() {
      "use strict";

      if (!("faviconize" in window) ||
          !("quickFav" in window.faviconize) ||
          typeof faviconize.quickFav.dblclick !== "function") {
        tk.debug("faviconize.quickFav.dblclick doesn't exists, replacing function failed");
        return;
      }

      var old_func = faviconize.quickFav.dblclick;
      // Function signature should be valid for FF 38.x & 45.x
      faviconize.quickFav.dblclick = function(e) {
        "use strict";
        var result = undefined;

        tk.debug(">>> faviconize.quickFav.dblclick >>>");
        var tab = e.target;
        if (tab.hasAttribute("groupid") && tk.localPrefService.getBoolPref("doubleClickCollapseExpand")) {
          tk.debug("faviconize cancelled");
          return;
        }
        else {
          result = old_func.apply(this, [e]);
        }
        tk.debug("<<< faviconize.quickFav.dblclick <<<");

        return result;
      };
    })();
  };
  this.initListeners.push(this.initSortingAndGrouping);

  this.getTabAttributesForTabKit = function(tab) {
    if (typeof tab !== "object" || typeof tab.getAttribute !== "function") {
      return;
    }

    let data = {};

    let attr_names = [
      "tabid",
      "possibleparent",
      "outoforder",
      "groupid",
      "singletonid",
      "groupcollapsed",
    ];
    for each (let attr_name in attr_names) {
      if (tab.hasAttribute(attr_name)) {
        data[attr_name] = tab.getAttribute(attr_name);
      }
    }

    for each (let attr_name in tk.Sorts) {
      if (tk.endsWith(attr_name, "Key")) {
        data[attr_name] = tab.getAttribute(attr_name);
      }
    }
    for each (let attr_name in tk.Groupings) {
      if (tk.endsWith(attr_name, "Group")) {
        data[attr_name] = tab.getAttribute(attr_name);
      }
    }

    return data;
  };

  this.setTabAttributesForTabKit = function(tab, tab_attributes) {
    if (typeof tab !== "object" || typeof tab.setAttribute !== "function") {
      return;
    }
    if (typeof tab_attributes !== "object") {
      return;
    }

    let attr_names = [
      "tabid",
      "possibleparent",
      "outoforder",
      "groupid",
      "singletonid",
      "groupcollapsed",
    ];
    for each (let attr_name in attr_names) {
      if (attr_name in tab_attributes) {
        tab.setAttribute(attr_name, tab_attributes[attr_name]);
      }
    }

    for each (let attr_name in tk.Sorts) {
      if (tk.endsWith(attr_name, "Key")) {
        if (attr_name in tab_attributes) {
          tab.setAttribute(attr_name, tab_attributes[attr_name]);
        }
      }
    }
    for each (let attr_name in tk.Groupings) {
      if (tk.endsWith(attr_name, "Group")) {
        if (attr_name in tab_attributes) {
          tab.setAttribute(attr_name, tab_attributes[attr_name]);
        }
      }
    }
  };

  this.postInitSortingAndGrouping = function postInitSortingAndGrouping(event) {
    // Persist Attributes
    if (_ss) {
      _ss.persistTabAttribute("tabid");
      _ss.persistTabAttribute("possibleparent");
      // n.b. we deliberately don't persist recentlyadded
      _ss.persistTabAttribute("outoforder");
      //_ss.persistTabAttribute("hidden"); // This will get overwritten anyway
      for each (var attr in tk.Sorts) {
        if (tk.endsWith(attr, "Key"))
          _ss.persistTabAttribute(attr);
      }
      _ss.persistTabAttribute("groupid");
      _ss.persistTabAttribute("singletonid");
      _ss.persistTabAttribute("groupcollapsed");
      for each (var attr in tk.Groupings) {
        if (tk.endsWith(attr, "Group"))
          _ss.persistTabAttribute(attr);
      }
    }

    // This is for search item in context menu only
    // Not sure if `BrowserSearch.loadSearch` should be patched as well
    (function init_BrowserSearch_loadSearchFromContext() {
      "use strict";

      if (!("loadSearchFromContext" in BrowserSearch) || typeof BrowserSearch.loadSearchFromContext !== "function") {
        tk.debug("BrowserSearch.loadSearchFromContext doesn't exists, replacing function failed");
        return;
      }

      var old_func = BrowserSearch.loadSearchFromContext;
      // Function signature should be valid for FF 38.x & 45.x
      BrowserSearch.loadSearchFromContext = function(terms) {
        "use strict";
        var result = undefined;

        tk.debug(">>> BrowserSearch.loadSearchFromContext >>>");
        let selected_tab_before_operation = gBrowser.selectedTab
        tabkit.addingTab({
          added_tab_type: "unrelated",
          parent_tab: selected_tab_before_operation
        });
        try {
          result = old_func.apply(this, [terms]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "unrelated",
            parent_tab: selected_tab_before_operation
          });
        }
        tk.debug("<<< BrowserSearch.loadSearchFromContext <<<");

        return result;
      };
    })();

    // This is for search item in context menu only
    // Not sure if `BrowserSearch.loadSearch` should be patched as well
    // Present in Fx 38.x & 45.x
    (function init_BrowserSearch_loadAddEngines() {
      "use strict";

      if (typeof BrowserSearch !== "object" || typeof BrowserSearch.loadAddEngines !== "function") {
        tk.debug("BrowserSearch.loadAddEngines doesn't exists, replacing function failed");
        return;
      }

      var old_func = BrowserSearch.loadAddEngines;
      // Function signature should be valid for FF 38.x & 45.x
      BrowserSearch.loadAddEngines = function() {
        "use strict";
        var result = undefined;

        tk.debug(">>> BrowserSearch.loadAddEngines >>>");
        let selected_tab_before_operation = gBrowser.selectedTab
        tabkit.addingTab({
          added_tab_type: "unrelated",
          parent_tab: selected_tab_before_operation
        });
        try {
          result = old_func.apply(this, []);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "unrelated",
            parent_tab: selected_tab_before_operation
          });
        }
        tk.debug("<<< BrowserSearch.loadAddEngines <<<");

        return result;
      };
    })();

    // For opening new tab with history entry of current tab
    (function init_gotoHistoryIndex() {
      "use strict";

      if (!("gotoHistoryIndex" in window) || typeof window.gotoHistoryIndex !== "function") {
        tk.debug("window.gotoHistoryIndex doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.gotoHistoryIndex;
      // Function signature should be valid for FF 38.x & 45.x
      window.gotoHistoryIndex = function(aEvent) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.gotoHistoryIndex >>>");
        let selected_tab_before_operation = gBrowser.selectedTab
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab: selected_tab_before_operation
        });
        try {
          result = old_func.apply(this, [aEvent]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related",
            parent_tab: selected_tab_before_operation
          });
        }
        tk.debug("<<< window.gotoHistoryIndex <<<");

        return result;
      };
    })();

    // For opening new tab with history entry of current tab
    (function init_BrowserBack() {
      "use strict";

      if (!("BrowserBack" in window) || typeof window.BrowserBack !== "function") {
        tk.debug("window.BrowserBack doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.BrowserBack;
      // Function signature should be valid for FF 38.x & 45.x
      window.BrowserBack = function(aEvent) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.BrowserBack >>>");
        let selected_tab_before_operation = gBrowser.selectedTab
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab: selected_tab_before_operation
        });
        try {
          result = old_func.apply(this, [aEvent]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related",
            parent_tab: selected_tab_before_operation
          });
        }
        tk.debug("<<< window.BrowserBack <<<");

        return result;
      };
    })();

    // For opening new tab with history entry of current tab
    (function init_BrowserForward() {
      "use strict";

      if (!("BrowserForward" in window) || typeof window.BrowserForward !== "function") {
        tk.debug("window.BrowserForward doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.BrowserForward;
      // Function signature should be valid for FF 38.x & 45.x
      window.BrowserForward = function(aEvent) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.BrowserForward >>>");
        let selected_tab_before_operation = gBrowser.selectedTab
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab: selected_tab_before_operation
        });
        try {
          result = old_func.apply(this, [aEvent]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related",
            parent_tab: selected_tab_before_operation
          });
        }
        tk.debug("<<< window.BrowserForward <<<");

        return result;
      };
    })();

    // For duplicating tab?
    (function init_BrowserReloadOrDuplicate() {
      "use strict";

      if (!("BrowserReloadOrDuplicate" in window) || typeof window.BrowserReloadOrDuplicate !== "function") {
        tk.debug("window.BrowserReloadOrDuplicate doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.BrowserReloadOrDuplicate;
      // Function signature should be valid for FF 38.x & 45.x
      window.BrowserReloadOrDuplicate = function(aEvent) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.BrowserReloadOrDuplicate >>>");
        let selected_tab_before_operation = gBrowser.selectedTab
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab: selected_tab_before_operation
        });
        try {
          result = old_func.apply(this, [aEvent]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related",
            parent_tab: selected_tab_before_operation
          });
        }
        tk.debug("<<< window.BrowserReloadOrDuplicate <<<");

        return result;
      };
    })();

    // For loading a search result
    (function init_BrowserSearch_loadSearch() {
      "use strict";

      if (!("loadSearch" in BrowserSearch) || typeof BrowserSearch.loadSearch !== "function") {
        tk.debug("BrowserSearch.loadSearch doesn't exists, replacing function failed");
        return;
      }

      var old_func = BrowserSearch.loadSearch;
      // Function signature should be valid for FF 38.x & 45.x
      BrowserSearch.loadSearch = function(searchText, useNewTab, purpose) {
        "use strict";
        var result = undefined;

        tk.debug(">>> BrowserSearch.loadSearch >>>");
        let selected_tab_before_operation = gBrowser.selectedTab
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab: selected_tab_before_operation
        });
        try {
          result = old_func.apply(this, [searchText, useNewTab, purpose]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related",
            parent_tab: selected_tab_before_operation
          });
        }
        tk.debug("<<< BrowserSearch.loadSearch <<<");

        return result;
      };
    })();

    // The search bar behaviour
    (function init_searchbar_handleSearchCommand() {
      "use strict";

      const searchbar = document.getElementById("searchbar");
      if (!("handleSearchCommand" in searchbar) || typeof searchbar.handleSearchCommand !== "function") {
        tk.debug("searchbar.handleSearchCommand doesn't exists, replacing function failed");
        return;
      }

      var old_func = searchbar.handleSearchCommand;
      // Function signature should be valid for FF 38.x & 45.x
      searchbar.handleSearchCommand = function(aEvent, aEngine, aForceNewTab) {
        "use strict";
        var result = undefined;

        tk.debug(">>> searchbar.handleSearchCommand >>>");
        tabkit.addingTab({
          added_tab_type: "unrelated",
          parent_tab: gBrowser.selectedTab
        });
        try {
          result = old_func.apply(this, [aEvent, aEngine, aForceNewTab]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "unrelated"
          });
        }
        tk.debug("<<< searchbar.handleSearchCommand <<<");

        return result;
      };
    })();

    // Should be handling click events on link in a webpage
    (function init_window_handleLinkClick() {
      "use strict";

      if (!("handleLinkClick" in window) || typeof window.handleLinkClick !== "function") {
        tk.debug("window.handleLinkClick doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.handleLinkClick;
      // Function signature should be valid for FF 38.x & 45.x
      window.handleLinkClick = function(event, href, linkNode) {
        "use strict";
        var result = undefined;
        var selected_tab_before_event_handling = gBrowser.selectedTab;

        tk.debug(">>> window.handleLinkClick >>>");
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab:     selected_tab_before_event_handling
        });
        try {
          result = old_func.apply(this, [event, href, linkNode]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related",
            parent_tab:     selected_tab_before_event_handling
          });
        }
        tk.debug("<<< window.handleLinkClick <<<");

        return result;
      };
    })();

    // Not sure what is this
    // This is converted from code brought from Tab Kit 1
    (function init_window_middleMousePaste() {
      "use strict";

      if (!("middleMousePaste" in window) || typeof window.middleMousePaste !== "function") {
        tk.debug("window.middleMousePaste doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.middleMousePaste;
      // Function signature should be valid for FF 38.x & 45.x
      window.middleMousePaste = function(event) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.middleMousePaste >>>");
        tabkit.addingTab({
          added_tab_type: "newtab"
        });
        try {
          result = old_func.apply(this, [event]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "newtab"
          });
        }
        tk.debug("<<< window.middleMousePaste <<<");

        return result;
      };
    })();

    // Some drag & drop action, but not sure where
    (function init_window_newTabButtonObserver_onDrop() {
      "use strict";

      if (!("newTabButtonObserver" in window) ||
          typeof window.newTabButtonObserver !== "object" ||
          !("onDrop" in window.newTabButtonObserver) ||
          typeof window.newTabButtonObserver.onDrop !== "function") {
        tk.debug("window.newTabButtonObserver.onDrop doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.newTabButtonObserver.onDrop;
      // Function signature should be valid for FF 38.x & 45.x
      window.newTabButtonObserver.onDrop = function(event) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.newTabButtonObserver.onDrop >>>");
        tabkit.addingTab({
          added_tab_type: "newtab"
        });
        try {
          result = old_func.apply(this, [event]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "newtab"
          });
        }
        tk.debug("<<< window.newTabButtonObserver.onDrop <<<");

        return result;
      };
    })();

    // Properly new tab button and/or Ctrl-T
    (function init_window_BrowserOpenTab() {
      "use strict";

      if (!("BrowserOpenTab" in window) ||
          typeof window.BrowserOpenTab !== "function") {
        tk.debug("window.BrowserOpenTab doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.BrowserOpenTab;
      // Function signature should be valid for FF 38.x & 45.x
      window.BrowserOpenTab = function(optional_options) {
        "use strict";
        var result = undefined;
        // Default value
        var added_tab_type = "newtab";
        if (typeof optional_options === "object" &&
            "tab_kit_options" in optional_options &&
            typeof optional_options.tab_kit_options === "object" &&
            "added_tab_type" in optional_options.tab_kit_options &&
            typeof optional_options.tab_kit_options.added_tab_type === "string"
          ) {
          added_tab_type = optional_tabkit_options.added_tab_type;
        }
        // Default value
        var parent_tab = gBrowser.selectedTab;
        if (typeof optional_options === "object" &&
            "tab_kit_options" in optional_options &&
            typeof optional_options.tab_kit_options === "object" &&
            "parent_tab" in optional_options.tab_kit_options &&
            typeof optional_options.tab_kit_options.parent_tab !== "undefined"
          ) {
          parent_tab = optional_tabkit_options.parent_tab;
        }

        tk.debug(">>> window.BrowserOpenTab >>>");
        tabkit.addingTab({
          added_tab_type: added_tab_type,
          parent_tab:     parent_tab
        });
        try {
          result = old_func.apply(this, []);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: added_tab_type,
            parent_tab:     parent_tab
          });
        }
        tk.debug("<<< window.BrowserOpenTab <<<");

        return result;
      };
    })();

    // Not sure which one uses it
    (function init_window_delayedOpenTab() {
      "use strict";

      if (!("delayedOpenTab" in window) ||
          typeof window.delayedOpenTab !== "function") {
        tk.debug("window.delayedOpenTab doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.delayedOpenTab;
      // Function signature should be valid for FF 38.x & 45.x
      window.delayedOpenTab = function(aUrl, aReferrer, aCharset, aPostData, aAllowThirdPartyFixup) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.delayedOpenTab >>>");
        tabkit.addingTab({
          added_tab_type: "newtab"
        });
        try {
          result = old_func.apply(this, [aUrl, aReferrer, aCharset, aPostData, aAllowThirdPartyFixup]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "newtab"
          });
        }
        tk.debug("<<< window.delayedOpenTab <<<");

        return result;
      };
    })();

    // Not sure which one uses it
    (function init_window_gURLBar_handleCommand() {
      "use strict";

      if (!("gURLBar" in window) ||
          typeof window.gURLBar !== "object" ||
          !("handleCommand" in window.gURLBar) ||
          typeof window.gURLBar.handleCommand !== "function") {
        tk.debug("window.gURLBar.handleCommand doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.gURLBar.handleCommand;
      // Function signature should be valid for FF 38.x & 45.x
      window.gURLBar.handleCommand = function(aTriggeringEvent) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.gURLBar.handleCommand >>>");
        tabkit.addingTab({
          added_tab_type: "newtab"
        });
        try {
          // Open new tab for address bar by default if preference set
          if (_prefs.getBoolPref("openTabsFrom.addressBar")) {
            if (aTriggeringEvent instanceof KeyboardEvent) {
              // Creates a new event object from the old one with some properties modified
              // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
              aTriggeringEvent = new KeyboardEvent(aTriggeringEvent.type, {
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
                sourceCapabilities:   aTriggeringEvent.sourceCapabilities,

                // From https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
                bubbles:              aTriggeringEvent.bubbles,
                cancelable:           aTriggeringEvent.cancelable,
              });
            }
            else if (aTriggeringEvent instanceof MouseEvent) {
              // Creates a new event object from the old one with some properties modified
              // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent
              aTriggeringEvent = new MouseEvent(aTriggeringEvent.type, {
                screenX:        aTriggeringEvent.screenX,
                screenY:        aTriggeringEvent.screenY,
                clientX:        aTriggeringEvent.clientX,
                clientY:        aTriggeringEvent.clientY,
                ctrlKey:        aTriggeringEvent.ctrlKey,
                shiftKey:       aTriggeringEvent.shiftKey,

                // The main reason why we need a new event object
                altKey:         !aTriggeringEvent.altKey,

                metaKey:        aTriggeringEvent.metaKey,
                repeat:         aTriggeringEvent.repeat,
                button:         aTriggeringEvent.button,
                buttons:        aTriggeringEvent.buttons,
                relatedTarget:  aTriggeringEvent.relatedTarget,
                region:         aTriggeringEvent.region,

                // From https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/UIEvent
                detail:               aTriggeringEvent.detail,
                view:                 aTriggeringEvent.view,
                sourceCapabilities:   aTriggeringEvent.sourceCapabilities,

                // From https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
                bubbles:              aTriggeringEvent.bubbles,
                cancelable:           aTriggeringEvent.cancelable,
              });
            }
          }
          result = old_func.apply(this, [aTriggeringEvent]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "newtab"
          });
        }
        tk.debug("<<< window.gURLBar.handleCommand <<<");

        return result;
      };
    })();

    // Some kind of cleanup function or remove tab callback
    (function init_window_gBrowser__endRemoveTab() {
      "use strict";

      if (!("gBrowser" in window) ||
          typeof window.gBrowser !== "object" ||
          !("_endRemoveTab" in window.gBrowser) ||
          typeof window.gBrowser._endRemoveTab !== "function") {
        tk.debug("window.gBrowser._endRemoveTab doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.gBrowser._endRemoveTab;
      // Function signature should be valid for FF 38.x & 45.x
      window.gBrowser._endRemoveTab = function(aTab) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.gBrowser._endRemoveTab >>>");
        tabkit.addingTab({
          added_tab_type: "newtab"
        });
        try {
          result = old_func.apply(this, [aTab]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "newtab"
          });
        }
        tk.debug("<<< window.gBrowser._endRemoveTab <<<");

        return result;
      };
    })();


    // Function called by context menu item
    // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/nsContextMenu.js#894
    // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#979
    (function() {
      "use strict";

      if (!("nsContextMenu" in window) ||
          typeof window.nsContextMenu !== "function" ||
          typeof window.nsContextMenu.prototype.openLinkInTab !== "function") {
        tk.debug("window.nsContextMenu.prototype.openLinkInTab doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.nsContextMenu.prototype.openLinkInTab;
      // Function signature should be valid for FF 38.x & 45.x
      window.nsContextMenu.prototype.openLinkInTab = function() {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.nsContextMenu.prototype.openLinkInTab >>>");
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab: gBrowser.selectedTab
        });
        try {
          result = old_func.apply(this, []);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related"
          });
        }
        tk.debug("<<< window.nsContextMenu.prototype.openLinkInTab <<<");

        return result;
      };
    })();

    // Function called by context menu item
    // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/nsContextMenu.js#926
    // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#1011
    (function() {
      "use strict";

      if (!("nsContextMenu" in window) ||
          typeof window.nsContextMenu !== "function" ||
          typeof window.nsContextMenu.prototype.openFrameInTab !== "function") {
        tk.debug("window.nsContextMenu.prototype.openFrameInTab doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.nsContextMenu.prototype.openFrameInTab;
      // Function signature should be valid for FF 38.x & 45.x
      window.nsContextMenu.prototype.openFrameInTab = function() {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.nsContextMenu.prototype.openFrameInTab >>>");
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab: gBrowser.selectedTab
        });
        try {
          result = old_func.apply(this, []);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related"
          });
        }
        tk.debug("<<< window.nsContextMenu.prototype.openFrameInTab <<<");

        return result;
      };
    })();

    // Function called by context menu item
    // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/nsContextMenu.js#1080
    // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#1182
    (function() {
      "use strict";

      if (!("nsContextMenu" in window) ||
          typeof window.nsContextMenu !== "function" ||
          typeof window.nsContextMenu.prototype.viewBGImage !== "function") {
        tk.debug("window.nsContextMenu.prototype.viewBGImage doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.nsContextMenu.prototype.viewBGImage;
      // Function signature should be valid for FF 38.x & 45.x
      window.nsContextMenu.prototype.viewBGImage = function(e) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.nsContextMenu.prototype.viewBGImage >>>");
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab: gBrowser.selectedTab
        });
        try {
          result = old_func.apply(this, [e]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related"
          });
        }
        tk.debug("<<< window.nsContextMenu.prototype.viewBGImage <<<");

        return result;
      };
    })();

    // Function called by context menu item
    // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/nsContextMenu.js#1560
    // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#1650
    (function() {
      "use strict";

      if (!("nsContextMenu" in window) ||
          typeof window.nsContextMenu !== "function" ||
          typeof window.nsContextMenu.prototype.addDictionaries !== "function") {
        tk.debug("window.nsContextMenu.prototype.addDictionaries doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.nsContextMenu.prototype.addDictionaries;
      // Function signature should be valid for FF 38.x & 45.x
      window.nsContextMenu.prototype.addDictionaries = function() {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.nsContextMenu.prototype.addDictionaries >>>");
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab: gBrowser.selectedTab
        });
        try {
          result = old_func.apply(this, []);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related"
          });
        }
        tk.debug("<<< window.nsContextMenu.prototype.addDictionaries <<<");

        return result;
      };
    })();

    // Function called by context menu item
    // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/nsContextMenu.js#1031
    // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/nsContextMenu.js#1133
    (function() {
      "use strict";

      if (!("nsContextMenu" in window) ||
          typeof window.nsContextMenu !== "function" ||
          typeof window.nsContextMenu.prototype.viewMedia !== "function") {
        tk.debug("window.nsContextMenu.prototype.viewMedia doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.nsContextMenu.prototype.viewMedia;
      // Function signature should be valid for FF 38.x & 45.x
      window.nsContextMenu.prototype.viewMedia = function(e) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.nsContextMenu.prototype.viewMedia >>>");
        tabkit.addingTab({
          added_tab_type: "related",
          parent_tab: gBrowser.selectedTab
        });
        try {
          result = old_func.apply(this, [e]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: "related"
          });
        }
        tk.debug("<<< window.nsContextMenu.prototype.viewMedia <<<");

        return result;
      };
    })();


    // Function called by ... Browser access?
    // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/browser.js#4666
    // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/browser.js#4983
    (function() {
      "use strict";

      if (!("nsBrowserAccess" in window) ||
          typeof window.nsBrowserAccess !== "function" ||
          typeof window.nsBrowserAccess.prototype.openURI !== "function") {
        tk.debug("window.nsBrowserAccess.prototype.openURI doesn't exists, replacing function failed");
        return;
      }

      var old_func = window.nsBrowserAccess.prototype.openURI;
      // Function signature should be valid for FF 38.x & 45.x
      window.nsBrowserAccess.prototype.openURI = function(aURI, aOpener, aWhere, aContext) {
        "use strict";
        var result = undefined;

        tk.debug(">>> window.nsBrowserAccess.prototype.openURI >>>");
        var added_tab_type = aContext == Ci.nsIBrowserDOMWindow.OPEN_EXTERNAL ? "unrelated" : "related";
        tabkit.addingTab({
          added_tab_type: added_tab_type,
          parent_tab: gBrowser.selectedTab
        });
        try {
          result = old_func.apply(this, [aURI, aOpener, aWhere, aContext]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabOver({
            added_tab_type: added_tab_type
          });
        }
        tk.debug("<<< window.nsBrowserAccess.prototype.openURI <<<");

        return result;
      };
    })();


    // Function called by ... Browser access?
    // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#1414
    // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#1439
    (function() {
      "use strict";

      if (!("loadTabs" in gBrowser) ||
          typeof gBrowser.loadTabs !== "function") {
        tk.debug("gBrowser.loadTabs doesn't exists, replacing function failed");
        return;
      }

      var old_func = gBrowser.loadTabs;
      // Function signature should be valid for FF 38.x & 45.x
      gBrowser.loadTabs = function(aURIs, aLoadInBackground, aReplace) {
        "use strict";
        var result = undefined;

        tk.debug(">>> gBrowser.loadTabs >>>");
        tabkit.addingTabs(aReplace ? gBrowser.selectedTab : null);
        try {
          result = old_func.apply(this, [aURIs, aLoadInBackground, aReplace]);
        }
        finally {
          // This might be called already
          // But this is called again since it contains code for cleaning up
          tabkit.addingTabsOver();
        }
        tk.debug("<<< gBrowser.loadTabs <<<");

        return result;
      };
    })();

    // Function called by dragover event handler
    // Disable the sliding effect of tab dragging until here is an preference
    // Defined in
    // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#4112
    // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#4959
    (function() {
      "use strict";

      if (typeof gBrowser.tabContainer !== "object" ||
          typeof gBrowser.tabContainer._animateTabMove !== "function") {
        tk.debug("gBrowser.tabContainer._animateTabMove doesn't exists, replacing function failed");
        return;
      }

      var old_func = gBrowser.tabContainer._animateTabMove;
      // Function signature should be valid for FF 38.x & 45.x
      gBrowser.tabContainer._animateTabMove = function(event) {
        "use strict";
        var result = undefined;

        tk.debug(">>> gBrowser.loadTabs >>>");
        this._handleTabSelect();
        tk.debug("<<< gBrowser.tabContainer._animateTabMove <<<");

        return result;
      };
    })();
  }
  this.postInitListeners.push(this.postInitSortingAndGrouping);

  /// More globals (for group by opener):
  this.nextType        = null;
  this.isBookmarkGroup = false;
  this.nextParent      = null;
  this.lastParent      = null;
  this.dontMoveNextTab = false;
  this.ignoreOvers     = 0; // TODO=P5: TJS Auto unset this after a timeout?
  this.addedTabs       = [];

  /// Method Hooks (for group by opener):
  this.preInitSortingAndGroupingMethodHooks = function preInitSortingAndGroupingMethodHooks(event) {
    (function() {
      "use strict";

      if (typeof gBrowser.addTab !== "function") {
        tk.debug("gBrowser.addTab doesn't exists, replacing function failed");
        return;
      }

      var old_func = gBrowser.addTab;
      // Function signature should be valid for FF 38.x & 45.x
      gBrowser.addTab = function(aURI, aReferrerURI, aCharset, aPostData, aOwner, aAllowThirdPartyFixup) {
        "use strict";
        var result = undefined;
        var tab = undefined;
        var aSkipAnimation = false;

        tk.debug(">>> gBrowser.addTab >>>");
        // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#1810
        // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#1888
        if (arguments.length === 2 &&
            typeof arguments[1] === "object" &&
            ("skipAnimation" in arguments[1])) {
          let params = arguments[1];
          aSkipAnimation = params.skipAnimation;
        }
        if (aSkipAnimation) {
          tk.addingTab({
            added_tab_type: "sessionrestore",
            should_keep_added_tab_position: true
          });
        }
        result = old_func.apply(this, arguments);
        tab = result;
        if (aSkipAnimation && tab != null) {
          tk.addingTabOver({
            added_tab:  tab,
            added_tab_type: "sessionrestore",
            should_keep_added_tab_position: true
          });
        }
        tk.debug("<<< gBrowser.addTab <<<");

        return result;
      };
    })();

    // And an attribute based related tab source:
    var reportPhishing = document.getElementById("menu_HelpPopup_reportPhishingtoolmenu");
    if (typeof reportPhishing === "object" && "setAttribute" in reportPhishing) {
      let original_command_str = reportPhishing.getAttribute("oncommand");
      reportPhishing.
        setAttribute(
          "oncommand",
          'tabkit.addingTab({ \
            added_tab_type: "related", \
            parent_tab: gBrowser.selectedTab \
          }); try {' + original_command_str + '} \
          finally { \
            tabkit.addingTabOver({ \
              added_tab_type: "related" \
            }); \
          }'
        );
    }


    // And an attribute based history tab source:
    var goMenu = document.getElementById("history-menu");
    if (!(typeof goMenu === "object" && "setAttribute" in goMenu)) {
      goMenu = document.getElementById("go-menu");
    }
    if (typeof goMenu === "object" && "setAttribute" in goMenu) {
      let original_command_str = goMenu.getAttribute("oncommand");
      goMenu.
        setAttribute(
          "oncommand",
          'tabkit.addingTab({ \
            added_tab_type: "history", \
            parent_tab: gBrowser.selectedTab \
          }); try {' + original_command_str + '} \
          finally { \
            tabkit.addingTabOver({ \
              added_tab_type: "history" \
            }); \
          }'
        );
    }
  };
  this.preInitListeners.push(this.preInitSortingAndGroupingMethodHooks);

  // See globalPreInitSortingAndGroupingMethodHooks in tabkit-global.js

  this.postInitSortingAndGroupingMethodHooks = function postInitSortingAndGroupingMethodHooks(event) {
  };
  this.postInitListeners.push(this.postInitSortingAndGroupingMethodHooks);

  /// Methods dealing with new tabs:
  this.addingTab = function addingTab(type_or_options, parent, dontMoveNextTab) {
    try {
      // Already got type?
      // Then ignore addingTabOver processing
      if (tk.nextType) {
        tk.ignoreOvers++;
        return;
      }

      if (typeof type_or_options === "object") {
        let options = type_or_options;

        if (("added_tab_type" in options) && options.added_tab_type != null) {
          tk.nextType = options.added_tab_type;
        }
        // This is special: will assign to `null` if provided
        if (("parent_tab" in options) && typeof options.parent_tab !== "undefined") {
          tk.nextParent = options.parent_tab;
        }
        if (("should_keep_added_tab_position" in options) && options.should_keep_added_tab_position != null) {
          // Will convert to `bool`
          tk.dontMoveNextTab = options.should_keep_added_tab_position ? true : false;
        }
      }
      else {
        tk.nextType = type_or_options;
      tk.isBookmarkGroup = false;
      tk.nextParent = parent != undefined ? parent : gBrowser.selectedTab;
        // Will convert to `bool`
      tk.dontMoveNextTab = dontMoveNextTab ? true : false;
    }
    }
    catch (ex) {
      tk.dump(ex);
    }
  };

  // For adding one tab
  // There is another function named addingTabsOver for multiple tabs
  this.addingTabOver = function addingTabOver(options) {
    let added_tabs_from_params_or_global = [];
    let parent_tab_from_params_or_global = null;
    let added_tab_type_from_params_or_global = null;
    let should_keep_added_tab_position_from_params_or_global = false;

    if (typeof options === "object" && ("added_tab" in options) && options.added_tab != null) {
      added_tabs_from_params_or_global = [options.added_tab];
    }
    else {
      added_tabs_from_params_or_global = tk.addedTabs;
    }

    if (typeof options === "object" && ("added_tab_type" in options) && options.added_tab_type != null) {
      added_tab_type_from_params_or_global = options.added_tab_type;
    }
    else {
      added_tab_type_from_params_or_global = tk.nextType;
    }

    // sessionrestore tabs have no parent
    // unrelated tabs? Let it be (What)
    if (added_tab_type_from_params_or_global === "sessionrestore") {
      parent_tab_from_params_or_global = null;
    }
    else {
      if (typeof options === "object" && ("parent_tab" in options) && options.parent_tab != null) {
        parent_tab_from_params_or_global = options.parent_tab;
      }
      else {
        parent_tab_from_params_or_global = tk.nextParent;
      }
    }

    if (typeof options === "object" && ("should_keep_added_tab_position" in options) && options.should_keep_added_tab_position != null) {
      should_keep_added_tab_position_from_params_or_global = options.should_keep_added_tab_position;
    }
    else {
      should_keep_added_tab_position_from_params_or_global = tk.dontMoveNextTab;
    }

    try {
      if (tk.ignoreOvers > 0) {
        // tk.ignoreOvers will be decremented in the finally clause at the end of this function
        return;
      }

      if (added_tabs_from_params_or_global.length > 1) { // Shouldn't happen
        tk.dump("addingTabsOver: More than one tab was added (" + added_tabs_from_params_or_global.length + " tabs, to be precise)!");
        tk.addingTabsOver();
        return;
      }

      if (added_tabs_from_params_or_global.length === 1) {
        var type = added_tab_type_from_params_or_global;
        // The first tab restored from session also has no parent
        var parent = parent_tab_from_params_or_global;
        var tab = added_tabs_from_params_or_global.pop();

        // Keep recentlyadded tags up to date
        if (!parent || parent != tk.lastParent)
          for (var i = 0; i < _tabs.length; i++)
            _tabs[i].removeAttribute("recentlyadded");
        tk.lastParent = tk.nextParent;

        // We do *nothing else* for sessionrestore tabs, as they will (hopefully) be dealt with later after a sortgroup_onSSTabRestoring
        if (type === "sessionrestore") {
          return;
        }

        // Get pid, set possibleparent
        var pid = parent ? tk.getTabId(parent) : null;
        var tid = tk.getTabId(tab);
        if (pid != null) {
          tab.setAttribute("possibleparent", pid);
        }
        else if (type !== "unrelated") {
          tk.dump("addingTabOver: no parent for " + type + " tab");
        }

        // Adjust openerGroup sensitivity
        if (type === "bookmark" && _prefs.getBoolPref("bookmarkTabsAreRelated")) {
          type = "related";
        }
        else if (type === "history" && _prefs.getBoolPref("historyTabsAreRelated")) {
          type = "related";
        }
        else if (type === "newtab" && _prefs.getBoolPref("newTabsAreRelated")) {
          type = "related";
        }
        else if (type === "sessionrestore") {
          type = "unrelated";
        }

        // Set openerGroup (reused later if autoGroupNewTabs and activeGrouping == "opener")
        if (type == "related" && pid) {
          var ogAttr = tk.Groupings.opener;
          var openerGroup = parent.getAttribute(ogAttr);
          if (openerGroup) {
            tab.setAttribute(ogAttr, openerGroup);
          }
          else {
            openerGroup = ":oG-" + pid;
            parent.setAttribute(ogAttr, openerGroup);
            tab.setAttribute(ogAttr, openerGroup);
          }
        }

        var tabNeedsPlacing = !should_keep_added_tab_position_from_params_or_global;

        if (tk.autoGroupNewTabs) {
          if (!tabNeedsPlacing
            && tab.previousSibling
            && tab.nextSibling
            && tab.previousSibling.getAttribute("groupid")
            && tab.previousSibling.getAttribute("groupid") == tab.nextSibling.getAttribute("groupid"))
          {
            if (type === "unrelated") {
              tk.keepGroupsTogether();
            }
            else {
              var gid = tab.previousSibling.getAttribute("groupid");
              tk.setGID(tab, gid);
              tab.setAttribute("outoforder", "true");
            }
          }
          else if (tk.activeGrouping == "opener") {
            if (type == "related" && pid) {
              var pgid = parent.getAttribute("groupid");
              // If tabNeedsPlacing or is already in place
              if (tabNeedsPlacing
                || (pgid ? ((tab.previousSibling && tab.previousSibling.getAttribute("groupid") == pgid)
                      || (tab.nextSibling && tab.nextSibling.getAttribute("groupid") == pgid))
                     : ((tab.previousSibling && tab.previousSibling == parent)
                      || (tab.nextSibling && tab.nextSibling == parent))))
              {
                // Group tab
                var grouped = false;
                if (pgid) {
                  // TODO=P4: ??? allow forcing all groups to act as openergroups?
                  //if (pgid.indexOf(openerGroup) != -1 || pgid.indexOf(":tmpOG-") != -1) {
                  if (pgid.indexOf(":oG-") != -1 || pgid.indexOf(":tmpOG-") != -1) { // So :oG-bookmarkGroup- works as intended
                    tk.setGID(tab, pgid);
                    grouped = true;
                  }
                }
                else if (!pgid) {
                  if (tk.getGroupById(openerGroup).length != 0 || tk.getUngroupedTabsByAttr(ogAttr, openerGroup).length != 2) {
                    openerGroup = ":tmpOG-" + pid;
                  }
                  tk.setGID(parent, openerGroup);
                  tk.setGID(tab, openerGroup);
                  grouped = true;
                }

                // If we have permission to move the tab
                if (tabNeedsPlacing && grouped) {
                  // Position tab
                  var gid = parent.getAttribute("groupid");

                  var newPos = tk.newTabPosition;
                  var autoSortOpenerGroups = _prefs.getBoolPref("autoSortOpenerGroups");
                  if ((autoSortOpenerGroups && (tk.countGroups(gid) == 1 || tk.activeSort == "origin")) // We can't really autosort merged groups
                    || newPos == 1
                    || (newPos == 2 && tk.activeSort == "origin"))
                  { // Next to current
                    switch (tk.openRelativePosition) {
                    case "left":
                      tk.moveBefore(tab, parent);
                      break;
                    case "right":
                      tk.moveAfter(tab, parent);
                      break;
                    default: //case "rightOfRecent": case "rightOfConsecutive":
                      var target = parent;
                      while (target.nextSibling && target.nextSibling.getAttribute("groupid") == gid && target.nextSibling.hasAttribute("recentlyadded"))
                        target = target.nextSibling;
                      tk.moveAfter(tab, target);
                      tab.setAttribute("recentlyadded", "true");
                    }
                    tab.setAttribute("outoforder", "true");
                  }
                  else if (newPos == 0) { // At far right
                    var target = parent;
                    while (target.nextSibling && target.nextSibling.getAttribute("groupid") == gid)
                      target = target.nextSibling;
                    tk.moveAfter(tab, target);
                    tab.setAttribute("outoforder", "true");
                  }
                  else { // By last sort (newPos == 2)
                    tk.insertTab(tab, gid);
                  }

                  tabNeedsPlacing = false;
                }
              }
            }
          }
          else if (tk.activeGrouping == "domain") {
            var domain = tab.getAttribute(tk.Groupings.domain);
            if (domain) {
              var group = tk.getGroupById(domain);
              // If tabNeedsPlacing or is already in place
              if (tabNeedsPlacing
                || ((group.length > 0) ? ((tab.previousSibling && tab.previousSibling.getAttribute("groupid").indexOf(domain) != -1)
                              || (tab.nextSibling && tab.nextSibling.getAttribute("groupid").indexOf(domain) != -1))
                             : ((tab.previousSibling && tab.previousSibling.getAttribute(tk.Groupings.domain) == domain)
                              || (tab.nextSibling && tab.nextSibling.getAttribute(tk.Groupings.domain) == domain))))
              {
                // Group tab
                if (group.length == 0) {
                  group = tk.getUngroupedTabsByAttr(tk.Groupings.domain, domain);
                  if (group.length == 2) // TODO=P2: GCODE Replace this simplistic check with an attribute remembering whether tabs were explicitly ungrouped, or are happy to be made into a domain group
                    for (var i = 0; i < group.length; i++)
                      tk.setGID(group[i], domain);
                  else
                    group = [];
                }
                else {
                  domain = group[0].getAttribute("groupid");
                  tk.setGID(tab, domain);
                }
                // If we have permission to move the tab
                if (tabNeedsPlacing && group.length > 0) {
                  // Position tab
                  var autoSortDomainGroups = _prefs.getBoolPref("autoSortDomainGroups");
                  if (autoSortDomainGroups && tk.countGroups(domain) == 1) { // We can't really autosort merged groups
                    tk.insertTab(tab, domain, "uri");
                  }
                  else {
                    var newPos = tk.newTabPosition;
                    if (newPos == 2)
                      newPos = (tk.activeSort == "origin") ? 1 : (autoSortDomainGroups ? 0 : newPos);
                    if (newPos == 1 && (!pid || parent.getAttribute("groupid").indexOf(domain) == -1))
                      newPos = 0;
                    if (newPos == 1) { // Next to current
                      switch (tk.openRelativePosition) {
                      case "left":
                        tk.moveBefore(tab, parent);
                        break;
                      case "right":
                        tk.moveAfter(tab, parent);
                        break;
                      default: //case "rightOfRecent": case "rightOfConsecutive":
                        var target = parent;
                        while (target.nextSibling && target.nextSibling.getAttribute("groupid") == domain && target.nextSibling.hasAttribute("recentlyadded"))
                          target = target.nextSibling;
                        tk.moveAfter(tab, target);
                        tab.setAttribute("recentlyadded", "true");
                      }
                      tab.setAttribute("outoforder", "true");
                    }
                    else if (newPos == 0) { // At far right
                      var target = parent;
                      while (target.nextSibling && target.nextSibling.getAttribute("groupid") == gid)
                        target = target.nextSibling;
                      tk.moveAfter(tab, target);
                      tab.setAttribute("outoforder", "true");
                    }
                    else { // By last sort (newPos == 2)
                      tk.insertTab(tab, domain);
                    }
                  }

                  tabNeedsPlacing = false;
                }
              }
            }
          }
        }

        if (tabNeedsPlacing) {
          var newPos = tk.newTabPosition;
          if (newPos == 2 && tk.activeSort == "origin")
            newPos = 1;
          if (newPos == 1 && !pid)
            newPos = 0;
          switch (newPos) {
          case 1: // Next to current
            var target = parent;
            var pagid = parent.getAttribute("groupid");
            // First exit any groups
            if (tk.openRelativePosition == "left") {
              if (pagid)
                while (target.previousSibling && target.previousSibling.getAttribute("groupid") == pagid)
                  target = target.previousSibling;
              tk.moveBefore(tab, target);
            }
            else {
              if (pagid)
                while (target.nextSibling && target.nextSibling.getAttribute("groupid") == pagid)
                  target = target.nextSibling;
              while (tk.openRelativePosition != "right" && target.nextSibling && !target.nextSibling.hasAttribute("groupid") && target.nextSibling.hasAttribute("recentlyadded"))
                target = target.nextSibling;
              tk.moveAfter(tab, target);
              if (tk.openRelativePosition != "right")
                tab.setAttribute("recentlyadded", "true");
            }
            tab.setAttribute("outoforder", "true");
            break;
          case 2: // By last sort
            tk.insertTab(tab);
            break;
          default: //case 0: // At far right
            // No need to move it, since it is already in the right place
            tab.setAttribute("outoforder", "true");
          }
        }
      }
    }
    catch (ex) {
      tk.dump(ex);
    }
    finally {
      // Don't reset until counter ends
      if (tk.ignoreOvers > 0) {
        tk.ignoreOvers--;
      }
      else {
        // Reset
        tk.nextType = null;
        tk.isBookmarkGroup = false;
        tk.nextParent = null;
        tk.dontMoveNextTab = false;
      }
    }
  };

  this.addingTabs = function addingTabs(firstTab) {
    try {
      if (tk.nextType) { // Unlikely
        tk.ignoreOvers++;
        return;
      }

      if (firstTab) {
        tk.addedTabs = [firstTab];
        tk.nextType = "loadOneOrMoreURIs";
      }
      else {
        tk.nextType = "loadTabs";
        tk.nextParent = gBrowser.selectedTab; // To make addingTabOver happy!
      }
    }
    catch (ex) {
      tk.dump(ex);
    }
  };

  this.addingTabsOver = function addingTabsOver() {
    if (tk.ignoreOvers > 0) {
      tk.ignoreOvers--;
      return;
    }

    try {
      if (tk.addedTabs.length > 1) {
        // We always do loadOneOrMoreURIs, thanks to sortgroup_onTabAdded
        var firstTab = tk.addedTabs[0];
        var pid = firstTab.getAttribute("possibleparent");
        var openerGroup = firstTab.getAttribute(tk.Groupings.opener);
        var gid = firstTab.getAttribute("groupid");
        if (!openerGroup) {
          openerGroup = ":oG-bookmarkGroup-" + tk.getTabId(firstTab);
          firstTab.setAttribute(tk.Groupings.opener, openerGroup);
          if (tk.autoGroupNewTabs && !gid) {
            gid = openerGroup;
            tk.setGID(firstTab, gid);
          }
        }
        else if (tk.autoGroupNewTabs && !gid) {
          gid = ":oG-bookmarkGroup-" + tk.generateId(); // Pretend to be an openerGroup ;)
          tk.setGID(firstTab, gid);
        }
        for (var i = tk.addedTabs.length - 1; i >= 1; i--) {
          var tab = tk.addedTabs[i];
          tk.moveAfter(tab, firstTab); // n.b. this is sometimes redundant since loadTabs already moves the tabs if loadOneOrMoreURIs (from Fx2)
          if (tk.autoGroupNewTabs)
            tk.setGID(tab, gid);
          if (pid) {
            tab.setAttribute("possibleparent", pid);
            tk.updateIndents();
          }
          tab.setAttribute(tk.Groupings.opener, openerGroup);
          //tab.setAttribute("outoforder", "true"); // Hmm, this will generally be the case...
        }
      }

      for (var i = 0; i < _tabs.length; i++)
        _tabs[i].removeAttribute("recentlyadded");
      //tk.lastParent = null; // Irrelevant since we've already cleared recentlyadded...
    }
    catch (ex) {
      tk.dump(ex);
    }
    finally {
      tk.nextType = null;
      tk.isBookmarkGroup = false;
      tk.nextParent = null; // For good measure
      tk.dontMoveNextTab = false; // For good measure
      tk.addedTabs.length = 0; // Clear added tabs
    }
  };

  // A collection of stack signatures we use to classify tab sources (see the end of sortgroup_onTabAdded)
  // Note: This can't replace cases where an explicit parent tab must be set
  // TODO=P4: GCODE Use sourceTypes for more tab sources
  this.sourceTypes = [ // TODO=P3: TJS Store full stack signatures here (even if only the last element is used)
    { depth: 5, name: "goup_up",         type: "related" }, //postInitype: if ("goup_up" in window && window.goup_up) tk.wrapMethodCode('window.goup_up', 'tabkit.addingTab("related"); try {', '} finally { tabkit.addingTabOver(); }');
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
    { depth: 1, name: "sss_restoreWindow",   type: "sessionrestore", DontMoveTab: true }  //sss_restoreWindow, Firefox 14 or below
  ];
  this.sourceTypes.sort(function __compareSourceDepths(a, b) { return b.depth - a.depth; }); // Sort by decreasing d(epth)

  /// Event Handlers:
  this.sortgroup_onTabAdded = function sortgroup_onTabAdded(event) {
    var tab = event.target;

    var tid = tk.generateNewTabId(tab);

    // Set keys
    tab.setAttribute(tk.Sorts.lastViewed, new Date().setYear(2030)); // Set never viewed tabs as viewed in the future!
    tab.setAttribute(tk.Sorts.lastLoaded, new Date().setYear(2030)); // Set never loaded tabs as loaded in the future!
    tk.setTabUriKey(tab);

    // Sort/group
    if (tk.nextType) {
      tk.addedTabs.push(tab);
      // A quick hack to avoid code duplication: we use addingTabOver to position
      // the first tab, then we can treat the rest as a loadOneOrMoreURIs
      if (tk.nextType == "loadTabs" && tk.addedTabs.length == 1) {
        tk.nextType = tk.isBookmarkGroup ? "bookmark" : "newtab";
        tk.dontMoveNextTab = false;
        tk.addingTabOver({
          added_tab: tab,
          added_tab_type: tk.isBookmarkGroup ? "bookmark" : "newtab",
          should_keep_added_tab_position: false
        });
        tk.addedTabs = [tab];
        tk.nextType = "loadTabs"; // But it can now be treated as "loadOneOrMoreURIs";
      }
    }
    else if (!("fromInitSortingAndGrouping" in event)) {
      // Should be buggy if this statement is true
      if (!tk.nextType) {
        tk.debug("No nextType for added tab: " + tid);
        tk.nextType = "newtab";
      }

      tk.isBookmarkGroup = false;
      tk.addingTabOver({
        parent_tab: gBrowser.selectedTab,
        added_tab:  tab
      });
    }

  };

  this.sortgroup_onTabSelect = function sortgroup_onTabSelect(event) {
    var tab = event.target;
    tab.setAttribute(tk.Sorts.lastViewed, Date.now());

    // Arguably should only apply if select outside of the last parent's children
    if (tk.openRelativePosition == "rightOfRecent")
      for (var i = 0; i < _tabs.length; i++)
        _tabs[i].removeAttribute("recentlyadded");

    if (_prefs.getBoolPref("autoCollapse")) {
      // Auto-collapse inactive groups
      if (tab.hasAttribute("groupid"))
        tk.updateAutoCollapse();
      // Else leave the last used group uncollapsed, so you can drag tabs into it, etc.
    }
    else if (tab.hidden && tab.hasAttribute("groupcollapsed")) { // visibility of a tab
      // Auto-expand groups when a hidden tab is accessed (note that normal methods of switching tabs skip these)
      tk.toggleGroupCollapsed(tab);
    }
  };

  // TODO=P3: GCODE Call updateAutoCollapse on restore if selected before the groupid is restored
  this.updateAutoCollapse = function updateAutoCollapse(group) {
    if (!_prefs.getBoolPref("autoCollapse"))
      return;

    // Autocollapse inactive groups
    if (!group || !("length" in group)) {
      for each (var g in tk.getAllGroups())
        tk.updateAutoCollapse(g);
      return;
    }

    var gid = gBrowser.selectedTab.getAttribute("groupid");
    var fixIndents = tk.subtreesEnabled();
    var indent = _prefs.getIntPref("indentAmount");
    if (group[0].getAttribute("groupid") == gid) {
      for each (var t in group) {
        t.removeAttribute("groupcollapsed");
        tk.tabSetHidden(t, false); // visibility of a tab
        if (fixIndents && ("treeLevel" in t))
          t.style.setProperty("margin-left", (indent * t.treeLevel) + "px", "important");
      }
    }
    else {
      var visible = [];
      for each (var t in group) {
        if (!t.hidden) // visibility of a tab
          visible.push(t);
        if (fixIndents)
          t.style.marginLeft = "";
      }
      if (visible.length == 0) {
        group.sort(tk.compareTabViewedExceptUnread);
        tk.tabSetHidden(group[group.length - 1], false); // visibility of a tab
      }
      else if (visible.length > 1) {
        visible.sort(tk.compareTabViewedExceptUnread);

        //1. hide them all first
        for each (var t in visible)
          tk.tabSetHidden(t, true); // visibility of a tab

        //2. decide which to show: First tab in group or last viewed tab
        var firstTab = group[0];
        var targetTab = _prefs.getCharPref("collapsedGroupVisibleTab") == "selected" ? visible.pop() : firstTab;  //which tab to show? decision here

        //3. show it
        tk.tabSetHidden(targetTab, false); // visibility of a tab

      }
      for each (var t in group) {
        //The attribute application must at last to avoid being blocked by a fix for Issue 11
        t.setAttribute("groupcollapsed", true);
      }
    }
  };

  this.sortgroup_onTabLoading = function sortgroup_onTabLoading(event) {
    try {
      var index = gBrowser.getBrowserIndexForDocument(event.originalTarget);
      var tab = _tabs[index];

      var uriKey = tab.getAttribute(tk.Sorts.uri);
      var uriGroup = tab.getAttribute(tk.Groupings.domain);

      tk.setTabUriKey(tab);

      // Allow autogrouping tabs by domain when loading a page into an about:blank tab
      if (event.originalTarget.nodeName == "#document" // Ignore image loads (especially favicons!)
        && uriKey == "zzzzzzzzzzzzzzz/about/blank"   // Tab was blank...
        && uriKey != tab.getAttribute(tk.Sorts.uri)  // ...but now has a url
        && !tab.hasAttribute("groupid")
        && tk.autoGroupNewTabs
        && tk.activeGrouping == "domain")
      {
        var pid = tab.getAttribute("possibleparent");
        tk.nextType = pid ? "pageload" : "unrelated";
        tk.dontMoveNextTab = false;
        tk.nextParent = pid ? tk.getTabById(pid) : null;
        tk.isBookmarkGroup = false;
        tk.addedTabs = [tab];
        tk.addingTabOver();
      }
    }
    catch (ex) {
      // Maybe there was a frameset or something, in which case we didn't need to update stuff anyway...
    }
  };

  this.sortgroup_onTabLoaded = function sortgroup_onTabLoaded(event) {
    try {
      if (event.originalTarget.nodeName == "#document") { // Ignore image loads (especially favicons!)
        var index = gBrowser.getBrowserIndexForDocument(event.originalTarget);
        var tab = _tabs[index];
        tab.setAttribute(tk.Sorts.lastLoaded, Date.now());
      }
    }
    catch (ex) {
      // Maybe there was a frameset or something...
    }
  };

  var _sortgroup_onSSTabRestoring_timers = [];
  this.sortgroup_onSSTabRestoring = function sortgroup_onSSTabRestoring(event) {
    var tab = event.originalTarget;

    // Prevent restoring the lastViewedKey from overwriting the fact that the tab is currently being viewed
    if (tab.getAttribute("selected") == "true")
      tab.setAttribute(tk.Sorts.lastViewed, Date.now());

    // Deal with duplicated tabs
    if (arguments.callee.caller
      && arguments.callee.caller.caller
      && arguments.callee.caller.caller.caller
      && arguments.callee.caller.caller.caller.name == "sss_duplicateTab")
    {
      tk.generateNewTabId(tab); // Tab must have its own unique tabid
      tk.removeGID(tab); // Let duplicateTab's caller worry about groups
      return; // Don't call __sortgroup_onTabRestored (which might move the tab) - duplicating method must deal with this
    }

    // Delay __sortgroup_onTabRestored timers until sortgroup_onSSTabRestoring stops getting called
    for each (var lt in _sortgroup_onSSTabRestoring_timers) {
      window.clearTimeout(lt.timeout);
      lt.timeout = window.setTimeout(function(lt) {lt.listener();}, 100, lt);
    }

    // TODO=P4: GCODE Check tabs are restored correctly (and test groupcollapsed and hidden)
    // The timeout is because this might be the first tab of a group to be restored, and we'd rather not waste time marking it as a singleton then turning it back into a group (sss_restoreHistory calls itself with a timeout of 0 between each added tab)
    tab.groupNotChecked = true;
    var listener = (function __sortgroup_onTabRestored() {
      _sortgroup_onSSTabRestoring_timers.shift();

      var gid = tab.getAttribute("groupid");
      if (!gid) {
        gid = tab.getAttribute("singletonid");
        if (gid) {
          tk.setGID(tab, gid);
        }
      }
      if (gid) {
        var group = tk.getGroupById(gid, true); // True to include singletons

        if (group.length == 1) {
          tk.removeGID(tab, true);
        }
        else {
          // The group might be split up, and it may even be splitting up another group. Fix it!
          var last = null;
          var before = true;
          for each (var t in group) {
            if (t == tab) {
              if (last)
                break;
              before = false;
            }
            else if (!("groupNotChecked" in t)) {
              last = t;
              if (!before)
                break;
            }
          }
          if (last) {
            // Note: It might be better to properly merge it using insertTab (extend insertTab for origin to look for possibleparent and if not move to end, and take advantage of this in groupTabsBy too)
            if (last._tPos < tab._tPos) {
              var target = last;
              while (target.nextSibling
                   && target.nextSibling != tab
                   && target.nextSibling.getAttribute("groupid") == gid)
              {
                target = target.nextSibling;
              }
              if (target.nextSibling != tab)
                tk.moveAfter(tab, last);
            }
            else {
              // This bit is important! If we just move tab before last, then tab could be
              // wrongly moved after tabs in between, just because they happenned to get
              // restored later (e.g. if last was the selected tab so got restored first)
              var target = last;
              while (target.previousSibling
                   && target.previousSibling != tab
                   && target.previousSibling.getAttribute("groupid") == gid)
              {
                target = target.previousSibling;
              }
              if (target.previousSibling != tab)
                tk.moveBefore(tab, last);
            }

            if (last.hasAttribute("groupcollapsed")) {
              tab.setAttribute("groupcollapsed", "true");
              if (tab.getAttribute("selected") == "true") {
                for each (var t in group)
                  tk.tabSetHidden(t, true); // visibility of a tab
                tk.tabSetHidden(tab, false); // visibility of a tab
              }
              else {
                tk.tabSetHidden(tab, true); // visibility of a tab
              }
            }
            else {
              tk.tabSetHidden(tab, false); // visibility of a tab
            }
          }
          else {
            // This tab is where the group will congregate, so make sure it's not in the middle of a group!
            tk.keepGroupsTogether();

            //~ if (tab.hasAttribute("groupcollapsed")) {
              // It is the only "done" tab so far. // TODO=P4: TJS? If there is already a groupcollapsed but not hidden tab being restored show that instead.
              tk.tabSetHidden(tab, false); // visibility of a tab
            //~ }
            //~ else {
              //~ tk.tabSetHidden(tab, false); visibility of a tab
            //~ }
          }
        }
      }
      if (tab.hasAttribute("groupid")) {
        tk.colorizeTab(tab); // Maintain tab color
      }
      else if (tk.ignoreOvers == 0) {
        // See if this tab needs grouping (but don't move it!)
        tk.nextType = "unrelated";
        tk.nextParent = null;
        tk.dontMoveNextTab = true;
        tk.addedTabs = [tab];
        tk.addingTabOver();
      }
      tk.colorizeTab(tab); // Maintain tab color
      tk.updateIndents();

      delete tab.groupNotChecked;
    });
    _sortgroup_onSSTabRestoring_timers.push({listener:listener, timeout:window.setTimeout(function(listener) {listener();}, 100, listener)}); // TODO=P5: TJS Tweak timeout - lower values cause less jumping, but may slow down restoring an entire window
  };

  this.sortgroup_onTabMoved = function sortgroup_onTabMoved(event) {
    var tab = event.target;

    if (tab.hasAttribute("groupid"))
      tk.colorizeTab(tab); // Maintain/update tab color, as it gets lost after a move

    tk.keepGroupsTogether(); // TODO=P5: ??? Intelligently adjust groups on move into or out of group? (with timeout of course, so as not to duplicate my existing code for dragged tabs etc.)

    tk.updateIndents();

  };

  /* [Close Order]
   * 0 (auto):  Go right unless that would involve going down a level or leaving the group [right->left depending on tk.openRelativePosition]
   * 1 (g-left):  Go left unless that would involve leaving the group
   * 2 (g-right): Go right unless that would involve leaving the group
   * 3 (left):  Go left
   * 4 (right):   Go right
   */
  this.sortgroup_onTabRemoved = function sortgroup_onTabRemoved(event) {
    var tab = event.target;
    var gid = tab.getAttribute("groupid");
    var tid = tk.getTabId(tab);
    var pid = tab.getAttribute("possibleparent");

    // Choose next tab
    // Note that this happens before pickNextIndex/_blurTab is called by removeTab
    tk.chosenNextTab = tk.chooseNextTab(tab);

    // Update possibleparents
    for (var i = 0; i < _tabs.length; i++) {
      var t = _tabs[i];
      if (t.getAttribute("possibleparent") == tid)
        t.setAttribute("possibleparent", pid);
    }
    tk.updateIndents();

    // Ungroup singleton groups
    if (gid) {
      if (!tab.previousSibling || tab.previousSibling.getAttribute("groupid") != gid) {
        var next = tab.nextSibling;
        if (!next || next.getAttribute("groupid") != gid)
          tk.dump("Group was already a singleton?! (no next)");
        else if (!next.nextSibling || next.nextSibling.getAttribute("groupid") != gid)
          tk.removeGID(next, true);
      }
      else if (!tab.nextSibling || tab.nextSibling.getAttribute("groupid") != gid) {
        var prev = tab.previousSibling;
        if (!prev || prev.getAttribute("groupid") != gid)
          tk.dump("Group was already a singleton?! (no prev)");
        else if (!prev.previousSibling || prev.previousSibling.getAttribute("groupid") != gid)
          tk.removeGID(prev, true);
      }
    }

    if (tab.hasAttribute("groupcollapsed") && !tab.hidden) { // visibility of a tab
      // Make sure collapsed groups don't get totally hidden!
      window.setTimeout(function __uncollapseTab(gid, next, prev) {
        if (gBrowser.selectedTab.getAttribute("groupid") != gid) {
          if (next && next.getAttribute("groupid") == gid)
            tk.tabSetHidden(next, false); // visibility of a tab
          else if (prev && prev.getAttribute("groupid") == gid) // Almost always true
            tk.tabSetHidden(prev, false); // visibility of a tab
        }
      }, 0, gid, tab.nextSibling, tab.previousSibling);

    }

  };

  this.sortgroup_onTabMousedown = function sortgroup_onTabMousedown(event) {
    if (event.target.localName != "tab")
      return;

    if (event.target.hasAttribute("groupid")
      && event.target.hasAttribute("groupcollapsed")
      && event.originalTarget.className == "tab-icon-image"
      && event.button == 0
      && !event.ctrlKey && !event.shiftKey && !event.altKey)
    {
      tk.toggleGroupCollapsed(event.target);

      event.stopPropagation();
      event.preventDefault();
    }
  };

  this.sortgroup_onClickTab = function sortgroup_onClickTab(event) {
    if (event.target.localName != "tab")
      return;

    if (event.target.hasAttribute("groupid")
      && (event.button == 1 || event.button == 0 && event.originalTarget.getAttribute('anonid') === 'close-button')
      && !event.altKey
      && navigator.platform.indexOf("Mac") == -1 ? event.ctrlKey : event.metaKey)
    {
      if (event.shiftKey)
        tk.closeChildren(event.target);
      else
        tk.closeGroup(event.target);

      event.stopPropagation();
      event.preventDefault();
    }
  };
  this.sortgroup_onDblclickTab = function sortgroup_onDblclickTab(event) {
    var tab = event.target;
    if (tab.localName == "tab") {
      if (event.originalTarget.getAttribute('anonid') == 'close-button')
      {
        if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey
          && tabkit.TabBar.Mode.getIsVerticalMode()) {
          // The user expected to close two tabs by clicking on a close button,
          // then clicking on the close button of the tab below it (which will
          // by now have risen up by one), so do this.
          // Note: to avoid dataloss, we don't allow this when closing a group or subtree at a time
          // TODO=P3: GCODE Test on Linux (where close tab might happen on mousedown instead of mouseup?)
          gBrowser.removeTab(tab);
          event.stopPropagation();
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
          window.focus();
          var check = { value: false };
          var strings = document.getElementById("bundle_tabkit");
          _ps.alertCheck(
            window, //aParent
            strings.getString("tab_kit"), //aDialogTitle
            strings.getString("doubleclickcollapse_warning"), //aText
            strings.getString("doubleclickcollapse_dont_mention_again"), //aCheckMsg
            check //aCheckState
          );
          if (check.value)
            _prefs.setBoolPref("warnOnDoubleClickCollapse", false);
        }

        tk.toggleGroupCollapsed(tab);
        event.stopPropagation();
      }
    }
  };

  this.updateSortGroupMenu = function updateSortGroupMenu(event) {
    if (event.target != event.currentTarget) return;

    var popup = event.target;
    var contextTab = gBrowser.mContextTab ? gBrowser.mContextTab : gBrowser.selectedTab;

    // Set appropriate text for Mark As Read/Unread
    document.getElementById("menu_tabkit-tab-toggleUnread").setAttribute("label", document.getElementById("bundle_tabkit").getString(contextTab.hasAttribute("read") ? "mark_as_unread" : "mark_as_read"));

    // Only enable Make Group if contextTab isn't selectedTab
    document.getElementById("cmd_tabkit-sortgroup-tab-makeGroup").setAttribute("disabled", (contextTab == gBrowser.selectedTab));

    // Show/hide items that only apply to groups
    var isGroup = contextTab.hasAttribute("groupid");
    var groupsOnly = popup.getElementsByAttribute("groupsonly", "true");
    for (var i = groupsOnly.length - 1; i >= 0; i--) {
      groupsOnly[i].hidden = !isGroup;
    }
    var couldBeSubtree = (isGroup && tk.subtreesEnabled());
    document.getElementById("menu_tabkit-sortgroup-group-closeChildren").hidden = !couldBeSubtree;
    var isSubtree = (couldBeSubtree && tk.getSubtreeFromTab(contextTab).length > 1);
    document.getElementById("cmd_tabkit-sortgroup-group-closeChildren").setAttribute("disabled", !isSubtree);

    // Show Collapse or Expand as appropriate
    if (isGroup) {
      var groupCollapsed = contextTab.hasAttribute("groupcollapsed");
      document.getElementById("menu_tabkit-sortgroup-group-collapse").collapsed = groupCollapsed;
      document.getElementById("menu_tabkit-sortgroup-group-expand").collapsed = !groupCollapsed;
    }

    // Update radio buttons & checkboxes (esp. for new windows)
    switch (tk.newTabPosition == 2 ? tk.activeSort : "none") {
      case "uri": document.getElementById("menu_tabkit-sortgroup-sortByUri").setAttribute("checked", "true"); break;
      case "lastLoaded": document.getElementById("menu_tabkit-sortgroup-sortByLastLoaded").setAttribute("checked", "true"); break;
      case "lastViewed": document.getElementById("menu_tabkit-sortgroup-sortByLastViewed").setAttribute("checked", "true"); break;
      case "creation": document.getElementById("menu_tabkit-sortgroup-sortByCreation").setAttribute("checked", "true"); break;
      case "origin": document.getElementById("menu_tabkit-sortgroup-sortByOrigin").setAttribute("checked", "true"); break;
      case "title": document.getElementById("menu_tabkit-sortgroup-sortByTitle").setAttribute("checked", "true"); break;
      default: // Clear all radio buttons
        document.getElementById("menu_tabkit-sortgroup-sortByUri").removeAttribute("checked");
        document.getElementById("menu_tabkit-sortgroup-sortByLastLoaded").removeAttribute("checked");
        document.getElementById("menu_tabkit-sortgroup-sortByLastViewed").removeAttribute("checked");
        document.getElementById("menu_tabkit-sortgroup-sortByCreation").removeAttribute("checked");
        document.getElementById("menu_tabkit-sortgroup-sortByOrigin").removeAttribute("checked");
        document.getElementById("menu_tabkit-sortgroup-sortByTitle").removeAttribute("checked");
    }
    switch (tk.autoGroupNewTabs ? tk.activeGrouping : "none") {
    case "domain":
      document.getElementById("menu_tabkit-sortgroup-groupByDomain").setAttribute("checked", "true");
      document.getElementById("menu_tabkit-sortgroup-groupByOpener").removeAttribute("checked"); break;
    case "opener":
      document.getElementById("menu_tabkit-sortgroup-groupByOpener").setAttribute("checked", "true");
      document.getElementById("menu_tabkit-sortgroup-groupByDomain").removeAttribute("checked"); break;
    default: //case "none":
      document.getElementById("menu_tabkit-sortgroup-groupByDomain").removeAttribute("checked");
      document.getElementById("menu_tabkit-sortgroup-groupByOpener").removeAttribute("checked");
    }
    switch (tk.newTabPosition) {
      default: /*case 0:*/ document.getElementById("menu_tabkit-sortgroup-newtabs-farRight").setAttribute("checked", "true"); break;
      case 1: document.getElementById("menu_tabkit-sortgroup-newtabs-nextToCurrent").setAttribute("checked", "true"); break;
      case 2: document.getElementById("menu_tabkit-sortgroup-newtabs-lastSort").setAttribute("checked", "true");
    }
    if (tk.autoGroupNewTabs)
      document.getElementById("menu_tabkit-sortgroup-newtabs-autoGroup").setAttribute("checked", "true");
    else
      document.getElementById("menu_tabkit-sortgroup-newtabs-autoGroup").removeAttribute("checked");

    // TODO=P4: GCODE update text of menu_tabkit-sortgroup-newtabs-nextToCurrent depending on openRelativePosition
  };


  /// Helper functions and method hooks:
  var _keepGroupsTogether_timeoutID = -1;
  this.keepGroupsTogether = function keepGroupsTogether() {
    if (_keepGroupsTogether_timeoutID != -1) // Wait until this stops getting called
      window.clearTimeout(_keepGroupsTogether_timeoutID);
    _keepGroupsTogether_timeoutID = window.setTimeout(function () {
      // TODO=P4: GCODE Check for singletons too
      for each (var group in tk.getAllGroups())
        for (var i = group.length - 2; i >= 0; i--)
          if (group[i].nextSibling != group[i + 1])
            tk.moveBefore(group[i], group[i + 1]);
      _keepGroupsTogether_timeoutID = -1;
    }, 250); // TODO=P5: GCODE Tweak timeout - lower values cause less jumping, but may slow down restoring an entire window
  };


  // Tab close focus direction
  this.preInitBlurTabModifications = function preInitBlurTabModifications(event) {
    if ("_blurTab" in gBrowser) { // [Fx3.5b4+]
      tk.addMethodHook([//{
        "gBrowser._blurTab",

        'var tab = aTab;',
        'if (tabkit.chosenNextTab != null) { \
          tabkit.blurTab(aTab); \
          return; \
        } \
        $&' // When closing the last tab and browser.tabs.closeWindowWithLastTab is false, tk.chooseNextTab is called before the replacement tab is opened, so tk.blurTab returns null; the original _blurTab works fine in this case though
      ]);//}
    }
  };
  this.preInitListeners.push(this.preInitBlurTabModifications);

  this.chosenNextTab = null;
  this.pickNextIndex = function pickNextIndex(index, tabCount) { // [Fx3.1b3-]
    if (tk.chosenNextTab) {
      var pos = tk.chosenNextTab._tPos;
      tk.chosenNextTab = null;
      return pos > index ? pos - 1 : pos; // This is before _tPos gets updated
    }
    else {
      tk.dump("Hadn't chosen next tab!");
      return index == tabCount ? index - 1 : index;
    }
  };

  this.blurTab = function blurTab(tab) { // [Fx3.5b4+]
    if (tk.chosenNextTab) {
      gBrowser.selectedTab = tk.chosenNextTab;
      tk.chosenNextTab = null;
    }
    else {
      tk.debug("Hadn't chosen next tab!");
    }
  };

  this.chooseNextTab = function chooseNextTab(tab) {
    // Note that in Fx3.1b3- the tab still exists at this point, but won't by the time pickNextIndex is called
    var prev = tab.previousSibling;
    var next = tab.nextSibling;
    var gid = tab.getAttribute("groupid");

    // _removingTabs is [Fx3.5+ (not including 3.1b3)] (bug 462673)
    while (prev && "_removingTabs" in gBrowser && gBrowser._removingTabs.indexOf(prev) != -1)
      prev = prev.previousSibling;
    while (next && "_removingTabs" in gBrowser && gBrowser._removingTabs.indexOf(next) != -1)
      next = next.nextSibling;

    // Skip hidden tabs unless they're in the same group (or there's no alternative tab)
    var oldPrev = prev, oldNext = next;
    while (prev && (prev.hidden && prev.getAttribute("groupid") != gid // visibility of a tab
            || "_removingTabs" in gBrowser && gBrowser._removingTabs.indexOf(prev) != -1))
      prev = prev.previousSibling;
    while (next && (next.hidden && next.getAttribute("groupid") != gid // visibility of a tab
            || "_removingTabs" in gBrowser && gBrowser._removingTabs.indexOf(next) != -1))
      next = next.nextSibling;
    if (!prev && !next) {
      prev = oldPrev;
      next = oldNext;
    }

    if (!next)
      return prev; // returns null if !prev

    if (!prev)
      return next;

    switch (_prefs.getIntPref("customCloseOrder")) {
    case 1: // G-Left
      if (!gid || prev.getAttribute("groupid") == gid || next.getAttribute("groupid") != gid)
        return prev;
      else
        return next;
    case 2: // G-Right
      if (gid && next.getAttribute("groupid") != gid && prev.getAttribute("groupid") == gid)
        return prev;
      else
        return next;
    case 3: // Left
      return prev;
    case 4: // Right
      return next;
    default: //case 0: // Auto // TODO=P4: ??? Can I improve tree level in auto-sorted opener groups?
      var defaultTab = (tk.openRelativePosition == "left") ? prev : next;
      if (!gid)
        return defaultTab;
      if (next.getAttribute("groupid") != gid) {
        if (prev.getAttribute("groupid") != gid) {
          tk.log("Might have been a singleton group at position " + tab._tPos + " ?");
          return defaultTab;
        }
        else {
          return prev;
        }
      }
      if (prev.getAttribute("groupid") != gid) {
        return next;
      }
      if (gid.indexOf(":oG-") == -1 && gid.indexOf(":tmpOG-") == -1) {
        return defaultTab;
      }
      // The tab and siblings share an opener based group, so see if we can use possibleparents to choose close order
      var tid = tk.getTabId(tab);
      var pid = tab.getAttribute("possibleparent");
      var openerGroup = tab.getAttribute(tk.Groupings.opener);
      if (prev.getAttribute(tk.Groupings.opener) == openerGroup) {
        if (next.getAttribute(tk.Groupings.opener) != openerGroup) {
          return prev;
        }
        else {
          // Both siblings are in the same openerGroup, so choose based on possibleparents
          // (i.e. return to parent/sibling unless the default direction takes you to a sibling/child)
          if (defaultTab == next) {
            if (next.getAttribute("possibleparent") == pid // sibling
              || next.getAttribute("possibleparent") == tid) // child
            {
              return next;
            }
            else {
              return prev;
            }
          }
          else {
            if (prev.getAttribute("possibleparent") == pid // sibling
              || prev.getAttribute("possibleparent") == tid) // child
            {
              return prev;
            }
            else {
              return next;
            }
          }
        }
      }
      if (next.getAttribute(tk.Groupings.opener) == openerGroup) {
        return next;
      }
      return defaultTab;
    }
  };


  /// Methods Called From Menus:
  this.sortByUri = function sortByUri() {
    tk.sortTabsBy("uri");
  };
  this.sortByLastLoaded = function sortByLastLoaded() {
    tk.sortTabsBy("lastLoaded");
  };
  this.sortByLastViewed = function sortByLastViewed() {
    tk.sortTabsBy("lastViewed");
  };
  this.sortByCreation = function sortByCreation() {
    tk.sortTabsBy("creation");
  };
  this.sortByOrigin = function sortByOrigin() {
    tk.sortTabsBy("origin");
  };
  this.sortByTitle = function sortByTitle() {
    tk.sortTabsBy("title");
  };

  this.toggleGroupByDomain = function toggleGroupByDomain() {
    if (tk.autoGroupNewTabs && tk.activeGrouping == "domain")
      tk.activeGrouping = "none";
    else
      tk.groupTabsBy("domain");
  };
  this.toggleGroupByOpener = function toggleGroupByOpener() {
    if (tk.autoGroupNewTabs && tk.activeGrouping == "opener")
      tk.activeGrouping = "none";
    else
      tk.groupTabsBy("opener");
  };

  this.ungroupAll = function ungroupAll() {
    tk.activeGrouping = "none";
    for (var i = 0; i < _tabs.length; i++)
      tk.removeGID(_tabs[i]);
  };

  this.openOptions = function openOptions() {
    var dialog = _wm.getMostRecentWindow("mozilla:tabkitsettings");
    if (dialog) {
      dialog.focus();
      return;
    }
    try {
      var instantApply = gPrefService.getBoolPref("browser.preferences.instantApply");
    }
    catch (ex) {
      var instantApply = false;
    }
    openDialog("chrome://tabkit/content/settings.xul", "_blank", "chrome,titlebar,toolbar,centerscreen,"
           + (instantApply ? "dialog=no" : "modal"));
  };


  this.placeNewTabsAtFarRight = function placeNewTabsAtFarRight() {
    tk.newTabPosition = 0;
  };
  this.placeNewTabsNextToCurrent = function placeNewTabsNextToCurrent() {
    tk.newTabPosition = 1;
  };
  this.placeNewTabsByLastSort = function placeNewTabsByLastSort() {
    tk.newTabPosition = 2;
  };

  this.toggleAutoGroupNewTabs = function toggleAutoGroupNewTabs() {
    tk.autoGroupNewTabs = !tk.autoGroupNewTabs;
  };


  this.openNewTabHere = function openNewTabHere(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;
    tk.addingTab("related", contextTab);
    BrowserOpenTab({
      tab_kit_options: {
        added_tab_type: "related",
        parent_tab: contextTab
      }
    });
    var newTab = document.getAnonymousElementByAttribute(gBrowser, "linkedpanel", gBrowser.mPanelContainer.lastChild.id);
    tk.addingTabOver();
    var gid = contextTab.getAttribute("groupid");
    if (tk.openRelativePosition == "left") {
      if (gid && contextTab.previousSibling && contextTab.previousSibling.getAttribute("groupid") == gid) {
        tk.setGID(newTab, gid);
        newTab.setAttribute("outoforder", "true");
      }
      tk.moveBefore(newTab, contextTab);
    }
    else {
      if (gid && contextTab.nextSibling && contextTab.nextSibling.getAttribute("groupid") == gid) {
        tk.setGID(newTab, gid);
        newTab.setAttribute("outoforder", "true");
      }
      tk.moveAfter(newTab, contextTab);
    }
  };
  this.duplicateTab = function duplicateTab(contextTab) {
    if (!contextTab) {
      contextTab = gBrowser.selectedTab;
    }

    var newTab = tk._duplicateTab(contextTab);

    function runPostDuplicateTabOperations(new_tab, parent_tab) {
      tk.addingTabOver({
        added_tab_type: "related",
        added_tab:      new_tab,
        parent_tab:     parent_tab,
        should_keep_added_tab_position: false
      });

      var gid = tk.getTabGroupId(parent_tab);
      if (gid && gid !== tk.getTabGroupId(new_tab)) {
        tk.setGID(new_tab, gid);
        new_tab.setAttribute("outoforder", "true");
      }
      if (tk.openRelativePosition === "left") {
        tk.moveBefore(new_tab, parent_tab);
      }
      else {
        tk.moveAfter(new_tab, parent_tab);
      }
    }

    runPostDuplicateTabOperations(newTab, contextTab);

    // Backup attributes at this time, so we can restore them later if needed
    let tab_attributes_backup = tk.getTabAttributesForTabKit(newTab);

    // In FF 45.x (and later maybe)
    // The attributes are restored again asynchronizedly
    // So we need to restore the atttributes after that operation
    if (typeof TabStateFlusher === "object" &&
        "flush" in TabStateFlusher &&
        typeof TabStateFlusher.flush === "function") {

      let browser = contextTab.linkedBrowser;
      TabStateFlusher.flush(browser).then(() => {
        tk.setTabAttributesForTabKit(newTab, tab_attributes_backup);
      });
    }

    gBrowser.selectedTab = newTab;
  };
  this.makeGroup = function makeGroup(contextTab) {
    // TODO=P3: GCODE replace redundant .hidden calls
    if (!contextTab || contextTab == gBrowser.selectedTab)
      return;

    tk.makeGroupBetweenTwoTabs(contextTab, gBrowser.selectedTab);
  };
  // TODO=P4: N/A merge left/right & split group features?

  // Make tabs between two tab group together
  // If they are the same tab then do nothing
  this.makeGroupBetweenTwoTabs = function makeGroupBetweenTwoTabs(tabA, tabB) {
    if (!tabA || !tabB) {
      return;
    }
    if (tabA == tabB) {
      return;
    }

    var start = Math.min(tabA._tPos, tabB._tPos);
    var end = Math.max(tabA._tPos, tabB._tPos);

    var reallyRegroup = false;
    for (var i = start; i <= end; i++) {
      if (_tabs[i].hasAttribute("groupid")) {
        reallyRegroup = true;
        if (_prefs.getBoolPref("warnOnRegroup")) {
          var warnOnRegroup = { value: true };
          // Focus the window before prompting.
          // This will raise any minimized window, which will
          // make it obvious which window the prompt is for and will
          // solve the problem of windows "obscuring" the prompt.
          // See bug #350299 for more details
          window.focus();
          var strings = document.getElementById("bundle_tabkit");
          reallyRegroup = _ps.confirmCheck(
            window,
            strings.getString("tab_kit"),
            strings.getString("regroup_warning"),
            strings.getString("regroup_warning_prompt_me"),
            warnOnRegroup
          );
          // We don't set the pref unless they press OK and it's false
          if (!reallyRegroup)
            return;
          if (!warnOnRegroup.value)
            _prefs.setBoolPref("warnOnRegroup", false);
          break;
        }
      }
    }

    // Ungroup soon-to-be-singleton groups
    var first = _tabs[start];
    var firstGID = first.getAttribute("groupid");
    var firstPrev = first.previousSibling ? first.previousSibling.getAttribute("groupid") : "";
    var last = _tabs[end];
    var lastGID = last.getAttribute("groupid");
    var lastNext = last.nextSibling ? last.nextSibling.getAttribute("groupid") : "";
    if (firstGID != lastGID
      || firstPrev != firstGID
      || lastNext != lastGID)
    {
      if (firstGID
        && firstPrev == firstGID
        && (!first.previousSibling.previousSibling
          || first.previousSibling.previousSibling.getAttribute("groupid") != firstGID))
      {
        tk.removeGID(first.previousSibling, true);
      }
      if (lastGID
        && lastNext == lastGID
        && (!last.nextSibling.nextSibling
          || last.nextSibling.nextSibling.getAttribute("groupid") != lastGID))
      {
        tk.removeGID(last.nextSibling, true);
      }
    }

    // Group the new group
    var gid = ":oG-manualGroup-" + tk.generateId(); // Pretend this is an opener group!
    for (var i = start; i <= end; i++)
      tk.setGID(_tabs[i], gid);

    if (reallyRegroup)
      tk.keepGroupsTogether();
  };

  this.toggleUnread = function toggleUnread(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    if (contextTab.hasAttribute("read"))
      contextTab.removeAttribute("read");
    else
      contextTab.setAttribute("read", "true");
  };


  this.closeFromHereToCurrent = function closeFromHereToCurrent(contextTab) {
    if (!contextTab || contextTab == gBrowser.selectedTab)
      return;

    var start = Math.min(contextTab._tPos, gBrowser.selectedTab._tPos);
    var end = Math.max(contextTab._tPos, gBrowser.selectedTab._tPos);


    var tabsToClose = [];
    for (var i = start; i <= end; i++) {
      tabsToClose.push(gBrowser.tabs[i]);
    }
    for (var i = tabsToClose.length - 1; i >= 0; i--) {
      if (tabsToClose[i] === gBrowser.selectedTab) {
        continue;
      }
      gBrowser.removeTab(tabsToClose[i]);
    }
  };


  // TODO=P4: ??? Left click on already selected collapsed tab shows group as menu (with expand option obviously) - or maybe on right-click? (see auto-collapse/expanding)
  this.toggleGroupCollapsed = function toggleGroupCollapsed(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    var group = tk.getGroupFromTab(contextTab);
    if (!group) {
      tk.dump("toggleGroupCollapsed: Group was null for tab in pos " + contextTab._tPos);
      return;
    }

    if (contextTab.hasAttribute("groupcollapsed")) {
      for each (var tab in group) {
        tab.removeAttribute("groupcollapsed");
        tk.tabSetHidden(tab, false); // visibility of a tab
      }
    }
    else {
      var firstTab = group[0];
      var targetTab = _prefs.getCharPref("collapsedGroupVisibleTab") == "selected" ? contextTab : firstTab; //which tab to show? decision here

      for each (var tab in group) {
        tab.setAttribute("groupcollapsed", "true");
        if (tab != targetTab) {

          //select context tab if not selected (prevent not completely collepesed group)
          if (tab == gBrowser.selectedTab)
            gBrowser.selectedTab = targetTab;

          tk.tabSetHidden(tab, true); // visibility of a tab */
        }
      }


    }

    tk.updateIndents();

    if (gBrowser.selectedTab.hidden) // visibility of a tab
      gBrowser.selectedTab = contextTab;

    tk.updateMultiRowTabs();
  };
  // Cancel all the indent in a group
  // Read updateIndents to see how indent work
  this.flattenGroup = function flattenGroup(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    var group = tk.getGroupFromTab(contextTab);
    if (!group) {
      tk.dump("flattenGroup: Group was null for tab in pos " + contextTab._tPos);
      return;
    }

    for each (var tab in group) {
      tab.removeAttribute("possibleparent");
      tab.treeLevel = 0;
      tab.style.marginLeft = "";
    }
  };
  this.flattenSubGroup = function flattenSubGroup(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    var possibleparent = contextTab.getAttribute("possibleparent");

    var tabsToClose = tk.getSubtreeFromTab(contextTab);
    for (var i = tabsToClose.length - 1; i >= 0; i--) {
      var tab = tabsToClose[i];
      if (tab != contextTab) // No need to set parent for contentTab
        tab.setAttribute("possibleparent", possibleparent);
        tab.treeLevel = contextTab.treeLevel || 0;
        tab.style.marginLeft = contextTab.style.marginLeft || "";
    }
  };
  this.bookmarkGroup = function bookmarkGroup(contextTab) {
    // TODO=P3: GCODE Drag group/subtree onto bookmarks toolbar should create bookmark folder
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    var group = tk.getGroupFromTab(contextTab);
    if (!group) {
      tk.dump("bookmarkGroup: Group was null for tab in pos " + contextTab._tPos);
      return;
    }

    if ("showBookmarkDialog" in PlacesUIUtils) {
      // Based on PlacesCommandHook.bookmarkCurrentPages
      var aURIList = group.map(function __getUri(tab) {
          return tab.linkedBrowser.webNavigation.currentURI;
      });
      //Since Firefox removed the API
      //Got to do it ourselves (copied from old version of Firefox (showMinimalAddMultiBookmarkUI)
      //Comment: Why they remove the API?
      if (aURIList.length == 0)
        throw("bookmarkGroup expects a list of nsIURI objects");
      var info = {
        action: "add",
        type: "folder",
        hiddenRows: ["description"],
        URIList: aURIList
      };
      PlacesUIUtils.showBookmarkDialog(info, window.top, true);
    }
    else {
      tk.dump("showBookmarkDialog NOT in PlacesUIUtils.");
    }
  };
  this.reColorGroup = function reColorGroup(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    // Remove known color for the group and re color all tabs in group
    var tabGroupID = contextTab.getAttribute("groupid");
    if (!tabGroupID) {
      return;
    }
    var knownColorKey = "knownColor:" + tabGroupID;
    tk.deleteWindowValue(knownColorKey);

    tk.allocateColor(contextTab, true);


    for each (var tab in tk.getGroupFromTab(contextTab))
      tk.colorizeTab(tab);
  };
  this.reColorAllGroups = function reColorAllGroups(contextTab) {
    // Delete all known colors first, then regenerate again
    var groups = tk.getAllGroups();

    for (var gid in groups) {
      var knownColorKey = "knownColor:" + gid;
      tk.deleteWindowValue(knownColorKey);
    }

    for (var gid in groups) {
      for each (var tab in groups[gid]) {
        tk.colorizeTab(tab);
      }
    }
  };
  this.copyGroupURIs = function copyGroupURIs(contextTab) {
    // TODO=P3: GCODE Drag group/subtree onto bookmarks toolbar should create bookmark folder
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    var group = tk.getGroupFromTab(contextTab);
    if (!group) {
      tk.dump("copyGroupURIs: Group was null for tab in pos " + contextTab._tPos);
      return;
    }

    // Based on PlacesCommandHook.bookmarkCurrentPages
    var aURIList = group.map(function __getUri(tab) {
        return tab.linkedBrowser.webNavigation.currentURI;
    });

    if (aURIList.length == 0)
      throw("copyGroupURIs expects a list of nsIURI objects");

    urisStringToCopy = '';
    for each (var uri in aURIList) {
      urisStringToCopy = urisStringToCopy + uri.spec + '\n';
    }

    // Code from http://stackoverflow.com/questions/218462/in-a-firefox-extension-how-can-i-copy-rich-text-links-to-the-clipboard
    // Extract to a method if you need this somewhere else

    var transferable = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    var unicodeString = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    var clipboardId = Components.interfaces.nsIClipboard;
    var clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipboardId);

    unicodeString.data = urisStringToCopy;

    if ('init' in transferable) transferable.init(null); // Gecko 16

    transferable.addDataFlavor("text/unicode");
    transferable.setTransferData("text/unicode", unicodeString, urisStringToCopy.length * 2);

    clipboard.setData(transferable, null, clipboardId.kGlobalClipboard);
  };
  this.protectAllTabsForGroupOfTab = function protectAllTabsForGroupOfTab(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    var tabsInGroup = tk.getGroupFromTab(contextTab);
    for (var i = tabsInGroup.length - 1; i >= 0; i--) {
      tk.setTabProtected(tabsInGroup[i]);
    }
  };
  this.unprotectAllTabsForGroupOfTab = function unprotectAllTabsForGroupOfTab(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    var tabsInGroup = tk.getGroupFromTab(contextTab);
    for (var i = tabsInGroup.length - 1; i >= 0; i--) {
      tk.setTabUnprotected(tabsInGroup[i]);
    }
  };
  this.closeGroup = function closeGroup(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    var tabsToClose = tk.getGroupFromTab(contextTab);
    for (var i = tabsToClose.length - 1; i >= 0; i--) {
      gBrowser.removeTab(tabsToClose[i]);
    }
  };
  this.closeSubGroup = function closeSubGroup(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    tk.closeChildren(contextTab);
    gBrowser.removeTab(contextTab);
  };
  this.closeChildren = function closeChildren(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    var tabsToClose = tk.getSubtreeFromTab(contextTab);
    for (var i = tabsToClose.length - 1; i >= 0; i--) {
      if (tabsToClose[i] != contextTab) // Don't close parent
        gBrowser.removeTab(tabsToClose[i]);
    }
  };
  this.ungroupGroup = function ungroupGroup(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;

    for each (var tab in tk.getGroupFromTab(contextTab))
      tk.removeGID(tab);
  };


  /// Utility Methods:
  this.compareTabCreated = function compareTabCreated(a, b) {
    if (Number(a.getAttribute(tk.Sorts.creation)) < Number(b.getAttribute(tk.Sorts.creation)))
      return -1;
    if (Number(a.getAttribute(tk.Sorts.creation)) > Number(b.getAttribute(tk.Sorts.creation)))
      return 1;
    return 0;
  };
  this.compareTabViewed = function compareTabViewed(a, b) {
    return Number(a.getAttribute(tk.Sorts.lastViewed)) - Number(b.getAttribute(tk.Sorts.lastViewed));
  };
  this.compareTabViewedExceptUnread = function compareTabViewedExceptUnread(a, b) {
    var aV = Number(a.getAttribute(tk.Sorts.lastViewed));
    var bV = Number(b.getAttribute(tk.Sorts.lastViewed));
    if (Date.now() < aV && Date.now() >= bV)
      return -1;
    if (Date.now() >= aV && Date.now() < bV)
      return 1;
    return aV - bV;
  };

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
  this.setTabUriKey = function setTabUriKey(aTab, options) { // TODO=P3: GCODE Listen for back/forwards
    tk.debug(">>> setTabUriKey >>>");
    if (typeof options !== "object") {
      // So we don't need to check the type of `options` below
      options = {};
    }

    var uri = aTab.linkedBrowser.currentURI;

    let initial_uri = "initial_uri" in options ? options.initial_uri : null;
    if (initial_uri != null) {
      // `isBlankPageURL` is a utility function present in Fx 38.x & 45.x
      if (!uri || isBlankPageURL(uri.asciiSpec)) {
        // We can't just use _ios.newURI since sometimes initialURI can be things like google.com (without http:// or anything!)
        //
        // `mURIFixup` is a shortcut to some utility (I guess)
        // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#67
        // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#62
        //
        // `createFixupURI` is a `native` function for "fixing" URI
        // Declaration:
        // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/docshell/base/nsIURIFixup.idl#117
        // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/docshell/base/nsIURIFixup.idl#111
        // Flags:
        // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/docshell/base/nsIURIFixup.idl#74
        // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/docshell/base/nsIURIFixup.idl#74
        let mURIFixup = gBrowser.mURIFixup;
        uri = mURIFixup.createFixupURI(initial_uri, mURIFixup.FIXUP_FLAGS_MAKE_ALTERNATE_URI);
      }
    }
    if (!uri)
      uri = _ios.newURI("about:blank", null, null);

    if (isBlankPageURL(uri.asciiSpec)) {
      var uriKey = "zzzzzzzzzzzzzzz/about/blank"; // Sort blank tabs to end
      // uriGroup isn't needed in this case
    }
    else if (uri.asciiHost == "") {

      // I shall use about:config as an example

      var uriKey = uri.scheme + "/" + uri.path; // e.g. /about/config
      var uriGroup = uri.asciiSpec.replace(/^[^:]*\:\/*([^\/]+).*$/, "$1"); // e.g. config // this could probably be improved on
    }
    else {
      try { /*[Fx3only]*/
        var eTLDService = Cc["@mozilla.org/network/effective-tld-service;1"]
                  .getService(Ci.nsIEffectiveTLDService);

        // I shall use http://www.google.co.uk/webhp?hl=en&complete=1 as an example

        var baseDomain = eTLDService.getBaseDomain(uri); // e.g. google.co.uk
        var subDomain = uri.asciiHost.substring(0, uri.asciiHost.length - baseDomain.length); // e.g. www.

        var uriKey = baseDomain + subDomain.split(".").reverse().join(".") + "/" + uri.scheme + "/" + uri.path; // e.g. google.co.uk.www/http//webhp?hl=en&complete=1
        var uriGroup = baseDomain.substring(0, baseDomain.indexOf(".")); // e.g. google

        // TODO=P4: TJS Make sure we only fall back to the old code in Firefox 2
      }
      catch (ex) {
        if (uri.asciiSpec != "chrome://speeddial/content/speeddial.xul") // Don't bother logging this error on Fx2, as the Effective TLD Service doesn't exist
          tk.debug("Error using nsIEffectiveTLDService:\n"+ex);

        var parts = /^(.*\.)?(([^.]+)\.[^.]{2,8}\.(?:a[ru]|c[kory]|do|eg|fj|gu|i[dl]|k[hr]|lb|m[moty]|n[ipz]|p[aey]|sv|t[hr]|u[gky]|ve|yu|za))$|^(.*\.)?(([^.]+)\.[^.0-9]{2,})$|^(.*)$/i.exec(uri.asciiHost);
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
        var key = parts[2] ? (parts[1] ? parts[2] + parts[1].split(".").reverse().join(".")
                         : parts[2])
                   : parts[5] ? (parts[4] ? parts[5] + parts[4].split(".").reverse().join(".")
                              : parts[5])
                        : parts[7];
        /* // i.e.:
        var key;
        if (parts[2]) {
          if (parts[1]) {
            key = parts[2] + parts[1].split(".").reverse().join(".");
          }
          else {
            key = parts[2];
          }
        }
        else {
          if (parts[5]) {
            if (parts[4]) {
              key = parts[5] + parts[4].split(".").reverse().join(".");
            }
            else {
              key = parts[5];
            }
          }
          else {
            key = parts[7];
          }
        }
        */

        var uriKey = key + "/" + uri.scheme + "/" + uri.path;
        var uriGroup = parts[3] || parts[6] || parts[7] || uri.asciiSpec.replace(/^[^:]*\:\/*([^\/]+).*$/, "$1");
      }
    }

    aTab.setAttribute(tk.Sorts.uri, uriKey);

    if (uriKey == "zzzzzzzzzzzzzzz/about/blank")
      aTab.removeAttribute(tk.Groupings.domain); // Blank tabs should not get grouped together
    else
      aTab.setAttribute(tk.Groupings.domain, ":dG-" + uriGroup + ":"); // Just to prevent domains that are substrings of each other matching
  };

  this.preInitListeners.push(function() {
    (function() {
      // "use strict";

      if (typeof gBrowser.addTab !== "function") {
        tk.debug("gBrowser.addTab doesn't exists, replacing function failed");
        return;
      }

      var old_func = gBrowser.addTab;
      // Function signature should be valid for FF 38.x & 45.x
      gBrowser.addTab = function(aURI, aReferrerURI, aCharset, aPostData, aOwner, aAllowThirdPartyFixup) {
        // "use strict";
        var result = undefined;
        var initialURI = aURI;
        var tab = null;

        tk.debug(">>> gBrowser.addTab >>>");
        // `isBlankPageURL` is a utility function present in Fx 38.x & 45.x
        // `aURI == "about:customizing"` is a logic copied from `gBrowser.addTab` in Fx 38.x & 45.x
        // Which should mean some special tab
        // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#1810
        // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#1888
        if (aURI == null || isBlankPageURL(aURI) || aURI == "about:customizing") {
          // We don't need `initialURI` for a "blank" page
          initialURI = null;
        }
        result = old_func.apply(this, arguments);
        tab = result;
        if (tab != null) {
          tk.setTabUriKey(tab, {initial_uri: initialURI});
        }
        tk.debug("<<< gBrowser.addTab <<<");

        return result;
      };
    })();
  });

  var _seed = 0; // Used to generate ids; TODO-P6: TJS sync across windows to completely avoid duplicates
  this.generateId = function generateId() {
    return String(Date.now()) + "-" + String(++_seed);
  };

  this.getTabById = function getTabById(tid) {
    for (var i = 0; i < _tabs.length; i++) {
      var tab = _tabs[i];
      if (tk.getTabId(tab) == tid)
        return tab;
    }
    tk.debug("Tab id not found: " + tid + "\n" + tk.quickStack());
    return null;
  };

  this.countGroups = function countGroups(gid) {
    var match = gid.match(/\|/g);
    return match ? match.length + 1 : 1;
  };

  this.getUngroupedTabsByAttr = function getUngroupedTabsByAttr(attr, value) {
    var tabs = [];
    for (var i = 0; i < _tabs.length; i++) {
      var t = _tabs[i];
      if (!t.hasAttribute("groupid") && (value ? t.getAttribute(attr) == value : t.hasAttribute(attr)))
        tabs.push(t);
    }
    return tabs;
  };

  this.getGroupById = function getGroupById(gid,  lookForSingletons) {
    // To find the group for a new tab
    var group = [];
    for (var i = 0; i < _tabs.length; i++) {
      var t = _tabs[i];
      if (t.getAttribute("groupid").indexOf(gid) != -1) {
        group.push(t);
      }
      else if (lookForSingletons && t.getAttribute("singletonid").indexOf(gid) != -1) {
        tk.setGID(t, gid);
        group.push(t);
        //lookForSingletons = false; // Possible optimisation
      }
    }
    return group;
  };

  /**
   * Returns the tab group containing tab, as an array of
   * tabs, or null if the tab is not part of a group.
   *
   * FROZEN since 0.4.3 - this method will not be changed.
   */
  this.getGroupFromTab = function getGroupFromTab(tab) {
    // To get an existing grouped tab's group
    var gid = tab.getAttribute("groupid");
    if (!gid) {
      tk.debug("getGroupFromTab called on an ungrouped tab (_tPos=" + tab._tPos + "); returning null\n" + tk.quickStack());
      return null;
    }

    /*
    var group = [];
    for (var i = 0; i < _tabs.length; i++) {
      var t = _tabs[i];
      if (t.getAttribute("groupid") == gid)
        group.push(t);
    }
    */
    // We use previous/nextSibling as an optimization, but *also*
    // because it must work across browser windows for onDrop
    var group = [ tab ];
    var cur;
    while ((cur = group[group.length-1].previousSibling) && cur.getAttribute("groupid") == gid) {
      group.push(cur);
    }
    group.reverse(); // Probably mildly faster than unshifting them in the first place
    while ((cur = group[group.length-1].nextSibling) && cur.getAttribute("groupid") == gid) {
      group.push(cur);
    }

    if (group.length <= 1)
      tk.dump("getGroupFromTab found a singleton group (_tPos=" + tab._tPos + "); returning [tab]\n" + tk.quickStack());
    return group;
  };

  this.getAllGroups = function getAllGroups() {
    var groups = {};
    for (var i = 0; i < _tabs.length; i++) {
      var t = _tabs[i];
      var gid = t.getAttribute("groupid");
      if (!gid)
        continue;
      if (gid in groups)
        groups[gid].push(t);
      else
        groups[gid] = [t];
    }
    return groups;
  };

  this.setGID = function setGID(tab, gid) {
    if (!gid) {
      tk.dump("setGID: Bad groupid \"" + gid + "\"");
      return;
    }

    tk.removeCollapsedTab(tab);

    for (var i = 0; i < _tabs.length; i++) {
      var t = _tabs[i];
      if (t.getAttribute("groupid") == gid) {
        if (t.hasAttribute("groupcollapsed")) {
          tab.setAttribute("groupcollapsed", "true");
          for each (var st in tk.getGroupById(gid)) {
            if (!st.hidden) { // visibility of a tab
              if (st.getAttribute("selected") == "true") {
                tk.tabSetHidden(tab, true); // visibility of a tab
              }
              else {
                tk.tabSetHidden(st, true); // visibility of a tab
              }
              break;
            }
          }
          // Note that if no tab is currently visible(!), then the tab we're adding will be correctly kept visible
        }
        break;
      }
    }

    tab.removeAttribute("singletonid");
    tab.setAttribute("groupid", gid);
    tk.colorizeTab(tab);
    tk.updateIndents();
  };

  this.removeGID = function removeGID(tab,  becauseSingleton) {
    tk.removeCollapsedTab(tab);

    if (becauseSingleton)
      tab.setAttribute("singletonid", tab.getAttribute("groupid"));
    else
      tab.removeAttribute("singletonid");
    tab.removeAttribute("groupid");
    tk.colorizeTab(tab);
    tk.updateIndents();
  };

  this.removeCollapsedTab = function removeCollapsedTab(tab) {
    if (tab.hasAttribute("groupcollapsed")) {
      tab.removeAttribute("groupcollapsed");

      var tgid = tab.getAttribute("groupid");
      if (tgid) { // Should always be true
        var oldGroup = [];
        for (var i = 0; i < _tabs.length; i++) {
          var t = _tabs[i];
          if (t !== tab && t.getAttribute("groupid") == tgid)
            oldGroup.push(t);
        }
        if (oldGroup.length > 0)
          tk.ensureCollapsedGroupVisible(oldGroup);
      }
    }
    tk.tabSetHidden(tab, false);   // visibility of a tab
  };

  this.ensureCollapsedGroupVisible = function ensureCollapsedGroupVisible(group) {
    // TODO=P3: GCODE Optimize ensureCollapsedGroupVisible with a timeout and Set of gids to avoid processing groups repeatedly [O(n^2) time]
    for each (var t in group)
      if (!t.hidden) // visibility of a tab
        return;
    var mostRecent = group[0];
    for (var i = 1; i < group.length; i++)
      if (tk.compareTabViewedExceptUnread(group[i], mostRecent) > 0)
        mostRecent = group[i];
    tk.tabSetHidden(mostRecent, false); // visibility of a tab
  };

  this.subtreesEnabled = function subtreesEnabled() {
    return (tk.TabBar.Mode.getIsVerticalMode()
        && _prefs.getBoolPref("indentedTree"));
  };

  this.getSubtreeFromTab = function getSubtreeFromTab(tab) {
    if (!tk.subtreesEnabled())
      return [ tab ];

    var group = tk.getGroupFromTab(tab);
    if (!group)
      return [ tab ];
    var gid = tab.getAttribute("groupid");
    tk.updateIndents(group);
    var tabs = [ tab ];
    for (var t = tab.nextSibling; t && t.treeLevel && t.treeLevel > tab.treeLevel && t.getAttribute("groupid") == gid; t = t.nextSibling)
      tabs.push(t);
    return tabs;
  };

  var _lastUpdateIndents = 0;
  var _updateIndentsRequested = false;
  // Incidentally this should work across browser windows so getSubtreeFromTab works for onDrop
  this.updateIndents = function updateIndents(group) {
    var subtreesEnabled = tk.subtreesEnabled();

    if (!group) {
      if (!subtreesEnabled)
        return;

      if (!_updateIndentsRequested) {
        // Limit this to once every 150ms
        var timeSinceLastUpdate = Date.now() - _lastUpdateIndents;
        if (timeSinceLastUpdate >= 150) {
          for (var i = 0; i < _tabs.length; i++)
            _tabs[i].style.marginLeft = "";
          for each (var g in tk.getAllGroups())
            tk.updateIndents(g);
          _lastUpdateIndents = Date.now();
        }
        else {
          _updateIndentsRequested = true;
          window.setTimeout(function __updateAllIndents() {
            _updateIndentsRequested = false;
            tk.updateIndents();
          }, 150 - timeSinceLastUpdate);
        }
      }
      return;
    }

    if (!group.length) {
      tk.debug("updateIndents called for zero length group: " + uneval(group) + "\n" + tk.quickStack());
      return;
    }

    var groupcollapsed = group[0].hasAttribute("groupcollapsed");
    if (groupcollapsed) {
      for each (var t in group) {
        t.style.marginLeft = "";
      }
    }

    var stack = [];
    var maxlevel = _prefs.getIntPref("maxTreeLevel");
    var indent = _prefs.getIntPref("indentAmount");
    for each (var tab in group) {
      var pp = tab.getAttribute("possibleparent");
      if (pp) {
        for (var i = stack.length - 1; i >= 0; i--) {
          if (stack[i] == pp) {
            stack.push(tk.getTabId(tab));
            tab.treeLevel = Math.min(i + 1, maxlevel); // For external use, e.g. dragging subtrees
            if (!groupcollapsed && subtreesEnabled) {
              tab.style.setProperty("margin-left", (indent * tab.treeLevel) + "px", "important");
            }
            break;
          }
          stack.pop();
        }
        if (i >= 0)
          continue;
      }
      tab.treeLevel = 0;
      tab.style.marginLeft = "";
      stack = [ tk.getTabId(tab) ];
    }
  };
  this.toggleIndentedTree = function toggleIndentedTree() {
    if (tk.TabBar.Mode.getIsVerticalMode() && _prefs.getBoolPref("indentedTree"))
      tk.updateIndents();
    else
      for (var i = 0; i < _tabs.length; i++)
        _tabs[i].style.marginLeft = "";
  };

  this.detectTheme = function detectTheme() {
    var forceThemeCompatibility = _prefs.getIntPref("forceThemeCompatibility"); // 0: Never, 1: Auto, 2: Always
    var darkTheme;

    // Auto mode forces compatibility unless the theme has been tested
    var theme = gPrefService.getCharPref("general.skins.selectedSkin");
    const goodThemes = { // Themes that work well
      // TODO=P4: GCODE Keep testing themes...
      "classic/1.0"   : { platform: /Win32/ }, // Default Windows theme ("Strata" in Fx3, "Firefox (default)" in Fx2)
      "abstractPCNightly": {},       // Abstract Classic
      "abstract_zune" : { dark: true }, // Abstract Zune     (n.b. current tab has solid black bg that hides groups)
      "aero_fox"     : { dark: true }, // Aero Fox        (n.b. current tab has solid black bg that hides groups)
      "aero_silver_fox"  : {},       // Aero Silver Fox Basic
      "aquatint_gloss"   : { dark: true }, // Aquatint Black Gloss  (n.b. current tab has solid black bg that hides groups)
      "aquatintII"     : {},       // Aquatint Redone
      "AzertyIII"   : {},      // Azerty III
      "blackx"       : {},       // BlackX 2
      "cfoxmodern"     : {},       // CrystalFox Modern
      "kempelton"   : {},      // Kempelton
      "MacOSX"       : {},       // MacOSX Theme - https://addons.mozilla.org/en-US/firefox/addon/7172
      "pitchdark"   : {},      // PitchDark
      "phoenityreborn"   : {},       // Phoenity Reborn
      "qute"       : {},       // Qute
      "vistaxp"     : {},      // Vista on XP
      "xpvista"     : {}        // XP on Vista
    };
    const badThemes = { // Themes with solid tab backgrounds, a -moz-appearance, or other problems
      /* Anything not listed above is assumed to be a 'bad' theme, so it's only really
       * useful to list the dark ones, though Tango is obviously worth mentioning */
    //  "classic/1.0"   : { platform: /Linux/ }, // Default Linux theme ("Tango" in Fx3)
      "nasanightlaunch"  : { dark: true },    // NASA Night Launch - https://addons.mozilla.org/en-US/firefox/addon/4908
      "NG_Classic"     : { dark: true }    // Newgrounds Classic
    };
    if (theme in goodThemes && (!("platform" in goodThemes[theme]) || goodThemes[theme].platform.test(navigator.platform))) {
      if (forceThemeCompatibility == 1)
        forceThemeCompatibility = 0;
      darkTheme = ("dark" in goodThemes[theme]);
    }
    else {
      if (forceThemeCompatibility == 1)
        forceThemeCompatibility = 2;
      darkTheme = (theme in badThemes) ? ("dark" in badThemes[theme]) : false;
    }
    if (forceThemeCompatibility > 0)
      gBrowser.tabContainer.setAttribute("tk-forcethemecompatibility", "true");
    else
      gBrowser.tabContainer.removeAttribute("tk-forcethemecompatibility");

    if (darkTheme)
      gBrowser.tabContainer.setAttribute("tk-darktheme", "true");
    else
      gBrowser.tabContainer.removeAttribute("tk-darktheme");

    // Clear up old colorizeTab results and re-run colorizeTab for each tab
    if (_prefs.getBoolPref("colorTabNotLabel")) {
      for (var i = 0; i < gBrowser.tabs.length; i++) {
        var tab = gBrowser.tabs[i];
        tk.colorizeTab(tab);
      }
    }
    else {
      for (var i = 0; i < gBrowser.tabs.length; i++) {
        var tab = gBrowser.tabs[i];
        tk.colorizeTab(tab);
      }
    }
  };

  this.regenSaturationLightness = function regenSaturationLightness() {
    // Used to reset each group's saturation and lightness when the prefs are changed
    // TODO=P4: GCODE Make this deal with restored old groups too (perhaps require that the hsl values are within the right ranges, otherwise regen them)
    var groups = tk.getAllGroups();
    for (var gid in groups) {
      try {
        var hue = /hsl\((\d+),/.exec(tk.getWindowValue("knownColor:" + gid))[1];
        var sat = tk.randInt(_prefs.getIntPref("minSaturation"), _prefs.getIntPref("maxSaturation"));
        var lum = tk.randInt(_prefs.getIntPref("minLightness"), _prefs.getIntPref("maxLightness"));
        tk.setWindowValue("knownColor:" + gid, "hsl(" + hue + ", " + sat + "%, " + lum + "%)");
        for each (var tab in groups[gid]) {
          tk.colorizeTab(tab);
        }
      }
      catch (ex) { // Shouldn't happen
        tk.dump(ex);
      }
    }
  };

  this.allocateColor = function allocateColor(tab, ignoreSurroundingGroups) {
    if (ignoreSurroundingGroups == null) {
      ignoreSurroundingGroups = false
    }

    var tabGroupID = tab.getAttribute("groupid");
    if (!tabGroupID) {
      return "";
    }

    var knownColorKey = "knownColor:" + tabGroupID;

    if (tk.getWindowValue(knownColorKey)) {
      return tk.getWindowValue(knownColorKey);
    }

    // Find neighbouring gids
    var gids = [];
    var gidDist = {};
    // Get up to three gids before tab
    for (var i = tab._tPos - 1, n = 0; i >= 0 && n < 3; i--) {
      var gid = _tabs[i].getAttribute("groupid");
      if (gid && gids.indexOf(gid) == -1 && tk.getWindowValue("knownColor:" + gid)) {
        gids.push(gid);
        gidDist[gid] = n;
        n++;
      }
    }
    // Get up to three gids after tab
    for (var i = tab._tPos + 1, n = 0; i < _tabs.length && n < 3; i++) {
      var gid = _tabs[i].getAttribute("groupid");
      if (gid && gids.indexOf(gid) == -1 && tk.getWindowValue("knownColor:" + gid)) {
        gids.push(gid);
        gidDist[gid] = n;
        n++;
      }
    }

    // If there are no surrounding groups, just generate a new color
    if (gids.length < 1 || ignoreSurroundingGroups) {
      // TODO=P4: GCODE Should I give domain groups a consistent color even if it might be the same as nearby groups?
      var hue = Math.floor(Math.random() * 360);
    }
    else {
      // Convert gids into colors
      var hues = [];
      var hueDistance = {};
      for each (var gid in gids) {
        var match = /\d+/.exec(tk.getWindowValue("knownColor:" + gid)); // Find first number
        var hue = Number(match[0]);
        hues.push(hue);
        switch (gidDist[gid]) {
          case 0: hueDistance[hue] = 60; break; // Neighbouring groups should be at least 60 apart in hue
          case 1: hueDistance[hue] = 60; break; // Groups one group away from each other should also be 60 apart
          case 2: hueDistance[hue] = 45;    // Groups two groups away from each other should be 45 apart
        }
      };

      // Sort hues
      hues.sort(function __compareNumbers(a, b) {
        return a - b;
      });

      // Find greatest hue gap, or a random group with hues at least hueDistance[hue] away from other hues
      var chosenGapStart = hues[hues.length - 1];
      var chosenGapEnd = hues[0];
      var chosenGap = chosenGapEnd - chosenGapStart + 360 - hueDistance[chosenGapStart] - hueDistance[chosenGapEnd];
      var totalGap = chosenGap;

      for (var i = 1; i < hues.length; i++) {
        var gapStart = hues[i - 1];
        var gapEnd = hues[i];
        var gap = gapEnd - gapStart - hueDistance[gapStart] - hueDistance[gapEnd];
        if (totalGap <= 0) {
          // We haven't yet found a large enough gap, so always switch to this one if it's better
          if (gap > chosenGap) {
            chosenGapStart = gapStart;
            chosenGapEnd = gapEnd;
            totalGap = chosenGap = gap;
          }
        }
        else if (gap > 0) {
          // We already have a large enough gap, so decide at random whether to use this one instead,
          // such that the probability that a gap is picked is proportional to its size.
          totalGap += gap;
          if (Math.random() < gap / totalGap) {
            chosenGapStart = gapStart;
            chosenGapEnd = gapEnd;
            chosenGap = gap;
          }
        }
      }

      if (totalGap > 0) {
        // Pick a random hue from the gap
        chosenGapStart = (chosenGapStart + hueDistance[chosenGapStart]) % 360;
        var hue = (chosenGapStart + Math.floor(Math.random() * chosenGap)) % 360;
      }
      else {
        // Pick the hue in the middle of the entire gap
        chosenGap += hueDistance[chosenGapStart] + hueDistance[chosenGapEnd];
        var hue = Math.round(chosenGapStart + (chosenGap / 2)) % 360;
      }
    }

    var saturation = tk.randInt(_prefs.getIntPref("minSaturation"), _prefs.getIntPref("maxSaturation"));
    var lightness = tk.randInt(_prefs.getIntPref("minLightness"), _prefs.getIntPref("maxLightness"));

    // TODO=P3: GCODE Stop memory-leaking known colors (for the duration of a session)
    var resultColor = "hsl(@hue, @saturation%, @lightness%)".replace('@hue', hue).replace('@saturation', saturation).replace('@lightness', lightness);
    tk.setWindowValue(knownColorKey, resultColor);
    return resultColor;
  };

  // Give color to the tab
  //
  // @params [Object] tab The tab to give color to
  // @params [String] customColor Any custom color in format "hsl(@hue, @saturation%, @lightness%)"
  this.colorizeTab = function colorizeTab(tab) {
    try {
      var tabText = tab.ownerDocument.getAnonymousElementByAttribute(tab, "class", "tab-text tab-label");
      var node = tab;
      if (!_prefs.getBoolPref("colorTabNotLabel")) {
        node = tabText;
      }

      // Clear the style first anyway
      tab.style.removeProperty("background-image");
      tabText.style.removeProperty("background-image");

      //New option to disable coloring
      if (_prefs.getBoolPref("disableTabGroupColor")) {
        return;
      }

      var bgColor = tk.allocateColor(tab);

      //add by Pika, coloring for Fx4+
      if (bgColor != "") {
        bgColor = "-moz-linear-gradient(@HSL_Top, @HSL_Bottom)".replace("@HSL_Top",bgColor).replace("@HSL_Bottom",bgColor);
      }
      else {
        // bgColor = "-moz-linear-gradient(@HSL_Top,@HSL_Bottom)".replace("@HSL_Top","hsla(0, 0%, 100%,1)").replace("@HSL_Bottom","hsla(0, 0%, 100%,1)");
      }
      node.style.setProperty("background-image", bgColor, "important");
    }
    catch (ex) {
      tk.dump(ex);
    }
  };

  this.colorAllTabsMenuItem = function colorAllTabsMenuItem(tab, menuItem) {
    // TODO=P4: GCODE Fx3: Make All Tabs prettier (since we mess things up a little by setting -moz-appearance: none)
    try {
      var bgSample = tab;//new line by Pika, Fx2 related
      if (_prefs.getBoolPref("colorTabNotLabel")) {
        menuItem.style.backgroundImage = bgSample.style.backgroundImage;
      }
      else if ((gBrowser.tabContainer.hasAttribute("tabkit-highlight-unread-tab") && !tab.hasAttribute("read"))
           || (gBrowser.tabContainer.hasAttribute("tabkit-highlight-current-tab") && tab.getAttribute("selected") == "true"))
      {
        var bgStyle = window.getComputedStyle(bgSample, null);
        menuItem.style.backgroundImage = bgStyle.backgroundImage;
      }
      menuItem.style.MozAppearance = "none";
      window.setTimeout(function __colorAllTabsMenuText(tab, menuItem) {
        try {
          var menuText = document.getAnonymousElementByAttribute(menuItem, "class", "menu-iconic-text");
          menuText.style.fontStyle = tab.hasAttribute("read") ? "normal" : "italic";
          var fgStyle = window.getComputedStyle(document.getAnonymousElementByAttribute(tab, "class", "tab-text tab-label"), null);
          menuText.style.setProperty("background-color", fgStyle.backgroundColor, "important");
          menuText.style.setProperty("color", fgStyle.color, "important");
        }
        catch (ex) {
          tabkit.dump(ex);
        }
      }, 20, tab, menuItem);
    }
    catch (ex) {
      tabkit.dump(ex);
    }
  };

  this.colorAllTabsMenu = function colorAllTabsMenu(event) {
    if (!gBrowser.mCurrentTab.mCorrespondingMenuitem)
      return;
    for (var i = 0; i < _tabs.length; i++) {
      var tab = _tabs[i];
      if (tab.mCorrespondingMenuitem)
        tk.colorAllTabsMenuItem(tab, tab.mCorrespondingMenuitem);
    }
  };

  this.postInitAllTabsMenuColors = function postInitAllTabsMenuColors(event) {

    // gBrowser.tabContainer.mAllTabsPopup could be null
    if (_tabContainer.mAllTabsPopup) {
      _tabContainer.mAllTabsPopup.addEventListener("popupshowing", tk.colorAllTabsMenu, false);
    }

    _tabContainer.addEventListener("TabClose", tk.colorAllTabsMenu, false);
    _tabContainer.addEventListener("TabSelect", tk.colorAllTabsMenu, false);

    //Need to run at the first time or they will missed out
    tk.colorAllTabsMenu(event);
  };
  this.postInitListeners.push(this.postInitAllTabsMenuColors);

  /// Public Methods:
  this.groupTabsBy = function groupTabsBy(groupingName) {
    var groupingAttr = tk.Groupings[groupingName];
    var newGroups = {};
    for (var i = 0; i < _tabs.length; i++) {
      var t = _tabs[i];
      if (!t.hasAttribute("groupid")) {
        var gid = t.getAttribute(groupingAttr);
        if (gid != "") {
          var group = tk.getGroupById(gid);
          if (group.length > 0) {
            // TODO=P4: ??? move next to parent if it's in the group
            if (tk.newTabPosition == 2 && tk.activeSort != "origin"
              && (groupingName != "domain" || !_prefs.getBoolPref("autoSortDomainGroups")) // We're going to sort all the groups anyway
              && (groupingName != "opener" || !_prefs.getBoolPref("autoSortOpenerGroups"))) // We're going to sort all the groups anyway
            {
              tk.insertTab(t, gid);
            }
            else {
              tk.moveAfter(t, group[group.length - 1]);
            }
            tk.setGID(t, group[0].getAttribute("groupid"));
          }
          else {
            if (gid in newGroups)
              newGroups[gid].push(t);
            else
              newGroups[gid] = [t];
          }
        }
      }
    }

    for (var gid in newGroups) {
      var group = newGroups[gid];
      if (group.length > 1) {
        for each (var tab in group) {
          tk.setGID(tab, gid);
        }

        // Move all tabs to where the median positioned tab currently is // TODO=P4: TJS if tk.newTabPosition == 2 && tk.activeSort in tk.DateSorts move to most recent tab instead?
        var mi = group.length >> 1;
        var median = group[mi];
        for (var i = 0; i < mi; i++)
          tk.moveBefore(group[i], median);
        for (var i = group.length - 1; i > mi; i--)
          tk.moveAfter(group[i], median);
      }
    }

    // Sort all groupingName groups
    if (groupingName == "domain") {
      if (_prefs.getBoolPref("autoSortDomainGroups")) {
        var groups = tk.getAllGroups();
        for each (var gid in groups)
          if (gid.indexOf(":dG-") != -1)
            tk.sortTabsBy("uri", gid);
      }
    }
    else if (groupingName == "opener") {
      if (_prefs.getBoolPref("autoSortOpenerGroups")) {
        var groups = tk.getAllGroups();
        for (var gid in groups)
          if (gid.indexOf(":oG-") != -1 || gid.indexOf(":tmpOG-") != -1)
            tk.sortTabsBy("origin", gid);
      }
    }

    if (groupingName != tk.activeGrouping)
      tk.activeGrouping = groupingName;
  };

  // If gid is specified, assumes the group is already together (else it will be arbitrarily positioned)
  this.sortTabsBy = function sortTabsBy(sortName, gid) { // gid is optional
    if (!sortName in tk.Sorts) {
      tk.dump("sortTabsBy: Bad sortName: \"" + sortName + "\"");
      return;
    }

    var isReverse = (sortName in tk.ReverseSorts);
    var isNumeric = (sortName in tk.NumericSorts);
    //~ var isDate = (sortName in tk.DateSorts);
    var isOrigin = (sortName == "origin");

    if (isOrigin) {
      // We need to calculate a set of keys we can sort by
      if (gid) {
        var tabset = tk.getGroupById(gid);
      }
      else {
        var tabset = [];
        for (var i = 0; i < _tabs.length; i++)
          tabset.push(_tabs[i]);
      }
      tabset.sort(tk.compareTabCreated);
      var lastParent = null;
      var recentChildren = 0;
      for (var i = 1; i < tabset.length; i++) {
        var pp = tabset[i].getAttribute("possibleparent");
        if (pp) {
          for (var j = i - 1; j >= 0; j--) {
            if (tk.getTabId(tabset[j]) == pp) {
              if (tk.openRelativePosition == "left") {
                tabset.splice(j, 0, tabset.splice(i, 1)[0]); // Move i before j
              }
              else {
                if (tk.openRelativePosition != "right") { // rightOfRecent is treated as rightOfConsecutive, since we don't know about tab selections
                  if (lastParent === pp) {
                    j += recentChildren++;
                  }
                  else {
                    lastParent = pp;
                    recentChildren = 1;
                  }
                }
                tabset.splice(j + 1, 0, tabset.splice(i, 1)[0]); // Move i after j & recentChildren
              }
              break;
            }
          }
        }
      }
      for (var i = 0; i < tabset.length; i++) {
        tabset[i].key = i;
      }
    }
    else {
      var attr = tk.Sorts[sortName];
    }

    // Presort groups and calculate medians
    if (gid) {
      var groups = {};
      groups[gid] = tk.getGroupById(gid);
    }
    else {
      var groups = tk.getAllGroups();
    }
    for (var groupid in groups) {
      var g = groups[groupid];

      // We need grouped tabs to have keys whether or not we intend to internally sort them, so we can set the medians
      if (!gid && !isOrigin)
        for (var i = 0; i < g.length; i++)
          g[i].key = isNumeric ? Number(g[i].getAttribute(attr)) : g[i].getAttribute(attr).toLowerCase();

      if (gid
        || tk.countGroups(groupid) != 1
        || ((groupid.indexOf(":dG-") == -1 || !_prefs.getBoolPref("autoSortDomainGroups"))
          && ((groupid.indexOf(":oG-") == -1 && groupid.indexOf(":tmpOG-") == -1) || !_prefs.getBoolPref("autoSortOpenerGroups"))))
      {
        // Sort group (by insertion sort)
        for (var i = 1; i < g.length; i++) {
          var gi = g[i];

          var j;
          for (j = i - 1; j >= 0; j--) {
            if (isReverse ? g[j].key >= gi.key : g[j].key <= gi.key)
              break;
            g[j + 1] = g[j];
          }
          g[j + 1] = gi;

          gi.removeAttribute("outoforder");
        }
      }

      if (!gid) {
        // TODO=P4: ??? ignore outoforder tabs?
        if (sortName == "origin")
          var representative = (tk.openRelativePosition == "left") ? g.concat().sort(tk.compareTabCreated)[0].key : g[0].key;
        //~ else if (isDate) // TODO=P4: TJS Should I?
          //~ var representative = g[ g.length - 1 ].key
        else // Median
          var representative = g[ g.length >> 1 ].key;
        for (var k = 0; k < g.length; k++)
          g[k].key = representative;
      }
    }

    if (gid) {
      // Just rearrange the group tabs
      var group = groups[gid];
      var firstTab = group[0];
      for (var i = 1; i < group.length; i++)
        tk.moveAfter(group[i], firstTab);
    }
    else {
      // Sort all tabs/groups (by insertion sort)
      for (var i = 0; i < _tabs.length; i++) {
        var ti = _tabs[i];
        var tig = ti.getAttribute("groupid");
        if (!tig && !isOrigin)
          ti.key = isNumeric ? Number(ti.getAttribute(attr)) : ti.getAttribute(attr).toLowerCase();

        var j;
        for (j = i - 1; j >= 0; j--) {
          if (isReverse ? _tabs[j].key >= ti.key : _tabs[j].key <= ti.key)
            break;
        }

        if (!tig) {
          gBrowser.moveTabTo(ti, j + 1);
          ti.removeAttribute("outoforder");
        }
        else {
          var g = groups[tig];
          for (var k = 0; k < g.length; k++) {
            gBrowser.moveTabTo(g[k], j + k + 1);
            g[k].removeAttribute("outoforder");
          }
          i += g.length - 1;
        }
      }

      if (tk.activeSort != sortName)
        tk.activeSort = sortName;
    }
  };

  /* Usage:
    - tk.insertTab(tab); inserts a tab into _tabs by tk.activeSort (ASSUMES tk.newTabPosition == 2 && tk.activeSort != "origin")
    - tk.insertTab(tab, gid); inserts a tab into tk.getGroupById(gid) by tk.activeSort (ASSUMES tk.newTabPosition == 2 && tk.activeSort != "origin")
    - tk.insertTab(tab, gid, sortName); inserts a tab into tk.getGroupById(gid) using sortName (ASSUMES sortName != "origin") */
  this.insertTab = function insertTab(tab, gid, sortName) { // gid and grouping are optional
    if (gid) {
      var tabset = tk.getGroupById(gid);
    }
    else {
      var tabset = [];
      for (var i = 0; i < _tabs.length; i++)
        tabset.push(_tabs[i]);
    }
    var tabIndex = tabset.indexOf(tab);
    if (tabIndex != -1)
      tabset.splice(tabIndex, 1);
    if (tabset.length == 0) {
      tk.dump("insertTab: tabset is empty!");
      return;
    }

    if (!sortName)
      sortName = tk.activeSort;
    if (!sortName in tk.Sorts || sortName == "origin") {
      tk.dump("Cannot insert by \"" + sortName + "\"");
      return;
    }

    var isReverse = (sortName in tk.ReverseSorts);
    var isNumeric = (sortName in tk.NumericSorts);

    var attr = tk.Sorts[sortName];
    tab.key = isNumeric ? Number(tab.getAttribute(attr)) : tab.getAttribute(attr);

    var i = 0;
    while (i < tabset.length) {
      var ti = tabset[i];
      if (!ti.hasAttribute("outoforder") && (gid || !ti.hasAttribute("groupid"))) {
        ti.key = isNumeric ? Number(ti.getAttribute(attr)) : ti.getAttribute(attr);
        if (isReverse ? ti.key < tab.key : ti.key > tab.key)
          break;
      }
      i++;
    }
    if (i < tabset.length)
      tk.moveBefore(tab, tabset[i]);
    else
      tk.moveAfter(tab, tabset[tabset.length - 1]);
    tab.removeAttribute("outoforder"); // In case it was set
  };

  /// Method Hooks

  //TODO=P4: GCODE Show warning when tabs are skipped because their group is collapsed

  // Show all tab titles in tooltip - one per line - when hovering over a collapsed group (instead of just the visible tab)
  this.earlyMethodHooks.push([//{
    "gBrowser.createTooltip",

    'tab.getAttribute("label")',
    '(tab.hasAttribute("groupcollapsed") ? tabkit.getGroupFromTab(tab).map(function __getLabel(ctab) { \
        return ctab == tab ? "> " + ctab.label : " - " + ctab.label; \
      }).join("\\n") \
     : $&)'
  ]);//}

  /// Implement Bug 298571 - support tab duplication (using ctrl) on tab drag and drop
  this._duplicateTab = function _duplicateTab(aTab) {
    "use strict";

    if (typeof _ss !== "object" ||
        !("duplicateTab" in _ss) ||
        typeof _ss.duplicateTab !== "function") {
      return gBrowser.loadOneTab(gBrowser.getBrowserForTab(aTab).currentURI.spec); // [Fx3- since browser.sessionstore.enabled always on in 3.5+]
    }

    let newTab = _ss.duplicateTab(window, aTab);

    tk.generateNewTabId(newTab);
    tk.removeGID(newTab);

    return newTab;
  };

  this._onDrop = function _onDrop(event) { // [Fx4+]
    var dt = event.dataTransfer;
    var dropEffect = dt.dropEffect;
    // if (dropEffect == "link")
      // return gBrowser.old_onDrop(event);

    var targetTab = event.target.localName == "tab" ? event.target : null;
    if (!targetTab || targetTab.hasAttribute("pinned"))
      return;

    var draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
    if (!draggedTab || draggedTab == targetTab || draggedTab.hasAttribute("pinned"))
      return;

    this._tabDropIndicator.collapsed = true;

    var draggedGid = draggedTab.getAttribute("groupid");
    var dPrev = draggedTab.previousSibling;
    var dNext = draggedTab.nextSibling;

    var newIndex = tk._getDropIndex(event);
    var beforeTab = newIndex > 0 ? _tabs[newIndex - 1] : null;
    var afterTab = newIndex < _tabs.length ? _tabs[newIndex] : null;
    var bGid = beforeTab ? beforeTab.getAttribute("groupid") : null;
    var aGid = afterTab ? afterTab.getAttribute("groupid") : null;

    // To be called after everything is done
    // If we perform cleanup too early (like removing original tabs in case of dragging tab across window)
    // It affects the grouping of moved/copied tabs in new window
    var cleanupCallbacks = [];

    // Prevent accidentally dragging into a collapsed group
    if (aGid && aGid == bGid && afterTab.hasAttribute("groupcollapsed")) {
      for each (var t in tk.getGroupFromTab(afterTab)) {
        if (!t.hidden) { // visibility of a tab
          if (t._tPos < afterTab._tPos) {
            beforeTab = afterTab;
            while (beforeTab.nextSibling && beforeTab.nextSibling.getAttribute("groupid") == aGid)
              beforeTab = beforeTab.nextSibling;
            afterTab = beforeTab.nextSibling; // May be null
            newIndex = beforeTab._tPos + 1;
          }
          else {
            var afterTab = beforeTab;
            while (afterTab.previousSibling && afterTab.previousSibling.getAttribute("groupid") == bGid)
              afterTab = afterTab.previousSibling;
            beforeTab = afterTab.previousSibling; // May be null
            newIndex = afterTab._tPos;
          }

          bGid = beforeTab ? beforeTab.getAttribute("groupid") : null;
          aGid = afterTab ? afterTab.getAttribute("groupid") : null;

          // tk.chosenNewIndex will be set to newIndex before calling old_onDrop
          break;
        }
      }
    }

    // Determine if we're dealing with one tab or a group/subtree
    var tabs = [];
    var shiftDragSubtree = false;

    var tabIsCopied = (dropEffect == "copy");
    var tabIsFromAnotherWindow = (draggedTab.parentNode != gBrowser.tabContainer);

    if (draggedGid && (event.shiftKey && _prefs.getBoolPref("shiftDragGroups")
           || draggedTab.hasAttribute("groupcollapsed"))) {
      // User wants to drag a group/subtree

      shiftDragSubtree = _prefs.getBoolPref("shiftDragSubtrees")
                   && !draggedTab.hasAttribute("groupcollapsed")
                   && !tabIsFromAnotherWindow;

      if (shiftDragSubtree) {
        /* Note that tk.getSubtreeFromTab checks tk.subtreesEnabled,
         * which checks `tabkit.TabBar.Mode.getIsVerticalMode()` &&
         * _prefs.getBoolPref("indentedTree")*/
        tabs = tk.getSubtreeFromTab(draggedTab);
        if (tabs.length < 2)
          shiftDragSubtree = false;
      } else {
        tabs = tk.getGroupFromTab(draggedTab);
        // Calculate the treeLevels - we'll need these when copying
        // possibleparents (getSubtreeFromTab normally does this)
        tk.updateIndents(tabs);
      }
    }
    else {
      // User wants to drag a single tab
      tabs = [ draggedTab ];
    }

    var singleTab = (tabs.length == 1);
    // Move/copy the tab(s)
    var tabsReverse = tabs.slice(); // Copy
    tabsReverse.reverse(); // In-place reverse
    var newTabs = [];
    var tabIdMapping = {};
    for each (var tab in tabsReverse) {
      if (tabIsCopied || tabIsFromAnotherWindow) {
        // Tab was copied or from another window, so tab will be recreated instead of moved directly

        // Only allow beforeTab not afterTab because addingTabOver only indents newTab if it is after draggedTab (since addingTabOver just sets possibleparent to the source tab)
        let added_tab_type  = singleTab && draggedTab == beforeTab ? "related" : "unrelated";
        let parent_tab      = singleTab && draggedTab == beforeTab ? draggedTab : null;
        let should_keep_added_tab_position = true;

        tk.addingTab({
          added_tab_type: added_tab_type,
          parent_tab:     parent_tab,
          should_keep_added_tab_position: should_keep_added_tab_position
        });

        // tk.chosenNewIndex = newIndex;
        // event.tab = tab;
        // gBrowser.old_onDrop(event);
        var copiedTab = tk._duplicateTab(tab);
        gBrowser.moveTabTo(copiedTab, newIndex);

        newTabs.unshift(copiedTab);
        tk.addingTabOver({
          added_tab_type: added_tab_type,
          added_tab:      copiedTab,
          parent_tab:     parent_tab,
          should_keep_added_tab_position: should_keep_added_tab_position
        });

        // Backup attributes at this time, so we can restore them later if needed
        let tab_attributes_backup = tk.getTabAttributesForTabKit(newTab);

        // In FF 45.x (and later maybe)
        // The attributes are restored again asynchronizedly
        // So we need to restore the atttributes after that operation
        if (typeof TabStateFlusher === "object" &&
            "flush" in TabStateFlusher &&
            typeof TabStateFlusher.flush === "function") {

          let browser = contextTab.linkedBrowser;
          TabStateFlusher.flush(browser).then(() => {
            tk.setTabAttributesForTabKit(newTab, tab_attributes_backup);
          });
        }


        if (tabIsFromAnotherWindow && !tabIsCopied) {
          // Code copied from addon SDK
          var draggedTabWindow = draggedTab.ownerDocument.defaultView;

          if (draggedGid)
            cleanupCallbacks.push(function() {
              draggedTabWindow.tabkit.closeGroup(draggedTab);
            });
          else
            cleanupCallbacks.push(function() {
              draggedTabWindow.gBrowser.removeTab(draggedTab);
            });
        }

        if (singleTab && draggedTab == beforeTab) {
          return; // addingTabOver will already have grouped the tab etc, so skip ___onDropCallback
        }
      }
      else {
        // Tab will be moved directly

        // tk.chosenNewIndex = newIndex;
        if (tab._tPos < newIndex)
          newIndex--;
        // event.tab = tab;
        // gBrowser.old_onDrop(event);
        gBrowser.moveTabTo(tab, newIndex);

        newTabs.unshift(tab); // Although not strictly a new tab, this allows copy and move to reuse code later
      }

      newTabs[0].originalTreeLevel = singleTab ? 0 : tab.treeLevel; // Save the treeLevels
    }

    event.preventDefault();
    event.stopPropagation();

    if (tabIsCopied || tabIsFromAnotherWindow)
      gBrowser.selectedTab = newTabs[0]; // TODO=P3: TJS Is this necessary?

    window.setTimeout(function ___onDropCallback() { // TODO=P3: TJS Waiting may actually be unnecessary
      // This is now after the tabs have been restored

      if (tabIsCopied || tabIsFromAnotherWindow)
        for (var i = 0; i < newTabs.length; i++)
          // Map tabids of original tabs to tabids of their clones
          tabIdMapping[tk.getTabId(tabs[i])] = tk.getTabId(newTabs[i]);

      // Group/indent the new/moved tabs
      var newGid = null;
      var app = null;
      var draggedIntoGroup = (aGid && aGid == bGid);
      var draggedIntoSameGroup = (draggedGid && (aGid == draggedGid || bGid == draggedGid));

      if (draggedIntoGroup || draggedIntoSameGroup) {
        if (draggedIntoSameGroup)
          newGid = draggedGid; // We're in the same group we were before
        else // draggedIntoGroup is true
          newGid = aGid; // Copy enclosing groupid

        // Get possible parent tab's ID in same group
        if (aGid) {
          // Inherit enclosing indentation (possibleparent)
          app = afterTab.getAttribute("possibleparent");
          // But only if afterTab's possibleparent is in the same group as it
          var parent = tk.getTabById(app);
          if (!parent || parent.getAttribute("groupid") != aGid)
            app = null;
        }
      }
      else if (singleTab) {
        if (newTabs[0].hasAttribute("groupid"))
          tk.removeGID(newTabs[0]);
      }
      else if (tabIsCopied || tabIsFromAnotherWindow) {
        // Create a new groupid
        newGid = ":oG-copiedGroupOrSubtree-" + tk.generateId();
      }
      else {
        if (shiftDragSubtree)
          newGid = ":oG-draggedSubtree-" + tk.generateId(); // Maintain subtree by creating a new opener group // TODO=P5: GCODE No need if the subtree was the entire group
      }
      for (var i = 0; i < newTabs.length; i++) {
        var newTab = newTabs[i];

        // Apply newGid
        if (newGid) {
          tk.setGID(newTab, newGid);
          if (draggedIntoGroup)
            newTab.setAttribute("outoforder", "true");
        }

        // Apply app, or copy from original if appropriate
        if (app && newTab.originalTreeLevel <= newTabs[0].originalTreeLevel) {
          // TODO=P3: N/A For consistency, use a temporary parent attribute so it's reset by sorts etc.
          newTab.setAttribute("possibleparent", app);
        }
        else if ((tabIsCopied || tabIsFromAnotherWindow) && !singleTab) {
          var tpp = tabs[i].getAttribute("possibleparent");
          if (tpp in tabIdMapping)
            tpp = tabIdMapping[tpp];
          newTab.setAttribute("possibleparent", tpp);
          // n.b. duplicated [single] tabs have their possibleparent set to the original because of the tk.addingTab("related", ...) above
        }

        delete newTab.originalTreeLevel;
      }
      tk.updateIndents();

      // Make sure the old group isn't now a singleton
      if (singleTab) {
        if (draggedGid) {
          // TODO=P4: TJS Refactor out into a checkIfSingleton method
          if (dPrev && dPrev.getAttribute("groupid") == draggedGid
            && (!dPrev.previousSibling || dPrev.previousSibling.getAttribute("groupid") != draggedGid)
            && (!dPrev.nextSibling || dPrev.nextSibling.getAttribute("groupid") != draggedGid))
          {
            tk.removeGID(dPrev, true);
          }
          else if (dNext && dNext.getAttribute("groupid") == draggedGid
            && (!dNext.previousSibling || dNext.previousSibling.getAttribute("groupid") != draggedGid)
            && (!dNext.nextSibling || dNext.nextSibling.getAttribute("groupid") != draggedGid))
          {
            tk.removeGID(dNext, true);
          }
        }
      }
      else if (!(tabIsCopied || tabIsFromAnotherWindow)) {
        if (shiftDragSubtree) {
          // Make sure old group isn't now a singleton
          var group = tk.getGroupById(draggedGid);
          if (group.length == 1)
            tk.removeGID(group[0], true);
        }
      }
      /*else if (tabIsCopied || tabIsFromAnotherWindow) {
        if (shiftDragSubtree) {
          // No need to worry about this, as no tabs are moved (they only get removed, so the TabClose listener sorts this out)
      }*/

      for (var i = 0; i < cleanupCallbacks.length; i++) {
        var cleanupCallback = cleanupCallbacks[i];
        if (typeof cleanupCallback === "function")
          cleanupCallback();
      }

      cleanupCallbacks.length = 0;
    }, 200);
  };

  // this.chosenNewIndex = null;
  this.preInitTabDragModifications = function preInitTabDragModifications(event) {
    gBrowser.tabContainer.addEventListener("dragover", function(event) {//for drop indicator
      var ind = this._tabDropIndicator.parentNode;
      // if (!this.hasAttribute("multirow")) {
        // ind.style.position = "";
        // return;
      // }
      ind.style.position = "fixed";
      ind.style.zIndex = 100;

      var newIndex = tk._getDropIndex(event);
      var targetTab = this.childNodes[newIndex < this.childNodes.length ? newIndex : newIndex - 1];
      var ltr = getComputedStyle(this, null).direction == "ltr";
      var isVertical = tk.TabBar.Mode.getIsVerticalMode();

      var position = isVertical ? "screenY" : "screenX";
      var size = isVertical ? "height" : "width";
      var start = isVertical ? "top" : "left";
      var end = isVertical ? "bottom" : "right";

      //When dragging over the tab itself, targetTab is undefined, so should just exit here
      if (typeof targetTab == "undefined" || !targetTab) {
        return;
      }

      //DO NOT reuse newIndex
      if (isVertical) {
        if (event.screenY <= targetTab.boxObject.screenY + targetTab.boxObject.height / 2) {
          ind.style.top = targetTab.getBoundingClientRect().top - targetTab.boxObject.height + "px";
        }
        else {
          ind.style.top = targetTab.getBoundingClientRect().top + "px";
        }
      }
      else {
        if (event.screenX <= targetTab.boxObject.screenX + targetTab.boxObject.width / 2) {
          ind.style.left = targetTab.getBoundingClientRect().left - targetTab.boxObject.width + "px";
        }
        else {
          ind.style.left = targetTab.getBoundingClientRect().left + "px";
        }
      }

      ind.style.lineHeight = targetTab.getBoundingClientRect().height + "px";
      ind.firstChild.style.verticalAlign = "bottom";
      this._tabDropIndicator.collapsed = false;

      event.preventDefault();
      event.stopPropagation();
    }, true);

    gBrowser.tabContainer.addEventListener("dragexit", function(event) {
      this._tabDropIndicator.collapsed = true;
    }, true);

    gBrowser.tabContainer.addEventListener("dragend", function(event) {
      this._tabDropIndicator.collapsed = true;
    }, true);

    //contain important logic, but no use itself
    /* gBrowser.tabContainer.addEventListener("dragover", function(event) {//setAttribute for after use I guess?
      var targetTab = event.target.localName == "tab" ? event.target : null;
      if (!targetTab || targetTab.hasAttribute("pinned"))
        return;

      var dt = event.dataTransfer;
      var draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
      if (!draggedTab || draggedTab == targetTab || draggedTab.hasAttribute("pinned") || draggedTab.parentNode != this)
        return;

      var dropEffect = dt.dropEffect;
      if (dropEffect == "link" || dropEffect == "copy") {
        targetTab.removeAttribute("dragover");
        return;
      }

      var isVertical = tk.TabBar.Mode.getIsVerticalMode();
      var position = isVertical ? "screenY" : "screenX";
      var size = isVertical ? "height" : "width";
      var start = isVertical ? "top" : "left";
      var end = isVertical ? "bottom" : "right";

      // tk.log("event.screenX = "+event.screenX);
      // tk.log("targetTab.boxObject.screenX = "+targetTab.boxObject.screenX);
      // tk.log("targetTab.boxObject.width = "+targetTab.boxObject.width);

      // tk.log("event.screenY = "+event.screenY);
      // tk.log("targetTab.boxObject.screenY = "+targetTab.boxObject.screenY);
      // tk.log("targetTab.boxObject.height = "+targetTab.boxObject.height);

      // tk.log("event.position = "+eval("event."+position));
      // tk.log("targetTab.boxObject.position = "+eval("targetTab.boxObject."+position));
      // tk.log("targetTab.boxObject.size = "+eval("targetTab.boxObject."+size));

      // tk.log("targetTab.boxObject.position + targetTab.boxObject.size * .25 = "+(eval("targetTab.boxObject."+position) + eval("targetTab.boxObject."+size+" * .25")));
      // tk.log("targetTab.boxObject.position + targetTab.boxObject.size * .75 = "+(eval("targetTab.boxObject."+position) + eval("targetTab.boxObject."+size+" * .75")));
      if (eval("event."+position) <= (eval("targetTab.boxObject."+position) + eval("targetTab.boxObject."+size+" /2"))) {
        targetTab.setAttribute("dragover", start);
      } else if (eval("event."+position) > (eval("targetTab.boxObject."+position) + eval("targetTab.boxObject."+size+" /2"))) {
        targetTab.setAttribute("dragover", end);
      } else {
        //Dead Code MEDIC!
        targetTab.setAttribute("dragover", "center");
        // this._tabDropIndicator.collapsed = true;
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);  */

    gBrowser.tabContainer.addEventListener("drop", tk._onDrop, true);
  };
  this.preInitListeners.push(this.preInitTabDragModifications);
  this.postInitTabDragModifications = function postInitTabDragModifications(event) { // TODO=P4: TJS Test
    // if ("_onDrop" in gBrowser) { // [Fx3.5+]
      // gBrowser.old_onDrop = gBrowser._onDrop;
      // gBrowser._onDrop = tk._onDrop;
    // }
    // else {// [Fx4+]
      // tk.debug("postInitTabDragModifications Fx4 Version Unavailable, Developer come!!");
    // }

  };
  this.postInitListeners.push(this.postInitTabDragModifications);

  this._getDropIndex = function _getDropIndex(event) {  //since the default functions sucks on vertical mode
    var targetTab = event.target.localName == "tab" ? event.target : null;
    if (!targetTab || targetTab.hasAttribute("pinned"))
      return;

    var dt = event.dataTransfer;
    var draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
    if (!draggedTab || draggedTab == targetTab || draggedTab.hasAttribute("pinned"))
      return;

    var isVertical = tk.TabBar.Mode.getIsVerticalMode();
    var position = isVertical ? "screenY" : "screenX";
    var size = isVertical ? "height" : "width";
    var start = isVertical ? "top" : "left";
    var end = isVertical ? "bottom" : "right";

    var resultIndex = 0;
    var targetPos = targetTab._tPos;
    if (isVertical) {
      if (event.screenY <= targetTab.boxObject.screenY + targetTab.boxObject.height / 2) {
        resultIndex = targetPos;
      }
      else {
        resultIndex = targetPos + 1;
      }
    }
    else {
      if (event.screenX <= targetTab.boxObject.screenX + targetTab.boxObject.width / 2) {
        resultIndex = targetPos;
      }
      else {
        resultIndex = targetPos + 1;
      }
    }

    return resultIndex;
  }



  /* TODO=P3: Let Ctrl-Tab switch tabs in most recently viewed order
  // I would put this under the Gestures section, but it relies on the sorting attributes set here

    <CHANGELOG>

      * - Can set Ctrl-Tab to switch tabs in most recently viewed order

    <HERE>

      ADD TO this.initSortingAndGrouping = function initSortingAndGrouping(event) {

        ...

        //tk.updateCtrlTabStack();

        ...

        //window.addEventListener("keydown", tk.onKeyDown, true);
        window.addEventListener("keypress", tk.onKeyPress, true);
        window.addEventListener("keyup", tk.onKeyUp, true);

        ...

      };
      //this.updateCtrlTabStack = function updateCtrlTabStack(event) {
      //  gBrowser.mTabBox.handleCtrlTab =
      //};
      this.compareTabViewedExceptUnreadOrSwitching = function compareTabViewedExceptUnreadOrSwitching(aV, bV) {
        if (Date.now() < aV && Date.now >= bV)
          return -1;
        if (Date.now() >= aV && Date.now < bV)
          return 1;
        return aV - bV;
      };
      this.isCtrlTabSwitching = false;
      //this.onKeyDown = function onKeyDown(event) {
      //  if (!event.isTrusted)
      //    return;
      //};
      this.onKeyPress = function onKeyPress(event) {
        if (!event.isTrusted
          || event.keyCode != event.DOM_VK_TAB
          || !event.ctrlKey
          || event.altKey
          || event.metaKey
          || !_prefs.getBoolPref("ctrlTabStack"))
        {
          return;
        }

        var selectedLastViewed = Number(b.hasAttribute("tempLastViewedKey") ? b.getAttribute("tempLastViewedKey")
                                          : b.getAttribute(tk.Sorts.lastViewed));
        var beforeSelected;
        var afterSelected;
        var

        event.stopPropagation();
        event.preventDefault();
      };
      this.onKeyUp = function onKeyUp(event) {
        if (!event.isTrusted
          || event.keyCode != event.DOM_VK_CONTROL
          || !tk.isCtrlTabSwitching)
        {
          return;
        }

        for (var i = 0; i < _tabs.length; i++)
          _tabs[i].removeAttribute("tempLastViewedKey");
        tk.isCtrlTabSwitching = false;
      };

    <defaults.js>

      pref("extensions.tabkit.ctrlTabStack", false);

    <settings.xul>

      <preference id="ctrltabstack-pref" name="extensions.tabkit.ctrlTabStack" type="bool"/>

      <checkbox id="ctrltabstack" label="&ctrlTabStack.label;"
        accesskey="&ctrlTabStack.accesskey;" preference="ctrltabstack-pref"/>

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

  this.initProtectedTabs = function initProtectedTabs(event) {
    // Function called by removing tab
    // Prevent "protected" tabs to be closed
    // FF 38.x: http://mxr.mozilla.org/mozilla-esr38/source/browser/base/content/tabbrowser.xml#2017
    // FF 45.x: http://mxr.mozilla.org/mozilla-esr45/source/browser/base/content/tabbrowser.xml#2109
    (function() {
      "use strict";

      if (typeof gBrowser.removeTab !== "function") {
        tk.debug("gBrowser.removeTab doesn't exists, replacing function failed");
        return;
      }

      var old_func = gBrowser.removeTab;
      // Function signature should be valid for FF 38.x & 45.x
      gBrowser.removeTab = function(aTab, aParams) {
        "use strict";
        var result = undefined;

        tk.debug(">>> gBrowser.removeTab >>>");
        if (tk.getTabIsProtected(aTab)) {
          tabkit.beep();
        }
        else {
          result = old_func.apply(this, [aTab, aParams]);
        }
        tk.debug("<<< gBrowser.removeTab <<<");

        return result;
      };
    })();

    _tabContainer.addEventListener("click", tk.protectedTabs_onClick, true);

    var tabContextMenu = _tabContainer.contextMenu;
    tabContextMenu.addEventListener("popupshowing", tk.protectedTabs_updateContextMenu, false);

    tk.context_closeTab = document.getElementById("context_closeTab");

  };
  this.initListeners.push(this.initProtectedTabs);

  this.postInitProtectedTabs = function postInitProtectedTabs(event) {
    // In firefox 15 session store module call must not be too early, reason unknown
    // Persist Attributes
    if (_ss)
      _ss.persistTabAttribute("protected");
  };
  this.postInitListeners.push(this.postInitProtectedTabs);

  this.protectedTabs_onClick = function protectedTabs_onClick(event) {
    var isCloseButton = (event.originalTarget.className.indexOf("tab-close-button") > -1);
    var isMouseClick = (event.button == 0 || event.button == 1);
    var isProtectedTab = ((event.target.localName == "tab") && event.target.getAttribute("protected") == "true");

    if (isCloseButton && isMouseClick && isProtectedTab)
    {
      event.target.removeAttribute("protected");
      event.stopPropagation();
    }
  };

  this.protectedTabs_updateContextMenu = function protectedTabs_updateContextMenu(event) {
    var tab = gBrowser.mContextTab || gBrowser.selectedTab;
    var isProtected = tab.getAttribute("protected") == "true";
    document.getElementById("menu_tabkit-tab-toggleProtected").setAttribute("checked", isProtected);
    tk.context_closeTab.setAttribute('disabled', isProtected);
  };

  this.getTabIsProtected = function getTabIsProtected(contextTab) {
    if (!contextTab) {
      contextTab = gBrowser.selectedTab;
    }

    return (contextTab.getAttribute("protected") === "true");
  };
  this.toggleProtected = function toggleProtected(contextTab) {
    if (!contextTab) {
      contextTab = gBrowser.selectedTab;
    }

    if (tk.getTabIsProtected(contextTab)) {
      tk.setTabUnprotected(contextTab);
    }
    else {
      tk.setTabProtected(contextTab);
    }
  };
  this.setTabProtected = function setTabProtected(contextTab) {
    if (!contextTab) {
      contextTab = gBrowser.selectedTab;
    }

    if (tk.getTabIsProtected(contextTab)) {
      return false;
    }
    else {
      contextTab.setAttribute("protected", "true");
      return true;
    }
  };
  this.setTabUnprotected = function setTabUnprotected(contextTab) {
    if (!contextTab) {
      contextTab = gBrowser.selectedTab;
    }

    if (tk.getTabIsProtected(contextTab)) {
      contextTab.removeAttribute("protected");
      return true;
    }
    else {
      return false;
    }
  };

//}##########################
//{=== New tabs by default
//|##########################

  // See globalPreInitNewTabsByDefault in tabkit-global.js

  this.postInitNewTabsByDefault = function postInitNewTabsByDefault(event) {
    if ("PlacesUIUtils" in window) {
      // We were patching `PlacesUIUtils.openNodeIn` and `PlacesUIUtils.openNodeWithEvent` before
      // But since they both calls `PlacesUIUtils._openNodeIn`, we just need to monky patch one place
      if ("_openNodeIn" in PlacesUIUtils) {
        // `PlacesUIUtils` seems to be shared by multiple windows, so it's better to just override the method once
        PlacesUIUtils._openNodeInOriginal = PlacesUIUtils._openNodeInOriginal || PlacesUIUtils._openNodeIn;
        PlacesUIUtils._openNodeIn = function (aNode, aWhere, aWindow) {
          aWhere = tabkit.returnWhereWhenOpenPlaces(aWhere, aNode);
          PlacesUIUtils._openNodeInOriginal(aNode, aWhere, aWindow);
        }
      }

      // document.getElementById('placesContext_open').removeAttribute('default');
      // document.getElementById('placesContext_open:newtab').setAttribute('default', true);
    }
  };
  this.postInitListeners.push(this.postInitNewTabsByDefault);

  this.returnWhereWhenOpenPlaces = function returnWhereWhenOpenPlaces(aWhere, aNode) {
    if (!gPrefService.getBoolPref("extensions.tabkit.openTabsFrom.places")) {
      return aWhere;
    }

    /* bookmarklets*/
    if (aNode.uri.indexOf('javascript:') == 0) {
      return aWhere;
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
    // tk.debug("clicking on folder");return aWhere;

    // Reverse bookmark open location: new tab <--> current tab
    if ((aWhere == "tab") || (aWhere == "tabshifted")) {
      // tk.debug("return current");
      return "current";
    }

    if (aWhere == "current") {
      // tk.debug("return tab");
      return "tab";
    }

    // Fallback (for window and othe values)
    return aWhere;
  };

//}##########################
//{=== Tab Min Width
//|##########################

  /// Initialisation:

  var tabWidthStyleSheet = null;  //for storing stylesheet for tab minWidth rule

  this.initTabMinWidth = function initTabMinWidth(event) {
    tk.addGlobalPrefListener("extensions.tabkit.tabs.tabMinWidth", tk.resetTabMinWidth);
    var ss = document.styleSheets;
    for (let i = ss.length - 1; i >= 0; i--) {
      if (ss[i].href == "chrome://tabkit/content/variable.css") {
        tk.tabWidthStyleSheet = ss[i];
        break;
      }
    }
  };
  this.initListeners.push(this.initTabMinWidth);

  /// Pref Listener/method:
  // Note: this is also used by multi-row tabs
  this.resetTabMinWidth = function resetTabMinWidth(pref) {
    tk.setTabMinWidth(gPrefService.getIntPref("extensions.tabkit.tabs.tabMinWidth")); //Minimum minWidth of tab is 100, a built-in CSS rule
  };

  /// Methods:
  // Note: this is also used by multi-row tabs
  this.setTabMinWidth = function setTabMinWidth(minWidth) {
    // _tabContainer.mTabMinWidth = minWidth;
    minWidth = Math.max(minWidth, TAB_MIN_WIDTH);
    for (var i = 0; i < _tabs.length; i++) {
      _tabs[i].minWidth = minWidth;
      //the index may change, also be noticed first rule start @ 1, [0] is always undefined, don't ask me why, idk
      var style = tk.tabWidthStyleSheet.cssRules[1].style;
      style.setProperty("min-width", minWidth + "px", "important");
    }
    _tabContainer.adjustTabstrip();
  };

//}##########################
//{>>> Tab Bar position
//|##########################

  // NOTE: Vertical tab dragging (inc. indicator position) is fixed by Multi-row tabs

  /// Enums:
  this.Positions = {
    TOP: 0,
    LEFT: 1,
    RIGHT: 2,
    BOTTOM: 3
  };

  /// Initialisation:
  this.initTabbarPosition = function initTabbarPosition(event) {
    var tabs_toolbar = document.getElementById("TabsToolbar");

    tk.moveSidebar();
    tk.addPrefListener("tabbarPosition", tk.moveSidebar);

    tk.moveTabbar();
    tk.addPrefListener("tabbarPosition", tk.moveTabbar);

    _tabContainer.addEventListener("TabOpen", tk.positionedTabbar_onTabOpen, false);
    _tabContainer.addEventListener("TabSelect", tk.positionedTabbar_onTabSelect, false);
    _tabContainer.addEventListener("TabMove", tk.positionedTabbar_onTabSelect, false); // In case a tab is moved out of sight

    _tabBar.tkLastMouseover = Date.now(); // Prevent strict errors if we get a mouseout before our first mouseover
    gBrowser.tabContainer.addEventListener("mouseover", tk.positionedTabbar_onMouseover, false);
    gBrowser.tabContainer.addEventListener("mouseout", tk.positionedTabbar_onMouseout, false);

    // `DOMAttrModified` event is deprecated
    // `MutationObserver` should be used instead
    // Ref:
    // - https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events
    // - https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    // - https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
    if (typeof MutationObserver === "function") {
      let tabs_toolbar_mutation_observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type !== "attributes") { return; }
          if (mutation.attributeName !== "collapsed") { return; }

          tk.positionedTabbar_onToggleCollapse({tabs_toolbar: tabs_toolbar});
        });
      });
      // Start observing
      tabs_toolbar_mutation_observer.observe(tabs_toolbar, {
        attributes: true,
        attributeFilter: ["collapsed"],
        attributeOldValue: true
      });
    }

    //Special bug workaround by Pika
    _tabContainer.addEventListener("TabClose", tk.bug608589workaround, true);
  };
  this.initListeners.push(this.initTabbarPosition);

  this.TabBar = this.TabBar || {};
  this.TabBar.Callbacks = this.TabBar.Callbacks || {};

  /// Event listeners:
  this.bug608589workaround = function bug608589workaround(event) {
    //As stated in bug 608589, if animation is enabled,
    // there is a chance the animation cannot finish and the tab will disappear but not closed(since waiting for animation)
    // I can still reproduce this problem up to firefox nightly 10
    // this workaround will stay here until a real fix is released
    if (gPrefService.getBoolPref("browser.tabs.animate"))
      gPrefService.setBoolPref("browser.tabs.animate",false);
  }
  this.positionedTabbar_onTabOpen = function positionedTabbar_onTabOpen(event) {
    var tab = event.target;
    if (tk.TabBar.Mode.getIsVerticalMode() && document.getElementById("tabkit-splitter")) {

      tab.maxWidth = 9999;
      tab.minWidth = 0;

      // Ensure newly opened tabs can be seen (even if, in some cases, this may put the selected tab offscreen - TODO=P4: GCODE Make sure not to move selected tab offscreen if it is onscreen)
      window.setTimeout(function() {
        tk.scrollToElement(document.getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox"), tab);
      }, 0);
    }
    // make all ungrouped tabs white
    // this could be buggy and/or impact performance
    // tk.colorizeTab(tab);
  };
  this.positionedTabbar_onTabSelect = function positionedTabbar_onTabSelect(event) {
    var tab = gBrowser.selectedTab;
    if (tk.TabBar.Mode.getIsVerticalMode()) {


      // Tabs on different rows shouldn't get before/afterselected attributes
      if (tab.previousSibling != null) {
        tab.previousSibling.removeAttribute("beforeselected");
      }
      if (tab.nextSibling != null) {
        tab.nextSibling.removeAttribute("afterselected");
      }



      // Ensure selected tabs become visible (and the tabs before/after if scrollOneExtra)
      // tk.scrollToElement(document.getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox"), tab);
      //Must use direct call instead of shortcut, or will cause error
      // tk.scrollToElement(document.getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox"), tab);
      window.setTimeout(function() {
        tk.scrollToElement(document.getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox"), tab);
      }, 50); //this timeout has to be after TabOpen to make it work normally (it seems)
    }
    tk.colorizeTab(tab);
  };
  this.positionedTabbar_onResize = function positionedTabbar_onResize(event) {
    var width = parseInt(_tabBar.width != "" ? _tabBar.width : 250);  //temp default value, MEDIC!!
    _prefs.setIntPref("tabSidebarWidth", Math.min(width, 576)); // Upper limit on default width so can't be wider than maximised browser window, even on 800x600 screen
  };
  this.positionedTabbar_onMouseover = function positionedTabbar_onMouseover(event) {
    var splitter = document.getElementById("tabkit-splitter");
    if (!splitter || splitter.getAttribute("state") != "collapsed")
      return;

    // Increment counter, so __collapse can tell if there has been a mouseover since the timer was started
    _tabBar.tkLastMouseover = (_tabBar.tkLastMouseover || 0) + 1;

    if (_tabBar.collapsed) {
      // Ensure tab bar has sensible width if we're showing it on hover (this
      // way it's ok to collapse it by dragging the splitter to zero width)
      _tabBar.width = Math.max(200, parseInt(_tabBar.width));

      // Show tab bar
      _tabBar.collapsed = false;
    }
  };
  this.positionedTabbar_onMouseout = function positionedTabbar_onMouseout(event) {
    var splitter = document.getElementById("tabkit-splitter");
    if (!splitter || splitter.getAttribute("state") != "collapsed")
      return;

    window.clearTimeout(tk.positionedTabbar_collapseTimer);
    tk.positionedTabbar_collapseTimer = window.setTimeout(function __collapse(lastMouseover) {
      if (splitter.getAttribute("state") == "collapsed"
        && lastMouseover == _tabBar.tkLastMouseover)
      {
        _tabBar.collapsed = true;
      }
    }, 333, _tabBar.tkLastMouseover);
  };
  this.positionedTabbar_onToggleCollapse = function positionedTabbar_onToggleCollapse(options) {
    "use strict";
    // if (event.attrName != "collapsed")
    //   return;

    if (typeof options !== "object") {
      options = {};
    }

    let tabs_toolbar = options.tabs_toolbar;
    // This should not happen, but to be safe we check it
    if (tabs_toolbar == null) { return; }

    let tabs_toolbar_collapsed = tabs_toolbar.getAttribute("collapsed") === "true";

    var scrollbar = tk.VerticalTabBarScrollbar.getElement();
    if (scrollbar == null) { return; }

    if (tabs_toolbar_collapsed) {
      tk.backupScrollBarPosition();
    }
    else {
      window.setTimeout(function () {
        tk.restoreScrollBarPosition();
      }, 100); // TODO: TJS Find more reliable way of setting this than 50 ms timeout...
    }
  };

  this.backupScrollBarPosition = function() {
    "use strict";
    var scrollbar = tk.VerticalTabBarScrollbar.getElement();
    var curpos = parseInt(scrollbar.getAttribute("curpos"));

    if (!isNaN(curpos) && curpos > 0) {
      // Restore the old scroll position, as collapsing the tab bar will have reset it
      tk.TKData.setDataWithKey(_tabBar, "scroll_bar_position", curpos);
    }
  };

  this.restoreScrollBarPosition = function() {
    "use strict";
    var scrollbar = tk.VerticalTabBarScrollbar.getElement();
    var curpos = tk.TKData.getDataWithKey(_tabBar, "scroll_bar_position").data;

    if (scrollbar != null && !isNaN(curpos) && curpos > 0) {
      // Restore the old scroll position, as collapsing the tab bar will have reset it
      scrollbar.setAttribute("curpos", curpos);
    }
  };

  /// Methods:
  this.moveSidebar = function moveSidebar(tabbarPosition) {
    if (typeof tabbarPosition != "number") tabbarPosition = _prefs.getIntPref("tabbarPosition");

    // Strange behavior when put on top or bottom, remove those options
    var flip_direction = false;
    if (tabbarPosition == tk.Positions.LEFT) {
      flip_direction = true;
    }
    // Special support for extension "All-In-One Sidebar"
    // Totally non-scalable implmenetation
    var do_not_move_sidebar = !!("AiOS_HELPER" in window);
    if (do_not_move_sidebar) {
      return;
    }

    var need_move_sidebar = ((tabbarPosition == tk.Positions.LEFT) || (tabbarPosition == tk.Positions.RIGHT));

    // Calculate new orient attributes
    var fromHorizontal = "horizontal";
    var fromVertical = "vertical";
    var fromNormal = "normal";

    // Get some nodes
    var browser_border_start = document.getElementById("browser-border-start");
    var browser = document.getElementById("browser");
    var sidebar_box = document.getElementById("sidebar-box");
    var sidebar_splitter = document.getElementById("sidebar-splitter");
    var sidebar_header = sidebar_box.getElementsByTagName("sidebarheader")[0];
    var appcontent = document.getElementById("appcontent");
    var normallyHorizontal = [
      browser,
      sidebar_splitter,
      sidebar_header
    ];
    var normallyVertical = [
      sidebar_box,
      appcontent
    ];
    var normallyNormal = [
      sidebar_box,
      sidebar_header
    ];

    // Set new attributes
    var new_direction = flip_direction ? "reverse" : "normal";

    // Before we use browser.dir, but that screws up the direction
    // Now just move the sidebar element
    if (need_move_sidebar) {
      tk.DomUtility.insertAfter(appcontent, sidebar_box);
      tk.DomUtility.insertBefore(sidebar_box, sidebar_splitter);
    } else {
      tk.DomUtility.insertAfter(browser_border_start, sidebar_box);
      tk.DomUtility.insertAfter(sidebar_box, sidebar_splitter);
    }

    for each (var node in normallyNormal)
      node.dir = fromNormal;

    sidebar_header.pack = "start";

    // Set orient attributes last or stuff messes up
    for each (var node in normallyHorizontal)
      node.orient = fromHorizontal;
    for each (var node in normallyVertical)
      node.orient = fromVertical;

    // Now activate our css
    browser.removeAttribute("horizsidebar");
    browser.removeAttribute("vertisidebar");
    browser.setAttribute(fromVertical.substring(0, 5) + "sidebar", new_direction);
  };

  //Edited by PikachuEXE, NOT tested
  this.moveTabbar = function moveTabbar(pos) {
    if (typeof pos != "number") pos = _prefs.getIntPref("tabbarPosition");

    //Start Edit by Pika
    var tabsToolbar = document.getElementById("TabsToolbar"); //FF4+ tabbar
    var appcontent = document.getElementById("appcontent");
    var browser = document.getElementById("browser");

    // Calculate new orient attributes
    var flipOrient = (pos == tk.Positions.LEFT || pos == tk.Positions.RIGHT);
    var fromHorizontal = flipOrient ? "vertical" : "horizontal";
    var fromVertical = flipOrient ? "horizontal" : "vertical";

    // Calculate new direction attribute
    var flipDirection = (pos == tk.Positions.RIGHT || pos == tk.Positions.BOTTOM);
    var newDirection = flipDirection ? "reverse" : "normal";

    // Now activate our css
    if (flipOrient) {
      appcontent.parentNode.insertBefore(tabsToolbar, appcontent);
    }
    else if (pos == tk.Positions.TOP) {
      var searchBox = document.getElementById("tabkit-filtertabs-box");
      var checkPtI = 1;
      var menubar = document.getElementById("toolbar-menubar");
      menubar.parentNode.insertBefore(tabsToolbar, menubar);
    }
    else if (pos == tk.Positions.BOTTOM) {
      var a = document.getElementById("browser-bottombox");
      a.parentNode.insertBefore(tabsToolbar, a);
    }
    browser.dir = newDirection;
    tabsToolbar.orient = _tabContainer.mTabstrip.orient = fromHorizontal;
    gBrowser.removeAttribute("horiztabbar");
    gBrowser.removeAttribute("vertitabbar");
    gBrowser.setAttribute(fromHorizontal.substring(0, 5) + "tabbar", newDirection);
    tabsToolbar.removeAttribute("horiztabbar");
    tabsToolbar.removeAttribute("vertitabbar");
    tabsToolbar.setAttribute(fromHorizontal.substring(0, 5) + "tabbar", newDirection);
    //add one more to mainPopupSet
    var mainPopupSet = document.getElementById("mainPopupSet");
    mainPopupSet.removeAttribute("horiztabbar");
    mainPopupSet.removeAttribute("vertitabbar");
    mainPopupSet.setAttribute(fromHorizontal.substring(0, 5) + "tabbar", newDirection);

    // Toggle the splitter as appropriate
    var splitter = document.getElementById("tabkit-splitter");
    if (flipOrient) {
      // Remove any space or flexible space in tab bar(which makes vertical tab bar works strange)
      for (var i = 0; i < tabsToolbar.children.length; i++) {
        var thisNode = tabsToolbar.children.item(i);
        if (thisNode.localName == "toolbarspacer" || thisNode.localName == "toolbarspring") {
          thisNode.parentNode.removeChild(thisNode);  //if you remove here you affect the length and index of after objects, the next one will escape check, so need to decrease index
          i--;
        }
      }

      if (!splitter) {
        splitter = document.createElementNS(XUL_NS, "splitter");
        splitter.id = "tabkit-splitter";
        splitter.setAttribute("collapse", "before");
        var grippy = document.createElementNS(XUL_NS, "grippy");
        grippy.id = "tabkit-grippy";
        splitter.appendChild(grippy);

        splitter.addEventListener("mouseover", tk.positionedTabbar_onMouseover, false);
        splitter.addEventListener("mouseout", tk.positionedTabbar_onMouseout, false);

        _tabBar.width = _prefs.getIntPref("tabSidebarWidth");
        for (var i = 0; i < _tabs.length; i++)
          _tabs[i].maxWidth = 9999;
        tk.setTabMinWidth(0);
        gBrowser.mTabBox.addEventListener("resize", tk.positionedTabbar_onResize, false);
      }
      tk.DomUtility.insertBefore(appcontent, splitter);//add by Pika
      if ("toggleIndentedTree" in tk) {
        tk.toggleIndentedTree();
      }
    }
    else {
      if ("toggleIndentedTree" in tk) {
        tk.toggleIndentedTree();
      }
      if (splitter) {
        gBrowser.mTabBox.removeEventListener("resize", tk.positionedTabbar_onResize, false);
        for (var i = 0; i < _tabs.length; i++)
          _tabs[i].maxWidth = 250;
        tk.resetTabMinWidth();
        appcontent.parentNode.removeChild(splitter);//add by Pika
      }
    }

    tk.positionedTabbar_onTabSelect();
  };

//}##########################
//{>>> Multi-row tabs
//|##########################

  /// Initialisation:
  this.initMultiRowTabs = function initMultiRowTabs(event) {
    _tabContainer.mTabstrip.addEventListener("overflow", tk._preventMultiRowFlowEvent, true);
    _tabContainer.mTabstrip.addEventListener("underflow", tk._preventMultiRowFlowEvent, true);

    tk.addPrefListener("tabRows", tk.updateMultiRowTabs);
    tk.addPrefListener("tabbarPosition", tk.updateMultiRowTabs);
    tk.addGlobalPrefListener("extensions.tabkit.tabs.tabMinWidth", tk.updateMultiRowTabs);
    tk.addGlobalPrefListener("extensions.tabkit.tabs.closeButtons", tk.updateMultiRowTabs);
    _tabContainer.addEventListener("TabOpen", tk.updateMultiRowTabs, false);
    tk.addDelayedEventListener(_tabContainer, "TabClose", tk.updateMultiRowTabs);
    document.addEventListener("SSTabRestoring", tk.updateMultiRowTabs, false); // "hidden" attributes might be restored!
    window.addEventListener("resize", tk.updateMultiRowTabs, false);

    _tabContainer.addEventListener("TabSelect", tk.multiRow_onTabSelect, false);
    _tabContainer.addEventListener("TabMove", tk.multiRow_onTabSelect, false); // In case a tab is moved out of sight

    tk.updateMultiRowTabs();

    //{=== Multi-row drop indicator

    // PikachuEXE: I have given up the drop indicator in multirow mode
    // Setup new drop indicator (this way it can be moved up and down as well as left and right)
    // var oldIndicatorBar = gBrowser.mTabBox.firstChild;
    // var oldIndicator = oldIndicatorBar.firstChild;
    // var oldBarStyle = tk.getCSSRule(".tab-drop-indicator-bar").style //[Fx3only]
    // var oldStyle = tk.getCSSRule(".tab-drop-indicator").style //[Fx3only]
    // var newDropIndicatorBar = document.createElementNS(XUL_NS, "hbox");
    // var newDropIndicator = document.createElementNS(XUL_NS, "hbox");
    // newDropIndicatorBar.id = "tabkit-tab-drop-indicator-bar";
    // if (oldIndicatorBar.hasAttribute("collapsed")) // [Fx3only]
      // newDropIndicatorBar.setAttribute("collapsed", "true");
    // newDropIndicator.setAttribute("mousethrough", "always");
    // newDropIndicatorBar.style.height = oldBarStyle.height;
    // newDropIndicatorBar.style.marginTop = oldBarStyle.marginTop;
    // newDropIndicatorBar.style.position = "relative";
    // newDropIndicatorBar.style.top = newDropIndicatorBar.style.left = "0";
    // newDropIndicator.style.height = oldStyle.height;
    // newDropIndicator.style.width = oldStyle.width;
    // newDropIndicator.style.marginBottom = oldStyle.marginBottom;
    // newDropIndicator.style.position = "relative";
    // newDropIndicator.style.backgroundColor = oldStyle.backgroundColor; // Probably unnecessary
    // newDropIndicator.style.backgroundImage = oldStyle.backgroundImage;
    // newDropIndicator.style.backgroundRepeat = oldStyle.backgroundRepeat;
    // newDropIndicator.style.backgroundAttachment = oldStyle.backgroundAttachment; // Probably unnecessary
    // newDropIndicator.style.backgroundPosition = "50% 50%"; // This cannot be gotten from oldStyle, see https://bugzilla.mozilla.org/show_bug.cgi?id=316981
    // newDropIndicatorBar.appendChild(newDropIndicator);
    // stack.appendChild(newDropIndicatorBar);
    // gBrowser.__defineGetter__("mTabDropIndicatorBar", function __get_mTabDropIndicatorBar() {
      // return document.getElementById("tabkit-tab-drop-indicator-bar");
    // });
    // oldIndicatorBar.removeAttribute("dragging");
    // oldIndicatorBar.setAttribute("collapsed", "true");

    //}
  };
  this.initListeners.push(this.initMultiRowTabs);

  /// Event Listeners:
  this.updateMultiRowTabs = function updateMultiRowTabs() {
    var tabbarPosition = _prefs.getIntPref("tabbarPosition");
    var needsDisabling = false;
    if ((tabbarPosition == tk.Positions.TOP || tabbarPosition == tk.Positions.BOTTOM) && _prefs.getIntPref("tabRows") > 1) {
      if (!gBrowser.getStripVisibility()) {
        var rows = 0;
      }
      else {
        var visibleTabs = _tabs.length;
        for (var i = 0; i < _tabs.length; i++)
          if (_tabs[i].hidden) // visibility of a tab
            visibleTabs--;
        //var newTabButton = _tabs[_tabs.length-1].boxObject.nextSibling; // [Fx3.5+]
        //seems not needed in FF4+
        // if (newTabButton && newTabButton.className == "tabs-newtab-button")
          // visibleTabs++; // Treat the new tab button as a tab for our purposes
        var minWidth = _prefs.getIntPref("tabs.tabMinWidth");
        var availWidth = _tabContainer.mTabstrip._scrollbox.boxObject.width;
        var tabsPerRow = Math.floor(availWidth / Math.max(minWidth, TAB_MIN_WIDTH));  //Minimum minWidth of tab is 100, a built-in CSS rule
        var rows = Math.ceil(visibleTabs / tabsPerRow);
      }
      if (rows > 1) {
        // Enable multi-row tabs
        if (_tabContainer.getAttribute("multirow") != "true") {
          _tabContainer.setAttribute("multirow", "true");
          try {
            _tabContainer.mTabstrip._scrollBoxObject.scrollTo(0,0);
          }
          catch (ex) {}
        }

        var maxRows = _prefs.getIntPref("tabRows");
        if (rows > maxRows) {
          _tabContainer.setAttribute("multirowscroll", "true");

          // TODO=P3: GCODE Make sure tab borders and padding are properly taken into account...
          _tabContainer.mTabstrip.style.setProperty("min-height", 24 * maxRows + "px", "important");
          _tabContainer.mTabstrip.style.setProperty("max-height", 24 * maxRows + "px", "important");

          var scrollbar = tk.VerticalTabBarScrollbar.getElement();
          try {
            availWidth -= Math.max(scrollbar.boxObject.width, 22);
          }
          catch (ex) {
            tk.debug("Oops, the scrollbar hasn't been created yet... TODO-P6: TJS use a timeout");
            availWidth -= 22;
          }
        }
        else {
          _tabContainer.removeAttribute("multirowscroll");

          _tabContainer.mTabstrip.style.setProperty("min-height", 24 * rows + "px", "important");
          _tabContainer.mTabstrip.style.setProperty("max-height", 24 * rows + "px", "important");
        }

        tk.setTabMinWidth(minWidth);
        // tk.setTabMinWidth(availWidth / tabsPerRow);

        if (rows > maxRows)
          tk.multiRow_onTabSelect(); // Check if we need to scroll
      }
      else {
        // Disable multi-row tabs
        if (_tabContainer.getAttribute("multirow") == "true")
          needsDisabling = true;
          var needsScrolling = true;
        _tabContainer.setAttribute("multirow", "false");
      }
    }
    else if (_tabContainer.hasAttribute("multirow")) {
      // Turn off multi-row tabs
      needsDisabling = true;
      var needsScrolling = (_tabContainer.getAttribute("multirow") == "true");
      _tabContainer.removeAttribute("multirow");
    }

    if (needsDisabling) {
      tk.resetTabMinWidth();

      if (needsScrolling) {
        try {
          if (gBrowser.selectedTab.nextSibling && _prefs.getBoolPref("scrollOneExtra")) {
            _tabContainer.mTabstrip._scrollBoxObject.ensureElementIsVisible(gBrowser.selectedTab.nextSibling);
          }
          _tabContainer.mTabstrip._scrollBoxObject.ensureElementIsVisible(gBrowser.selectedTab);
        }
        catch (ex) {}
      }

      _tabContainer.mTabstrip.style.removeProperty("min-height");
      _tabContainer.mTabstrip.style.removeProperty("max-height");
    }
  };

  this.multiRow_onTabSelect = function multiRow_onTabSelect() {
    if (_tabContainer.getAttribute("multirow") == "true") {
      var tab = gBrowser.selectedTab;

      tk.scrollToElement(document.getAnonymousElementByAttribute(gBrowser.tabContainer.mTabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox"), tab);

      // Tabs on different rows shouldn't get before/afterselected attributes
      if (tab.previousSibling != null && tab.boxObject.y != tab.previousSibling.boxObject.y) {
        tab.previousSibling.removeAttribute("beforeselected");
      }
      if (tab.nextSibling != null && tab.boxObject.y != tab.nextSibling.boxObject.y) {
        tab.nextSibling.removeAttribute("afterselected");
      }
    }
  };

  /// Private Methods
  this._preventMultiRowFlowEvent = function _preventMultiRowFlowEvent(event) {
    if (_tabContainer.hasAttribute("multirow")) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

//}##########################
//{>>> Search bar
//|##########################

   // Old bug that went away as of 3.6.10 (or earlier): Sometimes tabs remembered that the search bar was focused, and would confusingly focus it when you switch to them (in the same way as they used to remember whether the address bar was focused on a per-tab basis). Tabs no longer seem to remember this (nor for the address bar).

  /// Initialisation:
  this.initSearchBar = function initSearchBar(event) {
    var strings = document.getElementById("bundle_tabkit");

    var vbox = document.createElementNS(XUL_NS, "vbox");
    vbox.setAttribute("id", "tabkit-filtertabs-box");
    _tabBar.insertBefore(vbox, _tabBar.firstChild);

    var textbox = document.createElementNS(XUL_NS, "textbox");
    textbox.setAttribute("id", "tabkit-filtertabs-query");
    textbox.setAttribute("type", "search");
    textbox.setAttribute("emptytext", strings.getString("search_tabs"));
    textbox.setAttribute("tooltiptext", strings.getString("search_tabs"));
    textbox.setAttribute("clickSelectsAll", "true");
    textbox.setAttribute("newlines", "replacewithspaces");
    textbox.addEventListener("command", function() {
      tabkit.filterTabs(this.value)
    });
    textbox.addEventListener("input", function() {
      document.getElementById('tabkit-filtertabs-includetext').collapsed = !this.value;
    });
    textbox.addEventListener("blur", function() {
      // Clearing the query doesn't always trigger an input event, so additionally check when it gets blurred
      document.getElementById('tabkit-filtertabs-includetext').collapsed = !this.value;
    });
    vbox.appendChild(textbox);

    var checkbox = document.createElementNS(XUL_NS, "checkbox");
    checkbox.setAttribute("id", "tabkit-filtertabs-includetext");
    checkbox.setAttribute("label", strings.getString("include_page_text"));
    checkbox.addEventListener("command", function() {
      tabkit.filterTabs(document.getElementById('tabkit-filtertabs-query').value)
    });
    checkbox.setAttribute("collapsed", "true");
    vbox.appendChild(checkbox);

    //Option for on/off search bar
    tk.mapBoolPrefToAttribute("disableSearchBar", document.getElementById("tabkit-filtertabs-box"), "hidden");
  };
  this.initListeners.push(this.initSearchBar);

  this.filterTabs = function filterTabs(query) {
    // Expand collapsed groups during search
    if (query && typeof tk._groupsToReExpandAfterSearch === "undefined") {
      tk._groupsToReExpandAfterSearch = [];

      for each (var g in tk.getAllGroups()) {
        if (g[0].hasAttribute("groupcollapsed")) {
          tk.toggleGroupCollapsed(g[0]);
          tk._groupsToReExpandAfterSearch.push(g[0].getAttribute("groupid"));
        }
      }
    }

    var terms = query.split(/\s+/g);
    var includePageText = document.getElementById("tabkit-filtertabs-includetext").checked;

    // Filter tabs
    for (let t = 0; t < _tabs.length; t++) {
      let tab = _tabs[t];

      let foundTerms = {};

      // Try to match title/uri
      let uri = null;
      //if (tab.getAttribute("tk_frozen") == "true") {
      //  let entry = tk.getActiveTabDataEntry(tab);
      //  if (entry)
      //    uri = entry.url;
      // }
      if (uri == null) {
        uri = tab.linkedBrowser.currentURI.spec;
        try {
          uri = decodeURI(uri);
        } catch (ex) {}
      }
      let title = tab.label;
      let details = (title + " " + uri).toLowerCase();
      for (let i = 0; i < terms.length; i++) {
        if (details.indexOf(terms[i]) > -1) {
          foundTerms[i] = true;
        }
      }

      let match = true;
      for (let i = 0; i < terms.length; i++) {
        if (!(i in foundTerms)) {
          match = false;
          break;
        }
      }

      // Try to match text
      if (!match && includePageText) {
        // Get frames
        let frames = [];
        let frameQueue = [ tab.linkedBrowser.contentWindow ];
        while (frameQueue.length > 0) {
          let f = frameQueue.pop();
          for (let i = 0; i < f.frames.length; i++)
            frameQueue.push(f.frames[i]);
          frames.push(f);
        }

        // Search each frame
        for (let i = 0; i < frames.length; i++) {
          if (!frames[i].document || !frames[i].document.body)
            continue;
          let body = frames[i].document.body;
          let count = body.childNodes.length;
          let range = document.createRange();
          range.setStart(body, 0);
          range.setEnd(body, count);
          let start = document.createRange();
          start.setStart(body, 0);
          start.setEnd(body, 0);
          let end = document.createRange();
          end.setStart(body, count);
          end.setEnd(body, count);
          let finder = Cc["@mozilla.org/embedcomp/rangefind;1"]
                .createInstance()
                .QueryInterface(Components.interfaces.nsIFind);
          finder.caseSensitive = false;

          for (let j = 0; j < terms.length; j++) {
            if (!(j in foundTerms)) {
              if (finder.Find(terms[j], range, start, end) != null)
                foundTerms[j] = true;
            }
          }
        }

        match = true;
        for (let i = 0; i < terms.length; i++) {
          if (!(i in foundTerms)) {
            match = false;
            break;
          }
        }
      } // end if (!match && includePageText)

      // Show only matching tabs
      tk.tabSetHidden(tab, !match); // visibility of a tab
    } // end for (let t = 0; t < gBrowser.tabs.length; t++)

    // Recollapse expanded groups after search
    if (!query && typeof tk._groupsToReExpandAfterSearch === "object") {
      for each (var gid in tk._groupsToReExpandAfterSearch) {
        var g = tk.getGroupById(gid);
        if (!g[0].hasAttribute("groupcollapsed")) {
          tk.toggleGroupCollapsed(g[0]);
        }
      }

      delete tk._groupsToReExpandAfterSearch;
    }
  };

//}##########################
//{=== Mouse Gestures
//|##########################

  /// Private Globals:

  /// Initialisation:
  this.initMouseGestures = function initMouseGestures(event) {
    // event `wheel` is supported since Firefox 17, but was buggy (tested on 38.3.0)
    // It's not always fired
    // https://developer.mozilla.org/en-US/docs/Web/Events/wheel
    //
    // We keep using event `DOMMouseScroll`. It's deprecated but more reliable.
    // https://developer.mozilla.org/en-US/docs/Web/Events/DOMMouseScroll
    gBrowser.tabContainer.addEventListener("DOMMouseScroll", tk.onTabWheelGesture, true);

    // Move Close Tab Before/After to the tab context menu (from the Tools menu)
    var tabContextMenu = gBrowser.tabContextMenu;
    var closeAllTabsButButton = document.getElementById("context_closeOtherTabs");
    if (closeAllTabsButButton){
      tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsToLeft"), closeAllTabsButButton);
      tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsToRight"), closeAllTabsButButton);
      tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsAbove"), closeAllTabsButButton);
      tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsBelow"), closeAllTabsButButton);

      tk.mapBoolPrefToAttribute("closeBeforeAfterNotOther", document.getElementById("mainPopupSet"), "closebeforeafternotother");
    }
    else
      tk.dump("Could not find removeAllTabsBut");
  };
  this.initListeners.push(this.initMouseGestures);

  this.onTabWheelGesture = function onTabWheelGesture(event) {
    if (!event.isTrusted)
      return;

    var isUsingTabSheelSwitch = false;
    try {
      // The external preference key entry(s) could be missing, so we use try catch here
      isUsingTabSheelSwitch = gPrefService.getBoolPref("extensions.tabkit.mouse-gestures.tabWheelSwitchHover");
    } catch(ex) {}

    var name = event.originalTarget.localName;
    // If scroll on scrollbar or similar thing, scroll,
    // otherwise only scroll when it is not used for switching tabs
    if (!isUsingTabSheelSwitch ||
      (name == "scrollbar" || name == "scrollbarbutton" || name == "slider" || name == "thumb")) {
      // Scrollwheeling above an overflow scrollbar should still scroll 3 lines if vertical or 2 lines if multi-row tab bar
      var scrollbar = tk.VerticalTabBarScrollbar.getElement();
      if (!scrollbar) {
        tk.dump("tabInnerBox.mVerticalScrollbar is null - so what scrollbar did we scroll over?!");
        return;
      }

      if (tk.TabBar.Mode.getIsVerticalMode())
        var delta = (Math.abs(event.detail) != 1 ? event.detail : (event.detail < 0 ? -3 : 3)) * 24;
      else if (gBrowser.tabContainer.getAttribute("multirow") == "true")
        var delta = event.detail < 0 ? -48 : 48; // 2*24
      else
        return;

      var curpos = scrollbar.getAttribute("curpos");
      curpos = curpos == "NaN" ? 0 : Number(curpos);
      var maxpos = Number(scrollbar.getAttribute("maxpos"));
      var newpos = Math.min(maxpos, Math.max(0, curpos + delta));
      scrollbar.setAttribute("curpos", newpos);

      event.preventDefault();
      event.stopPropagation();
    }
  };

  this.removeTabsBefore = function removeTabsBefore(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;
    for (var i = contextTab._tPos - 1; i >= 0; i--)
      gBrowser.removeTab(_tabs[i]);
  };
  this.removeTabsAfter = function removeTabsAfter(contextTab) {
    if (!contextTab)
      contextTab = gBrowser.selectedTab;
    for (var i = _tabs.length - 1; i > contextTab._tPos; i--)
      gBrowser.removeTab(_tabs[i]);
  };

  /// Method hooks:
  /* this.earlyMethodHooks.push([
    'gBrowser.warnAboutClosingTabs',//{

    'numTabs = this.tabContainer.childNodes.length;',
    'numTabs = (typeof aAll == "number" ? aAll : this.tabContainer.childNodes.length);'
  ]);//} */

//}##########################
//{=== Scrollbars not arrows
//|##########################

  // TODO=P4: UVOICE Bug 345378 - tab preview from all tabs menupopup
  // TODO=P4: N/A Middle/right-click All Tabs menu, drag & drop
  // TODO=P5: N/A Double-click scroll buttons -> scroll to start/end

  /// Private Globals:
  var _allTabsInnerBox;

  /// Initialisation:
  this.initScrollbarsNotArrows = function initScrollbarsNotArrows(event) {
    //tk.mapBoolPrefToAttribute("scrollbarsNotArrows", document.documentElement, "scrollbarsnotarrows"); // disabling the attribute didn't disable the overflow auto, so it's best to only apply changes to new windows
    if (_prefs.getBoolPref("scrollbarsNotArrows"))
      document.documentElement.setAttribute("scrollbarsnotarrows", "true");
    tk.addDelayedEventListener(_tabContainer.mAllTabsPopup, "popupshowing", tk.scrollAllTabsMenu);
  };
  this.initListeners.push(this.initScrollbarsNotArrows);

  /// Event Listeners:
  this.scrollAllTabsMenu = function scrollAllTabsMenu(event) {
    if (!_allTabsInnerBox) {
      var arrowScrollBox = _tabContainer.mAllTabsPopup.popupBoxObject.firstChild;
      if (!arrowScrollBox) {
        tk.dump("_tabContainer.mAllTabsPopup.popupBoxObject.firstChild is null");
        return;
      }
      _allTabsInnerBox = document.getAnonymousElementByAttribute(arrowScrollBox._scrollbox, "class", "box-inherit scrollbox-innerbox");
    }
    tk.scrollToElement(_allTabsInnerBox, gBrowser.selectedTab.mCorrespondingMenuitem);
  };

//}##########################
//{=== Open Selected Links
//|##########################

  /// Initialisation:
  this.initOpenSelectedLinks = function initOpenSelectedLinks(event) {
    tk.addDelayedEventListener(document.getElementById("contentAreaContextMenu"), "popupshowing", tk.openSelectedLinks_onPopupShowing);
  };
  this.initListeners.push(this.initOpenSelectedLinks);

  /// Event Listeners:
  // TODO=P4: GCODE Localize Open Selected Links
  this.openSelectedLinks_onPopupShowing = function openSelectedLinks_onPopupShowing(event) {
    var topMenuItem = document.getElementById("context_tabkit-opentopselectedlinks");
    var menuItem = document.getElementById("context_tabkit-openselectedlinks");
    var textMenuItem = document.getElementById("context_tabkit-openselectedtextlinks");
    topMenuItem.hidden = menuItem.hidden = textMenuItem.hidden = true;
    topMenuItem.tabkit_selectedLinks = menuItem.tabkit_selectedLinks = textMenuItem.tabkit_selectedLinks = null;

    if (!_prefs.getBoolPref("openSelectedLinks"))
      return;

    var oneItemOnly = !_prefs.getBoolPref("openSelectedLinks.showAll");

    var uris, topUris;
    [uris, topUris] = tk.openSelectedLinks_getURIs();

    if (topUris.length > 0 && topUris.length < uris.length) {
      var s = topUris.length > 1 ? "s" : "";
      topMenuItem.setAttribute("label", "Open Main " + topUris.length + " Link" + s + " in New Tab" + s);
      topMenuItem.tabkit_selectedLinks = topUris;
      topMenuItem.tabkit_linkSource = content.document.documentURI; // TODO=P4: TJS Should this be focusedWindow?
      topMenuItem.hidden = false;
      if (oneItemOnly)
        return;
    }

    if (uris.length > 0) {
      var s = uris.length > 1 ? "s" : "";
      var all = topUris.length < uris.length ? "All " : "";
      menuItem.setAttribute("label", "Open " + all + uris.length + " Link" + s + " in New Tab" + s);
      menuItem.tabkit_selectedLinks = uris;
      menuItem.tabkit_linkSource = content.document.documentURI; // TODO-P4: TJS Should this be focusedWindow?
      menuItem.hidden = false;
      if (oneItemOnly)
        return;
    }

    var textUris = tk.openSelectedLinks_getTextURIs();

    if (textUris.length > 0) {
      var s = textUris.length > 1 ? "s" : "";
      textMenuItem.setAttribute("label", "Open " + textUris.length + " Text Link" + s + " in New Tab" + s);
      textMenuItem.tabkit_selectedLinks = textUris;
      textMenuItem.tabkit_linkSource = content.document.documentURI; // TODO-P4: TJS Should this be focusedWindow?
      textMenuItem.hidden = false;
    }
  };

  this.openSelectedLinks_getURIs = function openSelectedLinks_getURIs() {
    var focusedWindow = document.commandDispatcher.focusedWindow; // Support frames
    if (focusedWindow == window)
      focusedWindow = content;

    var selection = focusedWindow.getSelection();

    var uris = [], topUris = [];

    var largestSize = 0;

    for (var i = 0; i < selection.rangeCount; i++) {
      var treeWalker = focusedWindow.document.createTreeWalker(
        selection.getRangeAt(i).cloneContents(),
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: function(node) {
            return node.localName.toLowerCase() == "a" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
          }
        },
        true
      );

      while (treeWalker.nextNode()) {
        var node = treeWalker.currentNode;

        if (!node.href
          || (node.href.indexOf('http') != 0
            && node.href.indexOf('file') != 0
            && node.href.indexOf('ftp') != 0))
        {
          continue;
        }

        var uri = node.href;
        /*
        uri = gBrowser.mURIFixup.createFixupURI(uri, gBrowser.mURIFixup.FIXUP_FLAGS_MAKE_ALTERNATE_URI);
        if (uri == null)
          continue;
        uri = uri.spec;
        */
        if (uris.indexOf(uri) == -1)
          uris.push(uri);

        var size = parseInt(focusedWindow.getComputedStyle(node, null).getPropertyValue("font-size"));
        if (size > largestSize) {
          largestSize = size;
          topUris.length = 0; // Clear previous uris
        }
        else if (size < largestSize)
          continue;

        if (topUris.indexOf(uri) == -1)
          topUris.push(uri);
      }
    }

    return [uris, topUris];
  };

  this.openSelectedLinks_getTextURIs = function openSelectedLinks_getTextURIs() {
    var focusedWindow = document.commandDispatcher.focusedWindow; // Support frames
    if (focusedWindow == window)
      focusedWindow = content;

    var uris = [];

    var selectedText = focusedWindow.getSelection().toString();
    return tk.detectURIsFromText(selectedText);
  };

  this.openSelectedLinks = function openSelectedLinks(menuItem) {
    if (!menuItem.tabkit_selectedLinks)
      return;
    var uris = menuItem.tabkit_selectedLinks.filter(function __uriSecurityCheck(uri) {
      // URL Loading Security Check
      try {
        var linkSourceURI = _ios.newURI(menuItem.tabkit_linkSource, null, null);
        var linkSourcePrinciple = _sm.getCodebasePrincipal(linkSourceURI);

        _sm.checkLoadURIStrWithPrincipal(linkSourcePrinciple, uri, _sm.STANDARD);
        return true;
      }
      catch (ex) {
        return false;
      }
    });

    let selected_tab_before_operation = gBrowser.selectedTab;

    tk.addingTab({
      parent_tab: selected_tab_before_operation,
      added_tab_type: "related"
    });
    var first_tab = gBrowser.addTab(uris.shift());
    tk.addingTabOver({
      added_tab: first_tab,
      added_tab_type: "related",
      parent_tab: selected_tab_before_operation,
      should_keep_added_tab_position: false
    });

    for each (var uri in uris) {
      tk.addingTab({
        parent_tab: selected_tab_before_operation,
        added_tab_type: "related"
      });
      let new_tab = gBrowser.addTab(uri);
      tk.addingTabOver({
        added_tab: new_tab,
        added_tab_type: "related",
        parent_tab: selected_tab_before_operation,
        should_keep_added_tab_position: false
      });
    }

    if (!gPrefService.getBoolPref("browser.tabs.loadInBackground")) {
      gBrowser.selectedTab = first_tab;
    }
  };

  // Open the URL(s) in clipboard & create a group with opened tabs (if > 1)
  this.openClipboardLinks = function openClipboardLinks(contextTab) {
    var unicodeString = '';

    try {
      var transferable = Components.classes["@mozilla.org/widget/transferable;1"]
                         .createInstance(Components.interfaces.nsITransferable);
      var clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].
                      createInstance(Components.interfaces.nsIClipboard);

      // Store the transfered data
      var unicodeStringObject = new Object();
      var unicodeStringLengthObject = new Object();

      if ('init' in transferable) transferable.init(null); // Gecko 16

      transferable.addDataFlavor("text/unicode");
      clipboard.getData(transferable, clipboard.kGlobalClipboard);
      transferable.getTransferData("text/unicode", unicodeStringObject, unicodeStringLengthObject);

      if (unicodeStringObject) {
        unicodeString = unicodeStringObject.value.QueryInterface(Components.interfaces.nsISupportsString).toString();
      }
    } catch (ex) {
      return;
    }

    var uris = tk.detectURIsFromText(unicodeString);

    if (uris.length == 0) {
      return;
    }

    var firstTab = gBrowser.addTab(uris.shift());
    var lastTab = firstTab;
    for each (var uri in uris) {
      lastTab = gBrowser.addTab(uri);
    }
    if (!gPrefService.getBoolPref("browser.tabs.loadInBackground")) {
      gBrowser.selectedTab = firstTab;
    }
    // Even has one tab, lastTab == firstTab so this method would do nothing
    tk.makeGroupBetweenTwoTabs(firstTab, lastTab);
  };

  // @return [Array]
  this.detectURIsFromText = function detectURIsFromText(textToDetect) {
    var uris = [];
    if (textToDetect == "")
      return uris;

    // Using regex from http://www.regexguru.com/2008/11/detecting-urls-in-a-block-of-text/
    // This matches anything starting with www., ftp., http://, https:// or ftp://
    // and containing common URL characters, but the final character is restricted (for
    // example URLs mustn't end in brackets, dots, or commas). It will however correctly
    // recognise urls such as http://en.wikipedia.org/wiki/Rock_(disambiguation) by
    // specifically permitting singly-nested matching brackets.
    var matches = textToDetect.match(/\b(?:(?:https?|ftp):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/ig);
    if (matches == null) {
      return uris;
    }

    for (var i = 0; i < matches.length; i++) {
      var uri = matches[i];
      uri = gBrowser.mURIFixup.createFixupURI(uri, gBrowser.mURIFixup.FIXUP_FLAGS_MAKE_ALTERNATE_URI);
      if (uri == null)
        continue;
      uri = uri.spec;
      if (uris.indexOf(uri) == -1)
        uris.push(uri);
    }

    return uris;
  };

//}##########################
//{=== Modification for Fx4+
//|##########################
  this.postInitFx4Modifications = function postInitFx4Modifications(event) {
    // Not sure if pinned tab works in horizontal mode, but still BAM!
    (function() {
      "use strict";

      if (typeof gBrowser.pinTab !== "function") {
        tk.debug("gBrowser.pinTab doesn't exists, replacing function failed");
        return;
      }

      var old_func = gBrowser.pinTab;
      // Function signature should be valid for FF 38.x & 45.x
      gBrowser.pinTab = function(aTab) {
        "use strict";
        var result = undefined;

        tk.debug(">>> gBrowser.pinTab >>>");
        if (tk.TabBar.Mode.getIsVerticalMode()) {
          alert("Sorry, Tab Kit 2nd Edition does not support App Tabs in Vertical mode");
        }
        else {
          result = old_func.apply(this, [aTab]);
        }
        tk.debug("<<< gBrowser.pinTab <<<");

        return result;
      };
    })();

    // Issue 22, some weird behavior by the new animation related functions which mess with tabs' maxWidth
    (function() {
      "use strict";

      if (typeof gBrowser.tabContainer._lockTabSizing !== "function") {
        tk.debug("gBrowser.tabContainer._lockTabSizing doesn't exists, replacing function failed");
        return;
      }

      var old_func = gBrowser.tabContainer._lockTabSizing;
      // Function signature should be valid for FF 38.x & 45.x
      gBrowser.tabContainer._lockTabSizing = function(aTab) {
        "use strict";
        var result = undefined;

        tk.debug(">>> gBrowser.tabContainer._lockTabSizing >>>");
        result = old_func.apply(this, [aTab]);
        // Reset max-width
        let numPinned = this.tabbrowser._numPinnedTabs;
        var tabs = this.tabbrowser.visibleTabs;
        for (let i = numPinned; i < tabs.length; i++) {
          let tab = tabs[i];
          // clear the value
          tab.style.setProperty("max-width", "");
        }
        tk.debug("<<< gBrowser.tabContainer._lockTabSizing <<<");

        return result;
      };
    })();
  };
  this.postInitFx4TabEffects = function postInitFx4TabEffects(event) {
    // https://developer.mozilla.org/en-US/docs/Web/Events/fullscreen
    window.addEventListener("fullscreen", tk.onFullScreenToggle, false);
  };
  this.postInitListeners.push(this.postInitFx4Modifications);
  this.postInitListeners.push(this.postInitFx4TabEffects);

  // Good for HTML5 full screen video viewing
  this.onFullScreenToggle = function onFullScreenToggle(event) {
    var tabsToolbar = document.getElementById("TabsToolbar"); //FF4+ tabbar
    // This value is the value before switch, tested in FF 31.1.0 & 36.0.1
    var isFullScreenBeforeEvent = window.fullScreen;
    if (_prefs.getCharPref("tabbar_fullscreen_value_meaning_in_callback") == "value_after_change") {
      isFullScreenBeforeEvent = !isFullScreenBeforeEvent;
    }

    var willBeFullScreen = !isFullScreenBeforeEvent;
    var splitter = document.getElementById("tabkit-splitter");

    // Type: String
    // Values:
    // - `auto_collapse_with_spitter_visible`
    // - `auto_collapse_with_spitter_hidden`
    // - `do_nothing`
    var full_screen_behaviour_preference_value = _prefs.getCharPref("tabbarFullscreenBehaviour");
    var should_hide_spitter_on_collapse = (full_screen_behaviour_preference_value === "auto_collapse_with_spitter_hidden");

    if (!splitter) {
      //only collapsed splitter in vertical mode
      return;
    }
    if (full_screen_behaviour_preference_value === "do_nothing") {
      // Nothing needs to be done
      return;
    }

    if (willBeFullScreen) {
      tk.debug("gonna set splitter collapsed");
      splitter.setAttribute("state", "collapsed");

      if (should_hide_spitter_on_collapse) {
        tk.debug("gonna set splitter hidden");
        splitter.setAttribute("hidden", "true");
      }
    }
    else {
      tk.debug("gonna set splitter open");
      splitter.setAttribute("state", "open");
      tabsToolbar.removeAttribute("collapsed");

      if (should_hide_spitter_on_collapse) {
        tk.debug("gonna set splitter visible");
        splitter.removeAttribute("hidden");
      }
    }
  };

  this.onPrefTabsonTopChanged = function onPrefTabsonTopChanged() {
    if (tk.localPrefService.getBoolPref("firefox.tabsontop.force_disable.enabled") === false) {
      return;
    }
    if (gPrefService.getBoolPref("browser.tabs.onTop") === true) {
      gPrefService.setBoolPref("browser.tabs.onTop", false);
    }
  };
  this.initOnPrefTabsonTopChanged = function initOnPrefTabsonTopChanged(event) {
    tk.addGlobalPrefListener("browser.tabs.onTop", tk.onPrefTabsonTopChanged);

    // Run it once on start
    tk.onPrefTabsonTopChanged();
  };
  this.initListeners.push(this.initOnPrefTabsonTopChanged);


//}##########################
//{=== DPI
//|##########################

  //Private Constant
  var _DPI_MIN = 96;
  var _DPI_MAX = 192;

  this.initDPI = function initDPI(event) {
    tk.addPrefListener("DPIValue", tk.updateComponentSizeByDPI);
  };
  this.initListeners.push(this.initDPI);

  this.updateComponentSizeByDPI = function updateComponentSizeByDPI() {

    var DPIValue = _prefs.getIntPref("DPIValue");

    tk.debug('DPIValue before = ' + DPIValue);

    // auto fix out of range value
    if (DPIValue < _DPI_MIN) {
      _prefs.setIntPref("DPIValue",_DPI_MIN);
      DPIValue = _DPI_MIN;
    }
    if (DPIValue > _DPI_MAX) {
      _prefs.setIntPref("DPIValue",_DPI_MAX);
      DPIValue = _DPI_MAX;
    }

    // calculate and set value for "layout.css.devPixelsPerPx"
    var result = DPIValue / 96; //Result always relative to 96, not changable (unless Firefox did it)
    tk.debug('DPIValue after = ' + DPIValue);
    tk.debug('Going to set layout.css.devPixelsPerPx to ' + result);
    gPrefService.setCharPref("layout.css.devPixelsPerPx", result.toFixed(2));
  };


  // ### Panorama Related
  this.Panorama = this.Panorama || {};
  this.Panorama.Initializers = this.Panorama.Initializers || {};
  this.Panorama.Initializers.addMethodHookOnPostInit = function addMethodHookOnPostInit(event) {
    // Disable Panorama, why use Panorama when you have Tabkit?
    // This feature is removed from 45.x
    (function() {
      "use strict";

      if (typeof TabView !== "object" ||
          typeof TabView.toggle !== "function") {
        tk.debug("TabView.toggle doesn't exists, replacing function failed");
        return;
      }

      var old_func = TabView.toggle;
      // Function signature should be valid for FF 38.x & 45.x
      TabView.toggle = function() {
        "use strict";
        var result = undefined;

        tk.debug(">>> TabView.toggle >>>");
        if (tk.localPrefService.getBoolPref("panorama.enabled") === false) {
          alert("Sorry, but Tabkit 2 does not support Panorama (They use the same API). Why use Panorama when you have Tabkit 2? :)");
        }
        else {
          result = old_func.apply(this, []);
        }
        tk.debug("<<< TabView.toggle <<<");

        return result;
      };
    })();
  };
  this.postInitListeners.push(this.Panorama.Initializers.addMethodHookOnPostInit);

//}##########################
//{### Debug Aids
//|##########################

  // Allows external access to private members of tabkit to aid debugging
  // this._eval = function _eval(exp) {
    // return eval(exp);
  // };

  //Cannot find this extension, so no use
  /* this.preInitDebugAids = function preInitDebugAids(event) {
    // quickprompt requires my (currently unreleased) QuickPrompt extension (I use this for debugging)
    if ("quickprompt" in window) {
      window.tkprompt = function tkprompt() {
        quickprompt(tabkit._eval, "Tab Kit QuickPrompt", help(), "");
      };
      document.getElementById("cmd_quickPrompt").addEventListener("command", function() {
        tkprompt();
      });
    }
  };
  this.preInitListeners.push(this.preInitDebugAids); */

//}##########################
//|### End of tabkit object
//|##########################

};
// `this` in FF 45 is a `Sandbox` not a `ChromeWindow`
// Using reference `window` ensures it is a `ChromeWindow`
// Tested in FF 45.0 & 38.7.0
})(window);



window.addEventListener("DOMContentLoaded", tabkit.onDOMContentLoaded, false);
window.addEventListener("load", tabkit.onLoad, false);
