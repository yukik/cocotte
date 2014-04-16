var validTest = require('cocotte/fieldtype/rowno/test/valid-test')
  , TimeFeild = require('cocotte/fieldtype/time')
  , testData  = {};

testData.schemas = {
	dummy   : null

  , 省略    : {}
  , 必須    : {required: true}
  , 最大最小: {min: '10:00', max: '17:59'}

};

//値リスト
testData.values = {
	dummy   : null
  , 日付    : {val: new Date(2013, 2, 10)            , ng: true}
  , 日時    : {val: new Date(2013, 2, 10, 10, 30, 00), ng: true}
  , 文字列1 : {val: '2013-2-10'                      , ng: true}
  , 文字列2 : {val: '2013-2-10 10:30:00'             , ok: true}
  , 文字列3 : {val: '10:30'                          , ok: true}
  , 文字列4 : {val: '10:30:00'                       , ok: true}
  , 配列1   : {val: [10, 30]                         , ng: true}
  , 時間前  : {val: '0:00'                           , ng: ['最大最小']}
  , 時間後  : {val: '23:59:59'                       , ng: ['最大最小']}
  , 不正文字: {val: '時間でない文字列'               , ng: true}
  , 数字    : {val: 10 * 3600 + 30 * 60              , ok: true}  // 10:30
  , T       : {val: true                             , ng: true}
  , F       : {val: false                            , ng: ['必須']}
  , 空文字  : {val: ''                               , ng: ['必須']}
  , 未定    : {val: undefined                        , ng: ['必須']}
  , ヌル    : {val: null                             , ng: ['必須']}
  , オブ    : {val: {aaa: 'bbb'}                     , ng: true}
};


validTest(TimeFeild, testData, true, true);
