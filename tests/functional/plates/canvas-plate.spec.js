var CanvasPlate = require('../../../src/plates/canvas-plate');

describe('CanvasPlate', function() {
  var plate;

  it('should exist', function() {
    expect(CanvasPlate).to.exist;
  });

  beforeEach(function() {
    plate = new CanvasPlate({
      width: 100,
      height: 100,
      margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      },
      offset: [1, 1],
      pixelRatio: 2
    });
  });

  describe('constructor(params)', function() {
    it('should construct a plate that contains <canvas>', function() {
      expect(plate).to.exist;
      expect(plate.getNode().tagName.toLowerCase()).to.equal('canvas');
    });
  });

  describe('.getContext2d()', function() {
    it('should return context', function() {
      var ctx = plate.getContext2d();
      expect(ctx).to.exist;
    });

    it('should adjust scale and translation', function() {
      var ctx = plate.getContext2d();
      ctx.fillStyle = 'rgb(44,44,44)';
      ctx.fillRect(0, 0, 10, 10);
      var outside = ctx.getImageData(21, 21, 1, 1).data;
      expect(outside[0]).to.equal(0);
      expect(outside[1]).to.equal(0);
      expect(outside[2]).to.equal(0);
      var inside = ctx.getImageData(22, 22, 1, 1).data;
      expect(inside[0]).to.equal(44);
      expect(inside[1]).to.equal(44);
      expect(inside[2]).to.equal(44);
    });
  });

  describe('.clear()', function() {
    it('should clear canvas', function() {
      // fill first
      var ctx = plate.getContext2d();
      ctx.fillStyle = 'rgb(44,44,44)';
      ctx.fillRect(0, 0, 10, 10);
      var before = ctx.getImageData(22, 22, 1, 1).data;
      expect(before[0]).to.equal(44);
      expect(before[1]).to.equal(44);
      expect(before[2]).to.equal(44);

      // then clear
      plate.clear();
      var after = ctx.getImageData(22, 22, 1, 1).data;
      expect(after[0]).to.equal(0);
      expect(after[1]).to.equal(0);
      expect(after[2]).to.equal(0);
    });
  });

  describe('.updateDimensionNow()', function() {
    it('should update <canvas> dimension', function() {
      plate.updateDimensionNow();
      var canvas = plate.getSelection();
      expect(+canvas.attr('width')).to.equal(200);
      expect(+canvas.attr('height')).to.equal(200);
      expect(canvas.node().style.width).to.equal('100px');
      expect(canvas.node().style.height).to.equal('100px');
    });
  });
});
