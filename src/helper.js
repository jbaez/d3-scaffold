var debounce = require('lodash.debounce'),
  isObject = require('lodash.isobject'),
  trim = require('underscore.string/trim');

var exports = {};

exports.debounce = debounce;
exports.isObject = isObject;

exports.kebabCase = function(str) {
  return trim(str)
    .replace(/([A-Z])/g, '-$1')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase();
};


//---------------------------------------------------
// From http://youmightnotneedjquery.com/
//---------------------------------------------------

exports.deepExtend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj)
      continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object')
          out[key] = exports.deepExtend(out[key], obj[key]);
        else
          out[key] = obj[key];
      }
    }
  }

  return out;
};

exports.extend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
};

module.exports = exports;
