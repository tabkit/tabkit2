/*
Tab Kit 2 - https://github.com/tabkit/tabkit2
Copyright © 2014 Leung Ho Kung (PikachuEXE) <pikachuexe@gmail.com>

This file is part of Tab Kit 2.

Tab Kit 2 is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

Tab Kit 2 is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

For the complete terms of the GNU General Public License, please see this URL:
http://www.gnu.org/licenses/gpl-2.0.html
*/

(function (window) {

// Useful constants shortcuts
const { utils: Cu } = Components;


// Shortcut for (our) module loader
const JSMLoader = (function loadJSMLoader() {
  const tmp = {};
  Cu.import("resource://tabkit2/jsm/jsm-loader.jsm", tmp);
  return tmp.JSMLoader;
})();


const { Logging: Logging, TaggedLogging: TaggedLogging } = JSMLoader.fetch("logging.jsm");
// Set custom console to support styling
if (!Logging.consoleSupportStyling) {
  Logging.console = console;
}
// setTimeout(function() {
//   console.info("Pure console test");

//   Logging.trace();
//   Logging.trace("Tracing");
//   Logging.debug("Test");
//   Logging.info("Test");
//   Logging.warn("Test");
//   Logging.error("Test");

//   TaggedLogging.tagged(["pika", "chu"], function() {
//     Logging.trace("Test");
//   });
//   TaggedLogging.tagged(["pika", "chu"], function() {
//     Logging.debug("Test");
//   });
//   TaggedLogging.tagged(["pika", "chu"], function() {
//     Logging.info("Test");
//   });
//   TaggedLogging.tagged(["pika", "chu"], function() {
//     Logging.warn("Test");
//   });
//   TaggedLogging.tagged(["pika", "chu"], function() {
//     Logging.error("Test");
//   });
// }, 5 * 1000);


const { Unloader: Unloader } = JSMLoader.fetch("unloader.jsm");
// setTimeout(function() {
//   Unloader.unload({});
//   Unloader.unload(function() {
//     Logging.debug("I am in unloader!");
//   });
//   Unloader.unload(function() {
//     Logging.error("This should not run...");
//   }, {});
//   Unloader.unload(function() {
//     Logging.debug("This should run as long as window has not received unload event");
//   }, window);
//   Unloader.unload();
// }, 5 * 1000);



const { Preferences: Preferences } = JSMLoader.fetch("preferences.jsm");
// setTimeout(function() {
//   Preferences.getLocalPref();
//   Preferences.getLocalPref("test.not_here");
//   Preferences.getLocalPref("test.simple.string");
//   Preferences.getLocalPref("test.simple.string", "custom default");
//   Preferences.getLocalPref("test.simple.object");
//   Preferences.getLocalPref("test.simple.null");
//   Preferences.getLocalPref("test.simple.undefined");

//   Preferences.setLocalPref();
//   Preferences.setLocalPref("test.not_here");
//   Preferences.setLocalPref("test.simple.string");
//   Preferences.setLocalPref("test.simple.string", null);
//   Preferences.setLocalPref("test.simple.string", true);
//   Preferences.setLocalPref("test.simple.string", Preferences.getLocalPref("test.simple.string"));
//   Preferences.setLocalPref("test.simple.object", "foo");
//   Preferences.setLocalPref("test.simple.null", "foo");
//   Preferences.setLocalPref("test.simple.undefined", "foo");

//   Preferences.addGlobalPrefListener();
//   Preferences.addGlobalPrefListener("extensions.tabkit2.test.prefListener.global");
//   Preferences.addGlobalPrefListener("extensions.tabkit2.test.prefListener.global", function(prefName) {
//     Logging.debug([
//       "Inside global pref listener",
//       {prefName: prefName}
//     ]);
//   });
//   Preferences.addGlobalPrefListener("extensions.tabkit2.test.prefListener.global", function(prefName) {
//     Logging.error("This should not run...");
//   }, {});
//   Preferences.addGlobalPrefListener("extensions.tabkit2.test.prefListener.global", function(prefName) {
//     Logging.debug([
//       "Inside global pref listener with container",
//       {prefName: prefName}
//     ]);
//   }, window);

//   Preferences.addLocalPrefListener();
//   Preferences.addLocalPrefListener("test.prefListener.local");
//   Preferences.addLocalPrefListener("test.prefListener.local", function(prefName) {
//     Logging.debug([
//       "Inside local pref listener",
//       {prefName: prefName}
//     ]);
//   });
//   Preferences.addLocalPrefListener("test.prefListener.local", function(prefName) {
//     Logging.error("This should not run...");
//   }, {});
//   Preferences.addLocalPrefListener("test.prefListener.local", function(prefName) {
//     Logging.debug([
//       "Inside local pref listener with container",
//       {prefName: prefName}
//     ]);
//   }, window);

//   setTimeout(function() {
//     Preferences.setLocalPref("test.prefListener.global", !Preferences.getLocalPref("test.prefListener.global"));
//     Preferences.setLocalPref("test.prefListener.local", !Preferences.getLocalPref("test.prefListener.local"));
//   }, 5 * 1000);
// }, 5 * 1000);


const { PreferenceAttributeMapper: PreferenceAttributeMapper } = JSMLoader.fetch("preference-attribute-mapper.jsm");
// setTimeout(function() {
//   PreferenceAttributeMapper.mapLocalPrefToAttribute();
//   PreferenceAttributeMapper.mapLocalPrefToAttribute({});
//   PreferenceAttributeMapper.mapLocalPrefToAttribute("test.prefAttrMapper.file");
//   PreferenceAttributeMapper.mapLocalPrefToAttribute("test.prefAttrMapper.bool");
//   PreferenceAttributeMapper.mapLocalPrefToAttribute("test.prefAttrMapper.bool", {});
//   PreferenceAttributeMapper.mapLocalPrefToAttribute("test.prefAttrMapper.bool", window);
//   PreferenceAttributeMapper.mapLocalPrefToAttribute("test.prefAttrMapper.bool", gBrowser.tabContainer);
//   PreferenceAttributeMapper.mapLocalPrefToAttribute("test.prefAttrMapper.bool", gBrowser.tabContainer, []);
//   PreferenceAttributeMapper.mapLocalPrefToAttribute("test.prefAttrMapper.bool", gBrowser.tabContainer, "tabkit2--test--pref-attr-mapper");
//   PreferenceAttributeMapper.mapLocalPrefToAttribute("test.prefAttrMapper.bool", gBrowser.tabContainer, "tabkit2--test--pref-attr-mapper", {});
//   PreferenceAttributeMapper.mapLocalPrefToAttribute("test.prefAttrMapper.bool", gBrowser.tabContainer, "tabkit2--test--pref-attr-mapper", function(value) {
//     Logging.debug("mapLocalPrefToAttribute success");
//     return value ? "hello" : "hi";
//   });

//   PreferenceAttributeMapper.mapLocalBoolPrefToAttribute("test.prefAttrMapper.bool", gBrowser.tabContainer, "tabkit2--test--bool-pref-attr-mapper");

//   setTimeout(function() {
//     Preferences.setLocalPref("test.prefAttrMapper.bool", !Preferences.getLocalPref("test.prefAttrMapper.bool"));
//   }, 5 * 1000);
// }, 5 * 1000);

const { TabUtilities: TabUtilities } = JSMLoader.fetch("tab-utilities.jsm");


const TabKit2 = new function _Tabkit2() {

  // Shortcuts to be used in callbacks
  const tk2 = this;

  Object.defineProperties(this, {
    Logging: {
      value: Logging,
    },
    Unloader: {
      value: Unloader,
    },
  });


  this.Modules = {};
};


window.TabKit2 = TabKit2;

})(this);
