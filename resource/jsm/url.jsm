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

"use strict";

var EXPORTED_SYMBOLS = ["URL"];

var URL = new function() {
  Object.defineProperties(this, {
    SEPARATOR: {
      value: "/",
      writable: false,
    },
  });
  // Joining a url & a urlPart, removing extra SEPARATOR
  //
  // @param url [String]
  // @param urlPart [String]
  //
  // @example TabKit2.URL.join('chrome://package/', '/path') => 'chrome://package/path'
  this.join = function join(url, urlPart) {
    url     = url.replace(new RegExp(this.SEPARATOR + "$"), "");
    urlPart = urlPart.replace(new RegExp("^" + this.SEPARATOR), "");

    return [url, urlPart].join(this.SEPARATOR);
  };
  // @note This also matches protocal relative url
  // @note This will return false when there are leading spaces, OK for browser but not for extension (I think)
  this.isAbsolute = function isAbsolute(str) {
    var r = new RegExp("^(?:[a-z]+:)?//", "i");
    return r.test(str);
  };
};
