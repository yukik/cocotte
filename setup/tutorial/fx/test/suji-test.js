var msg  = require('cocotte/tools/message')
  , suji = require('cocotte/tools/getFx')('suji')
  , test = function (val, preset) {
				'use strict';
				msg(suji(val, preset), 2);
			};

test(1);
test(12);
test(128);
test(1289);
test(12891);
test(128910);
test(1289100);
test(12891000);
test(128910000);
test(1289100000);
test(12891000000);
test(128910000000);
test(1289100000000);
test(12891000000000);
test(128910000000000);
test(1289100000000000);
test(12891000000000000);
test(128910000000000000);
test(1289100000000000000);
test(12891000000000000000);
test(128910000000000000000);
test(1289100000000000000000);
test(12891000000000000000000);
test(128910000000000000000000);

msg('-------');

test(1, 'full');
test(12, 'full');
test(128, 'full');
test(1289, 'full');
test(12891, 'full');
test(128910, 'full');
test(1289100, 'full');
test(12891000, 'full');
test(128910000, 'full');
test(1289100000, 'full');
test(12891000000, 'full');
test(128910000000, 'full');
test(1289100000000, 'full');
test(12891000000000, 'full');
test(128910000000000, 'full');
test(1289100000000000, 'full');
test(12891000000000000, 'full');
test(128910000000000000, 'full');
test(1289100000000000000, 'full');
test(12891000000000000000, 'full');
test(128910000000000000000, 'full');
test(1289100000000000000000, 'full');
test(12891000000000000000000, 'full');
test(128910000000000000000000, 'full');
