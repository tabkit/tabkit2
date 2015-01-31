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
/* global Preferences */

"use strict";

var EXPORTED_SYMBOLS = ["PreferenceAttributeMapper"];

const { utils: Cu, classes: Cc, interfaces: Ci } = Components;

Cu.import("resource://tabkit2/jsm/logging.jsm");
Cu.import("resource://tabkit2/jsm/unloader.jsm");
Cu.import("resource://tabkit2/jsm/preferences.jsm");


/*
 *  Observe Preference change, and manipulate the *node*'s attribute (with attributeName)
 *
 *  @param [string] prefKey: Preferences keys, relative to our extension branch
 *  @param [object] node: The DOM node to add/change attribute
 *  @param [string] attributeName: The name is attribute to add/change
 *  @param [function] attributeValueFunc: The function to return the value of attribute to be set, if undefined is returned, will remove the attribute
 *
 *  @return [Boolean] whether mapping is successful
 */
function mapLocalPrefToAttribute(prefKey, node, attributeName, attributeValueFunc) {
  if (typeof prefKey !== "string") {
    Logging.error([
      "prefKey is not a string",
      {
        prefKey: prefKey,
        node: node,
        attributeName: attributeName,
      }
    ]);
    return false;
  }
  if (!Preferences.hasLocalPref(prefKey)) {
    Logging.error([
      "prefKey is not included in default preferences",
      {
        prefKey: prefKey,
        node: node,
        attributeName: attributeName,
      }
    ]);
    return false;
  }
  if (typeof node === "undefined" || node === null) {
    Logging.error([
      "node is undefined or null",
      {
        prefKey: prefKey,
        node: node,
        attributeName: attributeName,
      }
    ]);
    return false;
  }
  if (!("setAttribute" in node) || !("removeAttribute" in node)) {
    Logging.error([
      "node does not have setAttribute or removeAttribute",
      {
        prefKey: prefKey,
        node: node,
        attributeName: attributeName,
      }
    ]);
    return false;
  }
  if (typeof attributeName !== "string") {
    Logging.error([
      "attributeName is not a string",
      {
        prefKey: prefKey,
        node: node,
        attributeName: attributeName,
      }
    ]);
    return false;
  }
  if (typeof attributeValueFunc !== "function") {
    Logging.error([
      "attributeValueFunc is not a function",
      {
        prefKey: prefKey,
        node: node,
        attributeName: attributeName,
        attributeValueFunc: attributeValueFunc,
      }
    ]);
    return false;
  }


  // This listener must accept `aData` as parameter
  // See `PREF_OBSERVER.observe`
  function listener(aData) {
    // aData is the prefKey being changed
    // prefKey is the prefKey we want to listen to
    if (aData !== prefKey) {
      return;
    }

    var prefValue = Preferences.getLocalPref(aData);
    var newAttrbuteValue = attributeValueFunc(prefValue);

    if (typeof newAttrbuteValue !== "undefined") {
      node.setAttribute(attributeName, newAttrbuteValue);
    }
    else {
      node.removeAttribute(attributeName);
    }
  }

  // The container should be the node
  Preferences.addLocalPrefListener(prefKey, listener, node);

  // Execute on register as initialization
  listener(prefKey);

  return true;
}

/*
 *  Observe Boolean Preference change, and add/remove the *node*'s attribute (with attributeName) based whether the pref value is truthy or not
 *
 *  @param [string] prefKey: Preferences keys, will prepend PREF_BRANCH for you
 *  @param [object] node: The DOM node to add/change attribute
 *  @param [string] attributeName: The name is attribute to add/remove
 */
function mapLocalBoolPrefToAttribute(prefKey, node, attributeName) {
  mapLocalPrefToAttribute(prefKey, node, attributeName, function(prefValue) {
    return prefValue ? "true" : undefined;
  });
}

const PreferenceAttributeMapper = {
  mapLocalPrefToAttribute: mapLocalPrefToAttribute,

  mapLocalBoolPrefToAttribute: mapLocalBoolPrefToAttribute,
};
