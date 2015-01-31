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

/* jshint globalstrict: true */
/* global Components */
/* global Logging */
/* global TaggedLogging */
/* global Unloader */

"use strict";

var EXPORTED_SYMBOLS = ["Preferences"];

const { utils: Cu, classes: Cc, interfaces: Ci } = Components;

Cu.import("resource://tabkit2/jsm/logging.jsm");
Cu.import("resource://tabkit2/jsm/unloader.jsm");


// The trailing dot is important
const PREF_BRANCH = "extensions.tabkit2.";
// These are relative to branch
const defaultPreferences = {
  "test.simple.boolean": true,
  "test.simple.number": 1,
  "test.simple.string": "foo",
  "test.simple.object": {},
  "test.simple.null": null,
  "test.simple.undefined": undefined,

  "test.prefListener.global": false,
  "test.prefListener.local": false,

  "test.prefAttrMapper.bool": false,
};
const prefService             = Cc["@mozilla.org/preferences-service;1"]
                                .getService(Ci.nsIPrefService);
const globalPrefBranch        = Cc["@mozilla.org/preferences-service;1"]
                                .getService(Ci.nsIPrefBranch);
const localPrefBranch         = prefService
                                .getBranch(PREF_BRANCH);
const localDefaultPrefBranch  = prefService
                                .getDefaultBranch(PREF_BRANCH);


function hasLocalPref(key) {
  return (key in defaultPreferences);
}

// @return [Boolean, Number, String, null] null when the type is invalid
// @raise [NS_Error] Error raised from `getBoolPref` etc
function getLocalPref(key, aDefault) {
  if (typeof key !== "string") {
    Logging.error(["key is not a string!", {key: key}]);
    return null;
  }

  if (!(key in defaultPreferences)) {
    Logging.error([
      "key is not in defaultPreferences",
      {key: key},
    ]);
    return null;
  }

  var defaultValue = defaultPreferences[key];
  var prefType = localPrefBranch.getPrefType(key);
  // underlying preferences object throws an exception if pref doesn"t exist
  if (prefType === localPrefBranch.PREF_INVALID) {
    if (typeof aDefault !== "undefined" && aDefault !== null) {
      // Note: No type checking here
      return aDefault;
    } else {
      switch (typeof defaultValue) {
        case "boolean":
        case "number":
        case "string":
          return defaultValue;
        default:
          TaggedLogging.tagged(["getLocalPref"], function() {
            Logging.error([
              "defaultValue's type is not a simple type",
              {key: key, defaultValue: defaultValue},
            ]);
          });
          return null;
      }
    }
  }

  // Figure out what type of pref to fetch
  switch (typeof defaultValue) {
    case "boolean":
      return localPrefBranch.getBoolPref(key);
    case "number":
      return localPrefBranch.getIntPref(key);
    case "string":
      return localPrefBranch.getCharPref(key);
    default:
      TaggedLogging.tagged(["getLocalPref"], function() {
        Logging.error([
          "defaultValue's type is not a simple type",
          {key: key, defaultValue: defaultValue},
        ]);
      });
      return null;
  }
}

// @return [Boolean] Whether the operation is successful or not
// @raise [NS_Error] Error raised from `setBoolPref` etc
function setLocalPref(key, aValue) {
  if (typeof key !== "string") {
    Logging.error(["key is not a string!", {key: key}]);
    return false;
  }

  if (!(key in defaultPreferences)) {
    TaggedLogging.tagged(["setLocalPref"], function() {
      Logging.error([
        "key is not in defaultPreferences",
        {key: key},
      ]);
    });
    return false;
  }

  if (typeof aValue === "undefined" || aValue === null) {
    Logging.error("aValue is null or undefined");
    return false;
  }
  var defaultValue = defaultPreferences[key];
  var defaultValueType = typeof defaultValue;

  if (typeof aValue !== defaultValueType) {
    TaggedLogging.tagged(["setLocalPref"], function() {
      Logging.error([
        "aValue type is different from defaultValue",
        {aValue: aValue, defaultValue: defaultValue},
      ]);
    });
    return false;
  }

  // Figure out what type of pref to fetch
  switch (defaultValueType) {
    case "boolean":
      localPrefBranch.setBoolPref(key, aValue);
      break;
    case "number":
      localPrefBranch.setIntPref(key, aValue);
      break;
    case "string":
      localPrefBranch.setCharPref(key, aValue);
      break;
    default:
      TaggedLogging.tagged(["setLocalPref"], function() {
        Logging.error([
          "defaultValue's type is not a simple type",
          {key: key, defaultValue: defaultValue},
        ]);
      });
      return false;
  }

  return true;
}


function setDefaultPrefs() {
  let branch = localDefaultPrefBranch;

  return TaggedLogging.tagged(["setDefaultPrefs"], function() {
    for (let key in defaultPreferences) {
      let val = defaultPreferences[key];
      switch (typeof val) {
        case "boolean":
          branch.setBoolPref(key, val);
          break;
        case "number":
          branch.setIntPref(key, val);
          break;
        case "string":
          branch.setCharPref(key, val);
          break;
        default:
          Logging.warn([
            "val's type is not a simple type",
            {key: key, val: val},
          ]);
          break;
      }
    }
  });
}

