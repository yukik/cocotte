'use strict';

/*
 * ログアウト処理
 */

module.exports = exports = function () {
	return function*() {
		if (this.session) {
			//セッションの削除
			this.session.destroy();
		}
		this.body = yield {login: false, message: null};
	};
};
