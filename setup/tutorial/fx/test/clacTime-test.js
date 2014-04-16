var msg = require('cocotte/tools/message')
  , getFx        = require('cocotte/tools/getFx')
  , calcTime     = getFx('calcTime')
  , secondsToStr = getFx('secondsToStr');


var half = calcTime('next quarters');

msg(half);

msg(secondsToStr(half));

msg(secondsToStr(86400));

msg(secondsToStr(2410, 'time'));


