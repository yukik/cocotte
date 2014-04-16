var TextField = require('cocotte/fieldtype/text')
  , msg       = require('cocotte/tools/message')
  , callback  = msg.callback;

var schema = {
		caption     : '名前'
	  , defaultTo   : 'bbb'
	  , min         : 3
	  , max         : 5
	  , values      : ['AAA', 'BBB', 'CCC']
	  , customConvert: function (value) {
			'use strict';
			if (value === null) {
				return null;
			}
			if (value=== 'xxx') {
				return new Error('禁止ワードです');
			}
			return value.toUpperCase();
		}
	  , customValid : function (value) {
			'use strict';
			if (value === 'aaa') {
				return new Error('aaaは設定できません');
			}
		}
	};



var nameField = new TextField(schema);
//nameField.setDefaultTo('aasaa', callback);
//nameField.setDefaultTo(null, callback);
//nameField.setDefaultTo('8888888888', callback);
//nameField.setDefaultTo('xxx', callback);


//nameField.setMax(3, callback);

//msg(nameField);

var cell = {};

nameField.set('CCC', cell, callback);

nameField.set(null, cell, callback);

//msg(cell);




