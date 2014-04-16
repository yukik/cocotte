var validTest = require('cocotte/fieldtype/rowno/test/valid-test')
  , TimestampFeild = require('cocotte/fieldtype/timestamp')
  , testData  = {};

//定義リスト
testData.schemas = {
	dummy : null
//  , 省略    : {}
//  , 必須    : { required: true }
//  , 最大最小: { min: new Date(2013, 0, 1), max: new Date(2013, 11, 31, 23, 59, 59) }
  , 最大最小2: { min: 'last day', max: 'next 60days' }

};

//値リスト
testData.values = {
	dummy:null

//  , 日付    : {val: new Date(2013, 9, 10)            , ok: true}
//  , 日時    : {val: new Date(2013, 9, 10, 10, 30, 00), ok: true}
//  , 文字列1 : {val: '2013-9-10'                      , ok: true}
//  , 文字列2 : {val: '2013-9-10 10:30:00'             , ok: true}
//  , 日付昔  : {val: new Date(2000, 1, 1)             , ng: ['最大最小', '最大最小2']}
  , 日付未  : {val: new Date(2020, 1, 1)             , ng: ['最大最小', '最大最小2']}
//  , 不正文字: {val: '日時でない文字列'               , ok: false}
//  , 数字    : {val: 1360459800000                    , ng: ['最大最小2']} //Date.getTimeの値で2013-2-10 10:30:00を示す
//  , T       : {val: true                             , ok: false}
//  , F       : {val: false                            , ok: false}
//  , 空文字  : {val: ''                               , ng: ['必須']}
//  , 未定    : {val: undefined                        , ng: ['必須']}
//  , ヌル    : {val: null                             , ng: ['必須']}
//  , オブ    : {val: {aaa: 'bbb'}                     , ok: false}
};

//validTest(TimestampFeild, testData, true);
validTest(TimestampFeild, testData, true, true);
