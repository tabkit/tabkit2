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
/* global ConsoleAPI */
/* global console */
/* global extractOptions */

"use strict";

var EXPORTED_SYMBOLS = ["Logging", "TaggedLogging"];

const { utils: Cu } = Components;

// @see https://developer.mozilla.org/en-US/docs/Web/API/console
Cu.import("resource://gre/modules/devtools/Console.jsm");

Cu.import("resource://tabkit2/jsm/extract-options.jsm");


var customConsole = null;


const TaggedLogging = new function() {
  const _currentTags = [];

  // @param [String, Number, Array] single or multiple objects what would be converted into strings
  // @return whatever loggingFunc returns, if failed it returns `undefined`
  this.tagged = function tagged(tags, loggingFunc) {
    if (typeof tags === "undefined" || tags === null) {
      Logging.warn("tags is null or undefined!");
      Logging.trace();
      tags = [];
    }
    else if (Array.isArray(tags)) {
      // do nothing
    }
    else if (typeof tags === "string") {
      tags = [tags];
    }
    else {
      Logging.warn(["tags is not an array or a string!", {tags: tags}]);
      Logging.trace();
      tags = [];
    }

    let length = pushTags(tags);
    let result;

    try {
      result = loggingFunc();
    }
    catch (ex) {
      Logging.error({ex: ex});
    }
    finally {
      popTags(length);
      return result;
    }
  };

  Object.defineProperty(this, "currentTags", {
    get: function() { return _currentTags.slice(); },
  });

  // return [Number] how many tags are input
  function pushTags(tags) {
    if (typeof tags === "undefined" || tags === null) {
      Logging.error("tags is null or undefined!");
      return 0;
    }
    else if (!Array.isArray(tags)) {
      Logging.error("tags is NOT an array!", {tags: tags});
      return 0;
    }

    var allTagsAreStrings = tags.every(function(tag) {
      return (typeof tag === "string");
    });
    if (!allTagsAreStrings) {
      Logging.error("tags contain non string!", {tags: tags});
      return 0;
    }

    tags.forEach(function(tag) {
      _currentTags.push(tag);
    });
    return tags.length;
  }

  function popTags(length) {
    if (typeof length === "undefined" || length === null) {
      length = 1;
    }

    for (let i = length; i > 0; i--) {
      _currentTags.pop();
    }
  }
};


