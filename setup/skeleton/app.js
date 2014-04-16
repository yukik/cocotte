/**
 * アプリケーションのエントリポイント
 * 
 * 設定
 * @property {Object}
 */
var config = {

	/*
	 * アプリケーションルート
	 * 各種フォルダ(databases, datasources等)が配置されるフォルダを指定
	 */
	root: __dirname

	/*
	 * アプリケーションサーバのポート番号
	 * 80番ポートを使用する場合は、ルート権限で実行する必要があります
	 */
  , port: 80

	/*
	 * アプリケーションのタイトル
	 */
  , title: 'cocotte - skeleton'

	/*
	 * アプリケーションの説明
	 * 配列を指定してください。表示は要素ごとに改行されます
	 */
  , description: ['アプリケーションの説明']

	/*
	 * サポートデバイス
	 */
  , devices: ['desktop', 'phone', 'tablet']

	/*
	 * 許可ホストアドレス
	 * ホストを登録していない場合にサーバへ接続した場合はステータス500が返されます
	 * アスタリスク"*"を登録するとリストにかからなかった場合、上記を回避する設定となります
	 * 値にはエリア等を任意の文字列で設定します
	 * 値はユーザーのセッションに記録され、ウインドウなどの表示時に制限をかける事が出来ます
	 */
  , hosts: {
		localhost: 'lan'
	  , '*': 'wan'
	}

	/*
	 * セッション
	 */
  , session: {
		// セッションcookie名
		key: 'cctsess'
		// 暗号キー。ランダムな文字列を設定します
	  , secret: '76bc2a73f8108g'
		// セッション更新間隔
	  , time: 60
	}

	/*
	 * すべての権限を持つ管理者のアカウントのnameを指定します
	 * ユーザーテーブルから指定したアカウントのユーザーは削除する事が出来ません
	 * また、パスワードリセット用の電子メールアドレスを登録してください
	 */
  , admin: {
		name: 'admin'
	  , email: 'admin@example.com'
	}
};

/*
 * 著作権情報をコンソールに表示
 */
require('./credit')();

/*
 * dependencies
 */
var cocotte = require('cocotte');

//アプリケーションの作成
var app = cocotte(config);

//実行
app.start();

module.exports = exports = app;