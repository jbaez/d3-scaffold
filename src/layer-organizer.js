var helper = require('./helper');

// EXAMPLE USAGE:
//
// var layers = new d3LayerOrganizer(vis);
// layers.create([
//   {'axis': ['bar', 'mark']},
//   'glass',
//   'label'
// ]);
//
// Then access the layers via
// layers.get('axis'),
// layers.get('axis/bar'),
// layers.get('axis/mark'),
// layers.get('glass'),
// layers.get('label')

/**
 * Layer organizer.
 *
 * @param {object} mainContainer HTML D3 element container.
 * @param {string=} defaultTag Default tag to use. Defaults to `g`.
 */
var LayerOrganizer = function (mainContainer, defaultTag) {
  var _defaultTag = defaultTag || 'g',
    _mainContainer = mainContainer,
    _layers = {};

  /**
   * Creates a layer from a name.
   *
   * @private
   * @param {object} container HTML element container.
   * @param {string} layerName Layer name.
   * @param {string=} prefix Layer prefix. Defaults to ''
   */
  function createLayerFromName(container, layerName, prefix) {
    prefix = prefix || '';
    var chunks = layerName.split('.'),
      name,
      tag;
    if (chunks.length > 1) {
      tag = chunks[0].length > 0 ? chunks[0] : _defaultTag;
      name = chunks[1];
    } else {
      tag = _defaultTag;
      name = chunks[0];
    }

    var id = prefix + name;
    if (_layers.hasOwnProperty(id)) {
      throw new Error('Invalid or duplicate layer id:' + id);
    }
    var className = helper.kebabCase(name) + '-layer';
    var layer = container.append(tag)
      .classed(className, true);

    _layers[id] = layer;
    return layer;
  }

  /**
   * Creates a layer from the provided config in different formats.
   *
   * @private
   * @param {object} container HTML element container.
   * @param {array|object|string} config Array of labels, object with array of sub labels or just label.
   * @param {string} prefix Layer prefix.
   * @returns {object} layer
   */
  function createLayerFromConfig(container, config, prefix) {
    prefix = prefix || '';
    if (Array.isArray(config)) {
      return config
        .map(function(info) {
          createLayerFromConfig(container, info, prefix);
        });
    } else if (helper.isObject(config)) {
      var parentKey = Object.keys(config)[0];
      var parentLayer = createLayerFromName(container, parentKey, prefix);
      createLayerFromConfig(parentLayer, config[parentKey], prefix + parentKey + '/');
      return parentLayer;
    } else {
      return createLayerFromName(container, config, prefix);
    }
  }

  /**
   * Creates a layer in the main container.
   *
   * @private
   * @param {array|object|string} config Array of labels, object with array of sub labels or just label.
   */
  function createLayer(config) {
    return createLayerFromConfig(_mainContainer, config);
  }

  /**
   * Creates the layers as specified in the layerNames config.
   *
   * @public
   * @param {array|object|string} layerNames Array of labels, object with array of sub labels or just label.
   */
  function create(layerNames) {
    return Array.isArray(layerNames)
      ? layerNames.map(createLayer)
      : createLayer(layerNames);
  }

  /**
   * Get a layer by name.
   *
   * @public
   * @param {string} layerName Layer name
   */
  function get(layerName) {
    return _layers[layerName];
  }

  /**
   * Check if the layer exists by name.
   *
   * @public
   * @param {string} layerName Layer name.
   * @returns {boolean}
   */
  function has(layerName) {
    return !!_layers[layerName];
  }

  return {
    create: create,
    get: get,
    has: has
  };
};

module.exports = LayerOrganizer;
