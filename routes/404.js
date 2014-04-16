'use strict';

/*
 *
 * 不明なリクエスト
 * GETの場合は404のhtmlで、POSTの場合はJSONを返す
 * 
 */

var path = require('path')
  , coViews = require('co-views');

module.exports = exports = function (app) {

	var homeRender = coViews(path.join(app.root, 'views'), {map: {html: 'swig'}});

	return function*(next){

		if (this.req.method === 'POST') {

			// JSONを送信
			this.set('Content-type', 'text/json');
			this.body = {login:false, message: 'REQUEST FAILURE'};

		} else {

			// views/404/###.htmlを表示
			var device = this.session.device;
			var page = '404/' + (~app.devices.indexOf(device) ? device : 'unknown');
			var param = {title: app.title, description: app.description};
			this.body = yield homeRender(page, param);
		}

		return yield next;
	};

};