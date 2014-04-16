console.log('require ' + __filename);

var is  = require('cocotte/tools/is')
  , msg = require('cocotte/tools/message');

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
 * @param  {String} info
 * @param  {Object} user
 * @return {Mixed} result
 */
var fx = function userInfo (infoName, user) {
	'use strict';
	if (!is(String, infoName)) {
		throw new Error('パラメータに文字列を渡してください');
	}
	if (!is(Object, user)) {
		return null;
	}

	msg.todo('userInfo関数作成');

	switch(infoName) {
	case 'name':
	case 'group':
	case 'ua':
		return null;
	default:
		return null;
	}
};
fx.category = 'システム';
fx.description = 'ユーザーオブジェクトから値を取得します';

module.exports = exports = fx;
