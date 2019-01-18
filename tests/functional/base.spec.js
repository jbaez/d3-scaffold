var Base = require('../../src/base');

var TestBase = function(options) {
  Base.call(this, options);

  this.counter = {
    updateDimension: 0
  };

  // simulate override
  this._updateDimension = function() {
    this.counter.updateDimension++;
  };
};

TestBase.prototype = Object.create(Base.prototype);
TestBase.prototype.constructor = TestBase;

describe('Base', function() {
  var _base;

  it('should exist', function() {
    expect(Base).to.exist;
  });

  beforeEach(function() {
    _base = new TestBase({
      width: 10,
      height: 10,
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

  describe('(Base.prototype.getDefaultOptions()', function() {
    it('should return an options object', function() {
      var options = _base.getDefaultOptions();
      expect(options).to.be.an('Object');
    });
  });

  describe('new Base(options)', function() {
    it('should construct an object with the given options', function() {
      expect(_base).to.exist;
      expect(_base.width()).to.equal(10);
      expect(_base.height()).to.equal(10);
      expect(_base.margin()).to.deep.equal({ top: 10, right: 10, bottom: 10, left: 10 });
      expect(_base.pixelRatio()).to.equal(10);
      expect(_base.offset()).to.deep.equal([1, 1]);
    });
  });

  describe('.dimension([dimension])', function() {
    describe('as getter: when called without argument', function() {
      it('should return current value', function() {
        expect(_base.dimension()).to.deep.equal([10, 10]);
      });
    });
    describe('as setter: when called with argument', function() {
      it('should set value and update dimension if the new value is different from current value', function(done) {
        _base.dimension([20, 20]);
        expect(_base.dimension()).to.deep.equal([20, 20]);
        window.setTimeout(function() {
          expect(_base.counter.updateDimension).to.equal(2);
          done();
        }, 10);
      });
      it('should not update dimension if the new value is equal to current value', function(done) {
        _base.dimension([10, 10]);
        expect(_base.dimension()).to.deep.equal([10, 10]);
        window.setTimeout(function() {
          expect(_base.counter.updateDimension).to.equal(0);
          done();
        }, 10);
      });
      it('should return this', function() {
        expect(_base.dimension([5, 5])).to.equal(_base);
      });
    });
  });

  describe('.margin([margin])', function() {
    describe('as getter: when called without argument', function() {
      it('should return current value', function() {
        expect(_base.margin()).to.deep.equal({ left: 10, right: 10, top: 10, bottom: 10 });
      });
    });
    describe('as setter: when called with argument', function() {
      it('should set value and update dimension if the new value is different from current value', function(done) {
        _base.margin({ left: 1, right: 1, top: 1, bottom: 1 });
        expect(_base.margin()).to.deep.equal({ left: 1, right: 1, top: 1, bottom: 1 });
        window.setTimeout(function() {
          expect(_base.counter.updateDimension).to.equal(1);
          done();
        }, 10);
      });
      it('should accept partial values, not all "top", "left", "bottom", "right" have to be present.', function() {
        _base.margin({ left: 21 });
        expect(_base.margin().left).to.equal(21);
        _base.margin({ right: 22 });
        expect(_base.margin().right).to.equal(22);
        _base.margin({ top: 23 });
        expect(_base.margin().top).to.equal(23);
        _base.margin({ bottom: 24 });
        expect(_base.margin().bottom).to.equal(24);
      });
      it('should not update dimension if the new value is equal to current value', function(done) {
        _base.margin({ left: 10, right: 10, top: 10, bottom: 10 });
        expect(_base.margin()).to.deep.equal({ left: 10, right: 10, top: 10, bottom: 10 });
        window.setTimeout(function() {
          expect(_base.counter.updateDimension).to.equal(0);
          done();
        }, 10);
      });
      it('should return this', function() {
        expect(_base.margin({ top: 12 })).to.equal(_base);
      });
    });
  });

  describe('.offset([offset])', function() {
    describe('as getter: when called without argument', function() {
      it('should return current value', function() {
        expect(_base.offset()).to.deep.equal([1, 1]);
      });
    });
    describe('as setter: when called with argument', function() {
      it('should set value and update dimension if the new value is different from current value', function(done) {
        _base.offset([2, 2]);
        expect(_base.offset()).to.deep.equal([2, 2]);
        window.setTimeout(function() {
          expect(_base.counter.updateDimension).to.equal(1);
          done();
        }, 10);
      });
      it('should not update dimension if the new value is equal to current value', function(done) {
        _base.offset([1, 1]);
        expect(_base.offset()).to.deep.equal([1, 1]);
        window.setTimeout(function() {
          expect(_base.counter.updateDimension).to.equal(0);
          done();
        }, 10);
      });
      it('should return this', function() {
        expect(_base.offset([3, 3])).to.equal(_base);
      });
    });
  });

  ['width', 'height', 'pixelRatio'].forEach(function(field) {
    describe('.' + field + '([' + field + ']])', function() {
      describe('as getter: when called without argument', function() {
        it('should return current value', function() {
          expect(_base[field]()).to.equal(10);
        });
      });
      describe('as setter: when called with argument', function() {
        it('should set value and update dimension if the new value is different from current value', function(done) {
          _base[field](1);
          expect(_base[field]()).to.equal(1);
          window.setTimeout(function() {
            expect(_base.counter.updateDimension).to.equal(1);
            done();
          }, 10);
        });
        it('should not update dimension if the new value is equal to current value', function(done) {
          _base[field](10);
          expect(_base[field]()).to.equal(10);
          window.setTimeout(function() {
            expect(_base.counter.updateDimension).to.equal(0);
            done();
          }, 10);
        });
        it('should return this', function() {
          expect(_base[field](12)).to.equal(_base);
        });
      });
    });
  });

  describe('.copyDimension(another)', function() {
    it('should copy all fields and update dimension', function(done) {
      var state = {
        width: 20,
        height: 20,
        margin: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        offset: [2, 2],
        pixelRatio: 2
      };
      _base.copyDimension(new Base(state));
      expect(_base.width()).to.equal(state.width);
      expect(_base.height()).to.equal(state.height);
      expect(_base.pixelRatio()).to.equal(state.pixelRatio);
      expect(_base.margin()).to.deep.equal(state.margin);
      expect(_base.offset()).to.deep.equal(state.offset);

      window.setTimeout(function() {
        expect(_base.counter.updateDimension).to.equal(1);
        done();
      }, 10);
    });
    it('should do nothing if "another" is not defined', function(done) {
      _base.copyDimension(null);
      _base.copyDimension(undefined);
      window.setTimeout(function() {
        expect(_base.counter.updateDimension).to.equal(0);
        done();
      }, 10);
    });
    it('should return this', function() {
      expect(_base.copyDimension()).to.equal(_base);
    });
  });

  describe('.updateDimensionNow()', function() {
    it('should trigger update dimension immediately', function() {
      expect(_base.counter.updateDimension).to.equal(0);
      _base.updateDimensionNow();
      expect(_base.counter.updateDimension).to.equal(1);
    });
    it('should return this', function() {
      expect(_base.updateDimensionNow()).to.equal(_base);
    });
  });
});
