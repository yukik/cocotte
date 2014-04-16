console.log('require ' + __filename);
var is     = require('cocotte/tools/is')
  , helper = require('cocotte/portlet/helper');

/**
 * 地図表示を管理するポートレット
 * @param {Object} options
 */
var Portlet = function MapPortlet (options) {
	'use strict';
	this.locals = {};
	if (is(String, options.address)) {
		this.locals.address = options.address;
	}
};

// ポートレットの機能を追加
helper.inherit(Portlet);

module.exports = exports = Portlet;


