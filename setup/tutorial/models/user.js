console.log('require ' + __filename);

var helper = require('cocotte/model/helper');
// モデルの設定
var model = {
	name: 'user'
  , caption: 'ユーザー'
  , fields: {
		name    : {type: 'text' , caption: '名称', primary: true, min: 3, max: 20, defaultTo: 'aaa'}
	  , password: {type: 'text' , caption: 'パスワード', required: true, crypto: 'sha1', key:'cocotte'}
	  , admin   : {type: 'check', caption: '管理者権限'}
	}
};

/*
 * 検証
 */
var nameReg = /^[-_a-z0-9]+$/i;
model.fields.name.valid = function nameValid (value) {
	'use strict';
	if (!nameReg.test(value)) {
		return new Error('英数字、ハイフン、マイナス記号以外は使用出来ません');
	}
};

module.exports = exports = model;

helper.test(model);