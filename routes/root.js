'use strict';

/**
 * ルート時のビュー表示
 */

var path = require('path')
  , coViews = require('co-views');

module.exports = exports = function (app) {

	var homeRender = coViews(path.join(app.root, 'views'), {map: {html: 'swig'}});

	return function*() {
		var device = this.session.device
		  , user = this.session.user
		  , group = this.session.group
		  , page
		  , param;

		page = (group ? 'workspace' : 'home') + '/' +
			(~app.devices.indexOf(device) ? device : 'unknown');

		param = {title: app.title, description: app.description, user: user, group: group};

		this.body = yield homeRender(page, param);
	};

};

