console.log('require ' + __filename);
var helper        = require('cocotte/fieldtype/helper')
  , is            = require('cocotte/tools/is')
  , getType       = require('cocotte/tools/getType')
  , BusinessTimes = require('cocotte/tools/business-times')
  , dateToNumber  = require('cocotte/tools/getFx')('dateToNumber');

/**
 *  日にち型
 *
 *  日にち型は、1900-1-1を0とした経過日数で保存されます
 *
 *  schema (共通)
 *      fieldType: {String}      データ型        固定値: 'date' protoにて設定
 *      name     : {String}      システム名      既定値: 'date' protoにて設定
 *      caption  : {String}      表示名          既定値: 'date' protoにて設定
 *      primary  : {Boolean}     主フィールド    既定値: false  protoにて設定
 *      readonly : {Boolean}     読取専用        既定値: false  protoにて設定
 *      required : {Boolean}     必須            既定値: false  protoにて設定
 *      defaultTo: {String|Date} 既定値          既定値: null   protoにて設定 => 注参照
 *      filterTo : {String}      条件            既定値: null   protoにて設定
 *  schema（個別）
 *      min      : {String|Date} 最小値          既定値: '1900-01-01' 注参照
 *      max      : {String|Date} 最大値          既定値: '2099-12-31' 注参照
 *      calendar : {String}      カレンダー名    既定値: 'default'
 *
 *      注）Date型では固定値。String型では日にち、
 *          それ以外はcalc(コマンド)で計算された日時
 * 
 *      タイムゾーンの影響を受けません
 *
 * @class FieldType.DateField
 * @extends FieldType
 * @constructor
 * @param {fieldSchema} Object
 */
