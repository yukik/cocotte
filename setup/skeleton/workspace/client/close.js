/**
 * ウインドウを閉じます
 */
var script = function close (e) {
	'use strict';
	e.stopPropagation();
	var win = this.getWin();
	if (win) {
		win.close();
	}
};

module.exports = exports = script;