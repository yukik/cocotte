/*
 * データベースを初期状態に設定します
 */
var async      = require('async')
  , msg        = require('cocotte-message')
  , Database   = require('cocotte-database')
  , Model      = require('cocotte-model')
  , Datasource = require('cocotte-datasource')

	// ユーザーリスト
  , users      = [ {name: 'admin', password: 'admin', admin: true}
                 , {name: 'user1', password: 'user1', admin: false}
                 , {name: 'user2', password: 'user2', admin: false}
                 , {name: 'user3', password: 'user3', admin: false}]

	// 所属リスト
  , groups     = [ {name: 'group1'}
                 , {name: 'group2'}]

	// 権限リスト
  , roles      = [ {group: 'group1', user: 'user1', level: 10}
                 , {group: 'group2', user: 'user1', level: 10}
                 , {group: 'group1', user: 'user2', level: 10}];

/* 
 * 実処理
 */
var fn = function () {
	'use strict';
	var user  = Model.get('user')
	  , group = Model.get('group')
	  , role  = Model.get('role')
	  , tasks = [];

	// ユーザーテーブル作成
	tasks.push(function(next) {
		user.drop(function() {next();});
	});
	tasks.push(function(next) {
		var ds = new Datasource(user);
		users.forEach(function (item) {
			var row = ds.addRow();
			row.name.set(item.name);
			row.password.set(item.group);
			row.admin.set(item.admin);
		});
		ds.save(function() {next();});
	});

	// 所属テーブル作成
	tasks.push(function(next) {
		group.drop(function() {next();});
	});
	tasks.push(function(next) {
		var ds = new Datasource(group);
		groups.forEach(function (item) {
			var row = ds.addRow();
			row.name.set(item.name);
		});
		ds.save(function() {next();});
	});

	// 権限テーブル作成
	tasks.push(function(next) {
		role.drop(function() {next();});
	});
	tasks.push(function(next) {
		var ds = new Datasource(role);
		roles.forEach(function (item) {
			var row = ds.addRow();
			row.group.set(item.group);
			row.user.set(item.user);
			row.level.set(item.level);
		});
		ds.save(function() {next();});
	});

	async.series(tasks, function(){
		msg('done');
	});
};

/*
 * 実処理
 */
async.series([
		// データベース ビルトインの読み込み
		function (next) {
			'use strict';
			Database.on('end built in', function () { next();}).loadBuiltIn();
		}
		// モデル ビルトインの読み込み
	  , function (next) {
			'use strict';
			Model.on('end built in', function () {next();}).loadBuiltIn();
		}
		// 初期状態実行
	] , fn);
