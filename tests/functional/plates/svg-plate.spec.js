var SvgPlate = require('../../../src/plates/svg-plate');

describe('SvgPlate', function() {
  var plate;

  it('should exist', function() {
    expect(SvgPlate).to.exist;
  });

  beforeEach(function() {
    plate = new SvgPlate({
      width: 100,
      height: 100,
      margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      },
      offset: [1, 1],
      pixelRatio: 10
    });
  });

  describe('constructor(params)', function() {
    it('should construct a plate that contains <svg>', function() {
      expect(plate).to.exist;
      expect(plate.getNode().tagName.toLowerCase()).to.equal('svg');
    });
    it('should create root <g> inside <svg>', function() {
      expect(plate.getSelection().select('g').size()).to.equal(1);
      expect(plate.rootG.node().tagName).to.equal('g');
    });
    it('should create layer organizer', function() {
      expect(plate.layers).to.exist;
    });
  });

  describe('.updateDimensionNow()', function() {
    it('should update <svg> dimension', function() {
      plate.updateDimensionNow();
      var svg = plate.getSelection();
      expect(+svg.attr('width')).to.equal(100);
      expect(+svg.attr('height')).to.equal(100);
      expect(plate.rootG.attr('transform')).to.equal('translate(11,11)');
    });
  });
});
