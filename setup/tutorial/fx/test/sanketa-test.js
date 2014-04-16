
var msg     = require('cocotte/tools/message')
  , getFx   = require('cocotte/tools/getFx')
  , sanketa = getFx('sanketa')
  , test    = require('cocotte/tools/test')
  , eq      = test.eqHelper(sanketa);


eq(      1,         '1');
eq(     12,        '12');
eq(    123,       '123');
eq(   1234,     '1,234');
eq(  12345,    '12,345');
eq( 123456,   '123,456');
eq(1234567, '1,234,567');

eq(      1.1      ,         '1.1');
eq(     12.12     ,        '12.12');
eq(    123.123    ,       '123.123');
eq(   1234.1234   ,     '1,234.1234');
eq(  12345.12345  ,    '12,345.12345');
eq( 123456.123456 ,   '123,456.123456');
eq(1234567.1234567, '1,234,567.1234567');

msg('テストに成功しました');