var Field = function DateField (fieldSchema) {
	'use strict';
	if (!is(Object, fieldSchema)) {
		fieldSchema = {};
	}

	var self = this;
	
	//共通処理
	self.setProperties(fieldSchema);

	//カレンダー
	var calendarName = is(String, fieldSchema.calendar) ? fieldSchema.calendar : 'default';
	self.calendar = BusinessTimes.Manager.get(calendarName);

	// 最小値
	self.validMeta(fieldSchema.min, function(err, min) {
		if (!err) {
			self.min = min;
		}
	});
	
	// 最大値
	self.validMeta(fieldSchema.max, function(err, max) {
		if (!err) {
			self.max = max;
		}
	});
	
	// 既定値
	self.validMeta(fieldSchema.max, function(err, defaultTo) {
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
Field.prototype.type = 'date';


/**
 * 主フィールド許可
 * @property {Boolean} primaryEnabled
 */
Field.prototype.primaryEnabled = true;

/**
 * データ型
 * @property {Number} valueType
 * @default Number
 * @readOnly
 */
Field.prototype.valueType = Number;

/**
 * フィールド名
 * @property {String} name
 * @default date1
 */
Field.prototype.name = 'date1';

/**
 * 表示名
 * @property {String} caption
 * @default 日付1
 */
Field.prototype.caption = '日付1';

/**
 * 最小値
 * @property {Number} min
 * @default dataToNumber('1900-1-1')
 */
Field.prototype.min = dateToNumber('1900-1-1');

/**
 * 最大値
 * @property {Number} max
 * @default dataToNumber('2099-12-31')
 */
Field.prototype.max = dateToNumber('2099-12-31');

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
	switch (true) {
	case value === false:
	case value === null:
	case value === undefined:
	case value === '':
		return this.nullValue;
	case tp === String:
		val = this.calc (value);
		if (val === null) {
			val = dateToNumber(value);
		}
		if (val === null) {
			return new Error('日付の形式ではありません');
		} else {
			return val;
		}
		break;
	case tp === Date:
		return dateToNumber(value);
	default:
		return new Error('日付の形式ではありません');
	}
};

/**
 * 検証
 * 表示・保存の際は、callbackの第2引数を新しい値として使用する必要があります
 * @method valueValid
 * @param  {Date|String}  value 
 *                            入力データ
 * @param  {Function} callback 
 *                            ({Error} err, {Date} value);
 * @return {Error} err
 */
Field.prototype.valueValid = function valueValid (value, callback) {
	'use strict';
	var err = this.superValid(value)
	  , min = null
	  , max = null;
	if (!err) {
		//最小値
		if (is(Number, this.min)) {
			min = this.min;
		} else if (is(String, this.min)) {
			min = this.calc(this.min);
		}
		//最大値
		if (is(Number, this.max)) {
			max = this.max;
		} else if (is(String, this.max)) {
			max = this.calc(this.max);
		}
	}
	if (err) {
		//既にエラー
	} else if (min && value < min) {
		//最小値エラー
		err = new Error(min.getFullYear() + '年' + (min.getMonth() + 1) + '月' + min.getDate() + '日以降の日付を入力してください');
	} else if (max && max < value) {
		//最大値エラー
		err = new Error(max.getFullYear() + '年' + (max.getMonth() + 1) + '月' + max.getDate() + '日以前の日付を入力してください');
	}

	if (callback) {
		callback(err, value);
	}
	return err;
};
/**
 * 既定値・最大値・最小値の設定値の検証
 * 検証エラーはcallbackで取得してください
 * @method validMeta
 * @param  {String} value
 * @param  {Function} callback 
 *                        ({Error} err, {String} newValue)
 * @return {String} value
 */
Field.prototype.validMeta = function validMeta (value, callback) {
	'use strict';
	var err = null;
	if (value instanceof Date) {
		if (is(Date, value)) {
			err = new Error('有効な日付ではありません');
		} else {
			value = [value.getFullYear(), value.getMonth(), value.getDate()];
		}
	} else if(this.validCommand(value)) {
		//コマンド
	} else if (is(String, value)) {
		value = new Date(value);
		if (is(Date, value)) {
			err = new Error('日付の形式ではありません');
		} else {
			value = [value.getFullYear(), value.getMonth(), value.getDate()];
		}
	}  else {
		err = new Error('日付またはコマンドを設定してください');
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
 * コマンドはgetDefaultが実行されたタイミングで値が計算されます
 * @method setDefault
 * @param  {Date|String} value 
 * @param  {Function} callback 
 *                          ({Error} err, {Date|String} value);
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

/**
 * 既定値の取得
 * コマンドが設定されている場合は計算後の値が返されます
 * @method  getDefault
 * @return {Date} defaultValue
 */
Field.prototype.getDefault = function getDafeult () {
	'use strict';
	if (is(Date, this.defaultTo)) {
		return this.defaultTo;
	} else if (is(String, this.defaultTo)) {
		return this.calc(this.defaultTo);
	} else {
		return null;
	}
};

/**
 * 条件の変更
 * 基本は開始と終了を指定した配列[begin, end]です
 * beginもしくはendを指定しない場合はnullを設定します
 * 
 * @method setFilter
 * @param  {Array|String} condition
 *                                条件
 * @param  {Function} callback 
 *                                 ({Error} err, {Array} condition);
 * @return メソッドチェーン
 */
Field.prototype.setFilter = function setFilter (condition, callback) {
	'use strict';
	var begin    = null
	  , end      = null
	  , filterTo = null
	  , err      = null;

	//日付の場合は開始終了の両方に設定
	if (is(String, condition)) {
		var num = dateToNumber(condition);
		filterTo = [num, num];
	} else if (is(Array, condition)) {
		if (condition.length === 2) {
			if (is(String, condition[0])) {
				begin = dateToNumber(condition[0]);
				if (begin === null) {
					err = new Error('開始日が適切ではありません');
				}
			}
			if (!err && is(String, condition[1])) {
				end = dateToNumber(condition[1]);
				if (end === null) {
					err = new Error('終了日が適切ではありません');
				}
			}
			if (begin && end && end < begin) {
				err = new Error('開始と終了の範囲が適切ではありません');
			} else if (!err) {
				filterTo = [begin, end];
			}
		} else {
			err = new Error('有効な日付の形式ではありません');
		}
	} else {
		err = new Error('日時もしくは有効な範囲の形式ではありません');
	}
	if (filterTo) {
		this.filterTo = filterTo;
	}
	if (is(Function, callback)) {
		callback(err, filterTo);
	}
	return this;
};

/**
 * 計算コマンドにより基準日から計算した日を返します
 * 詳しいコマンドはbusiness-timesモジュールを参照します
 * @method calc
 * @param  {String} command 
 *                      計算式
 * @param  {Date} target 
 *                      基準日時。省略時は本日
 * @return {Date} value
 */
Field.prototype.calc = function calc (command, target) {
	'use strict';
	if (this.calendar) {
		return this.calendar.calc(command, target);
	} else {
		return null;
	}
};

/**
 * 文字列がコマンドかを判別する
 * @method validCommand
 * @param  {String} command
 * @return {Boolean} isCommand
 */
Field.prototype.validCommand = function validCommand (command) {
	'use strict';
	return BusinessTimes.validCommand(command);
};

module.exports = exports = Field;
