var AbstractPlate = require('./abstract-plate'),
  LayerOrganizer = require('../layer-organizer');

/**
 * SVG Plate.
 *
 * @param {object=} options Options to use.
 */
var SvgPlate = function(options) {
  var self = this;
  AbstractPlate.call(this, document.createElementNS('http://www.w3.org/2000/svg', 'svg'), options);

  this.rootG = this.selection.append('g');
  this.layers = new LayerOrganizer(this.rootG);

  /**
   * Called by updateDimension.
   *
   * @protected
   * @override
   * @return {this}
   */
  this._updateDimension = function() {
    var width = this.width(),
      height = this.height(),
      margin = self.margin(),
      offset = self.offset(),
      x = offset[0],
      y = offset[1];

    self.selection
      .attr('width', width)
      .attr('height', height);

    self.rootG.attr(
      'transform',
      'translate(' + (margin.left + x) + ',' + (margin.top + y) + ')'
    );

    return self;
  };
};

SvgPlate.prototype = Object.create(AbstractPlate.prototype);
SvgPlate.prototype.constructor = SvgPlate;

module.exports = SvgPlate;
