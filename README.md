# d3-scaffold

**d3-scaffold** is based on **d3Kit** (https://github.com/twitter/d3kit) but aiming to support older browsers. Written in ES5 JavaScript provides a small set of classes to build *reusable* and *responsive* charts with [D3](https://github.com/mbostock/d3).

Written to use with D3 v4.

## What is d3-scaffold?

The core of d3-scaffold are base classes for creating a chart. Currently there are `SvgChart`, `CanvasChart` and `HybridChart`. All are extended from `AbstractChart`.

### AbstractChart

* takes a target container (usually a `<div>`) and helps you build a chart inside.
* encapsulates [D3's margin convention](http://bl.ocks.org/mbostock/3019563). The dimension of each chart is defined by `width`, `height` and `margin`.
  * `chart.width()` get/set the total width (including margin)
  * `chart.height()` get/set the total height (including margin)
  * `chart.margin()` get/set the margin
  * `chart.getInnerWidth()` returns width excluding margin. This is usually used as the boundary of the x-axis.
  * `chart.getInnerHeight()` returns height excluding margin. This is usually used as the boundary of the y-axis.
* dispatches event `resize` when the chart is resized.
  * `chart.on('resize', listener)` is then use to register what to do after the chart is resized.
* defines two main input channels `.data(...)` and `.options(...)` and dispatches event `data` and `options` when they are changed, respectively.
  * `chart.data(data)` get/set data.
  * `chart.options(options)` get/merge options
  * `chart.on('data', listener)`
  * `chart.on('options', listener)`
* assumes little about how you implement a chart. You can extends the class and implements it the way you want.

Most of the time you will not need to access `AbstractChart` directly, but you will use one of its children: `SvgChart`, `CanvasChart` or `HybridChart`.

### CanvasChart

This class creates `<canvas>` inside the container. It also handles different screen resolution for you (retina display vs. standard display).


```javascript
var d3Scaffold = require('d3-scaffold'),
  AbstractChart = d3Scaffold.AbstractChart,
  CanvasPlate = d3Scaffold.CanvasPlate;

var CustomChart = function(selector, options) {
  AbstractChart.call(this, selector, options);

  this.addPlate('canvas1', new CanvasPlate());
  // now access D3 selection of this <canvas> element
  // via this.plates.canvas1.getSelection()

  this.addPlate('canvas2', new CanvasPlate());
  // now access D3 selection of this <canvas> element
  // via this.plates.canvas2.getSelection()

  this.updateDimensionNow();
};

CustomChart.prototype = Object.create(AbstractChart.prototype);
CustomChart.prototype.constructor = CustomChart;

### TODO: Add `SvgChart` and `HybridChart`

```

Once you call

```javascript
new CustomChart('#my-chart');
```

This will be created.

```html
<div id="my-chart">
  <div class="d3-scaffold-chart-root">
  	 <canvas />
  	 <canvas />
  	 <svg></svg>
  </div>
</div>
```
