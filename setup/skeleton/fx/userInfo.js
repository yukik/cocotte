'use strict';


var is = require('cocotte-is')
  , msg = require('cocotte-message');


/**
 * 引数userから情報を取得する
 *
 * userはモデルのフックで引数として渡されます
 * 
 * userオブジェクトのフォーマット
 * プレゼンテーション層からのイベント時に次のように設定される
 * <pre>
 * {
 *     session   : 接続しているユーザーのセッションオブジェクト
 *   , connection: Websocketコネクション
 *   , win       : 操作しているウインドウ
 *   , datasource: モデルと連携しているデータソース
 * }
 * </pre>
 *
 * @for fx
 * @method userInfo
 * @static
 * @param {String}   name
 * @param {Object}   user
 * @param {Function} callback
 */
var fx = function userInfo (name, user, callback) {

	if (!is.matches([String, Object, Function], arguments)) {
		callback(new Error('引数が正しくありません'), null);
		return;
	}

	msg.todo('userInfo関数作成');

	var val = null;

	switch(name) {
	case 'name':
	case 'group':
	case 'ua':
		val = null;
		break;
	default:
		val = null;
	}

	callback(null, val);

};
fx.category = 'システム';
fx.description = 'ユーザーオブジェクトから値を取得します';

module.exports = exports = fx;
