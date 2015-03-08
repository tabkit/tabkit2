# Tab Kit 2nd Edition
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/tabkit/tabkit2?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The original [Tab Kit(TK)](https://addons.mozilla.org/en-us/firefox/addon/tab-kit/) is an extension of Firefox that many people are using.  
It was last updated September 26, 2010, and the author has been silent after that.  
The most updated version (0.6) is not compatible with FF4+, since FF3->4 has a HUGE change especially in tab bar DOM structure.

This project aims to change modify the original TK to make it FF4+ compatible (and drop the support for pre-FF4).  
The name for the new(not quite) extension is *Tab Kit 2nd Edition*(You can still call it *Tab Kit 2* or *TK2* for short)


## Description from original Tab Kit (modified)
Tab Kit makes tabs more efficient for power users, allowing a wide variety of tweaks, all of which are optional, notably:

- Group tabs, by domain or opener (parent) tab, manually or automatically
- Vertical tab tree (with splitter), like Tree Style Tab
- Multi-row tabs
- Sort tabs, by address, last loaded, last viewed, order of creation, origin or title
- Control new tab position and close order
- Easily duplicate tabs and groups and copy/move them between windows by dragging
- Scrollwheel tab switch (Extracted to [Tab Kit - Mouse Gestures](https://github.com/tabkit/mouse-gestures))
- 'Mouse rocker' to go back/forward in history (Extracted to [Tab Kit - Mouse Gestures](https://github.com/tabkit/mouse-gestures))
- Highlight unread tabs (and emphasise current tab) (Extracted to [Tab Kit - Tab Highlighter](https://github.com/tabkit/tab-highlighter))
- Scrollbar instead of scroll arrows in over-long Bookmarks and All Tabs popups
- Open Selected Links feature
- Switch tabs on hover (Extracted to [Tab Kit - Mouse Gestures](https://github.com/tabkit/mouse-gestures))
- Options for urls, searches and/or bookmarks to open in new tabs by default


## Since Firefox `29.0`
Now requires [Classic Theme Restorer](https://addons.mozilla.org/en-US/firefox/addon/classicthemerestorer/) Extension  
Required options for `Classic Theme Restorer` `1.2.3`:
- Select `Tabs not on top - set [tabsontop=false]` in `Tabs` page: should fix the vertical tabbar direction  
- Uncheck `Firefox titlebar (about:config preference)` in ` Application button` page: should fix the totally unusable layout  


## Extension since `0.12.0`
Only support Firefox 31 ESR  
(Firefox of other versions can still install the extension, but issues for those will be ignored)


## Extension since `0.10.0`
Some features are extracted into other extensions (which can be used separately):
- Some coloring features extracted into [Tab Kit - Tab Highlighter](https://github.com/tabkit/tab-highlighter)
- Some mouse gesture features extracted into [Tab Kit - Mouse Gestures](https://github.com/tabkit/mouse-gestures)


## Download / Installation
- [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tabkit-2nd-edition/)  
- [Alternative download (Beta and official releases that might not be approved yet)](https://bintray.com/tabkit/tabkit2)  
If you download as a file, then you have to go to Firefox Addon Page, then press the gear button and choose `Install Addon from file`


## Issue
- [Github (here)](https://github.com/tabkit/tabkit2/issues)  
I have moved a few issues from Google Code, move more if you think it's necessary
- [Google Code](http://code.google.com/p/tabkit-2nd-edition/issues/list)  
Deprecated


## Changes
See https://github.com/tabkit/tabkit2/blob/master/CHANGELOG.md


## Tab Kit Series Extensions
- [Tab Kit 2nd Edition](https://github.com/tabkit/tabkit2)
- [Tab Kit - Tab Highlighter](https://github.com/tabkit/tab-highlighter)
- [Tab Kit - Mouse Gestures](https://github.com/tabkit/mouse-gestures)


## News & Discussion
- [Google Group (For more general discussion)](http://groups.google.com/group/tabkit-2nd-edition)


## Project Helper Needed!
If you want some feature added, then it might be faster to do it yourself! :P  
I am working as Web Developer and don't really have time to develop Tab Kit :d


## Collaboration
Since we are on GitHub  
Just fork, change and send pull request  
I will check frequently (since I also use GitHub at work)

## Download from Mozilla Addon Site if possible  
The one on their site is reviewed  
But if you don't want to wait, then use the Custom download one :P


## Compatibility with other extensions
- Firebug: Incompatible  
(But it seems OK since Fx10 o_0)


## Compatibility with new features in Fx4+
- TabsOnTop: Not allowed by Tab Kit, unless you change it in options
- App/Pin Tabs: Use it at your own risk, no support provided
- Tab Groups: Not allowed by Tab Kit, unless you change it in options


### False incompatibility with newer Firefox
Summary:  
If newer Firefox say it is incompatible, install one of the following:  
- https://addons.mozilla.org/en-US/firefox/addon/add-on-compatibility-reporter/
- https://addons.mozilla.org/en-us/firefox/addon/checkcompatibility/

But it should not be a problem since Fx 12


## License
Look the tabkit.js for now
