(function (cocotte) {
	'use strict';

	var workspace = {};

	/**
	 * ワークスペースにメッセージを表示する
	 * @param  {String} msg
	 * @param  {String} level   error, alert, infoなど
	 * @param  {Number} time    メッセージが消えるまでの時間(ミリ秒)
	 * @return メソッドチェーン
	 */
	workspace.message = function message (msg, level, time) {
		if (!time) {
			time = workspace.messageTime;
		}
		// TODO: 画面上にメッセージを表示する
		console.log(level + ':' + msg);
		return this;
	};

	/**
	 * メッセージが消えるまでの時間(ミリ秒)
	 * @property {Number}
	 */
	workspace.messageTime = 2000;

	cocotte.workspace = workspace;

})(cocotte);