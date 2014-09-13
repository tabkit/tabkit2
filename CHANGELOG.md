### Changelog



## 0.12.0

### Changes

- Only support Firefox 31 ESR  
  (Firefox of other versions can still install the extension, but issues for those will be ignored)

### New Features
- Add "Flatten Sub Group"

### Enhancements
- Bind hotkey to "Flatten Sub Group" instead of "Flatten Group" to be safe

### Bug Fix
- Fix "Splitter cannot be dragged when vertical tabbar has a small width" (#65)
- Fix "Vertical Tab Bar Has Horizontal Tabs Jammed In" (#58) by removing a "fix" that is no longer needed by OSX
- No longer remove the original tab when copying a single tab to a different browser window
- Fix moving group to a new window
- Fix strange sidebar arrangement when using with extension "All-In-One Sidebar"


## 0.11.2

### Bug Fix
- Fix tabbar left right are reversed in Firefox 29 (Tested with Classic Theme Restorer 1.1.9)
- Fix vertical tabbar splitter not showing on Firefox 29 on startup

### Known Bugs
- Due to the bug fix above, the tab bar position is reversed on Firefox 28 or below (Won't fix)


## 0.11.1

### Bug Fix
- Fix "Protect Tab" functionality on Firefox 29


## 0.11.0

### Changes

- Compatible with Firefox 29
- Now requires [Classic Theme Restorer](https://addons.mozilla.org/en-US/firefox/addon/classicthemerestorer/) Extension  
  Required options for `Classic Theme Restorer`:
  - Select `Tabs not on Top`: should fix the vertical tabbar direction
  - Uncheck `Tabs in title bar`: should fix the totally unusable layout


## 0.10.6

### Enhancements
- Add option to toggle "force disable TabsOnTop" (Options -> Tab Bar)


## 0.10.5

### New Features
- Open clipboard URIs in group (right click -> Tab Kit)

### Enhancements
- When closing multiple tabs, close from the right/bottom first, so that the parent can be restored first
- Remove access key for ungrouping tab groups to avoid accidents
- Disallow "Pin Tab" in vertical mode (but allow in horizontal mode)
- Add option to enable Panorama (Options -> Experimental)

### Changes
- Always disable TabsOnTop to avoid layout issue

### Bug Fix
- Moving tab across window will now close the original one from old window


## 0.10.4
- Add: Menu item for closing tabs from target tab to current tab
- Change: Recoloring a single group now ignores the surrounding groups (otherwise it might have too little effect)


## 0.10.3
- Add: Menu items for re-coloring a group and all groups (Right click on a group)
- Change: Minimal tab width can now be set down to 50px (per request in review)
- Fix: Changing minimal tab width now has effect again (no error report before)


## 0.10.2
- Remove: Warning message and Firefox built-in protection when using "Close tabs left/right/above/below"


## 0.10.1
- Change: Some Grouping coloring options no longer require restart
- Change: Change and cleanup some code to work with Tab Kit - Tab Highlighter 0.2.1


## 0.10.0
- Add: Copy group URLs, separated by newlines (#4)
- Remove: Some coloring features extracted into [Tab Kit - Tab Highlighter](https://github.com/tabkit/tab-highlighter)
- Remove: Some mouse gesture features extracted into [Tab Kit - Mouse Gestures](https://github.com/tabkit/mouse-gestures)
- Fix: Groups and sub-groups can be dragged across windows again (#3)
- Fix: Tab search box (if enabled) will auto-collapse in horizontal mode again (#13)


## 0.9.10
- Fix: Bookmark and History opened in new tab not working (#23)
- Change: Several options does not cache per window anymore, Not sure if this will cause bugs
