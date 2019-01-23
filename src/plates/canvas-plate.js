var AbstractPlate = require('./abstract-plate');

/**
 * Canvas Plate.
 *
 * @param {object=} options Options to use.
 */
var CanvasPlate = function(options){
  var self = this;
  AbstractPlate.call(this, document.createElement('canvas'), options);

  /**
   * Called by updateDimension.
   *
   * @protected
   * @override
   * @return {this}
   */
  this._updateDimension = function() {
    var width = self.width(),
      height = self.height(),
      pixelRatio = self.pixelRatio();
    self.node.setAttribute('width', width * pixelRatio);
    self.node.setAttribute('height', height * pixelRatio);
    self.node.style.width = width + 'px';
    self.node.style.height = height + 'px';
    return self;
  };

  this.getContext2d = function() {
    var pixelRatio = self.pixelRatio(),
      margin = self.margin(),
      offset = self.offset(),
      offsetX = offset[0],
      offsetY = offset[1],
      ctx = self.node.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(pixelRatio, pixelRatio);
    ctx.translate(margin.left + offsetX, margin.top + offsetY);
    return ctx;
  };

  this.clear = function() {
    var width = self.width(),
      height = self.height(),
      pixelRatio = self.pixelRatio(),
      ctx = self.node.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(pixelRatio, pixelRatio);
    ctx.clearRect(0, 0, width, height);
    return self;
  };
};

CanvasPlate.prototype = Object.create(AbstractPlate.prototype);
CanvasPlate.prototype.constructor = CanvasPlate;

module.exports = CanvasPlate;
