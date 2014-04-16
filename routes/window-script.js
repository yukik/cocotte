'use strict';
/**
 *
 * 
 * ウインドウスクリプトのビュー表示
 * 
 *
 * 
 */
var path = require('path')
  , koaSend = require('koa-send');

module.exports = exports = function (app) {
	// ウインドウスクリプトを取得
	return function*(name) {
		yield koaSend(this, path.join(app.root, 'windows', name, 'client.js'));
	};
};
