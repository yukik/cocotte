console.log('require ' + __filename);

var helper             = require('cocotte/fieldtype/helper')
  , is                 = require('cocotte/tools/is')
  , getType            = require('cocotte/tools/getType')
  , getFx              = require('cocotte/tools/getFx')
  , timestampToBetween = getFx('timestampToBetween')
  , calc               = getFx('calcTimestamp')
  , validCommand       = calc.validCommand;

/**
 * 日時型
 * 
 *     タイムゾーンの影響を受けます
 *     入力者と閲覧者のタイムゾーンが異なる場合は表示時間が異なることがあります
 *
 * @class  FieldType.TimestampField
 * @constructor
 * @extends FieldType
 * @param {Object} fieldSchema
 *                    name     : {String}  システム名 
 *                    caption  : {String}  表示名 
 *                    readonly : {Boolean} 読取専用
 *                    required : {Boolean} 必須
 *                    defaultTo: {Date|Strnig} 初期値
 *                    min      : {Date|String} 最小値
 *                    max      : {Date|String} 最大値 
 *                    注）Date型では固定値。String型では日時表記の場合はDate型に変換、それ以外はコマンド
 */
var Field = function TimestampField (fieldSchema) {
	'use strict';
	var self = this;

	if (!is(Object, fieldSchema)) {
		fieldSchema = {};
	}

	/*
	 * 共通処理
	 */
	self.setProperties(fieldSchema);

	/*
	 * 最小値
	 */
	self.validMeta(fieldSchema.min, function (err, value) {
		if (!err) {
			self.min = value;
		}
	});

	/*
	 * 最大値
	 */
	self.validMeta(fieldSchema.max, function (err, value) {
		if (!err) {
			self.max = value;
		}
	});

	/*
	 * 既定値
	 */
	self.setDefault(self.defaultTo, function(err) {
		if (err) {
			delete self.defaultTo;
		}
	});
};

helper.inherits(Field);

/**
 * フィールド型
 * @property {String} type
 * @default timestamp
 * @readOnly
 */
Field.prototype.type = 'timestamp';

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
 * @default Date
 * @readOnly
 */
Field.prototype.valueType = Date;

/**
 * フィールド名
 * @property {String} name
 * @default timestamp1
 */
Field.prototype.name = 'timestamp1';

/**
 * 表示名
 * @property {String} caption
 * @default 日時1
 */
Field.prototype.caption = '日時1';

/**
 * 最小値
 * @property {Date|String} min
 * @default new Date(Date.UTC(1900, 0, 1))
 */
Field.prototype.min = new Date(Date.UTC(1900, 0, 1));

/**
 * 最小値
 * @property {Date|String} max
 * @default new Date(Date.UTC(2099, 11, 31, 23, 59, 59))
 */
Field.prototype.max = new Date(Date.UTC(2099, 11, 31, 23, 59, 59));

/**
 * 既定値
 * @property {Date|String} defaultTo
 * @default null
 */
Field.prototype.defaultTo = null;

/**
 * 値の変換
 * @method convert
 * @param  {Mixed} value
 * @return {Date} value 
 */
Field.prototype.convert = function convert (value) {
	'use strict';
	var tp = getType(value);
	switch (true) {
	case value === false:
	case value === null:
	case value === undefined:
	case value === '':
		return this.nullValue;
	case tp === Date:
		return value;
	case tp === Number:
		//タイムスタンプを日付に変更
		return new Date(value);
	case tp === String:
		var v = calc(value);
		if (v) {
			value = v;
		} else {
			value = new Date(value);
		}
		if (is(Date, value)) {
			return value;
		} else {
			return new Error('日時ではありません');
		}
		break;
	default:
		return new Error('日時ではありません');
	}
};

/**
 * 検証
 * 表示・保存の際は、callbackの第2引数を新しい値として使用する必要があります
 * @method valueValid
 * @param  {Boolean}  value
 * @param  {Function} callback 
 *                       ({Error} err, {Boolean} value);
 * @return {Error} err 
 */
