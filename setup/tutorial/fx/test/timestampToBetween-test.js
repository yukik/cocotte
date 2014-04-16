var msg = require('cocotte/tools/message')
  , timestampToBetween = require('cocotte/tools/getFx')('timestampToBetween');

msg(timestampToBetween('1970-1-1'));
