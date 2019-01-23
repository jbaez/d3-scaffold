var AbstractPlate = require('./abstract-plate');

/**
 * Div Plate.
 *
 * @param {object=} options Options to use.
 */
var DivPlate = function(options) {
  var self = this;
  AbstractPlate.call(this, document.createElement('div'), options);

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
      margin = self.margin();

    self.node.style.width = (width - margin.left - margin.right) + 'px';
    self.node.style.height = (height - margin.top - margin.bottom) + 'px';
    self.node.style.marginLeft = margin.left + 'px';
    self.node.style.marginRight = margin.right + 'px';
    self.node.style.marginTop = margin.top + 'px';
    self.node.style.marginBottom = margin.bottom + 'px';

    return self;
  };
};

DivPlate.prototype = Object.create(AbstractPlate.prototype);
DivPlate.prototype.constructor = DivPlate;

module.exports = DivPlate;
