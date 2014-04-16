var validTest = require('cocotte/fieldtype/rowno/test/valid-test')
  , DateFeild = require('cocotte/fieldtype/date')
  , testData   = {};



//定義リスト
var schemas = {

	省略: {}

  , フル: {
		date    : true
	  , time    : false
	  , required: undefined
	  , default : undefined
	  , fixed   : false
	  , min     : undefined
	  , max     : undefined
	}

  , 必須: {
		time    : false
	  , required: true
	}

  , 最大最小: {
		time: false
	  , min : new Date(2013, 1, 20)
	  , max : new Date(2013, 3, 31)
	}
};


exports.schemas = schemas;

//値リスト
exports.values = {
	日付 : {val: new Date(2013, 2, 10), pass: true}
  , 日時 : {val: new Date(2013, 2, 10, 10, 30, 00), ng: true}
  , 文字列1 : {val: '2013-2-10', pass: true}
  , 文字列2 : {val: '2013-2-10 10:30:00', ng: true}
  , 日付昔 : {val: new Date(2000, 1, 1), ng: ['最大最小']}
  , 日付未 : {val: new Date(2020, 1, 1), ng: ['最大最小']}
  , 不正文字 : {val: '日時でない文字列', ng: true}
  , 数字 : {val: 1360459800, ng: true} //unixtimestamp(2013-2-10 10:30:00)
  , T   : {val: true, ng: true}
  , F   : {val: false, ng: true}
  , 空文字 : {val: '', ng:['必須']}
  , 未定: {val: undefined, ng: ['必須']}
  , ヌル: {val: null, ng: ['必須']}
  , オブジェクト: {val:{aaa: 'bbb'}, ng: true}
};