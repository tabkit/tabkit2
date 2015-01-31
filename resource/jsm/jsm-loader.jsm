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
/* global URL */

"use strict";

var EXPORTED_SYMBOLS = ["JSMLoader"];

const { utils: Cu } = Components;

Cu.import("resource://tabkit2/jsm/url.jsm");

const JSMLoader = new function() {
  const self = this;

  Object.defineProperties(this, {
    DEFAULT_JSM_ROOT_PATH: {
      value: "resource://tabkit2/jsm/",
      writable: false,
    },
  });

  // Same as Components.utils.import
  // But you can pass relative path to skip the prefix
  this.load = function load(relativeOrAbsoluteUrl, scope) {
    if (typeof scope !== "undefined" && scope !== null) {
      Cu.import(calculateFullURL(relativeOrAbsoluteUrl), scope);
    }
    else {
      Cu.import(calculateFullURL(relativeOrAbsoluteUrl));
    }
  };
  // @return [object] an object that contains the modules loaded from JSM
  // @example fetch('file-with-abc-modules.jsm') => {a: {...}, b: {...}, c: {...}}
  this.fetch = function fetch(relativeModulePath) {
    var resultObject = {};
    this.load(relativeModulePath, resultObject);
    return resultObject;
  };

  // @private
  function calculateFullURL(relativeOrAbsoluteUrl) {
    if (URL.isAbsolute(relativeOrAbsoluteUrl)) {
      return relativeOrAbsoluteUrl;
    }
    return URL.join(self.DEFAULT_JSM_ROOT_PATH, relativeOrAbsoluteUrl);
  }
};
