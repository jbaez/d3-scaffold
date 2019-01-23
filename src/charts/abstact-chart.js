var Base = require('../base'),
  helper = require('../helper'),
  d3 = require('d3');

/**
 * Abstract Chart.
 *
 * @param {object|string} selector HTMLElement or selector to use for the Chart.
 * @param {object=} options Options to use.
 */
var AbstractChart = function(selector, options) {
  var self = this;
  Base.call(this, options);

  /**
   * Called by updateDimension.
   *
   * @protected
   * @override
   * @return {this}
   */
  this._updateDimension = function() {
    var width = self._state.width,
      height = self._state.height,
      plates = self._state.plates,
      margin = self._state.options.margin;

    self._state.innerWidth = width - margin.left - margin.right;
    self._state.innerHeight = height - margin.top - margin.bottom;

    self.chartRoot
      .style('width', width + 'px')
      .style('height', height + 'px');

    for (var key in plates) {
      plates[key].copyDimension(self)
        .updateDimensionNow();
    }

    // Dispatch resize event
    self.dispatcher.apply(
      'resize',
      self,
      [width, height, self._state.innerWidth, self._state.innerHeight]
    );

    return self;
  };

  /**
   * @protected
   */
  this._dispatchData = function() {
    self.dispatcher.call('data', self, self._state.data);
    return self;
  };

  /**
   * @protected
   */
  this._dispatchOptions = function() {
    self.dispatcher.call('options', self, self._state.options);
    return self;
  };

  this.addPlate = function(name, plate, doNotAppend) {
    if(self.plates[name]) {
      throw new Error('Plate with this name already exists', name);
    }
    self._state.plates.push(plate);
    self.plates[name] = plate;
    if (doNotAppend) {
      return self;
    }
    plate.getSelection()
      .classed('d3-scaffold-plate', true)
      .style('position', 'absolute')
      .style('top', '0px')
      .style('left', '0px');
    self.chartRoot.append(function() { return plate.getNode(); });
    return self;
  };

  this.removePlate = function(name) {
    var plate = self.plates[name],
      index;
    if (plate) {
      index = self._state.plates.indexOf(plate);
      if (index > -1) {
        self._state.plates.splice(index, 1);
      }
      if (plate.getNode().parentNode === self.chartRoot.node()) {
        self.chartRoot.node().removeChild(plate.getNode());
      }
      delete self.plates[name];
    }
    return self;
  };

  this.setupDispatcher = function(customEventNames) {
    self._customEventNames = customEventNames || [];
    self._eventNames = AbstractChart.DEFAULT_EVENTS.concat(customEventNames);
    self.dispatcher = d3.dispatch.apply(self, self._eventNames);
    return self;
  };

  this.getInnerWidth = function() {
    return self._state.innerWidth;
  };

  this.getInnerHeight = function() {
    return self._state.innerHeight;
  };

  /**
   * Returns the data when no arguments are passed.
   * Sets the data when using the argument
   *
   * @param {array=} data Data to set.
   * @returns {this}
   */
  this.data = function(data) {
    if (typeof data == 'undefined') {
      return self._state.data;
    }
    self._state.data = data;
    self._dispatchData();
    return self;
  };

  this.options = function(options) {
    var copy;
    if (typeof options == 'undefined') {
      return self._state.options;
    }

    copy = helper.extend({}, options);

    if (options.margin) {
      self.margin(options.margin);
      delete copy.margin;
    }
    if (options.offset) {
      self.offset(options.offset);
      delete copy.offset;
    }
    if (options.pixelRatio) {
      self.pixelRatio(options.pixelRatio);
      delete copy.pixelRatio;
    }

    self._state.options = helper.deepExtend(self._state.options, copy);

    self._dispatchOptions();
    return self;
  };

  this.hasData = function() {
    var data = this._state.data;
    return data !== null && data !== undefined;
  };

  this.hasNonZeroArea = function() {
    var innerWidth = self._state.innerWidth,
      innerHeight = self._state.innerHeight;
    return (innerWidth > 0 && innerHeight > 0);
  };

  this.on = function(name, listener) {
    self.dispatcher.on(name, listener);
    return self;
  };

  this.off = function(name) {
    self.dispatcher.on(name, null);
    return self;
  };

  this.dispatchAs = function(name) {
    return function() {
      self.dispatcher.apply(name, self, arguments);
    };
  };

  this.destroy = function() {
    for (var i = 0; i < self._eventNames.length; i++) {
      self.off(self._eventNames[i]);
    }
    return self;
  };

  // init
  (function() {
    helper.extend(self._state, {
      innerWidth: 0,
      innerHeight: 0,
      data: null,
      plates: []
    });

    self.container = d3.select(selector);
    // Enforce line-height = 0 to fix issue with height resizing
    self.container.style('line-height', '0px');

    self.chartRoot = self.container.append('div')
      .classed('d3-scaffold-chart-root', true)
      .style('display', 'inline-block')
      .style('position', 'relative')
      .style('line-height', '0px');

    self.plates = {};

    var customEvents = self.getCustomEventNames();
    self.setupDispatcher(customEvents);

    self._dispatchData = helper.debounce(self._dispatchData.bind(self), 1);
    self._dispatchOptions = helper.debounce(self._dispatchOptions.bind(self), 1);

    self.on('data', function() {
      self.draw();
    });
  }());
};

AbstractChart.DEFAULT_EVENTS = ['data', 'options', 'resize'];

AbstractChart.prototype = Object.create(Base.prototype);
AbstractChart.prototype.constructor = AbstractChart;

/**
 * Return the custom event names to register.
 * Can be overridden by subclasses.
 *
 * @returns {array}
 */
AbstractChart.prototype.getCustomEventNames = function() {
  return [];
};

/**
 * Method to draw the chart.
 * To be overridden in subclasses.
 *
 * @abstract
 */
AbstractChart.prototype.draw = function() {};

module.exports = AbstractChart;
