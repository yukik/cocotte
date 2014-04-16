console.log('require ' + __filename);

var helper       = require('cocotte/fieldtype/helper')
  , getFx        = require('cocotte/tools/getFx')
  , calc         = getFx('calcTime')
  , validCommand = calc.validCommand
  , s2str        = getFx('secondsToStr')
  , secondsToStr = function (val) {
        'use strict';
        return s2str(val, 'time');
    }
  , strToSeconds = getFx('strToSeconds');

/**
 * 時刻・時間型
 * 
 * 時刻や時間を管理します
 *   時刻：日をもたない時刻だけを管理する際に使用します
 *   時間：日時と日時の間隔の計算などに使用します
 *   
 * フィールド型での意味による区別はありません
 * 適切に判断出来るフィールド名を使用してください
 *
 * タイムゾーンの影響を受けません
 *
 * @class FieldType.TimeField
 * @constructor
 * @extends FieldType
 * @param {Object} fieldSchema 
 *                    name     : {String}  システム名 
 *                    caption  : {String}  表示名 
 *                    readonly : {Boolean} 読取専用 
 *                    required : {Boolean} 必須 
 *                    defaultTo: {Number|Strnig} 初期値 
 *                    min      : {Number|String} 最小値 
 *                    max      : {Number|String} 最大値 
 *                    注）Number型では固定値。String型では時間表記の場合は数値に変換、それ以外はコマンド 
 */
var Field = function TimeField (fieldSchema) {
	'use strict';
	var self = this;

	/*
	 * 共通処理
	 */
	self.setProperties(fieldSchema);

	/*
	 * 最小値
	 */
	self.validMeta(fieldSchema.min, function (err, min) {
		if (!err) {
			self.min = min;
		}
	});

	/*
	 * 最大値
	 */
	self.validMeta(fieldSchema.max, function (err, max) {
		if (!err) {
			self.max = max;
		}
	});

	/*
	 * 既定値
	 */
	self.validMeta(fieldSchema.defaultTo, function (err, defaultTo) {
		if (!err) {
			self.defaultTo = defaultTo;
		}
	});
};

helper.inherits(Field);

/**
 * フィールド型
 * @property {String} type
 */
Field.prototype.type = 'time';

/**
 * 主フィールド許可
 * @property {Boolean} primaryEnabled
 * @default true
 * @readOnly
 */
Field.prototype.primaryEnabled = true;


/**
 * データ型
 * @property {Function} valueType
 * @default Number
 * @readOnly
 */
Field.prototype.valueType = Number;

/**
 * フィールド名
 * @property {String} name
 * @default time1
 */
Field.prototype.name = 'time1';

/**
 * 表示名
 * @property {String} caption
 * @default 時間1
 */
Field.prototype.caption = '時間1';

/**
 * 最小値
 * 文字列を設定した場合は、コマンドと見なし都度計算します
 * @property {Number|String} min
 * @default -2147483648
 */
Field.prototype.min = -2147483648;

/**
 * 最大値
 * 文字列を設定した場合は、コマンドと見なし都度計算します
 * @property {Number|String} max
 * @default 2147483647
 */
Field.prototype.max = 2147483647;

/**
 * 変換
 * @method convert
 * @param  {Mixed} value
 * @return {Number} value
 */
Field.prototype.convert = function convert (value) {
	'use strict';
	var tp = getType(value)
	  , val;
	switch(true) {
	case value === false:
	case value === null:
	case value === undefined:
	case value === '':
		return this.nullValue;
	case tp === String:
		val = calc(value);
		if (val === null) {
			val = strToSeconds(value);
		}
		if (val === null) {
			return new Error('時間・時刻の形式ではありません');
		} else {
			return val;
		}
		break;
	case tp === Number:
		return parseInt(value, 10);
	default:
		return new Error('時間・時刻ではありません');
	}
};

/*
 * 引数を時間(秒)に変換して返します
 * 
 * 秒の数字, calcTime, strToSecondsの順で判定し変換出来る場合はいずれかの数字を返します
 * 変換出来ない場合はnullを返します
 * @param  {Number|String} 
 * @return {Number}
 */
var convertTime = function convertTime (value) {
	'use strict';
	var tp = getType(value);
	switch(true) {
	case tp === Number:
		return parseInt(value, 10);

	case tp === String:
		if (validCommand(value)) {
			return calc(value);
		} else {
			return strToSeconds(value);
		}
		break;

	default:
		return null;
	}
};

/**
 * 検証
 * @method valueValid
 * @param  {Mixed}     value
 * @param  {Function}  callback 
 *                         ({Error} err, {Number} value)
 * @return {Error} err
 */
Field.prototype.valueValid = function valueValid (value, callback) {
	'use strict';
	var self = this
	  , err  = self.superValid(value);
	if (!err) {
		//型チェック
		var x = self.validMeta(value, function(e) {
			if (err) {
				err = e;
			}
		});
		//最大値・最小値チェック
		var min = convertTime(self.min)
		  , val = convertTime(x)
		  , max = convertTime(self.max);
		if (val === null) {
			err = new Error('時間・時刻の形式ではありません');
		} else if (val < min) {
			err = new Error(secondsToStr(min) + '以上を入力してください');
		} else if (max < val) {
			err = new Error(secondsToStr(max) + '以下を入力してください');
		} else {
			value = val;
		}
	}
	if (is(Function, callback)) {
		callback(err, value);
	}
	return err;
};


/**
 * 既定値・最大値・最小値の設定値の検証
 * 入力値は数値,コマンド文字列,strToSecondsで変換出来る文字列
 * 検証後はコマンドはそのまま、他はすべて数値に変換されます
 * 検証エラーはcallbackで取得してください
 * @method validMeta
 * @param  {Number|String} value
 * @param  {Function} callback 
 *                      ({Error} err, {Number|String} newValue)
 * @return {Number|String} value
 */
Field.prototype.validMeta = function validMeta(value, callback) {
	'use strict';
	var err = null;
	if (is(Number, value)) {
		//数字
		value = parseInt(value, 10);
	} else if (validCommand(value)) {
		//コマンド
	} else if (is(String, value)) {
		//書式
		value = strToSeconds(value);
		if (value === null) {
			err = new Error('時間・時刻ではありません');
		}
	} else {
		err = new Error('時間・時刻の形式ではありません');
	}
	if (err) {
		value = null;
	}
	if (callback) {
		callback(err, value);
	}
	return value;
};

/**
 * 既定値の設定
 * コマンドを設定する事もできます
 * コマンドは既定値が必要になった時点で都度、値が計算されます
 * @method setDefault
 * @param  {String} value　既定値
 * @param  {Function} callback ({Error} err, {String|Command} value);
 * @return メソッドチェーン
 */
Field.prototype.setDefault = function setDefault (value, callback) {
	'use strict';
	var self = this;
	self.validMeta(value, function(err, value) {
		if (!err) {
			self.defaultTo = value;
		}
		if (callback) {
			callback(err, value);
		}
	});
	return this;
};

module.exports = exports = Field;