var DivPlate = require('../../../src/plates/div-plate');

describe('DivPlate', function() {
  var plate;

  it('should exist', function() {
    expect(DivPlate).to.exist;
  });

  beforeEach(function() {
    plate = new DivPlate({
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
      expect(plate.getNode().tagName.toLowerCase()).to.equal('div');
    });
  });

  describe('.updateDimensionNow()', function() {
    it('should update <div> dimension', function() {
      plate.updateDimensionNow();
      var div = plate.getNode();
      expect(div.style.width).to.equal('80px');
      expect(div.style.height).to.equal('80px');
      expect(div.style.marginLeft).to.equal('10px');
      expect(div.style.marginRight).to.equal('10px');
      expect(div.style.marginTop).to.equal('10px');
      expect(div.style.marginBottom).to.equal('10px');
    });
  });
});
