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

var EXPORTED_SYMBOLS = ["Unloader"];

const { utils: Cu } = Components;

Cu.import("resource://tabkit2/jsm/logging.jsm");

// Nope you CANNOT assign it to a new array
const unloaders = [];

// @return [Function, Boolean]
//   a function that might be able to remove
//   or a Boolean indicating it's success or not
function unload(callback, container) {
  // Initialize the array of unloaders on the first usage

  // Calling with no arguments runs all the unloader callbacks
  if (typeof callback === "undefined" || callback === null) {
    // last registered unloader is executed first to ensure proper cleanup (like parent => child unloader registering)
    unloaders.slice().reverse().forEach(function(unloader) {
      unloader();
    });
    unloaders.length = 0;
    return true;
  }

  if (typeof callback !== "function") {
    TaggedLogging.tagged(["unload"], function() {
      Logging.error(["The callback passed in is not a function", callback]);
    });
    return false;
  }

  // The callback is bound to the lifetime of the container if we have one
  if (typeof container !== "undefined" && container !== null) {
    if ("addEventListener" in container && "removeEventListener" in container) {
      // Remove the unloader when the container unloads
      container.addEventListener("unload", removeUnloader, false);

      // Wrap the callback to additionally remove the unload listener
      let originalCallback = callback;
      callback = function() {
        container.removeEventListener("unload", removeUnloader, false);
        originalCallback();
      };
    }
    else {
      TaggedLogging.tagged(["unload"], function() {
        Logging.error(["The container passed in does not have addEventListener", container]);
      });
      return false;
    }
  }

  // Wrap the callback in a function that ignores failures
  // This is also referenced to be removed on "unload" event of container (if present)
  function unloader() {
    try {
      callback();
    }
    catch(ex) {}
  }
  unloaders.push(unloader);

  // Provide a way to remove the unloader
  function removeUnloader() {
    let index = unloaders.indexOf(unloader);
    if (index !== -1) {
      unloaders.splice(index, 1);
    }
  }
  return removeUnloader;
}

const Unloader = {
  unload: unload,
};
