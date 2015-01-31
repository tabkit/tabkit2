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

"use strict";

var EXPORTED_SYMBOLS = ["TabUtilities"];

const { utils: Cu, classes: Cc, interfaces: Ci } = Components;

Cu.import("resource://tabkit2/jsm/logging.jsm");

const sessionStore = Components.classes["@mozilla.org/browser/sessionstore;1"].
                      getService(Ci.nsISessionStore);


// set attribute and store it to session store
//
// @return [Boolean] whether operation is successful
function setAttribute(tab, attributeName, stringValue) {
  if (typeof attributeName !== "string") {
    Logging.error(["attributeName is not a string",
      {
        tab: tab,
        attributeName: attributeName,
        stringValue: stringValue,
      }
    ]);
    return false;
  }
  if (typeof stringValue !== "string") {
    Logging.error(["stringValue is not a string",
      {
        tab: tab,
        attributeName: attributeName,
        stringValue: stringValue,
      }
    ]);
    return false;
  }
  if (stringValue.length === 0) {
    Logging.error(["stringValue has zero length!",
      {
        tab: tab,
        attributeName: attributeName,
        stringValue: stringValue,
      }
    ]);
    return false;
  }

  tab.setAttribute(attributeName, stringValue);
  sessionStore.setTabValue(tab, attributeName, stringValue);

  return true;
}

// @return [Boolean] whether operation is successful
function removeAttribute(tab, attributeName) {
  if (typeof attributeName !== "string") {
    Logging.error(["attributeName is not a string",
      {
        tab: tab,
        attributeName: attributeName,
      }
    ]);
    return false;
  }

  tab.removeAttribute(attributeName);
  sessionStore.deleteTabValue(tab, attributeName);

  return true;
}

// @return [Boolean] whether operation is successful
function restoreAttribute(tab, attributeName) {
  if (typeof attributeName !== "string") {
    Logging.error(["attributeName is not a string",
      {
        tab: tab,
        attributeName: attributeName,
      }
    ]);
    return false;
  }

  let value = sessionStore.getTabValue(tab, attributeName);
  if (value.length > 0) {
    tab.setAttribute(attributeName, value);
  }
  else {
    tab.removeAttribute(attributeName);
  }

  return true;
}


const TabUtilities = new function() {
  this.setAttribute = setAttribute;
  this.removeAttribute = removeAttribute;
  this.restoreAttribute = restoreAttribute;
};
