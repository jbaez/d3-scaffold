var AbstractChart = require('./abstact-chart'),
  CanvasPlate  = require('../plates/canvas-plate');

var CanvasChart = function(selector, options) {
  var self = this;
  AbstractChart.call(this, selector, options);

  this.addPlate('canvas', new CanvasPlate());
  this.canvas = this.plates.canvas.getSelection();
  this.updateDimensionNow();

  this.getContext2d = function() {
    return self.plates.canvas.getContext2d();
  };

  this.clear = function() {
    self.plates.canvas.clear();
    return self;
  };
};

CanvasChart.prototype = Object.create(AbstractChart.prototype);
CanvasChart.prototype.constructor = CanvasChart;

module.exports = CanvasChart;
