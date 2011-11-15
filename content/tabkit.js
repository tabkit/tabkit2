/**
 * TabKit 2nd Edition(TabKit 2 for short) - http://code.google.com/p/tabkit-2nd-edition/
 * Copyright (c) 2007-2010 John Mellor
 * Copyright (c) 2011 Leung Ho Kuen
 * 
 * This file is part of TabKit 2.
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

var tabkit = new function _tabkit() { // Primarily just a 'namespace' to hide our stuff in

	//|##########################
	//{### Basic Constants
	//|##########################

	/// Private globals:
	const tk = this; // Functions passed as parameters lose their this, as do nested functions, and tabkit is a bit long(!), so store it in 'tk'
	
	const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
	
	const Cc = Components.classes;
	const Ci = Components.interfaces;
	
	const PREF_BRANCH = "extensions.tabkit.";

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
				var message = 'TK Error: "' + error + '"\nat:\u00A0' + stack.replace("\n@:0", "").replace(/\n/g, "\n	  "); // \u00A0 is a non-breaking space
				var sourceName   = (haveException && "fileName"	 in actualException && actualException.fileName)	 ? actualException.fileName	 : Components.stack.caller.filename;
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
	//var _isFx3;
	//var _isFx4;		//added by Pika, it means FF4 or later, since the layout is not changed much (And I don't want it to change again!)
	
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

		//_isFx3 = (document.getElementById("browser-stack") == null);
		//_isFx4 = (document.getElementById("TabsToolbar") != null);	//add by Pika, only FF4+ got TabsToolBar
		
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
						styleSheet.deleteRule(ii);
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

	/// Private Globals:
	var _tabContainer;
	var _tabstrip;
	var _tabInnerBox;
	var _tabs;
	var _tabBar;
	
	/// Initialisation:
	this.preInitShortcuts = function preInitShortcuts(event) {
		//tk.assert('window.location == "chrome://browser/content/browser.xul"', function(e) eval(e), "preInitShortcuts should only be run in browser windows, as tabkit.js is only loaded into browser.xul");
		if(window.location != "chrome://browser/content/browser.xul")
			tk.dump("preInitShortcuts should only be run in browser windows, as tabkit.js is only loaded into browser.xul");
		
		// Make sure we can use gBrowser from now on if this is a browser window
		getBrowser();
		//tk.assert('gBrowser', function(e) eval(e), "gBrowser must not be null after preInitShortcuts!");
		if(!gBrowser)
			tk.dump("gBrowser must not be null after preInitShortcuts!");
		
		_tabContainer = gBrowser.tabContainer;
		_tabstrip = _tabContainer.mTabstrip;
		_tabInnerBox = document.getAnonymousElementByAttribute(_tabstrip._scrollbox, "class", "box-inherit scrollbox-innerbox");
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
		gPrefService.QueryInterface(Ci.nsIPrefBranch2);

		// Do this in preInit just in case something expects their init prefListener to work 'instantly'
		tk.addGlobalPrefListener(PREF_BRANCH, tk.localPrefsListener);
	};
	this.preInitListeners.push(this.preInitPrefsObservers);

	/// Pref Listeners:
	// This listener checks all changes to the extension's pref branch, and delegates them to their registered listeners
	// Presumeably more efficient than simply adding a global observer for each one...
	this.localPrefsListener = function localPrefsListener(changedPref) {
		changedPref = changedPref.substring(PREF_BRANCH.length); // Remove prefix for these local prefs
		for (var pref in _localPrefListeners) {
			if (changedPref.substring(0, pref.length) == pref) {
				for each (var listener in _localPrefListeners[pref]) {
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

				register: function() {
					gPrefService.addObserver(prefString, this, false);
				},

				unregister: function() {
					gPrefService.removeObserver(prefString, this);
				},

				observe: function(aSubject, aTopic, aData) {
					if (aTopic != "nsPref:changed") return;
					// aSubject is the nsIPrefBranch we're observing (after appropriate QI)
					// aData is the name of the pref that's been changed (relative to aSubject)
					for each (var listener in this.listeners) {
						listener(aData);
					}
				}
			};

			window.addEventListener("unload", function() { _globalPrefObservers[prefString].unregister(); }, false);
			_globalPrefObservers[prefString].register();
		}

		_globalPrefObservers[prefString].listeners.push(prefListener);
	};

	this.addPrefListener = function addPrefListener(pref, listener) {
		if (!_localPrefListeners[pref]) {
			_localPrefListeners[pref] = [];
		}
		_localPrefListeners[pref].push(listener);
	};

	//}##########################
	//{### Pref-attribute Mapping
	//|##########################

	this.mapPrefsToAttribute = function mapPrefsToAttribute(prefs, test, node, attribute) {
		var listener = function() {
			var value = test();
			if (value !== undefined) {
				node.setAttribute(attribute, value);
			}
			else {
				node.removeAttribute(attribute);
			}
		};

		for each (var pref in prefs) {
			tk.addPrefListener(pref, listener);
		}

		listener();
	};

	this.mapBoolPrefToAttribute = function mapBoolPrefToAttribute(pref, node, attribute) {
		tk.mapPrefsToAttribute([pref], function() { return _prefs.getBoolPref(pref) ? "true" : undefined; }, node, attribute);
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
	this.addMethodHook = function addMethodHook(hook) {
		try {
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
			
			for (var i = 1; i < hook.length; ) {
				var newCode = code.replace(hook[i++], hook[i++]);
				if (newCode == code) {
					tk.log("Method hook of \"" + hook[0] + "\" had no effect, when replacing:\n" + uneval(hook[i - 2]) + "\nwith:\n" + uneval(hook[i - 1]));
				}
				else {
					code = newCode;
				}
			}
			
			eval(hook[0]+"="+code);
		}
		catch (ex) {
			tk.dump("Method hook of \"" + hook[0] + "\" failed with exception:\n" + ex + "\nCode: "+code.substring(0,150), ex);
		}
	};

	// TODO=P4: GCODE prepend/append/wrapMethodCode could be done without modifying the actual method to preserve closures
	this.prependMethodCode = function prependMethodCode(methodname, codestring) {
		tk.addMethodHook([methodname, '{', '{' + codestring]);
	};

	this.appendMethodCode = function appendMethodCode(methodname, codestring) {
		tk.addMethodHook([methodname, /\}$/, codestring + '}']);
	};

	this.wrapMethodCode = function wrapMethodCode(methodname, startcode, endcode) {
		//tk.addMethodHook([methodname, /\{([^]*)\}$/, '{' + startcode + '$&' + endcode + '}']);
		tk.addMethodHook([methodname, '{', '{' + startcode, /\}$/, endcode + '}']);
	};

	//}##########################
	//{>>> Sorting & Grouping
	//|##########################

	// TODO=P3: UVOICE Allow viewing tabs in sorted order without reordering them OR undoing sorts
	// TODO=P4: GCODE Check outoforder is set as appropriate (tabs that have been moved or added contrary to the prevailing sort and should be ignored when placing new tabs by sort order)
	// TODO=P5: ??? Back to the tab the current tab is opened from, by the "Back" button; Forward to tabs opened from the current tab, by the "Forward" button

	/// Enums:
	this.Sorts = {
		creation:   "tabid",		  // == Firefox: new tabs to far right
		lastLoaded: "lastLoadedKey",
		lastViewed: "lastViewedKey",  // == Visual Studio: last used tabs to far left (except they go to the right for consistency :/)
		origin:	 "possibleparent", // == Tabs Open Relative [n.b. possibleparent is _not_ a key, it is special cased]
		title:	  "label",
		uri:		"uriKey"
	};

	this.Groupings = {
		none:	   "",
		opener:	 "openerGroup",	// Can be internally sorted by origin
		domain:	 "uriGroup"		// Can be internally sorted by uri
	};
	
	this.RelativePositions = {
		left:			   1,
		right:			  2,
		rightOfRecent:	  3,		// Right of consecutive tabs sharing a possibleparent marked recent; all recent tabs are reset on TabSelect
		rightOfConsecutive: 4		 // Right of consecutive tabs sharing a possibleparent
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
		var sortName = tk.getWindowValue("activeSort");
		if (!sortName) {
			sortName = _prefs.getCharPref("lastActiveSort");
			if (!sortName in tk.Sorts)
				sortName = "creation";
			tk.setWindowValue("activeSort", sortName);
		}
		return sortName;
	});
	this.__defineSetter__("activeSort", function __set_activeSort(sortName) {
		if (sortName in tk.Sorts) {
			tk.setWindowValue("activeSort", sortName);
			_prefs.setCharPref("lastActiveSort", sortName);
		}
		else tk.dump("activeSort - invalid sort name: " + sortName);
		return sortName;
	});
	
	this.__defineGetter__("activeGrouping", function __get_activeGrouping() {
		var groupingName = tk.getWindowValue("activeGrouping");
		if (!groupingName) {
			groupingName = _prefs.getCharPref("lastActiveGrouping");
			if (!groupingName in tk.Groupings)
				groupingName = "none";
			tk.setWindowValue("activeGrouping", groupingName);
		}
		return groupingName;
	});
	this.__defineSetter__("activeGrouping", function __set_activeGrouping(groupingName) {
		if (groupingName in tk.Groupings) {
			tk.setWindowValue("activeGrouping", groupingName);
			_prefs.setCharPref("lastActiveGrouping", groupingName);
		}
		else tk.dump("activeGrouping - invalid grouping name: " + groupingName);
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
		else tk.dump("openRelativePosition - invalid position name: " + positionName);
		return positionName;
	});
	
	this.__defineGetter__("newTabPosition", function __get_newTabPosition() {
		var position = tk.getWindowValue("newTabPosition");
		if (position !== "")
			return Number(position);
		position = _prefs.getIntPref("newTabPosition");
		if (position >= 0 && position <= 2) {
			tk.setWindowValue("newTabPosition", position);
			return position;
		}
		else {
			tk.log("newTabPosition - invalid pref value: " + position);
			return 0;
		}
	});
	this.__defineSetter__("newTabPosition", function __set_newTabPosition(position) {
		if (position >= 0 && position <= 2) {
			tk.setWindowValue("newTabPosition", position);
			_prefs.setIntPref("newTabPosition", position);
		}
		else tk.dump("newTabPosition - invalid position: " + position);
		return position;
	});
	
	this.__defineGetter__("autoGroupNewTabs", function __get_autoGroupNewTabs() {
		var bool = tk.getWindowValue("autoGroupNewTabs");
		if (bool != "") {
			return bool == "true" ? true : false;
		}
		else {
			bool = _prefs.getBoolPref("autoGroupNewTabs");
			tk.setWindowValue("autoGroupNewTabs", bool);
			return bool;
		}
	});
	this.__defineSetter__("autoGroupNewTabs", function __set_autoGroupNewTabs(bool) {
		tk.setWindowValue("autoGroupNewTabs", bool);
		_prefs.setBoolPref("autoGroupNewTabs", bool);
		return bool;
	});


	/// Initialisation:
	this.initSortingAndGrouping = function initSortingAndGrouping(event) {

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
		
		tk.addPrefListener("forceThemeCompatibility", tk.detectTheme);
		tk.addPrefListener("colorTabNotLabel", tk.detectTheme);
		tk.addPrefListener("minSaturation", tk.regenSaturationLightness);
		tk.addPrefListener("maxSaturation", tk.regenSaturationLightness);
		tk.addPrefListener("minLightness", tk.regenSaturationLightness);
		tk.addPrefListener("maxLightness", tk.regenSaturationLightness);
		tk.addPrefListener("indentedTree", tk.toggleIndentedTree);
		tk.addPrefListener("maxTreeLevel", tk.updateIndents);
		tk.addPrefListener("indentAmount", tk.updateIndents);
		tk.addPrefListener("autoCollapse", tk.updateAutoCollapse);
		
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
		var tabContextMenu = _tabContainer.contextMenu;
		tabContextMenu.insertBefore(document.getElementById("menu_tabkit-sortgroup"), tabContextMenu.childNodes[1]);
		
		// Fixed Issue 11 by Pika
		// After each tab selecting/switching the whole list of tabs is called against gBrowser.showTab (Source not found, guessed to be Panorama)
		// So this method hook disallows those collapsed and hidden tabs to be expanded by that unknown source
		tk.addMethodHook([
			"gBrowser.showTab",
			
			'if (aTab.hidden) {',
			' \
			$& \
			if(aTab.hasAttribute("groupcollapsed")) return;',
		]);
	};
	this.initListeners.push(this.initSortingAndGrouping);

	/// More globals (for group by opener):
	this.nextType = null;
	this.isBookmarkGroup = false;
	this.nextParent = null;
	this.lastParent = null;
	this.dontMoveNextTab = false;
	this.ignoreOvers = 0; // TODO=P5: TJS Auto unset this after a timeout?
	this.addedTabs = [];
	
	/// Method Hooks (for group by opener):
	this.preInitSortingAndGroupingMethodHooks = function preInitSortingAndGroupingMethodHooks(event) {
		// Calculate a stack in addTab, since event listeners can't get to it anymore due to https://bugzilla.mozilla.org/show_bug.cgi?id=390488 (fixed now, but kept this way for compatibility)
		tk.addMethodHook([
			'gBrowser.addTab',
			
			't.dispatchEvent(evt);',
			'if (tabkit.sourceTypes.length) { \
				evt.stack = [ arguments.callee ]; \
				evt.stackDepth = 0; \
				while (evt.stackDepth < tabkit.sourceTypes[0].d) { \
					var prev = evt.stack[evt.stackDepth].caller; \
					if (prev) { \
						evt.stack.push(prev); \
						evt.stackDepth++; \
					} \
					else { \
						break; \
					} \
				} \
			} \
			$&'
		]);
		
		var relatedTabSources = [
			'nsContextMenu.prototype.openLinkInTab',//{
			'nsContextMenu.prototype.openFrameInTab',
			'nsContextMenu.prototype.viewBGImage',
			'nsContextMenu.prototype.addDictionaries'
			// And nsBrowserAccess.prototype.openURI if !isExternal
			// And <menuitem id="menu_HelpPopup_reportPhishingtoolmenu">
			// See also sourceTypes
		];//}
		if ('viewMedia' in nsContextMenu.prototype) // [Fx3.5+]
			relatedTabSources.push('nsContextMenu.prototype.viewMedia');
		else // [Fx3-]
			relatedTabSources.push('nsContextMenu.prototype.viewImage');
		
		var newTabSources = [
			// See sourceTypes
		];
		
		var unrelatedTabSources = [
			'BrowserSearch.loadAddEngines'//{
			// Should add extensions.js->openURL too, but unrelated is the default after all...
			// See also sourceTypes
		];//}
		
		// Process all simple related tab sources:
		for each (var s in relatedTabSources) {
			tk.wrapMethodCode(s, 'tabkit.addingTab("related"); try {', '} finally { tabkit.addingTabOver(); }');
		}
		
		// Process all simple new tab sources:
		for each (var s in newTabSources) {
			tk.wrapMethodCode(s, 'tabkit.addingTab("newtab"); try {', '} finally { tabkit.addingTabOver(); }');
		}
		
		// Process all simple unrelated tab sources:
		for each (var s in unrelatedTabSources) {
			tk.wrapMethodCode(s, 'tabkit.addingTab("unrelated"); try {', '} finally { tabkit.addingTabOver(); }');
		}
		
		// And a sometimes related, sometimes unrelated tab source:
		tk.wrapMethodCode(
			'nsBrowserAccess.prototype.openURI',
			'tabkit.addingTab(aContext == Ci.nsIBrowserDOMWindow.OPEN_EXTERNAL ? "unrelated" : "related"); try {',
			'} finally { tabkit.addingTabOver(); }'
		);
		
		// And an attribute based related tab source:
		var reportPhishing = document.getElementById("menu_HelpPopup_reportPhishingtoolmenu");
		if (reportPhishing)
			reportPhishing.setAttribute("oncommand", 'tabkit.addingTab("related"); try {' + reportPhishing.getAttribute("oncommand") + '} finally { tabkit.addingTabOver(); }');
		
		// And an attribute based history tab source:
		var goMenu = document.getElementById("history-menu");
		if (!goMenu)
			goMenu = document.getElementById("go-menu");
		if (goMenu)
			goMenu.setAttribute("oncommand", 'tabkit.addingTab("history"); try {' + goMenu.getAttribute("oncommand") + '} finally { tabkit.addingTabOver(); }');
		
		// And another
		// TODO=P5: GCODE document.getElementById("sidebar").contentDocument.getElementById("miOpenInNewTab") [set onload and onopensidebar]
		
		// And deal with tab groups
		tk.wrapMethodCode(
			'gBrowser.loadTabs',
			'tabkit.addingTabs(aReplace ? gBrowser.selectedTab : null); try {',
			'} finally { tabkit.addingTabsOver(); }'
		);
	};
	this.preInitListeners.push(this.preInitSortingAndGroupingMethodHooks);
	
	// See globalPreInitSortingAndGroupingMethodHooks in tabkit-global.js
	
	this.postInitSortingAndGroupingMethodHooks = function postInitSortingAndGroupingMethodHooks(event) {
		// Give mlb_common.Utils.openUrlInNewTab a function name so it can be detected by sourceTypes!
		if ("mlb_common" in window && "Utils" in mlb_common && "openUrlInNewTab" in mlb_common.Utils)
			tk.addMethodHook([
				'mlb_common.Utils.openUrlInNewTab',
				
				'function (',
				'function mlb_common_Utils_openUrlInNewTab('
			]);
	};
	this.postInitListeners.push(this.postInitSortingAndGroupingMethodHooks);
	
	/// Methods dealing with new tabs:
	this.addingTab = function addingTab(type, parent, dontMoveNextTab) {
		try {
			if (tk.nextType) {
				tk.ignoreOvers++;
				return;
			}
			
			tk.nextType = type;
			tk.isBookmarkGroup = false;
			tk.nextParent = parent != undefined ? parent : gBrowser.selectedTab;
			tk.dontMoveNextTab = dontMoveNextTab ? true : false;
		}
		catch (ex) {
			tk.dump(ex);
		}
	};
	
	this.addingTabOver = function addingTabOver() {
		try {
			if (tk.ignoreOvers > 0) {
				// tk.ignoreOvers will be decremented in the finally clause at the end of this function
				return;
			}
			
			if (tk.addedTabs.length == 1) {
				var type = tk.nextType;
				var parent = (type == "unrelated" || type == "sessionrestore") ? null : tk.nextParent;
				var tab = tk.addedTabs.pop();
				
				// Keep recentlyadded tags up to date
				if (!parent || parent != tk.lastParent)
					for (var i = 0; i < _tabs.length; i++)
						_tabs[i].removeAttribute("recentlyadded");
				tk.lastParent = tk.nextParent;
				
				// We do *nothing else* for sessionrestore tabs, as they will (hopefully) be dealt with later after a sortgroup_onSSTabRestoring
				if (type == "sessionrestore")
					return;
				
				// Get pid, set possibleparent
				var pid = parent ? parent.getAttribute("tabid") : null;
				if (pid) {
					tab.setAttribute("possibleparent", pid);
					tk.updateIndents();
				}
				else if (type != "unrelated")
					tk.dump("addingTabOver: no parent for " + type + " tab");
				
				// Adjust openerGroup sensitivity
				if (type == "bookmark" && _prefs.getBoolPref("bookmarkTabsAreRelated"))
					type = "related";
				else if (type == "history" && _prefs.getBoolPref("historyTabsAreRelated"))
					type = "related";
				else if (type == "newtab" && _prefs.getBoolPref("newTabsAreRelated"))
					type = "related";
				else if (type == "sessionrestore")
					type = "unrelated";
				
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
				
				var tabNeedsPlacing = !tk.dontMoveNextTab;
				
				if (tk.autoGroupNewTabs) {
					if (!tabNeedsPlacing
						&& tab.previousSibling
						&& tab.nextSibling
						&& tab.previousSibling.getAttribute("groupid")
						&& tab.previousSibling.getAttribute("groupid") == tab.nextSibling.getAttribute("groupid"))
					{
						if (type != "unrelated") {
							var gid = tab.previousSibling.getAttribute("groupid");
							tk.setGID(tab, gid);
							tab.setAttribute("outoforder", "true");
						}
						else {
							tk.keepGroupsTogether();
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
			else if (tk.addedTabs.length > 1) { // Shouldn't happen
				tk.dump("addingTabsOver: More than one tab was added (" + tk.addedTabs.length + " tabs, to be precise)!");
				tk.addingTabsOver();
				return;
			}
		}
		catch (ex) {
			tk.dump(ex);
		}
		finally {
			if (tk.ignoreOvers > 0) {
				tk.ignoreOvers--;
			}
			else {
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
					openerGroup = ":oG-bookmarkGroup-" + firstTab.getAttribute("tabid");
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
		{ d: 5, n: "goup_up",			   t: "related" }, //postInit: if ("goup_up" in window && window.goup_up) tk.wrapMethodCode('window.goup_up', 'tabkit.addingTab("related"); try {', '} finally { tabkit.addingTabOver(); }');
		{ d: 4, n: "diggerLoadURL",		 t: "related" }, //diggerLoadURL
		{ d: 3, n: "mlb_common_Utils_openUrlInNewTab", t: "related" }, //Mouseless Browsing mlb_common.Utils.openUrlInNewTab (but only after Tab Kit assigns a name to the function in postInitSortingAndGroupingMethodHooks!) [[[1. win_open 2. open 3. mlb_common_Utils_openUrlInNewTab 4.  5. ]]]
		{ d: 3, n: "activateLinks",		 t: "related" }, //Snap Links Plus [[[1. openTabs 2. executeAction 3. activateLinks 4. eventMouseUp]]]
		{ d: 3, n: "gotoHistoryIndex",	  t: "related" }, //gotoHistoryIndex [[[1. loadOneTab 2. openUILinkIn 3. gotoHistoryIndex 4. anonymous 5. checkForMiddleClick 6. onclick]]]
		{ d: 3, n: "BrowserBack",		   t: "related" }, //BrowserBack [[[1. loadOneTab 2. openUILinkIn 3. BrowserBack 4. anonymous 5. checkForMiddleClick 6. onclick]]]
		{ d: 3, n: "BrowserForward",		t: "related" }, //BrowserForward [[[1. loadOneTab 2. openUILinkIn 3. BrowserForward 4. anonymous 5. checkForMiddleClick 6. onclick]]]
		{ d: 3, n: "BrowserReloadOrDuplicate", t: "related" }, //BrowserReloadOrDuplicate [[[1. loadOneTab 2. openUILinkIn 3. BrowserReloadOrDuplicate 4. anonymous 5. checkForMiddleClick]]]]
		{ d: 2, n: "BrowserSearch_search",  t: "related" }, //BrowserSearch.loadSearch
		{ d: 3, n: "handleLinkClick",	   t: "related" }, //handleLinkClick [[[1. loadOneTab 2. openNewTabWith 3. handleLinkClick 4. contentAreaClick 5. onclick]]]
		{ d: 1, n: "webdeveloper_generateDocument", t: "related" }, //webdeveloper_generateDocument (WebDeveloper extension)
		{ d: 1, n: "openSelectedLinks",	 t: "related" }, //Tab Kit openSelectedLinks [[[1: openSelectedLinks]]]
		
		{ d: 5, n: "BM_onCommand",		  t: "newtab" }, //BM_onCommand [[[1. loadOneTab 2. openUILinkIn 3. PU_openNodeIn 4. PU_openNodeWithEvent 5. BM_onCommand]]]
		{ d: 5, n: "ondragdrop",			t: "newtab" }, //newTabButtonObserver.onDrop [[[1. loadOneTab 2. openNewTabWith 3.  4.  5. ondragdrop]]] // Could make unrelated if from a different window?
		{ d: 4, n: "middleMousePaste",	  t: "newtab" }, //middleMousePaste
		{ d: 4, n: "handleCommand",		 t: "newtab" }, //[Fx3.5+] gURLBar.handleCommand [[[1.loadOneTab 2. openUILinkIn 3. openUILink 4. handleCommand 5. onclick]]]
		{ d: 2, n: "BrowserOpenTab",		t: "newtab" }, //BrowserOpenTab [[[1. loadOneTab 2. BrowserOpenTab 3. oncommand]]] // Amongst other traces
		{ d: 2, n: "delayedOpenTab",		t: "newtab" }, //delayedOpenTab
		{ d: 2, n: "handleCommand",		 t: "newtab" }, //[Fx3.5+] gURLBar.handleCommand [[[1.loadOneTab 2. handleCommand 3. anonymous 4. fireEvent 5. onTextEntered]]]
		{ d: 1, n: "_endRemoveTab",		 t: "newtab" }, //[Fx3.5+] gBrowser._endRemoveTab [[[1. _endRemoveTab 2. removeTab 3. removeCurrentTab 4. BrowserCloseTabOrWindow 5. oncommand]]]
		
		{ d: 4, n: "openReleaseNotes",	  t: "unrelated" }, //openReleaseNotes [[[1. loadOneTab 2. openUILinkIn 3. openUILink 4. openReleaseNotes 5. anonymous 6. checkForMiddleClick 7. onclick]]]
		
		{ d: 1, n: "sss_duplicateTab",	  t: "sessionrestore", m: true }, //sss_duplicateTab [[[1. sss_duplicateTab 2. duplicateTab ...]]]
		{ d: 1, n: "sss_undoCloseTab",	  t: "sessionrestore", m: true }, //sss_undoCloseTab [[[1. sss_undoCloseTab 2. undoCloseTab 3. undoCloseTab 4. oncommand]]]
		{ d: 1, n: "sss_restoreWindow",	 t: "sessionrestore", m: true }  //sss_restoreWindow
	];
	this.sourceTypes.sort(function __compareSourceDepths(a, b) { return b.d - a.d; }); // Sort by decreasing d(epth)
	
	/// Event Handlers:
	this.sortgroup_onTabAdded = function sortgroup_onTabAdded(event) {
		var tab = event.target;
		
		var tid = tk.generateId();
		tab.setAttribute("tabid", tid);
		
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
				tk.addingTabOver();
				tk.addedTabs = [tab];
				tk.nextType = "loadTabs"; // But it can now be treated as "loadOneOrMoreURIs";
			}
		}
		else if (!("fromInitSortingAndGrouping" in event)) {
			if (tk.sourceTypes.length && event.stackDepth) {
				var stack = event.stack;
				var depth = event.stackDepth;
				/*
				// This is now calculated in addTab due to https://bugzilla.mozilla.org/show_bug.cgi?id=390488
				var stack = [ arguments.callee.caller.caller ];
				var depth = 0;
				// Note that sourceTypes is sorted in order of decreasing d
				while (depth < tk.sourceTypes[0].d) {
					var prev = stack[depth].caller;
					if (prev) {
						stack.push(prev);
						depth++;
					}
					else {
						break;
					}
				}
				*/
				for (var i = 0; i < tk.sourceTypes.length; i++) {
					var st = tk.sourceTypes[i];
					if (st.d > depth)
						continue;
					while (st.d < depth)
						depth--;
					if (stack[depth].name == st.n) {
						tk.nextType = st.t;
						tk.dontMoveNextTab = ("m" in st && st.m);
						break;
					}
				}
			}
			
			if (!tk.nextType) {
				tk.dump("No nextType for added tab: " + tid + "\nStack ="
						  + event.stack.map(function __getName(f, i) {
								return " " + i + ": " + f.name;
							}));
				// TODO=P2: GCODE Make default nextType depend on whether the tab was opened in the foreground or background, for better compatibility with extensions that open tabs (this may have to be done by seeing if the tab gets selected...)
				tk.nextType = "newtab";
				//tk.nextType = "unrelated";
				//tk.dontMoveNextTab = true;
			}
			
			tk.nextParent = gBrowser.selectedTab;
			tk.isBookmarkGroup = false;
			tk.addedTabs = [tab];
			tk.addingTabOver();
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
		
		// Color tabs-bottom (see also colorizeTab, and note that tabs-bottom is hidden during multirow mode)
		// if (_tabContainer.getAttribute("colortabnotlabel") == "true" && _tabContainer.getAttribute("multirow") != "true") {
			// var tabsBottom = document.getAnonymousElementByAttribute(tab.parentNode, "class", "tabs-bottom");
			// if (tabsBottom) {
				// var bgColor = document.getAnonymousNodes(tab)[0].style.backgroundColor;
				// tabsBottom.style.setProperty("background-color", bgColor, "important");
			// }
			// else {
				// tk.debug("sortgroup_onTabSelect: Couldn't find tabs-bottom");
			// }
		// }
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
				t.setAttribute("groupcollapsed", true);
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
				tk.tabSetHidden(visible.pop(), false); // visibility of a tab
				for each (var t in visible)
					tk.tabSetHidden(t, true); // visibility of a tab
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
		
		if ("__SS_data" in tab.linkedBrowser.parentNode && "attributes" in tab.linkedBrowser.parentNode.__SS_data) {
			// Clean up the tab, in case it had data before being restored into
			var attributes = tab.linkedBrowser.parentNode.__SS_data.attributes;
			if (!("groupid" in attributes) && tab.hasAttribute("groupid"))
				tk.removeGID(tab);
			if (!("groupcollapsed" in attributes) && tab.hasAttribute("groupcollapsed")) {
				tab.removeAttribute("groupcollapsed");
				tk.tabSetHidden(tab.hidden, false); // visibility of a tab
			}
			if (!("singletonid" in attributes) && tab.hasAttribute("singletonid"))
				tab.removeAttribute("singletonid");
			if (!("possibleparent" in attributes) && tab.hasAttribute("possibleparent"))
				tab.removeAttribute("possibleparent");
			if (!("outoforder" in attributes) && tab.hasAttribute("outoforder"))
				tab.removeAttribute("outoforder");
		}
		
		// Prevent restoring the lastViewedKey from overwriting the fact that the tab is currently being viewed
		if (tab.getAttribute("selected") == "true")
			tab.setAttribute(tk.Sorts.lastViewed, Date.now());
		
		// Deal with duplicated tabs
		if (arguments.callee.caller
			&& arguments.callee.caller.caller
			&& arguments.callee.caller.caller.caller
			&& arguments.callee.caller.caller.caller.name == "sss_duplicateTab")
		{
			tab.setAttribute("tabid", tk.generateId()); // Tab must have its own unique tabid
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
	 * 0 (auto):	Go right unless that would involve going down a level or leaving the group [right->left depending on tk.openRelativePosition]
	 * 1 (g-left):  Go left unless that would involve leaving the group
	 * 2 (g-right): Go right unless that would involve leaving the group
	 * 3 (left):	Go left
	 * 4 (right):   Go right
	 */
	this.sortgroup_onTabRemoved = function sortgroup_onTabRemoved(event) {
		var tab = event.target;
		var gid = tab.getAttribute("groupid");
		var tid = tab.getAttribute("tabid");
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
					&& gBrowser.hasAttribute("vertitabbar")) {
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


	this.updateSortGroupMenu = function updateSortGroupMenu(event, popup) {
		if (event.target != event.currentTarget) return;

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
		else if ("_endRemoveTab" in gBrowser) { // [Fx3.1b3]
			tk.addMethodHook([//{
				"gBrowser._endRemoveTab",
				
				'newIndex = index == length ? index - 1 : index;',
				'newIndex = tabkit.pickNextIndex(index, length); \
				if (newIndex == null) $&' // When closing the last tab and browser.tabs.closeWindowWithLastTab is false, tk.chooseNextTab is perhaps called before the replacement tab is opened, so tk.pickNextIndex returns null; the original code works fine in this case though
			]);//}
		}
		else { // [Fx3-]
			tk.addMethodHook([//{
				"gBrowser.removeTab",
				
				/newIndex = \(?index == l - 1\)? \? index - 1 : index;/,
				'newIndex = tabkit.pickNextIndex(index, l - 1); \
				if (newIndex == null) $&' // When closing the last tab and browser.tabs.closeWindowWithLastTab is false, tk.chooseNextTab is perhaps called before the replacement tab is opened, so tk.pickNextIndex returns null; the original code works fine in this case though
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
			var tid = tab.getAttribute("tabid");
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
		BrowserOpenTab();
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
		if (!contextTab)
			contextTab = gBrowser.selectedTab;
		tk.addingTab("related", contextTab);
		var newTab = tk._duplicateTab(contextTab);
		tk.addingTabOver();
		var gid = contextTab.getAttribute("groupid");
		if (gid && gid != newTab.getAttribute("groupid")) {
			tk.setGID(newTab, gid);
			newTab.setAttribute("outoforder", "true");
		}
		if (tk.openRelativePosition == "left")
			tk.moveBefore(newTab, contextTab);
		else
			tk.moveAfter(newTab, contextTab);
		gBrowser.selectedTab = newTab;
	};
	this.makeGroup = function makeGroup(contextTab) {
		// TODO=P3: GCODE replace redundant .hidden calls
		if (!contextTab || contextTab == gBrowser.selectedTab)
			return;
		
		var start = Math.min(contextTab._tPos, gBrowser.selectedTab._tPos);
		var end = Math.max(contextTab._tPos, gBrowser.selectedTab._tPos);
		
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
	// TODO=P4: N/A merge left/right & split group features?
	
	this.toggleUnread = function toggleUnread(contextTab) {
		if (!contextTab)
			contextTab = gBrowser.selectedTab;
		
		if (contextTab.hasAttribute("read"))
			contextTab.removeAttribute("read");
		else
			contextTab.setAttribute("read", "true");
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
			for each (var tab in group) {
				tab.setAttribute("groupcollapsed", "true");
				if (tab != contextTab) {
					tk.tabSetHidden(tab, true); // visibility of a tab */
				}

			}
		}
		
		tk.updateIndents();
		
		if (gBrowser.selectedTab.hidden) // visibility of a tab
			gBrowser.selectedTab = contextTab;
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
		
		if ("gBookmarkAllTabsHandler" in window) { // [Fx3only]
			// Based on PlacesCommandHook.bookmarkCurrentPages
			var uris = group.map(function __getUri(tab) {
					return tab.linkedBrowser.webNavigation.currentURI;
			});
			PlacesUIUtils.showMinimalAddMultiBookmarkUI(uris);
		}
		else {
			tk.dump("Places detection failed.");
		}
	};
	this.closeGroup = function closeGroup(contextTab) {
		if (!contextTab)
			contextTab = gBrowser.selectedTab;
		for each (var tab in tk.getGroupFromTab(contextTab))
			gBrowser.removeTab(tab);
	};
	this.closeChildren = function closeChildren(contextTab) {
		if (!contextTab)
			contextTab = gBrowser.selectedTab;
		for each (var tab in tk.getSubtreeFromTab(contextTab))
			if (tab != contextTab) // Don't close parent
				gBrowser.removeTab(tab);
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
	this.setTabUriKey = function setTabUriKey(aTab) { // TODO=P3: GCODE Listen for back/forwards
		var uri = aTab.linkedBrowser.currentURI;
		if (aTab.initialURI) {
			if (!uri || uri.asciiSpec == "about:blank")
				uri = gBrowser.mURIFixup.createFixupURI(aTab.initialURI, gBrowser.mURIFixup.FIXUP_FLAGS_MAKE_ALTERNATE_URI); // We can't just use _ios.newURI since sometimes initialURI can be things like google.com (without http:// or anything!)
			delete aTab.initialURI;
		}
		if (!uri)
			uri = _ios.newURI("about:blank", null, null);
		
		if (uri.asciiSpec == "about:blank") {
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
	// Allow easy access to the initial uri a tab is loading
	this.earlyMethodHooks.push([
		"gBrowser.addTab",//{
		'b.loadURIWithFlags(aURI',
		't.initialURI = aURI; $&'
	]);//}
	
	var _seed = 0; // Used to generate ids; TODO-P6: TJS sync across windows to completely avoid duplicates
	this.generateId = function generateId() {
		return String(Date.now()) + "-" + String(++_seed);
	};

	this.getTabById = function getTabById(tid) {
		for (var i = 0; i < _tabs.length; i++) {
			var t = _tabs[i];
			if (t.getAttribute("tabid") == tid)
				return t;
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
		return (gBrowser.hasAttribute("vertitabbar")
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
						stack.push(tab.getAttribute("tabid"));
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
			stack = [ tab.getAttribute("tabid") ];
		}
	};
	this.toggleIndentedTree = function toggleIndentedTree() {
		if (gBrowser.hasAttribute("vertitabbar") && _prefs.getBoolPref("indentedTree"))
			tk.updateIndents();
		else
			for (var i = 0; i < _tabs.length; i++)
				_tabs[i].style.marginLeft = "";
	};

	this.detectTheme = function detectTheme() {
		var forceThemeCompatibility = _prefs.getIntPref("forceThemeCompatibility"); // 0: Never, 1: Auto, 2: Always
		var colorTabNotLabel = _prefs.getBoolPref("colorTabNotLabel");
		var darkTheme;
		
		// Auto mode forces compatibility unless the theme has been tested
		var theme = gPrefService.getCharPref("general.skins.selectedSkin");
		const goodThemes = { // Themes that work well
			// TODO=P4: GCODE Keep testing themes...
			"classic/1.0"	  : { platform: /Win32/ }, // Default Windows theme ("Strata" in Fx3, "Firefox (default)" in Fx2)
			"abstractPCNightly": {},			 // Abstract Classic
			"abstract_zune"	: { dark: true }, // Abstract Zune		 (n.b. current tab has solid black bg that hides groups)
			"aero_fox"		 : { dark: true }, // Aero Fox			  (n.b. current tab has solid black bg that hides groups)
			"aero_silver_fox"  : {},			 // Aero Silver Fox Basic
			"aquatint_gloss"   : { dark: true }, // Aquatint Black Gloss  (n.b. current tab has solid black bg that hides groups)
			"aquatintII"	   : {},			 // Aquatint Redone
			"AzertyIII"		: {},			 // Azerty III
			"blackx"		   : {},			 // BlackX 2
			"cfoxmodern"	   : {},			 // CrystalFox Modern
			"kempelton"		: {},			 // Kempelton
			"MacOSX"		   : {},			 // MacOSX Theme - https://addons.mozilla.org/en-US/firefox/addon/7172
			"pitchdark"		: {},			 // PitchDark
			"phoenityreborn"   : {},			 // Phoenity Reborn
			"qute"			 : {},			 // Qute
			"vistaxp"		  : {},			 // Vista on XP
			"xpvista"		  : {}			  // XP on Vista
		};
		const badThemes = { // Themes with solid tab backgrounds, a -moz-appearance, or other problems
			/* Anything not listed above is assumed to be a 'bad' theme, so it's only really
			 * useful to list the dark ones, though Tango is obviously worth mentioning */
		//  "classic/1.0"	  : { platform: /Linux/ }, // Default Linux theme ("Tango" in Fx3)
			"nasanightlaunch"  : { dark: true },		// NASA Night Launch - https://addons.mozilla.org/en-US/firefox/addon/4908
			"NG_Classic"	   : { dark: true }		 // Newgrounds Classic
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
			_tabContainer.setAttribute("tk-forcethemecompatibility", "true");
		else
			_tabContainer.removeAttribute("tk-forcethemecompatibility");
		
		if (darkTheme)
			_tabContainer.setAttribute("tk-darktheme", "true");
		else
			_tabContainer.removeAttribute("tk-darktheme");
		
		// Set colortabnotlabel attribute, clear up old colorizeTab results, and re-run colorizeTab for each tab
		if (colorTabNotLabel) {
			if (_tabContainer.getAttribute("colortabnotlabel") != "true") {
				_tabContainer.setAttribute("colortabnotlabel", "true");
				for (var i = 0; i < _tabs.length; i++) {
					var t = _tabs[i];
					t.ownerDocument.getAnonymousElementByAttribute(t, "class", "tab-text tab-label").style.backgroundColor = null;
					tk.colorizeTab(t);
				}
			}
		}
		else if (_tabContainer.hasAttribute("colortabnotlabel")) {
			_tabContainer.removeAttribute("colortabnotlabel");
			for (var i = 0; i < _tabs.length; i++) {
				var t = _tabs[i];
				var nodes = [ t ];
				for (var j = 0; j < nodes.length; j++)
					nodes[j].style.backgroundColor = null;
				tk.colorizeTab(t);
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
				for each (var t in groups[gid])
					tk.colorizeTab(t);
			}
			catch (ex) { // Shouldn't happen
				tk.dump(ex);
			}
		}
	};

	this.allocateColor = function allocateColor(tab) {
		var tgid = tab.getAttribute("groupid");
		if (!tgid)
			tk.dump("allocateColor requires a groupid!");
		if (tk.getWindowValue("knownColor:" + tgid))
			return;
		
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
		if (gids.length < 1) {
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
					case 2: hueDistance[hue] = 45;		// Groups two groups away from each other should be 45 apart
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
		
		var sat = tk.randInt(_prefs.getIntPref("minSaturation"), _prefs.getIntPref("maxSaturation"));
		var lum = tk.randInt(_prefs.getIntPref("minLightness"), _prefs.getIntPref("maxLightness"));
		
		// TODO=P3: GCODE Stop memory-leaking known colors (for the duration of a session)
		tk.setWindowValue("knownColor:" + tgid, "hsl(" + hue + ", " + sat + "%, " + lum + "%)");
	};
	
	this.colorizeTab = function colorizeTab(tab) {
		try {
			var gid = tab.getAttribute("groupid");
			if (gid) {
				var bgColor = tk.getWindowValue("knownColor:" + gid);
				if (!bgColor) {
					// Use a timeout to make sure the tab is in place (next to the groups it will neighbour) before we color it
					window.setTimeout(function __colorizeTabLater(tk, tab) {
						tk.allocateColor(tab);
						tk.colorizeTab(tab);
					}, 0, tk, tab);
					return;
				}
			}
			else {
				var bgColor = "";
			}
			var tabText = tab.ownerDocument.getAnonymousElementByAttribute(tab, "class", "tab-text tab-label");
			// Background colors are reset on tab move (and close then restore), hence the listeners
			if (_tabContainer.getAttribute("colortabnotlabel") == "true") { // This is set at the start of initSortingAndGrouping
				var nodes = [ tab ];
			}
			else {
				var nodes = [ tabText ];
			}
			//add by Pika, coloring for Fx4+
			if (bgColor != "") {
				bgColor = "-moz-linear-gradient(@HSL_Top,@HSL_Bottom)".replace("@HSL_Top",bgColor).replace("@HSL_Bottom",bgColor);
			}
			else {
				// bgColor = "-moz-linear-gradient(@HSL_Top,@HSL_Bottom)".replace("@HSL_Top","hsla(0, 0%, 100%,1)").replace("@HSL_Bottom","hsla(0, 0%, 100%,1)");
			}
			for (var i = 0; i < nodes.length; i++) {
				//edit by Pika, coloring for Fx4+
				nodes[i].style.setProperty("background-image", bgColor, "important");
				nodes[i].style.setProperty("color", "black", "important");
			}
			// Color tabs-bottom (see also sortgroup_onTabSelect, and note that tabs-bottom is hidden during multirow mode)
			// if (tab.getAttribute("selected") == "true" && _tabContainer.getAttribute("colortabnotlabel") == "true") {
				// var tabsBottom = document.getAnonymousElementByAttribute(tab.parentNode, "class", "tabs-bottom");
				// if (tabsBottom)
					// tabsBottom.style.setProperty("background-color", bgColor, "important");
				// else
					// tk.debug("colorizeTab: Couldn't find tabs-bottom");
			// }
		}
		catch (ex) {
			tk.dump(ex);
		}
	};

	this.setTabsColorBlack = function setTabsColorBlack(event) {
		var tabs = gBrowser.tabs;
		for (var i = 0; i<tabs.length; i++)
			tabs[i].style.setProperty("color", "black", "important");
	}
	
	this.colorAllTabsMenuItem = function colorAllTabsMenuItem(tab, menuItem) {
		// TODO=P4: GCODE Fx3: Make All Tabs prettier (since we mess things up a little by setting -moz-appearance: none)
		try {
			var bgSample = tab;//new line by Pika, Fx2 related
			if (gBrowser.tabContainer.getAttribute("colortabnotlabel") == "true") {
				menuItem.style.backgroundColor = bgSample.style.backgroundColor;
			}
			else if ((gBrowser.tabContainer.hasAttribute("highlightunread") && !tab.hasAttribute("read"))
					 || (gBrowser.tabContainer.hasAttribute("emphasizecurrent") && tab.getAttribute("selected") == "true"))
			{
				var bgStyle = window.getComputedStyle(bgSample, null);
				menuItem.style.backgroundColor = bgStyle.backgroundColor;
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
		_tabContainer.mAllTabsPopup.addEventListener("popupshowing", tk.colorAllTabsMenu, false);
		_tabContainer.addEventListener("TabClose", tk.colorAllTabsMenu, false);
		_tabContainer.addEventListener("TabSelect", tk.colorAllTabsMenu, false);
		_tabContainer.addEventListener("TabSelect", tk.setTabsColorBlack, false);
			
		if ("LastTab" in window && window.LastTab && LastTab.Browser && LastTab.Browser.OnTabMenuShowing) {
			tk.appendMethodCode('LastTab.Browser.OnTabMenuShowing',//{
				'for (var i = 0; i < menu.childNodes.length; i++) { \
					var menuItem = menu.childNodes[i]; \
					if (LastTab.Preference.TabMenuSortMethod == LastTab.TabMenuSortMethod.MostRecent) \
							var tab = LastTab.Browser.TabHistory[menuItem.value]; \
					else \
						var tab = gBrowser.tabs[menuItem.value]; \
					tab.mCorrespondingMenuitem = menuItem; \
				} \
				tabkit.colorAllTabsMenu();'
			);//}
		}
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
						if (tabset[j].getAttribute("tabid") == pp) {
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
	this.earlyMethodHooks.push([
		"gBrowser.createTooltip",//{
		null,
		'event.target.setAttribute("label", tn.getAttribute("label"));',
		'if (tn.hasAttribute("groupcollapsed")) { \
			event.target.setAttribute("label", tabkit.getGroupFromTab(tn).map(function __getLabel(tab) { \
				return tab == tn ? "> " + tab.label : " - " + tab.label; \
			}).join("\\n")); \
		} \
		else $&'
	]);//}

	/// Implement Bug 298571 - support tab duplication (using ctrl) on tab drag and drop
	this._duplicateTab = function _duplicateTab(aTab) {
		if (_ss) {
			var newTab = _ss.duplicateTab(window, aTab); // [Fx3+]
			newTab.setAttribute("tabid", tk.generateId());
			tk.removeGID(newTab);
			return newTab;
		}
		return gBrowser.loadOneTab(gBrowser.getBrowserForTab(aTab).currentURI.spec); // [Fx3- since browser.sessionstore.enabled always on in 3.5+]
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
		if (!draggedTab || draggedTab == targetTab || draggedTab.hasAttribute("pinned") || draggedTab.parentNode != this)
			return;
		
		this._tabDropIndicator.collapsed = true;
		
		var dGid = draggedTab.getAttribute("groupid");
		var dPrev = draggedTab.previousSibling;
		var dNext = draggedTab.nextSibling;
		
		var newIndex = tk._getDropIndex(event);
		var beforeTab = newIndex > 0 ? _tabs[newIndex - 1] : null;
		var afterTab = newIndex < _tabs.length ? _tabs[newIndex] : null;
		var bGid = beforeTab ? beforeTab.getAttribute("groupid") : null;
		var aGid = afterTab ? afterTab.getAttribute("groupid") : null;
		
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
		var tabs;
		var shiftDragSubtree;
		if (dGid && (event.shiftKey && _prefs.getBoolPref("shiftDragGroups")
					 || draggedTab.hasAttribute("groupcollapsed"))) {
			// User wants to drag a group/subtree
			
			shiftDragSubtree = _prefs.getBoolPref("shiftDragSubtrees")
								   && !draggedTab.hasAttribute("groupcollapsed");
			
			if (shiftDragSubtree) {
				/* Note that tk.getSubtreeFromTab checks tk.subtreesEnabled,
				 * which checks gBrowser.hasAttribute("vertitabbar") &&
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
		var copyOrFromAnotherWindow = (dropEffect == "copy" || draggedTab.parentNode != _tabContainer);
		
		// Move/copy the tab(s)
		var tabsReverse = tabs.slice(); // Copy
		tabsReverse.reverse(); // In-place reverse
		var newTabs = [];
		var tabIdMapping = {};
		for each (var tab in tabsReverse) {
			if (copyOrFromAnotherWindow) {
				// Tab was copied or from another window, so tab will be recreated instead of moved directly
				
				// Only allow beforeTab not afterTab because addingTabOver only indents newTab if it is after draggedTab (since addingTabOver just sets possibleparent to the source tab)
				if (singleTab && draggedTab == beforeTab)
					tk.addingTab("related", draggedTab, true); // Or could just do tk.duplicateTab(draggedTab); return;
				else
					tk.addingTab("unrelated", null, true);
				
				// tk.chosenNewIndex = newIndex;
				// event.tab = tab;
				// gBrowser.old_onDrop(event);
				gBrowser.moveTabTo(tab, newIndex);
				
				newTabs.unshift(tk.addedTabs[0]);
				
				tk.addingTabOver();
				if (singleTab && draggedTab == beforeTab)
					return; // addingTabOver will already have grouped the tab etc, so skip ___onDropCallback 
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
		
		if (dropEffect == "copy" && draggedTab.parentNode != _tabContainer)
			gBrowser.selectedTab = newTabs[0]; // TODO=P3: TJS Is this necessary?
		
		window.setTimeout(function ___onDropCallback() { // TODO=P3: TJS Waiting may actually be unnecessary
			// This is now after the tabs have been restored
			
			if (copyOrFromAnotherWindow)
				for (var i = 0; i < newTabs.length; i++)
					// Map tabids of original tabs to tabids of their clones
					tabIdMapping[tabs[i].getAttribute("tabid")] = newTabs[i].getAttribute("tabid");
			
			// Group/indent the new/moved tabs
			var nGid;
			var app;
			var draggedIntoGroup = (aGid && aGid == bGid);
			if (draggedIntoGroup || dGid && (aGid == dGid || bGid == dGid)) {
				if (aGid == dGid || bGid == dGid)
					nGid = dGid; // We're in the same group we were before
				else
					nGid = aGid; // Copy enclosing groupid
				
				if (aGid) {
					// Inherit enclosing indentation (possibleparent)
					app = afterTab.getAttribute("possibleparent");
					// But only if afterTab's possibleparent is in the same group as it
					var parent = tk.getTabById(app);
					if (!parent || parent.getAttribute("groupid") != aGid)
						app = null;
				}
				else
					app = null;
			}
			else if (singleTab) {
				if (newTabs[0].hasAttribute("groupid"))
					tk.removeGID(newTabs[0]);
			}
			else if (copyOrFromAnotherWindow /*&& !singleTab*/) {
				// Create a new groupid
				nGid = ":oG-copiedGroupOrSubtree-" + tk.generateId();
				
				app = null;
			}
			else {
				if (shiftDragSubtree)
					nGid = ":oG-draggedSubtree-" + tk.generateId(); // Maintain subtree by creating a new opener group // TODO=P5: GCODE No need if the subtree was the entire group
				else
					nGid = null; // Just keep existing groupid
				
				app = null;
			}
			for (var i = 0; i < newTabs.length; i++) {
				var newTab = newTabs[i];
				
				// Apply nGid
				if (nGid) {
					tk.setGID(newTab, nGid);
					if (draggedIntoGroup)
						newTab.setAttribute("outoforder", "true");
				}
				
				// Apply app, or copy from original if appropriate
				if (app && newTab.originalTreeLevel <= newTabs[0].originalTreeLevel) {
					// TODO=P3: N/A For consistency, use a temporary parent attribute so it's reset by sorts etc.
					newTab.setAttribute("possibleparent", app);
				}
				else if (copyOrFromAnotherWindow && !singleTab) {
					var tpp = tabs[i].getAttribute("possibleparent");
					if (tpp in tabIdMapping)
						tpp = tabIdMapping[tpp];
					newTab.setAttribute("possibleparent", tpp);
					// n.b. duplicated [single] tabs have their possibleparent set to the original because of the tk.addingTab("related", ...) above
				}
			}
			tk.updateIndents();
			
			// Make sure the old group isn't now a singleton
			if (singleTab) {
				if (dGid) {
					// TODO=P4: TJS Refactor out into a checkIfSingleton method
					if (dPrev && dPrev.getAttribute("groupid") == dGid
						&& (!dPrev.previousSibling || dPrev.previousSibling.getAttribute("groupid") != dGid)
						&& (!dPrev.nextSibling || dPrev.nextSibling.getAttribute("groupid") != dGid))
					{
						tk.removeGID(dPrev, true);
					}
					else if (dNext && dNext.getAttribute("groupid") == dGid
						&& (!dNext.previousSibling || dNext.previousSibling.getAttribute("groupid") != dGid)
						&& (!dNext.nextSibling || dNext.nextSibling.getAttribute("groupid") != dGid))
					{
						tk.removeGID(dNext, true);
					}
				}
			}
			else if (!copyOrFromAnotherWindow) {
				if (shiftDragSubtree) {
					// Make sure old group isn't now a singleton
					var group = tk.getGroupById(dGid);
					if (group.length == 1)
						tk.removeGID(group[0], true);
				}
			}
			/*else if (copyOrFromAnotherWindow) {
				if (shiftDragSubtree) {
					// No need to worry about this, as no tabs are moved (they only get removed, so the TabClose listener sorts this out)
			}*/
		}, 200);
	};
	
	// this.chosenNewIndex = null;
	this.preInitTabDragModifications = function preInitTabDragModifications(event) {	
		// Allow setting the next value returned by this via tk.chosenNewIndex
		//comment by Pika, for dragging tab
		// tk.addMethodHook([//{
			// "gBrowser.tabContainer._getDropIndex",
			
			// '{',
			// '{ \
			// if (typeof tk.chosenNewIndex == "number") { \
				// var newIndex = tabkit.chosenNewIndex; \
				// tabkit.chosenNewIndex = null; \
				// return newIndex; \
			// }'
		// ]);//}
		
		/* if ("_onDrop" in gBrowser) { // [Fx3.5+]
			tk.addMethodHook([//{
				"gBrowser._onDrop",
				
				// Lets us pass arbitrary dragged tabs to _onDrop
				'dt.mozGetDataAt(TAB_DROP_TYPE, 0)',
				'("tab" in aEvent ? aEvent.tab : $&)',
				// See _onDragOver replacement
				'this.mTabDropIndicatorBar.collapsed = true;',
				'this.mTabDropIndicatorBar.style.display = "none";'
			]);//}
		}
		else {// [Fx4+]
			tk.debug("preInitTabDragModifications Fx4 Version Unavailable, Developer come!!");
		} */
		
		/* if ("_onDragLeave" in gBrowser) { // [Fx3.5+]
			tk.addMethodHook([//{
				"gBrowser._onDragLeave",
				
				// See _onDragOver replacement
				'this.mTabDropIndicatorBar.collapsed = true;',
				'this.mTabDropIndicatorBar.style.display = "none";'
			]);//}
		}
		else {// [Fx4+]
			tk.debug("preInitTabDragModifications Fx4 Version Unavailable, Developer come!!");
		} */
		
		//Pika test on dragging tab for Fx4+
		gBrowser.tabContainer.addEventListener("dragstart", function(event) {//What's the use of this?
			if (event.target.localName == "tab") {
				var draggedTab = event.target;
				var draggedTabs = gBrowser.contextTabsOf(draggedTab);
				draggedTabs.splice(draggedTabs.indexOf(draggedTab), 1);
				draggedTabs.unshift(draggedTab);

				var dt = event.dataTransfer;
				draggedTabs.forEach(function(aTab, aIndex) {
					dt.mozSetDataAt(TAB_DROP_TYPE, aTab, aIndex);
					dt.mozSetDataAt("text/x-moz-text-internal", aTab.linkedBrowser.currentURI.spec, aIndex);
				});
			}
		}, true);
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
			var isVertical = gBrowser.hasAttribute("vertitabbar");
			
			var position = isVertical ? "screenY" : "screenX";
			var size = isVertical ? "height" : "width";
			var start = isVertical ? "top" : "left";
			var end = isVertical ? "bottom" : "right";
			
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

			var isVertical = gBrowser.hasAttribute("vertitabbar");
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
	
	this._getDropIndex = function _getDropIndex(event) {	//since the default functions sucks on vertical mode
		var targetTab = event.target.localName == "tab" ? event.target : null;
		if (!targetTab || targetTab.hasAttribute("pinned"))
			return;
		
		var dt = event.dataTransfer;
		var draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
		if (!draggedTab || draggedTab == targetTab || draggedTab.hasAttribute("pinned") || draggedTab.parentNode != _tabContainer)
			return;
		
		var isVertical = gBrowser.hasAttribute("vertitabbar");
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
	//	gBrowser.mTabBox.handleCtrlTab = 
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
	//	if (!event.isTrusted)
	//		return;
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
		// Persist Attributes
		if (_ss)
			_ss.persistTabAttribute("protected");
		
		tk.mapBoolPrefToAttribute("emphasizeProtectedTabs", _tabContainer, "emphasizeprotected");
		
		tk.prependMethodCode('gBrowser.removeTab', 'if (aTab.getAttribute("protected") == "true") { tabkit.beep(); return; }');
		
		tk.prependMethodCode('gBrowser.warnAboutClosingTabs', ' \
			if (aAll === true) { \
				var numProtected = this.tabContainer.getElementsByAttribute("protected", "true").length; \
				if (numProtected > 0) \
					return tabkit.warnAboutClosingProtectedTabs(numProtected); \
			} \
		');
		
		_tabContainer.addEventListener("click", tk.protectedTabs_onClick, true);
		
		var tabContextMenu = _tabContainer.contextMenu;
		tabContextMenu.addEventListener("popupshowing", tk.protectedTabs_updateContextMenu, false);
		
		tk.context_closeTab = document.getElementById("context_closeTab");
		 
	};
	this.initListeners.push(this.initProtectedTabs);
	
	this.warnAboutClosingProtectedTabs = function warnAboutClosingProtectedTabs(numProtected) {
		// Focus the window before prompting.
		// This will raise any minimized window, which will
		// make it obvious which window the prompt is for and will
		// solve the problem of windows "obscuring" the prompt.
		// See bug #350299 for more details
		window.focus();
		var strings = document.getElementById("bundle_tabkit");
		var flags = _ps.BUTTON_POS_0 * _ps.BUTTON_TITLE_IS_STRING
					+ _ps.BUTTON_POS_1 * _ps.BUTTON_TITLE_CANCEL
					+ _ps.BUTTON_POS_2 * _ps.BUTTON_TITLE_IS_STRING;
		var button = _ps.confirmEx(
			window, //aParent
			gBrowser.mStringBundle.getString("tabs.closeWarningTitle"), //aDialogTitle
			strings.getFormattedString("close_warning_protected_tabs", [ _tabs.length, numProtected ]), //aText
			flags, // aButtonFlags
			strings.getString("close_all_tabs"), //aButton0Title
			null, //aButton1Title // Cancel has to be button 1 due to Bug 345067 - Issues with prompt service's confirmEx - confirmEx always returns 1 when user closes dialog window using the X button in titlebar
			strings.getString("close_unprotected_tabs"), //aButton2Title
			null, //aCheckMsg
			{} //aCheckState
		);
		if (button == 0) { // Close all tabs
			return true;
		}
		else if (button == 2) { // Close unprotected tabs
			for (var i = _tabs.length - 1; i >= 0; --i)
				if (_tabs[i].getAttribute("protected") != "true")
					gBrowser.removeTab(_tabs[i]);
			return false;
		}
		else { // Cancel
			return false;
		}
	};
	
	this.protectedTabs_onClick = function protectedTabs_onClick(event) {
		if (event.originalTarget.className == "tab-close-button"
			&& (event.button == 0 || event.button == 1)
			&& event.target.localName == "tab"
			&& event.target.getAttribute("protected") == "true")
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

	this.toggleProtected = function toggleProtected(contextTab) {
		if (!contextTab)
			contextTab = gBrowser.selectedTab;
		
		if (contextTab.getAttribute("protected") == "true")
			contextTab.removeAttribute("protected");
		else
			contextTab.setAttribute("protected", "true");
	};
	
	//}##########################
	//{=== New tabs by default
	//|##########################
	
	// See globalPreInitNewTabsByDefault in tabkit-global.js
	
	this.postInitNewTabsByDefault = function postInitNewTabsByDefault(event) {
		// [Fx3.5+]
		tk.addMethodHook([//{
			'gURLBar.handleCommand',
			
			'aTriggeringEvent.altKey',
			'(aTriggeringEvent.altKey ^ gPrefService.getBoolPref("extensions.tabkit.openTabsFrom.addressBar"))'
		]);//}
		
		// [Fx4+]
		if ("PlacesUIUtils" in window) {
			tk.addMethodHook([
				'PlacesUIUtils._openNodeIn',
				
				'aWindow.openUILinkIn(aNode.uri, aWhere);',
				'aWindow.openUILinkIn(aNode.uri, tk.returnWhereWhenOpenPlaces(aWhere, aNode));'
			]);
			
			document.getElementById('placesContext_open').removeAttribute('default');
			document.getElementById('placesContext_open:newtab').setAttribute('default', true);
		}
	};
	this.postInitListeners.push(this.postInitNewTabsByDefault);
	
	this.returnWhereWhenOpenPlaces = function returnWhereWhenOpenPlaces(aWhere, aNode) {
		
		if (!gPrefService.getBoolPref("extensions.tabkit.openTabsFrom.places"))
			return aWhere;
		
/* 		if ( // clicking on folder
			aEvent &&
			(
				( // tree
					aEvent.target.localName == 'treechildren' &&
					aEvent.currentTarget.selectedNode &&
					!PlacesUtils.nodeIsURI(aEvent.currentTarget.selectedNode) &&
					PlacesUtils.nodeIsContainer(aEvent.currentTarget.selectedNode)
				) ||
				( // toolbar, menu
					aEvent.originalTarget &&
					aEvent.originalTarget.node &&
					PlacesUtils.nodeIsContainer(aEvent.originalTarget.node)
				)
			)
		)
		tk.debug("clicking on folder");return aWhere; */
		
		if ((aWhere == "tab")  || (aWhere == "tabshifted")
			|| (aNode.uri.indexOf('javascript:') == 0) /* bookmarklets*/) {
			// tk.debug("return current");
			return "current";
		}
		else {
			var w = getTopWin();
			var browser = w ? w.getBrowser().tabContainer.selectedItem.linkedBrowser : w;
			// tk.debug(browser.contentTitle);
			// tk.debug(browser.webNavigation.currentURI.spec);
			if (aWhere == "current"
				 && (!browser
				 || browser.webNavigation.currentURI.spec != "about:blank"
				 || browser.webProgress.isLoadingDocument)
				 ) {
				// tk.debug("return tab");
				return "tab";
			}
		}
	};
	
	//}##########################
	//{=== Tab Min Width
	//|##########################

	/// Initialisation:
	
	var tabWidthStyleSheet = null;	//for storing stylesheet for tab minWidth rule
	
	this.initTabMinWidth = function initTabMinWidth(event) {
		tk.addGlobalPrefListener("browser.tabs.tabMinWidth", tk.resetTabMinWidth);
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
		tk.setTabMinWidth(Math.max(gPrefService.getIntPref("browser.tabs.tabMinWidth"), 100));	//Minimum minWidth of tab is 100, a built-in CSS rule
	};

	/// Methods:
	// Note: this is also used by multi-row tabs
	this.setTabMinWidth = function setTabMinWidth(minWidth) {
		// _tabContainer.mTabMinWidth = minWidth;
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
		
		var sidebarPosition = _prefs.getIntPref("sidebarPosition");
		if (sidebarPosition != tk.Positions.LEFT)
			tk.moveSidebar(sidebarPosition);
		tk.addPrefListener("sidebarPosition", tk.moveSidebar);
		
		var tabbarPosition = _prefs.getIntPref("tabbarPosition");
		if (tabbarPosition != tk.Positions.TOP) {
			tk.moveTabbar(tabbarPosition);
		}
		tk.addPrefListener("tabbarPosition", tk.moveTabbar);

		_tabContainer.addEventListener("TabOpen", tk.positionedTabbar_onTabOpen, false);
		_tabContainer.addEventListener("TabSelect", tk.positionedTabbar_onTabSelect, false);
		_tabContainer.addEventListener("TabMove", tk.positionedTabbar_onTabSelect, false); // In case a tab is moved out of sight
		
		_tabBar.tkLastMouseover = Date.now(); // Prevent strict errors if we get a mouseout before our first mouseover
		gBrowser.tabContainer.addEventListener("mouseover", tk.positionedTabbar_onMouseover, false);
		gBrowser.tabContainer.addEventListener("mouseout", tk.positionedTabbar_onMouseout, false);
		gBrowser.parentNode.addEventListener("DOMAttrModified", tk.positionedTabbar_onToggleCollapse, true);
		
		//Special bug workaround by Pika
		_tabContainer.addEventListener("TabClose", tk.bug608589workaround, true);
	};
	this.initListeners.push(this.initTabbarPosition);

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
		if (gBrowser.hasAttribute("vertitabbar") && document.getElementById("tabkit-splitter")) {
			
			tab.maxWidth = null;
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
		if (gBrowser.hasAttribute("vertitabbar")) {
			
			
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
			}, 50);	//this timeout has to be after TabOpen to make it work normally (it seems)
		}
		tk.colorizeTab(tab);
	};
	this.positionedTabbar_onResize = function positionedTabbar_onResize(event) {
		var width = parseInt(_tabBar.width != "" ? _tabBar.width : 250);	//temp default value, MEDIC!!
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
			if (document.getElementById("tabkit-splitter").getAttribute("state") == "collapsed"
				&& lastMouseover == _tabBar.tkLastMouseover)
			{
				_tabBar.collapsed = true;
			}
		}, 333, _tabBar.tkLastMouseover);
	};
	this.positionedTabbar_onToggleCollapse = function positionedTabbar_onToggleCollapse(event) {
		if (event.attrName != "collapsed")
			return;
		
		if (event.attrChange == MutationEvent.ADDITION) {
			event.target.collapsed = false;	//target = appcontent
			_tabBar.collapsed = true;
			var curpos = parseInt(_tabInnerBox.mVerticalScrollbar.getAttribute("curpos"));
			// It returns 0 when collapsed, so don't restore this (and it will
			// default to 0 when re-expanded anyway, so we don't need to restore it)
			if (!isNaN(curpos) && curpos > 0)
				_tabBar.tkScrollPos = curpos;
		}
		else if (event.attrChange == MutationEvent.REMOVAL) {
			window.setTimeout(function __restoreScrollPosition() {
				if ("tkScrollPos" in _tabBar && _tabInnerBox.mVerticalScrollbar) {
					// Restore the old scroll position, as collapsing the tab bar will have reset it
					_tabInnerBox.mVerticalScrollbar.setAttribute("curpos", _tabBar.tkScrollPos);
					delete _tabBar.tkScrollPos;
				}
			}, 50); // TODO: TJS Find more reliable way of setting this than 50 ms timeout...
		}
		// Ignore event.attrChange == MutationEvent.MODIFICATION
	};

	/// Methods:
	this.moveSidebar = function moveSidebar(pos) {
		if (typeof pos != "number") pos = _prefs.getIntPref("sidebarPosition");

		// Calculate new orient attributes
		var flipOrient = (pos == tk.Positions.TOP || pos == tk.Positions.BOTTOM);
		var fromHorizontal = flipOrient ? "vertical" : "horizontal";
		var fromVertical = flipOrient ? "horizontal" : "vertical";
		var fromNormal = flipOrient ? "reverse" : "normal";

		// Calculate new direction attribute
		var flipDirection = (pos == tk.Positions.RIGHT || pos == tk.Positions.BOTTOM);

		// Get some nodes
		var browser = document.getElementById("browser");
		var sidebarBox = document.getElementById("sidebar-box");
		var sidebarHeader = sidebarBox.getElementsByTagName("sidebarheader")[0];
		var normallyHorizontal = [
			browser,
			document.getElementById("sidebar-splitter"),
			sidebarHeader
		];
		var normallyVertical = [
			sidebarBox,
			document.getElementById("appcontent")
		];
		var normallyNormal = [
			sidebarBox,
			sidebarHeader
		];

		// Set new attributes
		browser.dir = flipDirection ? "reverse" : "normal";
		
		for each (var node in normallyNormal) 
			node.dir = fromNormal;
		
		sidebarHeader.pack = (flipOrient ? "end" : "start");

		// Set orient attributes last or stuff messes up
		for each (var node in normallyHorizontal)
			node.orient = fromHorizontal;
		for each (var node in normallyVertical)
			node.orient = fromVertical;

		// Now activate our css
		browser.removeAttribute("horizsidebar");
		browser.removeAttribute("vertisidebar");
		browser.setAttribute(fromVertical.substring(0, 5) + "sidebar", flipDirection ? "reverse" : "normal");
	};

	//Edited by PikachuEXE, NOT tested
	this.moveTabbar = function moveTabbar(pos) {
		if (typeof pos != "number") pos = _prefs.getIntPref("tabbarPosition");
		
		//Start Edit by Pika
		var tabsToolbar = document.getElementById("TabsToolbar"); //FF4+ tabbar
		var appcontent = document.getElementById("appcontent");

		//End Edit by Pika

		// Calculate new orient attributes
		var flipOrient = (pos == tk.Positions.LEFT || pos == tk.Positions.RIGHT);
		var fromHorizontal = flipOrient ? "vertical" : "horizontal";
		var fromVertical = flipOrient ? "horizontal" : "vertical";

		// Calculate new direction attribute
		var flipDirection = (pos == tk.Positions.RIGHT || pos == tk.Positions.BOTTOM);

		// Now activate our css
		if (pos == tk.Positions.LEFT || pos == tk.Positions.RIGHT) {
			appcontent.parentNode.insertBefore(tabsToolbar, appcontent);
		}
		else if (pos == tk.Positions.TOP) {
			var searchBox = document.getElementById("tabkit-filtertabs-box");
			var checkPtI = 1;
			a = document.getElementById("toolbar-menubar");
			tk.debug("searchBox chk pt " + checkPtI++);
			tk.debug("searchBox.previousSibling = "+(searchBox?searchBox.previousSibling:null));
			tk.debug("searchBox.nextSibling = "+(searchBox?searchBox.nextSibling:null));
			a.parentNode.insertBefore(tabsToolbar, a);//search box bug source!!
			tk.debug("searchBox chk pt " + checkPtI++);
			tk.debug("searchBox.previousSibling = "+(searchBox?searchBox.previousSibling:null));
			tk.debug("searchBox.nextSibling = "+(searchBox?searchBox.nextSibling:null));
		}
		else if (pos == tk.Positions.BOTTOM) {
			a = document.getElementById("browser-bottombox");
			a.parentNode.insertBefore(tabsToolbar, a);
		}
		tabsToolbar.orient = _tabContainer.mTabstrip.orient = fromHorizontal;
		gBrowser.removeAttribute("horiztabbar");
		gBrowser.removeAttribute("vertitabbar");
		gBrowser.setAttribute(fromHorizontal.substring(0, 5) + "tabbar", flipDirection ? "reverse" : "normal");
		tabsToolbar.removeAttribute("horiztabbar");
		tabsToolbar.removeAttribute("vertitabbar");
		tabsToolbar.setAttribute(fromHorizontal.substring(0, 5) + "tabbar", flipDirection ? "reverse" : "normal");
		
		// Toggle the splitter as appropriate
		var splitter = document.getElementById("tabkit-splitter");
		if (flipOrient) {
			// Remove any space or flexible space in tab bar(which makes vertical tab bar works strange)
			for (var i = 0; i < tabsToolbar.children.length; i++) {
				var thisNode = tabsToolbar.children.item(i);
				if (thisNode.localName == "toolbarspacer" || thisNode.localName == "toolbarspring") {
					thisNode.parentNode.removeChild(thisNode);	//if you remove here you affect the length and index of after objects, the next one will escape check, so need to decrease index
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
				appcontent.parentNode.insertBefore(splitter, appcontent);//add by Pika
				
				splitter.addEventListener("mouseover", tk.positionedTabbar_onMouseover, false);
				splitter.addEventListener("mouseout", tk.positionedTabbar_onMouseout, false);
				
				_tabBar.width = _prefs.getIntPref("tabSidebarWidth");
				for (var i = 0; i < _tabs.length; i++)
					_tabs[i].maxWidth = null;
				tk.setTabMinWidth(0);
				gBrowser.mTabBox.addEventListener("resize", tk.positionedTabbar_onResize, false);
			}
			if ("toggleIndentedTree" in tk)
				tk.toggleIndentedTree();
		}
		else {
			if ("toggleIndentedTree" in tk)
				tk.toggleIndentedTree();
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
		_tabstrip.addEventListener("overflow", tk._preventMultiRowFlowEvent, true);
		_tabstrip.addEventListener("underflow", tk._preventMultiRowFlowEvent, true);
		
		tk.addPrefListener("tabRows", tk.updateMultiRowTabs);
		tk.addPrefListener("tabbarPosition", tk.updateMultiRowTabs);
		tk.addGlobalPrefListener("browser.tabs.tabMinWidth", tk.updateMultiRowTabs);
		tk.addGlobalPrefListener("browser.tabs.closeButtons", tk.updateMultiRowTabs);
		_tabContainer.addEventListener("TabOpen", tk.updateMultiRowTabs, false);
		tk.addDelayedEventListener(_tabContainer, "TabClose", tk.updateMultiRowTabs);
		document.addEventListener("SSTabRestoring", tk.updateMultiRowTabs, false); // "hidden" attributes might be restored!
		window.addEventListener("resize", tk.updateMultiRowTabs, false);
		tk.appendMethodCode("tabkit.toggleGroupCollapsed", 'tabkit.updateMultiRowTabs();');
		
		_tabContainer.addEventListener("TabSelect", tk.multiRow_onTabSelect, false);
		_tabContainer.addEventListener("TabMove", tk.multiRow_onTabSelect, false); // In case a tab is moved out of sight
		
		tk.updateMultiRowTabs();
		
		// Setup new drop indicator (this way it can be moved up and down as well as left and right)
		var oldIndicatorBar = gBrowser.mTabBox.firstChild;
		var oldIndicator = oldIndicatorBar.firstChild;
		var oldBarStyle = tk.getCSSRule(".tab-drop-indicator-bar").style //[Fx3only] 
		var oldStyle = tk.getCSSRule(".tab-drop-indicator").style //[Fx3only]
		var newDropIndicatorBar = document.createElementNS(XUL_NS, "hbox");
		var newDropIndicator = document.createElementNS(XUL_NS, "hbox");
		newDropIndicatorBar.id = "tabkit-tab-drop-indicator-bar";
		//newDropIndicatorBar.setAttribute("dragging", oldIndicatorBar.getAttribute("dragging")); // This shouldn't be the case
		if (oldIndicatorBar.hasAttribute("collapsed")) // [Fx3only]
			newDropIndicatorBar.setAttribute("collapsed", "true");
		newDropIndicator.setAttribute("mousethrough", "always");
		newDropIndicatorBar.style.height = oldBarStyle.height;
		newDropIndicatorBar.style.marginTop = oldBarStyle.marginTop;
		newDropIndicatorBar.style.position = "relative";
		newDropIndicatorBar.style.top = newDropIndicatorBar.style.left = "0";
		newDropIndicator.style.height = oldStyle.height;
		newDropIndicator.style.width = oldStyle.width;
		newDropIndicator.style.marginBottom = oldStyle.marginBottom;
		newDropIndicator.style.position = "relative";
		newDropIndicator.style.backgroundColor = oldStyle.backgroundColor; // Probably unnecessary
		newDropIndicator.style.backgroundImage = oldStyle.backgroundImage;
		newDropIndicator.style.backgroundRepeat = oldStyle.backgroundRepeat;
		newDropIndicator.style.backgroundAttachment = oldStyle.backgroundAttachment; // Probably unnecessary
		newDropIndicator.style.backgroundPosition = "50% 50%"; // This cannot be gotten from oldStyle, see https://bugzilla.mozilla.org/show_bug.cgi?id=316981
		newDropIndicatorBar.appendChild(newDropIndicator);
		var stack = document.getElementById("browser-stack"); // [Fx2only]
		if (!stack) // [Fx3only]
			stack = document.getAnonymousElementByAttribute(_tabContainer, "class", "tabs-stack");
		stack.appendChild(newDropIndicatorBar);
		gBrowser.__defineGetter__("mTabDropIndicatorBar", function __get_mTabDropIndicatorBar() {
			return document.getElementById("tabkit-tab-drop-indicator-bar");
		});
		oldIndicatorBar.removeAttribute("dragging");
		oldIndicatorBar.setAttribute("collapsed", "true");
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
				var newTabButton = _tabs[_tabs.length-1].boxObject.nextSibling; // [Fx3.5+]
				//seems not needed in FF4+
				// if (newTabButton && newTabButton.className == "tabs-newtab-button")
					// visibleTabs++; // Treat the new tab button as a tab for our purposes
				var minWidth = gPrefService.getIntPref("browser.tabs.tabMinWidth");
				var availWidth = _tabstrip._scrollbox.boxObject.width;
				var tabsPerRow = Math.floor(availWidth / Math.max(minWidth, 100));	//Minimum minWidth of tab is 100, a built-in CSS rule
				var rows = Math.ceil(visibleTabs / tabsPerRow);
				tk.log("availWidth: "+availWidth+" tabsPerRow: "+tabsPerRow+" rows: "+rows);
			}
			if (rows > 1) {
				// Enable multi-row tabs
				if (_tabContainer.getAttribute("multirow") != "true") {
					_tabContainer.setAttribute("multirow", "true");
					try {
						_tabstrip._scrollBoxObject.scrollTo(0,0);
					}
					catch (ex) {}
				}

				var maxRows = _prefs.getIntPref("tabRows");
				if (rows > maxRows) {
					_tabContainer.setAttribute("multirowscroll", "true");

					// TODO=P3: GCODE Make sure tab borders and padding are properly taken into account...
					_tabstrip.style.setProperty("min-height", 24 * maxRows + "px", "important");
					_tabstrip.style.setProperty("max-height", 24 * maxRows + "px", "important");

					var scrollbar = _tabInnerBox.mVerticalScrollbar;
					try {
						scrollbar.removeEventListener("DOMAttrModified", tk.preventChangeOfAttributes, true);
					}
					catch (ex) {
						// It wasn't set...
					}
					try {
						scrollbar.setAttribute("increment", 24);
						scrollbar.setAttribute("pageincrement", 48);
						scrollbar.addEventListener("DOMAttrModified", tk.preventChangeOfAttributes, true);
						
						availWidth -= Math.max(scrollbar.boxObject.width, 22);
					}
					catch (ex) {
						tk.debug("Oops, the scrollbar hasn't been created yet... TODO-P6: TJS use a timeout");
						availWidth -= 22;
					}
				}
				else {
					_tabContainer.removeAttribute("multirowscroll");

					_tabstrip.style.setProperty("min-height", 24 * rows + "px", "important");
					_tabstrip.style.setProperty("max-height", 24 * rows + "px", "important");
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
						_tabstrip._scrollBoxObject.ensureElementIsVisible(gBrowser.selectedTab.nextSibling);
					}
					_tabstrip._scrollBoxObject.ensureElementIsVisible(gBrowser.selectedTab);
				}
				catch (ex) {}
			}
			
			_tabstrip.style.removeProperty("min-height");
			_tabstrip.style.removeProperty("max-height");
		}
	};

	this.preventChangeOfAttributes = function preventChangeOfAttributes(event) {
		var scrollbar = _tabInnerBox.mVerticalScrollbar;
		if (event.attrName == "increment") {
			//event.preventDefault(); // does not work for this event...
			scrollbar.setAttribute("increment", 24);
			event.stopPropagation();
		}
		else if (event.attrName == "pageincrement") {
			scrollbar.setAttribute("pageincrement", 48);
			event.stopPropagation();
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

	/// Method hooks:
	//comment by Pika, for dragging tab
	// this.earlyMethodHooks.push([
		// "gBrowser.tabContainer._getDropIndex",//{
		// null,
		// '{',
		// '{ \
		// var verticalTabs = this.hasAttribute("vertitabbar"); \
		// var multiRow = this.tabContainer.getAttribute("multirow") == "true";',
		
		// 'aEvent.screenX < this.tabs[i].boxObject.screenX + this.tabs[i].boxObject.width / 2', // ltr
		// 'verticalTabs ? aEvent.screenY < this.tabs[i].boxObject.screenY + this.tabs[i].boxObject.height / 2 \
					  // : (multiRow && aEvent.screenY < this.tabs[i].boxObject.screenY) \
						// || (aEvent.screenX < this.tabs[i].boxObject.screenX + this.tabs[i].boxObject.width / 2 \
							// && (aEvent.screenY < this.tabs[i].boxObject.screenY + this.tabs[i].boxObject.height \
								// || !multiRow))',
		
		// 'aEvent.screenX > this.tabs[i].boxObject.screenX + this.tabs[i].boxObject.width / 2', // rtl
		// 'verticalTabs ? aEvent.screenY < this.tabs[i].boxObject.screenY + this.tabs[i].boxObject.height / 2 \
					  // : (multiRow && aEvent.screenY < this.tabs[i].boxObject.screenY) \
						// || (aEvent.screenX > this.tabs[i].boxObject.screenX + this.tabs[i].boxObject.width / 2 \
							// && (aEvent.screenY < this.tabs[i].boxObject.screenY + this.tabs[i].boxObject.height \
								// || !multiRow))'
	// ]);//}
	
	// TODO=P4: GCODE Prevent inappropriate indicator wrap around when dragging to end of row
	this.postInitTabDragIndicator = function postInitTabDragIndicator(event) {
/* 		if ("_onDragOver" in gBrowser) { // [Fx3.5]
			if (gBrowser._onDragOver.toString().indexOf("ib.getBoundingClientRect().right") != -1) { // [Fx3.6+]
				tk.addMethodHook([
					"gBrowser._onDragOver",
					
					'ib.getBoundingClientRect().right',
					'gBrowser.clientWidth'
				]);
			}
			else { // [Fx3.5only]
				tk.addMethodHook([
					"gBrowser._onDragOver",
					
					'ib.boxObject.x + ib.boxObject.width',
					'gBrowser.boxObject.width'
				]);
			}
			tk.addMethodHook([
				"gBrowser._onDragOver",
				
				// See below
				'ib.collapsed = "true";',
				'ib.style.display = "none";',
				
				'ind.style.MozMarginStart = newMargin + "px";',
				'if (gBrowser.hasAttribute("vertitabbar")) { \
					newMargin = Math.floor(this.mStrip.width / 2); \
				} \
				ib.style.display = "none"; \
				$&',
				// Note: we set it to display:none before moving it because otherwise Fx3 forgot to repaint over the old location!
				'ind.style.MozMarginStart = newMargin + "px";',
				'$& \
				if (newIndex == this.tabs.length) \
					ib.style.top = (this.tabs[newIndex-1].boxObject.screenY - this.tabs[0].boxObject.screenY + (gBrowser.hasAttribute("vertitabbar") ? this.tabs[newIndex-1].boxObject.height : 0)) + "px"; \
				else \
					ib.style.top = (this.tabs[newIndex].boxObject.screenY - this.tabs[0].boxObject.screenY) + "px"; \
				ib.style.display = null;',
				// Removing this attribute sometimes caused tab bar to scroll (?!?!), so now
				// we keep it permanently set and show/hide the tab bar with display: -moz-box/null
				'ib.collapsed = false;',
				'ib.style.display = "-moz-box";',
				
				// For compatibility with tab search bar
				'rect = this.getBoundingClientRect()',
				'rect = this.tabContainer.getBoundingClientRect()'
			]);//}
		}
		else {// [Fx4+]
			tk.debug("postInitTabDragIndicator Fx4 Version Unavailable, Developer come!!");
		}
		
		if ("_setEffectAllowedForDataTransfer" in gBrowser) { // [Fx3.5+]
			tk.addMethodHook([
				"gBrowser._setEffectAllowedForDataTransfer",
				
				/aEvent\.screenX\s*>=\s*sourceNode\.boxObject\.screenX\s*&&\s*aEvent\.screenX\s*<=\s*sourceNode\.boxObject\.screenX\s*\+\s*sourceNode\.boxObject\.width/,
				'$& \
				 && aEvent.screenY >= sourceNode.boxObject.screenY \
				 && aEvent.screenY <= sourceNode.boxObject.screenY + sourceNode.boxObject.height'
			]);//}
		}
		else {// [Fx4+]
			tk.debug("postInitTabDragModifications Fx4 Version Unavailable, Developer come!!");
		} */
	};
	this.postInitListeners.push(this.postInitTabDragIndicator);

	/// Private Methods
	this._preventMultiRowFlowEvent = function _preventMultiRowFlowEvent(event) {
		if (_tabContainer.hasAttribute("multirow")) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	//}##########################
	//{>>> Search bar
	//|#########################

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
		textbox.setAttribute("oncommand", "tabkit.filterTabs(this.value)");
		textbox.setAttribute("oninput", "document.getElementById('tabkit-filtertabs-includetext').collapsed = !this.value;");
		textbox.setAttribute("onblur", "document.getElementById('tabkit-filtertabs-includetext').collapsed = !this.value;"); // Clearing the query doesn't always trigger an input event, so additionally check when it gets blurred
		vbox.appendChild(textbox);
		
		var checkbox = document.createElementNS(XUL_NS, "checkbox");
		checkbox.setAttribute("id", "tabkit-filtertabs-includetext");
		checkbox.setAttribute("label", strings.getString("include_page_text"));
		checkbox.setAttribute("oncommand", "tabkit.filterTabs(document.getElementById('tabkit-filtertabs-query').value)");
		checkbox.setAttribute("collapsed", "true");
		vbox.appendChild(checkbox);
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
			//	let entry = tk.getActiveTabDataEntry(tab);
			//	if (entry)
			//		uri = entry.url;
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
	//{=== Highlight unread tabs
	//|##########################

	// TODO=P4: UVOICE Tab progress bar/rotating+filling pie

	// Note: sorting and grouping hooks into _onShowingAllTabsPopup to highlight all tabs menu entries

	/// Initialisation:
	this.initHighlightUnreadTabs = function initHighlightUnreadTabs(event) {
		tk.mapBoolPrefToAttribute("highlightUnreadTabs", _tabContainer, "highlightunread");
		tk.mapBoolPrefToAttribute("emphasizeCurrentTab", _tabContainer, "emphasizecurrent");

		_tabContainer.addEventListener("TabSelect", tk.tabRead, false);

		if (_ss)
			_ss.persistTabAttribute("read"); // So restored sessions remember which tabs have been read
	};
	this.initListeners.push(this.initHighlightUnreadTabs);

	this.postInitHighlightUnreadTabs = function postInitHighlightUnreadTabs(event) {
		gBrowser.selectedTab.setAttribute("read", "true");
	};
	this.postInitListeners.push(this.postInitHighlightUnreadTabs);

	/// Event Listener
	this.tabRead = function tabRead(event) {
		var tab = event.target;
		tab.setAttribute("read", "true");
	};

	//}##########################
	//{=== Mouse Gestures
	//|##########################

	/// Private Globals:
	var _mousedown = [false, undefined, false];
	var _preventContext = false;
	var _mouseScrollWrapCounter = 0;
	var _hoverTab = null;
	var _hoverTimer = null;
	var _lastHover = 0;

	/// Initialisation:
	this.initMouseGestures = function initMouseGestures(event) {
		gBrowser.addEventListener("mouseup", tk.onMouseUpGesture, true);
		gBrowser.addEventListener("mousedown", tk.onMouseDownGesture, true);
		gBrowser.addEventListener("contextmenu", tk.onContextMenuGesture, true);
		gBrowser.addEventListener("draggesture", tk.onMouseDragGesture, true);
		gBrowser.addEventListener("mouseout", tk.onMouseOutGesture, false);
		//gBrowser.mPanelContainer.addEventListener("DOMMouseScroll", tk.onRMBWheelGesture, true);
		gBrowser.addEventListener("DOMMouseScroll", tk.onRMBWheelGesture, true);
		//_tabInnerBox.addEventListener("DOMMouseScroll", tk.onTabWheelGesture, true);
		//_tabContainer.mTabstripClosebutton.addEventListener("DOMMouseScroll", tk.onTabWheelGesture, true);
		gBrowser.tabContainer.addEventListener("DOMMouseScroll", tk.onTabWheelGesture, true);
		_tabContainer.addEventListener("TabSelect", function(event) { _mouseScrollWrapCounter = 0; }, false);
		_tabContainer.addEventListener("mouseover", tk.onTabHoverGesture, false);
		_tabContainer.addEventListener("mouseout", tk.cancelTabHoverGesture, false);
		
		// Move Close Tab Before/After to the tab context menu (from the Tools menu)
		var tabContextMenu = _tabContainer.contextMenu;
		for (var i = 0; i < tabContextMenu.childNodes.length; i++) {
			var el = tabContextMenu.childNodes[i];
			if (el.getAttribute("oncommand").indexOf("removeAllTabsBut") != -1) {
				tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsToLeft"), el);
				tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsToRight"), el);
				tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsAbove"), el);
				tabContextMenu.insertBefore(document.getElementById("menu_tabkit-closeTabsBelow"), el);
				
				tk.mapBoolPrefToAttribute("closeBeforeAfterNotOther", gBrowser, "closebeforeafternotother");
				
				return;
			}
		}
		tk.dump("Could not find removeAllTabsBut");
	};
	this.initListeners.push(this.initMouseGestures);

	/// Event Listeners:
	this.onMouseUpGesture = function onMouseUpGesture(event) {
		if (!event.isTrusted)
			return;

		var splitter = document.getElementById("tabkit-splitter");
		if (splitter && splitter.getAttribute("state") == "dragging")
			return;

		var btn = event.button;
		if (_mousedown[btn])
			_mousedown[btn] = false;
		else if (btn != 1)
			event.preventDefault(); // We've probably just done a rocker gesture
	};

	this.onMouseDownGesture = function onMouseDownGesture(event) {
		if (!event.isTrusted)
			return;

		var splitter = document.getElementById("tabkit-splitter");
		if (splitter && splitter.getAttribute("state") == "dragging")
			return;

		var btn = event.button;	//0 = LMB, 2 = RMB
		var opp;	//opposite button
		if (btn == 0)
			opp = 2;
		else if (btn == 2)
			opp = 0;
		else
			return;

		if (_mousedown[opp] && _prefs.getBoolPref("gestures.lmbRmbBackForward")) {
			if (btn == 0)
				BrowserBack();
			else
				BrowserForward();
			_preventContext = true;
			_mousedown[opp] = false; // Since the Firefox loses mouseup events during the page load (http://forums.mozillazine.org/viewtopic.php?p=33605#33605)
			event.preventDefault();
			event.stopPropagation();
		}
		else {
			_mousedown[btn] = true;
		}
	};

	this.onContextMenuGesture = function onContextMenuGesture(event) {
		if (!event.isTrusted || !_preventContext)
			return;

		_preventContext = false;
		event.preventDefault();
		event.stopPropagation();
	};

	this.onMouseDragGesture = function onMouseDragGesture(event) {
		if (!event.isTrusted)
			return;

		_mousedown[0] = _mousedown[2] = false;
	};

	this.onMouseOutGesture = function onMouseOutGesture(event) {
		if (!event.isTrusted || event.target != event.currentTarget) // n.b. this refers to gBrowser, not tabkit!
			return;

		_mousedown[0] = _mousedown[2] = false;
	};

	this.onRMBWheelGesture = function onRMBWheelGesture(event) {
		if (!event.isTrusted || !_mousedown[2] || !_prefs.getBoolPref("gestures.rmbWheelTabSwitch"))
			return;

		tk.scrollwheelTabSwitch(event);
		if (event.change != 0)
			_preventContext = true;
	};

	this.onTabWheelGesture = function onTabWheelGesture(event) {
		if (!event.isTrusted)
			return;

		var name = event.originalTarget.localName;
		if (name == "scrollbar" || name == "scrollbarbutton" || name == "slider" || name == "thumb") {
			// Scrollwheeling above an overflow scrollbar should still scroll 3 lines if vertical or 2 lines if multi-row tab bar
			var scrollbar = _tabInnerBox.mVerticalScrollbar;
			if (!scrollbar) {
				tk.dump("tabInnerBox.mVerticalScrollbar is null - so what scrollbar did we scroll over?!");
				return;
			}
			
			if (gBrowser.hasAttribute("vertitabbar"))
				var delta = (Math.abs(event.detail) != 1 ? event.detail : (event.detail < 0 ? -3 : 3)) * 24;
			else if (_tabContainer.getAttribute("multirow") == "true")
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
		else if (_prefs.getBoolPref("gestures.tabWheelTabSwitch")) {
			tk.scrollwheelTabSwitch(event);
		}
	};
	
	this.onTabHoverGesture = function onTabHoverGesture(event) {
		if (!event.isTrusted || event.target.localName != "tab" || !_prefs.getBoolPref("gestures.switchTabsOnHover"))
			return;
		
		_hoverTab = event.target;
		// Switch instantly if less than 200ms since last switch, or to tabs next to current tab if less than 1s
		if ((Date.now() - _lastHover) < (Math.abs(_hoverTab._tPos - gBrowser.selectedTab._tPos) == 1 ? 1000 : 200))
			var wait = 0;
		else
			var wait = 200;
		window.clearTimeout(_hoverTimer);
		_hoverTimer = window.setTimeout(function __hoverSelectTab() {
			gBrowser.selectedTab = _hoverTab;
			_lastHover = Date.now();
		}, wait);
	};
	this.cancelTabHoverGesture = function cancelTabHoverGesture(event) {
		if (!event.isTrusted || event.target != _hoverTab)
			return;
		
		window.clearTimeout(_hoverTimer);
	};

	/// Methods:
	this.scrollwheelTabSwitch = function scrollwheelTabSwitch(event) {
		var change = event.detail;
		if (change > 0) {
			var lastTab = _tabs[_tabs.length-1];
			while (lastTab.hidden && lastTab.previousSibling) // visibility of a tab
				lastTab = lastTab.previousSibling;
			// Switch to next tab, but requiring 3 wheelscrolls to wrap around
			if (_tabContainer.selectedIndex < lastTab._tPos || _mouseScrollWrapCounter >= 2) {
				_tabContainer.advanceSelectedTab(1, true);
				// Note: _mouseScrollWrapCounter is reset whenever a tab is selected
			}
			else _mouseScrollWrapCounter++;
		}
		else if (change < 0) {
			var firstTab = _tabs[0];
			while (firstTab.hidden && firstTab.nextSibling) // visibility of a tab
				firstTab = firstTab.nextSibling;
			// Switch to previous tab, but requiring 3 wheelscrolls to wrap around
			if (_tabContainer.selectedIndex > firstTab._tPos || _mouseScrollWrapCounter >= 2) {
				_tabContainer.advanceSelectedTab(-1, true);
				// Note: _mouseScrollWrapCounter is reset whenever a tab is selected
			}
			else _mouseScrollWrapCounter++;
		}

		event.preventDefault();
		event.stopPropagation();
	};

	this.removeTabsBefore = function removeTabsBefore(contextTab) {
		if (!contextTab)
			contextTab = gBrowser.selectedTab;
		if (gBrowser.warnAboutClosingTabs(contextTab._tPos))
			for (var i = contextTab._tPos - 1; i >= 0; i--)
				gBrowser.removeTab(_tabs[i]);
	};
	this.removeTabsAfter = function removeTabsAfter(contextTab) {
		if (!contextTab)
			contextTab = gBrowser.selectedTab;
		if (gBrowser.warnAboutClosingTabs(_tabs.length - contextTab._tPos - 1))
			for (var i = _tabs.length - 1; i > contextTab._tPos; i--)
				gBrowser.removeTab(_tabs[i]);
	};
	
	/// Method hooks:
	this.earlyMethodHooks.push([
		'gBrowser.warnAboutClosingTabs',//{
		'numTabs = this.tabContainer.childNodes.length;',
		'numTabs = (typeof aAll == "number" ? aAll : this.tabContainer.childNodes.length);'
	]);//}
	
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
		if (selectedText == "")
			return uris;
		
		// Using regex from http://www.regexguru.com/2008/11/detecting-urls-in-a-block-of-text/
		// This matches anything starting with www., ftp., http://, https:// or ftp://
		// and containing common URL characters, but the final character is restricted (for
		// example URLs mustn't end in brackets, dots, or commas). It will however correctly
		// recognise urls such as http://en.wikipedia.org/wiki/Rock_(disambiguation) by
		// specifically permitting singly-nested matching brackets.
		var matches = selectedText.match(/\b(?:(?:https?|ftp):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/ig);
		if (matches != null) {
			for (var i = 0; i < matches.length; i++) {
				var uri = matches[i];
				uri = gBrowser.mURIFixup.createFixupURI(uri, gBrowser.mURIFixup.FIXUP_FLAGS_MAKE_ALTERNATE_URI);
				if (uri == null)
					continue;
				uri = uri.spec;
				if (uris.indexOf(uri) == -1)
					uris.push(uri);
			}
		}
		
		return uris;
	};
	
	this.openSelectedLinks = function openSelectedLinks(menuItem) {
		if (!menuItem.tabkit_selectedLinks)
			return;
		var uris = menuItem.tabkit_selectedLinks.filter(function __uriSecurityCheck(uri) {
			// URL Loading Security Check
			try {
				_sm.checkLoadURIStr(menuItem.tabkit_linkSource, uri, _sm.STANDARD);
				return true;
			}
			catch (ex) {
				return false;
			}
		});
		var firstTab = gBrowser.addTab(uris.shift());
		for each (var uri in uris)
			gBrowser.addTab(uri);
		if (!gPrefService.getBoolPref("browser.tabs.loadInBackground"))
			gBrowser.selectedTab = firstTab;
	};

	//}##########################
	//{=== Modification for Fx4+
	//|##########################
	this.postInitFx4Modifications = function postInitFx4Modifications(event) {
		// Not sure if pinned tab works in horizontal mode, but still BAM!
		tk.addMethodHook([
			"gBrowser.pinTab",
			
			'if (aTab.pinned)',
			'alert("Sorry, but Tabkit 2 does not support App Tabs"); return; \
			$&',
		]);
		
		// Disable Panorama, why use Panorama when you have Tabkit?
		tk.addMethodHook([
			"TabView.toggle",
			
			'if (this.isVisible())',
			'alert("Sorry, but Tabkit 2 does not support Panorama. Why use Panorama when you have Tabkit? :)"); return; \
			$&',
		]);
		//Also need to disable certain menu item(s)
		var context_tabViewMenu = document.getElementById("context_tabViewMenu");
		context_tabViewMenu.disabled = true;
		
		// Issue 22, some weird behavior by the new animation related functions which mess with tabs' maxWidth
		tk.addMethodHook([
			'gBrowser.tabContainer._lockTabSizing',
			
			'tab.style.setProperty("max-width", tabWidth, "important");',
			''
		]);
	}
	
	this.postInitListeners.push(this.postInitFx4Modifications);
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
			document.getElementById("cmd_quickPrompt").setAttribute("oncommand", "tkprompt()");
		}
	};
	this.preInitListeners.push(this.preInitDebugAids); */

	//}##########################
	//|##########################

}; // End of tabkit object

