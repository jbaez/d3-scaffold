var AbstractChart = require('./abstact-chart'),
  SvgPlate = require('../plates/svg-plate');

var SvgChart = function(selector, options) {
  var self = this;
  AbstractChart.call(this, selector, options);

  // init
  (function() {
    self.addPlate('svg', new SvgPlate());
    var plate = self.plates.svg;
    self.svg = plate.getSelection();
    self.rootG = plate.rootG;
    self.layers = plate.layers;
    self.updateDimensionNow();
  }());
};

SvgChart.prototype = Object.create(AbstractChart.prototype);
SvgChart.prototype.constructor = SvgChart;

module.exports = SvgChart;
