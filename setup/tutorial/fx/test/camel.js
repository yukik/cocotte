var msg            = require('cocotte/tools/message')
  , getFx          = require('cocotte/tools/getFx')
  , camelCase      = getFx('camelCase')
  , upperCamelCase = getFx('upperCamelCase');


msg.clear();

msg(camelCase('half-life'));

msg(upperCamelCase('half-life'));
