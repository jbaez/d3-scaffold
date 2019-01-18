var AbstractChart = require('../../../src/charts/abstact-chart'),
  CanvasPlate = require('../../../src/plates/canvas-plate');

var CustomChart = function(selector, options) {
  AbstractChart.call(this, selector, options);
};

CustomChart.prototype = Object.create(AbstractChart.prototype);
CustomChart.prototype.constructor = CustomChart;

CustomChart.prototype.getCustomEventNames = function() {
  return ['custom1', 'custom2'];
};

describe('AbstractChart', function() {
  var _element, _chart;

  beforeEach(function() {
    _element = document.body.appendChild(document.createElement('div'));
    _chart = new AbstractChart(_element, null);
  });

  describe('new AbstractChart(element, options)', function() {
    it('should create a dispatcher as chart.dispatcher', function() {
      var dispatcher = _chart.dispatcher;
      expect(dispatcher).to.be.an('Object');
      expect(dispatcher.call).to.be.a('Function');
    });
  });

  describe('.addPlate(name, plate [, doNotAppend])', function() {
    it('should add a plate to the chart and make plate accessible via chart.plates[name]', function() {
      var plate = new CanvasPlate();
      _chart.addPlate('plate1', plate);
      expect(_chart.plates.plate1).to.equal(plate);
    });
    it('should append plate node to chartRoot', function() {
      var plate = new CanvasPlate();
      _chart.addPlate('plate1', plate);
      expect(plate.getNode().parentNode).to.equal(_chart.chartRoot.node());
    });
    it('should not append plate node to chartRoot if doNotAppend is true', function() {
      var plate = new CanvasPlate();
      _chart.addPlate('plate1', plate, true);
      expect(plate.getNode().parentNode).to.not.equal(_chart.chartRoot.node());
    });
    it('should throw error if a plate with this name already exists', function() {
      _chart.addPlate('plate1', new CanvasPlate());
      expect(function() {
        _chart.addPlate('plate1', new CanvasPlate());
      }).to.throw(Error);
    });
  });

  describe('.removePlate(name)', function() {
    it('should remove plate from the chart', function() {
      var plate = new CanvasPlate();
      _chart.addPlate('plate1', plate);
      _chart.removePlate('plate1');
      expect(_chart.plates.plate1).to.equal(undefined);
    });
    it('should remove plate node from chartRoot', function() {
      var plate = new CanvasPlate();
      _chart.addPlate('plate1', plate);
      _chart.removePlate('plate1');
      expect(plate.getNode().parentNode).to.not.equal(_chart.chartRoot.node());
    });
    it('should do nothing if there is no plate with this name', function() {
      expect(function() {
        _chart.removePlate('plate1');
      }).to.not.throw(Error);
    });
  });

  describe('.getCustomEventNames()', function() {
    it('should return an array of custom event names', function() {
      var names = _chart.getCustomEventNames();
      expect(names).to.be.an('Array');
      expect(names).to.deep.equal([]);
    });
    it('can be overridden by subclass', function() {
      var customChart = new CustomChart(_element);
      var names = customChart.getCustomEventNames();
      expect(names).to.be.an('Array');
      expect(names).to.deep.equal(['custom1', 'custom2']);
    });
  });

  describe('.getInnerWidth()', function() {
    it('should return width of the chart excluding margin', function() {
      _chart
        .width(100)
        .options({
          margin: { left: 10, right: 10 }
        })
        .updateDimensionNow();
      expect(_chart.getInnerWidth()).to.equal(80);
    });
  });

  describe('.getInnerHeight()', function() {
    it('should return height of the chart excluding margin', function() {
      _chart
        .height(100)
        .options({
          margin: { top: 10, bottom: 20 }
        })
        .updateDimensionNow();
      expect(_chart.getInnerHeight()).to.equal(70);
    });
  });

  describe('.data(data)', function() {
    it('should return data when called without argument', function() {
      _chart.data([{ a: 1 }]);
      expect(_chart.data()).to.deep.equal([{ a: 1 }]);
    });
    it('should set data when called with at least one argument', function() {
      _chart.data('test');
      expect(_chart.data()).to.equal('test');
    });
    it('after setting, should dispatch "data" event', function(done) {
      _chart.on('data.test', function() { done(); });
      _chart.data({ a: 1 });
    });
  });

  describe('.options(options)', function() {
    it('should return options when called without argument', function() {
      _chart.options({ a: 2 });
      expect(_chart.options()).to.include.key('a');
      expect(_chart.options().a).to.equal(2);
    });
    it('should set options when called with at least one argument', function() {
      _chart.options({ a: 1 });
      expect(_chart.options()).to.include.key('a');
      expect(_chart.options().a).to.equal(1);
    });
    it('should not overwrite but extend existing options when setting', function() {
      _chart.options({ a: 1 });
      _chart.options({ b: 2 });
      expect(_chart.options()).to.include.keys(['a', 'b']);
      expect(_chart.options().a).to.equal(1);
      expect(_chart.options().b).to.equal(2);
    });
    it('should dispatch "resize" as necessary if margin was included in the options.', function(done) {
      _chart.on('resize.test', function() { done(); });
      _chart.options({
        margin: { top: 12 }
      });
    });
    it('should dispatch "resize" as necessary if offset was included in the options.', function(done) {
      _chart.on('resize.test', function() { done(); });
      _chart.options({
        offset: [4, 4]
      });
    });
    it('should dispatch "resize" as necessary if pixelRatio was included in the options.', function(done) {
      _chart.on('resize.test', function() { done(); });
      _chart.options({
        pixelRatio: 3
      });
    });
    it('after setting, should dispatch "options" event', function(done) {
      _chart.on('options.test', function() { done(); });
      _chart.options({ a: 1 });
    });
  });

  describe('.dimension(dimension)', function() {
    it('after setting, should dispatch "resize" event', function(done) {
      _chart.on('resize.test', function() { done(); });
      _chart.dimension([150, 150]);
    });
  });

  describe('.margin(margin)', function() {
    it('should update innerWidth after setting margin', function() {
      _chart
        .width(100)
        .margin({ left: 15, right: 15 })
        .updateDimensionNow();

      expect(_chart.getInnerWidth()).to.equal(70);
    });
    it('should update innerHeight after setting margin', function() {
      _chart
        .height(100)
        .margin({ top: 10, bottom: 10 })
        .updateDimensionNow();

      expect(_chart.getInnerHeight()).to.equal(80);
    });
    it('after setting, should dispatch "resize" event', function(done) {
      _chart.on('resize.test', function() { done(); });
      _chart.margin({ left: 33 });
    });
  });

  describe('.offset(offset)', function() {
    it('after setting, should dispatch "resize" event', function(done) {
      _chart.on('resize.test', function() { done(); });
      _chart.offset([3, 3]);
    });
  });

  ['width', 'height', 'pixelRatio'].forEach(function(field) {
    describe('.' + field + '(' + field + ')', function() {
      it('after setting, should dispatch "resize" event', function(done) {
        _chart.on('resize.test', function() { done(); });
        _chart[field](200);
      });
    });
  });

  describe('.hasData()', function() {
    it('should return true when data are not null nor undefined', function() {
      _chart.data([]);
      expect(_chart.hasData()).to.be.true;
      _chart.data([{test: 1} ]);
      expect(_chart.hasData()).to.be.true;
      _chart.data([]);
      expect(_chart.hasData()).to.be.true;
      _chart.data(['test']);
      expect(_chart.hasData()).to.be.true;
    });
    it('should return false when data are null or undefined', function() {
      _chart.data(null);
      expect(_chart.hasData()).to.be.false;
      _chart.data(undefined);
      expect(_chart.hasData()).to.be.false;
    });
  });

  describe('.hasNonZeroArea()', function() {
    it('should return true if innerWidth * innerHeight is more than zero', function() {
      _chart
        .width(80)
        .height(50)
        .options({
          margin: { top: 10, bottom: 20, left: 10, right: 10 }
        })
        .updateDimensionNow();
      expect(_chart.hasNonZeroArea()).to.be.true;
    });
    it('should return false otherwise', function() {
      _chart
        .width(20)
        .height(30)
        .options({
          margin: { top: 10, bottom: 20, left: 10, right: 10 }
        })
        .updateDimensionNow();
      expect(_chart.hasNonZeroArea()).to.be.false;
    });
  });

  describe('.destroy()', function() {
    it('should unregister all event handlers', function(done) {
      var chart2 = new CustomChart(_element);
      chart2.on('custom1', function() {
        assert.fail('should not be called');
      });
      chart2.destroy();
      chart2.dispatcher.call('custom1', _chart);
      setTimeout(function() {
        done();
      }, 20);
    });
    it('should stop fitWatcher if there is any', function() {
      _chart.destroy();
      expect(_chart.fitWatcher).to.not.exist;
    });
  });

  describe('.dispatchAs(eventName)', function() {
    it('should return a function which can be called to dispatch the named event with given arguments', function(done) {
      var chart2 = new CustomChart(_element);
      chart2.on('custom1', function(a, b, c) {
        expect(a).to.equal(1);
        expect(b).to.equal(2);
        expect(c).to.equal(3);
        done();
      });
      chart2.dispatchAs('custom1')(1, 2, 3);
    });
  });
});
