console.log('require ' + __filename);

var is      = require('cocotte/tools/is')
  , getType = require('cocotte/tools/getType')
  , helper  = require('cocotte/fieldtype/helper');

/**
 * 数字
 * 
 * 定義する際はhelper.help()でプロパティを確認してください
 *
 * @class FieldType.NumberField
 * @constructor
 * @extends FieldType
 * @param {Object} schema
 */
var Field = function NumberField (schema) {
	'use strict';
	schema = Field.sanitize(schema);
	schema.__proto__ = this;
	return schema;
};

helper.inherits(Field);

/**
 * 許可定義プロパティ
 * @property {Object} schemaKeys
 * @static
 */
Field.schemaKeys = {
	type: '         {String}   フィールド型。number固定'
  , caption: '      {String}   表示名'
  , primary: '      {Boolean}  主フィールド'
  , index: '        {Boolean}  インデックス'
  , readonly: '     {Boolean}  読取専用'
  , required: '     {Boolean}  必須項目'
  , customConvert: '{Function} 変換 ({Number} oldValue) => {Number} newValue'
  , customValid: '  {Function} 検証 ({Number} value) => {Error} err'
  , defaultTo: '    {Number}   既定値'
  , filterTo: '     {Number}   条件'

  , min: '          {Number}   最小値。既定値:-2147483648'
  , max: '          {Number}   最大値。既定値:2147483647'
  , precision: '    {Number}   小数点桁。既定値:0 最大20桁'
};

/**
 * 定義無害化
 * @method sanitize
 * @static
 * @param  {Object} schema
 * @param  {Array}  errs
 * @return {Object} schema
 */
Field.sanitize = function sanitize (schema, defErrors) {
	'use strict';

	if (!is(Object, schema)) {
		schema = {};

	} else if (schema.sanitize) {
		// 既に無害化済み
		return schema;
	}

	var errs;
	if (is(Array, defErrors)) {
		errs = defErrors;
	} else {
		if (!is(Array, schema.defErrors)) {
			schema.defErrors = [];
		}
		errs = schema.defErrors;
	}

	// 不明なプロパティ
	helper.sanitizeUnknownKeys(schema, Field.schemaKeys, errs);

	// caption
	helper.sanitizeCaption(schema, errs);

	// primary
	helper.sanitizePrimary(schema, errs);

	// index
	helper.sanitizeIndex(schema, errs);

	// readonly
	helper.sanitizeReadonly(schema, errs);
	
	// required
	helper.sanitizeRequired(schema, errs);

	// customConvert
	helper.sanitizeCustomConvert(schema, errs);

	// cosutomValid
	helper.sanitizeCustomValid(schema, errs);

	// min / max / precision / defaultTo / filterTo
	helper.sanitizeSet(
		  schema
		, Field
		, ['min', 'max', 'precision', 'defaultTo', 'filterTo']
		, errs);

	// 無害化フラグ
	schema.sanitize = true;

	return schema;
};

/**
 * フィールド名
 * @property {String} name
 * @default number1
 */
Field.prototype.name = 'number1';

/**
 * フィールド型
 * @property {String} type
 * @default number
 * @readOnly
 */
Field.prototype.type = 'number';

/**
 * 表示名
 * @property {String} caption
 * @default 数値1
 */
Field.prototype.caption = '数値1';

/**
 * 最小値
 * @property {Number} min
 * @default -2147483648
 */
Field.prototype.min = -2147483648;

/**
 * 最小値の設定
 * @method setMin
 * @param {Number}   value
 * @param {Function} callback
 * @return メソッドチェーン
 */
Field.prototype.setMin = function setMin (value, callback) {
	'use strict';
	var err = null
	  , self = this;

	if (value === null || value === undefined) {
		self.min = null;

	} else if (!is(Number, value)) {
		err = new Error('数値を設定してください');

	} else if (self.max !== null && self.max < value) {
		err = new Error('最大値(max)以下の値で設定してください');

	} else {
		self.min = value;

	}

	if (is(Function, callback)) {
		callback(err);
	}

	return self;
};

/**
 * 最大値
 * @property {Number} max
 * @default 2147483647
 */
Field.prototype.max =  2147483647;

/**
 * 最大値の設定
 * @method  setMax
 * @param {Number}   value
 * @param {Function} callback
 * @return メソッドチェーン
 */
Field.prototype.setMax = function setMax (value, callback) {
	'use strict';
	var err = null
	  , self = this;

	if (value === null || value === undefined) {
		value = null;

	} else if (!is(Number, value)) {
		err = new Error('数値を設定してください');

	} else if (self.min !== null && value < self.min) {
		err = new Error('最小値(min)以上の値で設定してください');
	}

	if (!err) {
		self.max = value;
	}
	if (is(Function, callback)) {
		callback(err);
	}
	return self;
};

/**
 * 小数点桁
 * @property {Number} precision
 * @default 0
 */
Field.prototype.precision = 0;

/**
 * 小数点桁数を設定する
 * @method setPrecision
 * @param  {Number}     value
 * @param  {Function}   callback ({Error} err)
 * @return メソッドチェーン
 */
Field.prototype.setPrecision = function setPrecision (value, callback) {
	'use strict';
	var err = null;

	if (!is(Number, value) || ~~value !== value) {
		err = new Error('小数点桁数(precision)は整数を設定してください');

	} else if (value < 0 || 20 < value) {
		err = new Error('小数点桁数(precision)は0から20までの整数を設定してください');

	}

	if (is(Function, callback)) {
		callback(err);
	}
	return this;
};

/**
 * 変換
 * @method convert
 * @param  {Mixed} value
 * @return {Number|Error} value
 */
Field.prototype.convert = function convert (value) {
	'use strict';
	var tp = getType(value);
	switch (true) {
	case value === false:
	case value === null:
	case value === undefined:
		return null;

	case tp === String:
		value = value.trim();
		if (value === '') {
			return null;

		} else if(/^-?[0-9]+(\.[0-9]+)?$/.test(value)) {
			value = value * 1;

		} else {
			return new Error('値が数値型ではありません');

		}
		break;

	case tp === Number:
		break;

	default:
		return new Error('値が数値型ではありません');
	}
	if (this.precision) {
		return value.toFixed(this.precision) * 1;
	} else {
		return parseInt(value, 10);
	}
};

/**
 * 検証
 * @method valuValid
 * @param  {String} value
 * @param  {Object} options
 * @return {Error}  err
 */
Field.prototype.valueValid = function valueValid (value, options) {
	'use strict';

	var checkReadonly = true;
	if (is(Object, options)) {
		checkReadonly = options.readonly !== false;
	}

	if (checkReadonly && this.readonly) {
		return new Error('読取専用です');

	} else if (!is(Number, value)) {
		return new Error('数値型ではありません');

	} else if (value < this.min) {
		return new Error(this.min + '以上の値を入力してください');

	} else if (this.max < value) {
		return new Error(this.max + '以下の値を入力してください');

	}
	return null;

};

module.exports = exports = Field;

