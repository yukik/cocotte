// ウインドウビューを取得
'use strict';

var path = require('path')
  , koaSend = require('koa-send');


// 命名規則確認
var reg = /^[0-9a-z]{1,20}$/i;

module.exports = exports = function (app) {

	return  function*(name, template){

		var f;

		if (reg.test(name) && reg.test(template)) {
			f = path.join(app.root, 'windows', name, template + '.html');

		} else {
			f = path.join(app.root, 'windows', 'unkown.html');

		}

		yield koaSend(this, f);

	};

};