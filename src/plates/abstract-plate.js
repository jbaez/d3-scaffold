var Base = require('../base'),
  d3 = require('d3');

var AbstractPlate  = function(node, options) {
  var self = this;
  Base.call(this, options);

  this.node = node;
  this.selection = d3.select(this.node);

  this.getNode = function() {
    return self.node;
  };

  this.getSelection = function() {
    return self.selection;
  };
};

AbstractPlate.prototype = Object.create(Base.prototype);
AbstractPlate.prototype.constructor = AbstractPlate;

module.exports = AbstractPlate;
