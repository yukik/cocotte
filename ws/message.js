'use strict';
/** 
 *
 * メッセージをそのままオウム返し
 *
 *
 * 
 */
var moment = require('moment');

var middleware = function*(next){
	var message = this.param;
	this.socket.emit('new message', {
		message: message
	  , pasted_at: moment().format('YYYY/MM/DD HH:mm:ss')
	});

	yield next;
};

module.exports = exports = function () {
	return middleware;
};