// Mainly console logging with group
const Logging = new function() {
  const self = this;

  Object.defineProperty(this, "console", {
    get: function() {
      if (customConsole !== null && typeof customConsole === "object") {
        return customConsole;
      }
      return console;
    },
    set: function(newCustomConsole) {
      if (newCustomConsole !== null && typeof newCustomConsole === "object") {
        customConsole = newCustomConsole;
      }
      else {
        customConsole = null;
      }
    },
  });

  Object.defineProperty(this, "consoleSupportStyling", {
    get: function() {
      if (customConsole !== null && typeof customConsole === "object") {
        return true;
      }
      return false;
    },
  });

  this.Trace = new function() {
    const self = this;

    Object.defineProperties(this, {
      groupHeader: {
        value: "[Tab Kit 2][Trace]",
        writable: false,
      },
    });

    // @param arguments [String, Array]
    //   One or more messages
    //   They are just thrown to console.info
    //   If the first argument is an array, it will be used directly
    this.write = function write() {
      const defaultOptions = {};
      var options = extractOptions(arguments, defaultOptions);
      var args = Array.slice(arguments);
      var messages = [];

      if (args.length > 0 && Array.isArray(args[0])) {
        messages = args[0];
      }
      else if (args.length > 0) {
        messages = [ args[0] ] ;
      }

      withGroupHeader(this.groupHeader, function() {
        // Custom Messages
        messages.forEach(function(message) {
          writeSingleMessageToConsole(message, "trace", options);
        });
        // Now write the console
        writeTraceToConsole();
      }, "trace");
    };
  };

  // Debug and Info are almost the same except group header... for now
  // Later Debug message will only be output with hidden preference enabled
  this.Debug = new function() {
    const self = this;

    Object.defineProperties(this, {
      groupHeader: {
        value: "[Tab Kit 2][Debug]",
        writable: false,
      },
    });

    // @param arguments [String, Array]
    //   One or more messages
    //   They are just thrown to console.info
    //   If the first argument is an array, it will be used directly
    this.write = function write() {
      const defaultOptions = {};
      var options = extractOptions(arguments, defaultOptions);
      var args = Array.slice(arguments);
      var messages = [];

      if (args.length > 0 && Array.isArray(args[0])) {
        messages = args[0];
      }
      else if (args.length > 0) {
        messages = [ args[0] ] ;
      }

      withGroupHeader(this.groupHeader, function() {
        messages.forEach(function(message) {
          writeSingleMessageToConsole(message, "debug", options);
        });
      }, "debug");
    };
  };

  this.Info = new function() {
    const self = this;

    Object.defineProperties(this, {
      groupHeader: {
        value: "[Tab Kit 2][Info]",
        writable: false,
      },
    });

    // @param arguments [String, Array]
    //   One or more messages
    //   They are just thrown to console.info
    //   If the first argument is an array, it will be used directly
    this.write = function write() {
      const defaultOptions = {};
      var options = extractOptions(arguments, defaultOptions);
      var args = Array.slice(arguments);
      var messages = [];

      if (args.length > 0 && Array.isArray(args[0])) {
        messages = args[0];
      }
      else if (args.length > 0) {
        messages = [ args[0] ] ;
      }

      withGroupHeader(this.groupHeader, function() {
        messages.forEach(function(message) {
          writeSingleMessageToConsole(message, options);
        });
      });
    };
  };

  this.Warn = new function() {
    const self = this;

    Object.defineProperties(this, {
      groupHeader: {
        value: "[Tab Kit 2][Warn]",
        writable: false,
      },
    });

    // @param arguments [String, Array]
    //   One or more messages
    //   They are just thrown to console.info
    //   If the first argument is an array, it will be used directly
    this.write = function write() {
      const defaultOptions = {};
      var options = extractOptions(arguments, defaultOptions);
      var args = Array.slice(arguments);
      var messages = [];

      if (args.length > 0 && Array.isArray(args[0])) {
        messages = args[0];
      }
      else if (args.length > 0) {
        messages = [ args[0] ] ;
      }

      withGroupHeader(this.groupHeader, function() {
        messages.forEach(function(message) {
          writeSingleMessageToConsole(message, "warn", options);
        });
      }, "warn");
    };
  };

  this.Error = new function() {
    const self = this;

    Object.defineProperties(this, {
      groupHeader: {
        value: "[Tab Kit 2][Error]",
        writable: false,
      },
    });

    // @param arguments [String, Array]
    //   One or more messages
    //   They are just thrown to console.info
    //   If the first argument is an array, it will be used directly
    this.write = function write() {
      const defaultOptions = {};
      var options = extractOptions(arguments, defaultOptions);
      var args = Array.slice(arguments);
      var messages = [];

      if (args.length > 0 && Array.isArray(args[0])) {
        messages = args[0];
      }
      else if (args.length > 0) {
        messages = [ args[0] ] ;
      }

      withGroupHeader(this.groupHeader, function() {
        messages.forEach(function(message) {
          writeSingleMessageToConsole(message, "error", options);
        });
      }, "error");
    };
  };


  // Shortcuts
  this.trace = function() {
    var loggingModule = this.Trace;
    loggingModule.write.apply(loggingModule, arguments);
  };
  this.debug = function() {
    var loggingModule = this.Debug;
    loggingModule.write.apply(loggingModule, arguments);
  };
  this.info = function() {
    var loggingModule = this.Info;
    loggingModule.write.apply(loggingModule, arguments);
  };
  this.warn = function() {
    var loggingModule = this.Warn;
    loggingModule.write.apply(loggingModule, arguments);
  };
  this.error = function() {
    var loggingModule = this.Error;
    loggingModule.write.apply(loggingModule, arguments);
  };





  // Only write a single message
  // Passing in an Array as first argument will print multiple messages
  // Passing in an Object will inspect it instead
  //
  // @param message [Object]
  // @param logLevel [String]
  //   Acually the method name to be used on `console`
  //   Default to "info"
  function writeSingleMessageToConsole(message, logLevel) {
    const defaultLogLevel = "info";
    const defaultOptions = {
      skipTagging: false,
    };

    logLevel = (typeof logLevel === "undefined") ? defaultLogLevel : logLevel;
    var options = extractOptions(arguments, defaultOptions);

    var originalLevel = logLevel;
    switch (logLevel) {
      case "trace":
        logLevel = defaultLogLevel;
        break;
      case "debug":
        logLevel = defaultLogLevel;
        break;
      default:
        break;
    }

    if (typeof message === "undefined") {
      message = "undefined";
    }
    else if (message === null) {
      message = "null";
    }

    let currentTags = TaggedLogging.currentTags;
    let wrappedCurrentTags = currentTags.map(function(tag) {
      return "[" + tag + "]";
    });

    if (typeof message === "string") {
      if (!options.skipTagging && wrappedCurrentTags.length > 0) {
        message = [wrappedCurrentTags.join(" "), message].join(" ");
      }

      if (typeof self.consoleSupportStyling) {
        let messageWithStyle = "%c" + message;
        let style = (function() {
          switch (originalLevel) {
            case "trace":
              return "color: Magenta;";
            case "debug":
              return "color: Green;";
            case "info":
              return "color: Blue;";
            case "warn":
              return "color: OrangeRed;";
            case "error":
              return "color: Red;";
            default:
              return "";
          }
        })();

        self.console[logLevel](messageWithStyle, style);
      }
      else {
        // Style does not work in console module
        self.console[logLevel](message);
      }
    }
    else {
      self.console.dir(message);
    }
  }
  function writeTraceToConsole() {
    self.console.trace();
  }
  // @param logLevel [String] Acually the method name to be used on `console`
  function withGroupHeader(groupHeader, funcInGroup, logLevel) {
    writeSingleMessageToConsole(groupHeader, logLevel, {skipTagging: true});

    self.console.group();

    try {
      funcInGroup();
    }
    finally {
      self.console.groupEnd();
    }
  }
};