Field.prototype.valueValid = function valueValid (value, callback) {
	'use strict';
	var err = this.superValid(value);
	if (!err) {
		var min = is(Date, this.min) ? this.min : calc(this.min)
		  , max = is(Date, this.max) ? this.max : calc(this.max);
		if (value < min) {
			//最小値
			err = new Error(min.toLocaleString() + '以降の日時を入力してください');
		} else if (max < value) {
			//最大値
			err = new Error(max.toLocaleString() + '以前の日時を入力してください');
		}
	}
	if (is(Function, callback)) {
		callback(err, value);
	}
	return err;
};

/**
 * 既定値・値リストの設定値の検証
 * 検証エラーはcallbackで取得してください
 * @method  validMeta
 * @param  {String} value
 * @param  {Function} callback 
 *                     ({Error} err, {Date|String} newValue)
 * @return {Date|String} value
 */
Field.prototype.validMeta = function validMeta (value, callback) {
	'use strict';
	var err = null;
	if (validCommand(value)) {
		//コマンド
	} else if (is(String, value)) {
		//日時
		var d = new Date(value);
		if (is(Date, d)) {
			value = d;
		} else {
			err = new Error('不明な日時が設定されました');
		}
	} else if (!is(Date, value)) {
		err = new Error('有効な日時もしくはコマンドを設定してください');
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
 * @method setDefault
 * @param  {Boolean}  value
 * @param  {Function} callback 
 *                        ({Error} err, {Boolean} value);
 * @return メソッドチェーン
 */
Field.prototype.setDefault = function setDefault(value, callback) {
	'use strict';
	var self = this;
	if (value === null || value === undefined) {
		self.defaultTo = null;
		if (callback) {
			callback(null, null);
		}
	} else {
		self.validMeta(value, function(err, value) {
			if (!err) {
				self.defaultTo = value;
			}
			if (callback) {
				callback(err, value);
			}
		});
	}
	return this;
};

/**
 * 既定値の取得
 * コマンドが設定されている場合は計算後の値が返されます
 * @method getDefault
 * @return {Date} value 
 */
Field.prototype.getDefault = function getDafeult () {
	'use strict';
	if (is(Date, this.defaultTo)) {
		return this.defaultTo;
	} else if (is(String, this.defaultTo)) {
		return calc(this.defaultTo);
	} else {
		return null;
	}
};

/**
 * 条件の変更
 * 基本は開始と終了を指定した配列です
 * beginもしくはendを指定しない場合はnullを設定します
 * [begin, end]
 * 日時の場合はミリ秒を丸めて範囲にします
 * 文字列の場合は範囲に置き換えます
 * '2013-6' => ['2013-06-01 00:00:00', '2013-06-30 23:59:59.999']
 * '2013-6-1 10' => ['2013-06-01 10:00:00', '2013-06-01 10:59:59.999']
 * @method setFilter
 * @param  {Array|String}  condition
 * @param  {Function} callback 
 *                        ({Error} err, {Boolean} condition);
 * @return メソッドチェーン
 */
Field.prototype.setFilter = function setFilter(condition, callback) {
	'use strict';
	var filterTo = null
	  , err = null;
	if (is(Date, condition)) {
		//日時の場合はミリ秒を丸めて範囲に設定し直す
		filterTo = [new Date(parseInt(condition.getTime() / 1000, 10) * 1000)
			  , new Date(parseInt(condition.getTime() / 1000, 10) * 1000 + 999)];
	} else if (validCommand(condition)) {
		//コマンドの場合はエラー
		err = new Error('コマンドを条件に設定する事はできません'); //## 将来は対応するかのせいあり
	} else if (is(String, condition)) {
		//文字列の場合は範囲に置き換えられる
		filterTo = timestampToBetween(condition);
		if (filterTo === null) {
			err = new Error('有効な範囲の形式ではありません');
		}
	} else {
		err = new Error('日時もしくは有効な範囲の形式ではありません');
	}
	if (filterTo) {
		this.filterTo = filterTo;
	}
	if (callback) {
		callback(err, filterTo);
	}
	return this;
};

module.exports = exports = Field;
