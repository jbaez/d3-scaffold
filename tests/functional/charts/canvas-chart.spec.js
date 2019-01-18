var CanvasChart = require('../../../src/charts/canvas-chart'),
  CanvasPlate = require('../../../src/plates/canvas-plate');

describe('CanvasChart', function() {
  var _element, _chart;

  beforeEach(function() {
    _element = document.body.appendChild(document.createElement('div'));
    _chart = new CanvasChart(_element, null);
  });

  describe('new CanvasChart(element, options)', function() {
    it('should create <canvas> inside the element, which is accessible from chart.canvas', function() {
      expect(_chart.canvas).to.exist;
      expect(_chart.canvas.size()).to.be.equal(1);
    });
    it('has a CanvasPlate accessible from this.plates.canvas', function() {
      expect(_chart.plates.canvas).to.be.instanceof(CanvasPlate);
    });
  });

  describe('.getContext2d()', function() {
    it('should return context2d from canvas', function() {
      var ctx = _chart.getContext2d();
      expect(ctx).to.exist;
      expect(ctx).to.be.instanceof(CanvasRenderingContext2D);
    });
  });

  describe('.clear()', function() {
    it('should clear canvas and return this', function() {
      var returnValue = _chart.clear();
      expect(returnValue).to.equal(_chart);
    });
  });
});
