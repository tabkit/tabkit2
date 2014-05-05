### Changelog



## Next Release

### Bug Fix
- Fix "Protect Tab" functionality on Firefox 29


## 0.11.0

### Changes
- Compatible with Firefox 29
- Now requires [Classic Theme Restorer](https://addons.mozilla.org/en-US/firefox/addon/classicthemerestorer/) Extension  
  Also needs to set "Tabs on Top" in that extension tp fix the direction


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
