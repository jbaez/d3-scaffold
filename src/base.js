var helper = require('./helper');

/**
 * Base Class for Charts and Plates.
 *
 * @param {object=} options Options to use.
 */
var Base = function(options) {
  var self = this;

  /**
   * Called by updateDimension.
   * Subclasses can override this function.
   * @protected
   * @return {this}
   */
  this._updateDimension = function() {
    return self;
  };

  this.copyDimension = function(another) {
    if (another) {
      var newState = another._state,
        newOptions = newState.options;

      helper.deepExtend(this._state, {
        width: newState.width,
        height: newState.height,
        options: {
          offset: newOptions.offset.concat(),
          margin: newOptions.margin,
          pixelRatio: newOptions.pixelRatio
        }
      });
      self._updateDimension();
    }
    return self;
  };

  /**
   * Sets/gets the width.
   *
   * @param {number=} width
   */
  this.width = function(width) {
    var newValue;
    if (typeof width == 'undefined') {
      return self._state.width;
    }
    newValue = Math.floor(+width);
    if (newValue !== self._state.width) {
      self._state.width = newValue;
      self._updateDimension();
    }
    return self;
  };

  this.height = function(height) {
    var newValue;
    if (typeof height == 'undefined') {
      return self._state.height;
    }
    newValue = Math.floor(+height);
    if (newValue !== self._state.height) {
      self._state.height = newValue;
      self._updateDimension();
    }
    return self;
  };

  this.dimension = function(dimension) {
    var newValue;
    if (typeof dimension == 'undefined') {
      return [self._state.width, self._state.height];
    }
    newValue = dimension.length == 2 ? dimension : null;
    if (newValue) {
      self.width(dimension[0])
        .height(dimension[1]);
    }
    return self;
  };

  this.margin = function(margin) {
    var oldMargin, newMargin, changed;
    if (typeof margin == 'undefined') {
      return self._state.options.margin;
    }
    oldMargin = self._state.options.margin;
    newMargin = helper.extend({}, self._state.options.margin, margin);
    changed = false;

    for (var field in newMargin) {
      if (oldMargin[field] !== newMargin[field]) {
        changed = true;
        break;
      }
    }
    if (changed) {
      self._state.options.margin = newMargin;
      self._updateDimension();
    }
    return self;
  };

  this.offset = function(offset) {
    var oldOffset, newOffset, changed;
    if (typeof offset == 'undefined') {
      return self._state.options.offset;
    }
    oldOffset = self._state.options.offset;
    newOffset = offset.length == 2 ? offset : null;
    changed = false;
    if (newOffset) {
      if (newOffset[0] !== oldOffset[0] || newOffset[1] !== oldOffset[1]) {
        // [0] = x [1] = y offset has changed either for x or y
        changed = true;
      }
    }
    if (changed) {
      self._state.options.offset = newOffset;
      self._updateDimension();
    }
    return self;
  };

  this.pixelRatio = function(ratio) {
    var newValue;
    if (typeof ratio == 'undefined') {
      return self._state.options.pixelRatio;
    }
    newValue = +ratio;
    if (newValue !== self._state.options.pixelRatio) {
      self._state.options.pixelRatio = newValue;
      self._updateDimension();
    }
    return self;
  };

  this.updateDimensionNow = function() {
    self._updateDimension();
    return self;
  };

  // init
  (function() {
    var mergedOptions = helper.deepExtend(self.getDefaultOptions(), options);

    self._state = {
      width: mergedOptions.width,
      height: mergedOptions.height,
      options: mergedOptions
    };

    self._updateDimension = helper.debounce(self._updateDimension.bind(self), 1);
  })();
};

Base.prototype.getDefaultOptions = function() {
  return {
    width: 720,
    height: 500,
    margin: {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30
    },
    offset: [0.5, 0.5],
    pixelRatio: window.devicePixelRatio || 1
  };
};

module.exports = Base;
