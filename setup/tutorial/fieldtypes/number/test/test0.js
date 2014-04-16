var NumberField = require('cocotte/fieldtype/number')
  , msg       = require('cocotte/tools/message')
  , callback  = msg.callback;

var schema = {
		caption     : '年齢'
	  , defaultTo   : 18
//	  , defaultTo   : '成年'
	  , min         : 0
	  , max         : 200
		
	  , customConvert: function (value) {
			'use strict';
			msg(value);
			if (value === '成年') {
				return 20;
			}
			if (value === '大人') {
				return new Error('大人は何歳なのかわかりません');
			}
			return value;
		}
	  , customValid : function (value) {
			'use strict';
			if (value <= 5) {
				return new Error('５歳以下は設定できません');
			}
		}
	};

var ageField = new NumberField(schema);

ageField.setMax(150, callback);

msg(ageField);

var cell = {};

ageField.set(19, cell);

msg(cell);