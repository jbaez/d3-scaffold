var AbstractPlate = require('../../../src/plates/abstract-plate');

describe('AbstractPlate', function() {
  var node, plate;

  it('should exist', function() {
    expect(AbstractPlate).to.exist;
  });

  beforeEach(function() {
    node = document.createElement('div');
    plate = new AbstractPlate(node, {
      width: 5,
      height: 5
    });
  });

  describe('new AbstractPlate(node, options)', function() {
    it('should construct an object with the given parameters', function() {
      expect(plate).to.exist;
      expect(plate.width()).to.equal(5);
      expect(plate.height()).to.equal(5);
    });
  });

  describe('.getNode()', function() {
    it('should return the node passed to constructor', function() {
      expect(plate.getNode()).to.equal(node);
    });
  });

  describe('.getSelection()', function() {
    it('should return selection of the node passed to constructor', function() {
      expect(plate.getSelection().node()).to.equal(node);
    });
  });
});
