# d3-scaffold

**d3-scaffold** is based on **d3Kit** (https://github.com/twitter/d3kit) but aiming to support older browsers. Written in ES5 JavaScript provides a small set of classes to build *reusable* and *responsive* charts with [D3](https://github.com/mbostock/d3).

Written to use with D3 v4.

## What is d3-scaffold?

The core of d3-scaffold are base classes for creating a chart. Currently there are `SvgChart` and `CanvasChart`. All are extended from `AbstractChart`.

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

Most of the time you will not need to access `AbstractChart` directly, but you will use one of its children: `SvgChart` or `CanvasChart`.

### SvgChart

This class creates `<svg>` boilerplate inside the container.

### CanvasChart

This class creates `<canvas>` inside the container. It also handles different screen resolution for you (retina display vs. standard display).

### Build your own chart with `plates`

If `SvgChart` or `CanvasChart` does not fit your need yet, you can create your own.

Under the hood, d3-scaffold use its "plating" system to wrap different type of components (`<svg>`, `<canvas>`, etc.). The current implementation includes three types of plates: `SvgPlate`, `CanvasPlate` and `DivPlate`.

Think of `AbstractChart` as a container. **Any resizing done to the chart will be applied to the plates in it by d3-scaffold.** This abstraction helps you think of a chart as one piece and not to worry about how to keep track of each children size. Then you can just focus on what to drawn on svg or canvas based on the current dimension of the chart.

* An `SvgChart` is an `AbstractChart` that has an `SvgPlate` in it.
* A `CanvasChart` is an `AbstractChart` that has a `CanvasPlate` in it.

Now if you want to create a chart with multiple canvases and svg, just create a new subclass.

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

  this.draw = function() {
    // Implement here the logic for drawing the chart
  }
};

CustomChart.prototype = Object.create(AbstractChart.prototype);
CustomChart.prototype.constructor = CustomChart;

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
