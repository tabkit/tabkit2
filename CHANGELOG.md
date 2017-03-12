# Change Log
All notable changes to this project will be documented in this file.
This project does NOT adhere to [Semantic Versioning](http://semver.org/) YET (Will do so after rewrite).


## [Unreleased][unreleased] - YYYY-MM-DD


## [0.12.16][0.12.16] - 2017-03-12

### Changed
- Declare as compatible with 52.x  
  FF 45.x should just use old versions  

### Fixed
- Not working on FF 52


## [0.12.15][0.12.15] - 2016-06-19

### Changed
- Declare as compatible with 38.x (PikachuEXE is still using 38.x)

### Fixed
- Try to fix multiple screen issue by removing DPI related stuff


## [0.12.14][0.12.14] - 2016-05-22

### Fixed
- Fix selected tab was always changed even after closing an inactive tab
  (caused by incorrect conversion of old way method patch to new way)


## [0.12.13][0.12.13] - 2016-05-15

### Fixed
- Fix items in bookmark / history sidebar or window could not be opened due to incorrect method patching
- Fix drop indicator not positioned correctly in multi-row mode


## [0.12.12][0.12.12] - 2016-05-08

### Fixed
- Fix tabs open by opening single bookmark entry were always unrelated even user prefers them to be opened as related
- Fix tabs opened by bookmark groups (a set of bookmark entries) were not positioned according preference
- Fix extension malfunctioning if browser starts without search bar in layout


## [0.12.11][0.12.11] - 2016-05-02

### Fixed
- [Regression] Fix duplicate tab function in FF 45.x (again)


## [0.12.10][0.12.10] - 2016-05-02

### Changed
- Many Many Many code patching using `eval` which is considered as a security issue has been changed to use "the new way"
  (with property replacing + `function#apply`)
  This *might* bring some regressions
  (I have tested briefly for each place changed to use "the new way", but don't trust my testing)

### Fixed
- Scrollbar will now return to pre-collapse position after collapsed (vertical) tab bar expanded


## [0.12.9][0.12.9] - 2016-04-24

### Fixed
- [Regression] New tabs opened by search text box (in browser menu bar) are now placed properly


## [0.12.8][0.12.8] - 2016-04-17

### Fixed
- Remove an old "workaround" that causes more unexpected issues, including "forever hidden tabs" ([Issue 71][issue_71])
  Again (2nd time)
- Fix duplicate tab function in FF 45.x, but not tested in 38.x yet


## [0.12.7][0.12.7] - 2016-04-02

### Fixed
- Fix new tab behaviour when opening a new tab with new tab button of Ctrl+T keyboard shortcut
- Fix feature "open new tab from address bar" broken in last version due to usage of new "patches"


## [0.12.6][0.12.6] - 2016-03-30

### Changed
- Only allow 45.x to install this version, since FF 38.x can use last version without problem
- Disable tab duplicating feature since it's still buggy on FF 45.x
  It will be fixed soon

### Fixed
- Fix tab coloring for FF 45.x
- Fix new tab behaviour (maybe partially) for FF 45.x


## [0.12.5][0.12.5] - 2016-02-12

### Fixed
- Add new preference to allow users to fix [#96][issue_96] in different versions of Firefox
  Tested with 38.6.0 and 44.0.1 which behave differently


## [0.12.4][0.12.4] - 2016-01-10

### Fixed
- Workaround [#92][issue_92] by adding back the workaround removed in last version ([0.12.3][0.12.3])
  This will cause [#71][issue_71] again, but that issue was less serious
  The workaround will be kept until a permanent fix is developed


## [0.12.3][0.12.3] - 2015-10-11

### Added
- Add new preference to allow hiding the vertical tab bar splitter on fullscreen  
  See "Tab Bar" in options

### Fixed
- Remove an old "workaround" that causes more unexpected issues, including "forever hidden tabs" ([Issue 71][issue_71])
  No regression is found with the "workaround" removed.
- Disable window dragging by dragging the scrollbar on tab bar which makes the scrollbar difficult to use. ([Issue 87][issue_87])


## 0.12.2

### Enhancements
- "Close Tabs From Here To Current" now does NOT close selected tab
- Add new functions "Protect All Tabs in Group" & "Unprotect All Tabs in Group" for tab groups with menu items


## 0.12.1

### Bug Fix
- Fix fullscreen vertical tab bar behaviour (#80)


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


[unreleased]: https://github.com/tabkit/tabkit2/compare/v0.12.16...HEAD
[0.12.15]:     https://github.com/tabkit/tabkit2/compare/v0.12.15...v0.12.16
[0.12.15]:     https://github.com/tabkit/tabkit2/compare/v0.12.14...v0.12.15
[0.12.14]:     https://github.com/tabkit/tabkit2/compare/v0.12.13...v0.12.14
[0.12.13]:     https://github.com/tabkit/tabkit2/compare/v0.12.12...v0.12.13
[0.12.12]:     https://github.com/tabkit/tabkit2/compare/v0.12.11...v0.12.12
[0.12.11]:     https://github.com/tabkit/tabkit2/compare/v0.12.10...v0.12.11
[0.12.10]:     https://github.com/tabkit/tabkit2/compare/v0.12.9...v0.12.10
[0.12.9]:     https://github.com/tabkit/tabkit2/compare/v0.12.8...v0.12.9
[0.12.8]:     https://github.com/tabkit/tabkit2/compare/v0.12.7...v0.12.8
[0.12.7]:     https://github.com/tabkit/tabkit2/compare/v0.12.6...v0.12.7
[0.12.6]:     https://github.com/tabkit/tabkit2/compare/v0.12.5...v0.12.6
[0.12.5]:     https://github.com/tabkit/tabkit2/compare/v0.12.4...v0.12.5
[0.12.4]:     https://github.com/tabkit/tabkit2/compare/v0.12.3...v0.12.4
[0.12.3]:     https://github.com/tabkit/tabkit2/compare/v0.12.2...v0.12.3

[issue_96]: https://github.com/tabkit/tabkit2/issues/96
[issue_92]: https://github.com/tabkit/tabkit2/issues/92
[issue_87]: https://github.com/tabkit/tabkit2/issues/87
[issue_71]: https://github.com/tabkit/tabkit2/issues/71