// setDefaultPrefs();



// ========== Separator ==========



// @see http://mxr.mozilla.org/mozilla-release/ident?i=NS_PREFBRANCH_PREFCHANGE_TOPIC_ID&tree=mozilla-release&filter=
const NS_PREFBRANCH_PREFCHANGE_TOPIC_ID = "nsPref:changed";

function PreferenceObserver() {
  const listeners = [];
  const self = this;

  // No type checking, assumed to be done outside
  function addListener(listener) {
    listeners.push(listener);
  }
  function removeListener(listener) {
    let index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  this.addListenerWithUnload = function addListenerWithUnload(listener, container) {
    // Whether container is there or not, it's handled by unloader
    let observerListenerUnloaderAdded = Unloader.unload(function() {
      removeListener(listener);
    }, container);
    if (observerListenerUnloaderAdded) {
      addListener(listener);
    }
  };

  this.observe = function observe(aSubject, aTopic, aData) {
    if (aTopic !== NS_PREFBRANCH_PREFCHANGE_TOPIC_ID) {
      return;
    }
    // aSubject is the nsIPrefBranch we're observing (after appropriate QI)
    // aData is the name of the pref that's been changed (relative to aSubject)
    listeners.forEach(function(listener) {
      try {
        listener(aData);
      }
      catch(ex) {
        TaggedLogging.tagged("PrefObserver", function() {
          Logging.error([
            "error thrown when running listener",
            {
              aData: aData,
              listener: listener,
              ex: ex,
            }
          ]);
        });
      }
    });
  };
}

function PreferenceObserverCollection(prefBranch) {
  const observers = {};
  const _prefBranch = prefBranch;

  this.fetchObserver = function(prefDomain) {
    if (!(prefDomain in observers)) {
      let newLocalPrefObserver = new PreferenceObserver();
      observers[prefDomain] = newLocalPrefObserver;

      // Since observer is global (NOT window specific)
      // container should NOT be passed in
      let observerUnloaderAdded = Unloader.unload(function() {
        _prefBranch.removeObserver(prefDomain, newLocalPrefObserver);
      });
      if (observerUnloaderAdded) {
        _prefBranch.addObserver(prefDomain, newLocalPrefObserver, false);
      }
    }

    return observers[prefDomain];
  };
}

const globalPrefObservers = new PreferenceObserverCollection(globalPrefBranch);
const localPrefObservers = new PreferenceObserverCollection(localPrefBranch);


// Add a listener for a "domain"
//
// @param prefDomain [String]
//    @see https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIPrefBranch
// @param prefListener [Function]
//    It should accept a single argument which is the full (not relative) preference key
// @param container [Object]
//    Optional
//    Anything that has method `addEventListener`
//    If passed in, the listener will be removed on unload event of container (using unload module)
//
// @return [Boolean] Whether the operation is successful or not
function addGlobalPrefListener(prefDomain, prefListener, container) {
  if (typeof prefDomain !== "string") {
    TaggedLogging.tagged(["addGlobalPrefListener"], function() {
      Logging.error([
        "prefDomain is not a string",
        {prefDomain: prefDomain}
      ]);
    });
    return false;
  }
  if (typeof prefListener !== "function") {
    TaggedLogging.tagged(["addGlobalPrefListener"], function() {
      Logging.error([
        "prefListener is not a function",
        {
          prefDomain: prefDomain,
          prefListener: prefListener,
        }
      ]);
    });
    return false;
  }

  globalPrefObservers.fetchObserver(prefDomain).addListenerWithUnload(prefListener, container);
}


// Add a listener for a "domain"
//
// @param prefDomain [String]
//     Different from the global one, this is relative to our extension branch
//    @see https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIPrefBranch
// @param prefListener [Function]
//    It should accept a single argument which is the full (not relative) preference key
// @param container [Object]
//    Optional
//    Anything that has method `addEventListener`
//    If passed in, the listener will be removed on unload event of container (using unload module)
//
// @return [Boolean] Whether the operation is successful or not
function addLocalPrefListener(prefDomain, prefListener, container) {
  if (typeof prefDomain !== "string") {
    TaggedLogging.tagged(["addLocalPrefListener"], function() {
      Logging.error([
        "prefDomain is not a string",
        {prefDomain: prefDomain}
      ]);
    });
    return false;
  }
  if (typeof prefListener !== "function") {
    TaggedLogging.tagged(["addLocalPrefListener"], function() {
      Logging.error([
        "prefListener is not a function",
        {
          prefDomain: prefDomain,
          prefListener: prefListener,
        }
      ]);
    });
    return false;
  }

  localPrefObservers.fetchObserver(prefDomain).addListenerWithUnload(prefListener, container);
}


const Preferences = new function() {

  this.hasLocalPref = hasLocalPref;
  this.getLocalPref = getLocalPref;
  this.setLocalPref = setLocalPref;

  this.addGlobalPrefListener = addGlobalPrefListener;
  this.addLocalPrefListener  = addLocalPrefListener;

};
