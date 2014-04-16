console.log('require ' + __filename);

var helper = require('cocotte/portlet/helper');

/**
 * 一覧表を管理するポートレット
 * @class GridPortlet
 * @constructor
 * @param {Object} options
 * @param {Window} win
 */
var Portlet = function GridPortlet (options, win) {
	'use strict';
	this.setDatasource(options, win);
};

helper.inherit(Portlet);

module.exports = exports = Portlet;


