console.log('require ' + __filename);

var helper  = require('cocotte/fieldtype/helper')
  , is      = require('cocotte/tools/is')
  , getType = require('cocotte/tools/getType');

/**
 * 選択型
 *     文字列のリストから複数を選択して登録する事が出来ます
 *
 * 定義する際はhelper.help()でプロパティを確認してください
 *
 * @class FieldType.SelectionField
 * @constructor
 * @extends FieldType
 * @param {Object} schema
 */
var Field = function SelectionField (schema) {
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
	type: '         {String}   フィールド型。selection固定'
  , caption: '      {String}   表示名'
  , index: '        {Boolean}  インデックス'
  , readonly: '     {Boolean}  読取専用'
  , customConvert: '{Function} 変換 ({Array} oldValue) => {Array} newValue'
  , customValid: '  {Function} 検証 ({Array} value) => {Error} err'
  , defaultTo: '    {Number}   既定値'
  , filterTo: '     {Number}   条件'

  , values: '       {Array}    値リスト。既定値: [\'項目1\',\'項目2\',\'項目3\']'
  , min: '          {Number}   最小選択数。既定値:0。valuesの要素数以下'
  , max: '          {Number}   最大選択数。既定値:null。1以上、min以上。valuesの要素数以下もしくはnull(チェックしない)'
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

	// index
	helper.sanitizeIndex(schema, errs);

	// readonly
	helper.sanitizeReadonly(schema, errs);

	// customConvert
	helper.sanitizeCustomConvert(schema, errs);

	// customValid
	helper.sanitizeCustomValid(schema, errs);

	// values / min / max / defaultTo / filterTo
	helper.sanitizeSet(
		  schema
		, Field
		, ['values', 'min', 'max', 'defaultTo', 'filterTo']
		, errs);

	// 無害化フラグ
	schema.sanitize = true;
};

/**
 * フィールド名
 * @property {String} name
 * @default selection1
 */
Field.prototype.name = 'selection1';

/**
 * フィールド型
 * @property {String} type
 * @default selection
 * @readOnly
 */
Field.prototype.type = 'selection';

/**
 * 表示名
 * @property {String} caption
 * @default 選択1
 */
Field.prototype.caption = '選択1';

/**
 * 必須検証
 * 不要のためnull
 * @method requiredValid
 * @return {Number} result
 */
Field.prototype.requiredValid = null;

/**
 * 値リスト
 * @property {Array} values
 * @default ['項目1','項目2','項目3']
 */
Field.prototype.values = ['項目1','項目2','項目3'];

/**
 * 値リストの設定
 * 
 * 最小選択数、最大選択数と値リストに不整合が起きた場合は
 * それぞれの選択数毎に検証しnullを設定します。（エラーは出ません）
 * @method setValues
 * @param  {Array} values
 */
Field.prototype.setValues = function setValues(values, callback) {
	'use strict';
	var err = null
	  , self = this;

	if (!is(Array, values) || values.length === 0) {
		err = new Error('値リストは配列を設定してください');

	} else if (!values.every(function (x) {
				return is(String, x) && x.length > 0 && x.length <= 50;
			})) {
		err = new Error('各値は1文字以上50文字以下の文字列を設定してください');

	} else if (!self.defaultTo.every(function (x){return !!~values.indexOf(x);})) {
		err = new Error('既定値(defaultTo)に設定されている値が値リストに含まれていません');

	} else if (!is.unique(values)) {
		err = new Error('重複した値が含まれています');

	} else {
		// 設定
		self.values = values;
		// minの再設定
		if (self.min && values.length < self.min) {
			self.min = null;
		}
		// maxの再設定
		if (self.max && self.max < values.length) {
			self.max = null;
		}
	}

	if (is(Function, callback)) {
		callback(err);
	}

	return self;
};

/**
 * 最小選択数
 * nullの場合はチェックを行わない
 * @property {Number} min
 * @default  null
 */
Field.prototype.min = null;

/**
 * 最小選択数の設定
 * @method setMin
 * @param  {Number}   value
 * @param  {Function} callback
 */
Field.prototype.setMin = function setMin (value, callback) {
	'use strict';
	var err = null
	  , self = this
	  , vLen = self.values.length;

	if (value === null || value === 0) {
		self.min = null;

	} else if (!is(Number, value) && ~~value !== value) {
		err = new Error('整数を設定してください');

	} else if (value < 1) {
		err = new Error('1以上の値を設定してください');

	} else if (self.max && self.max < value) {
		err = new Error('最大選択数以下の値を設定してください');

	} else if (vLen < self.values) {
		err = new Error('値リストの数以下の値を設定してください');

	} else {
		self.min = value;

	}

	if (is(Function, callback)) {
		callback(err);
	}

	return self;
};

/**
 * 最大選択数
 * nullの場合はチェックを行わない
 * @property {Number|Boolean} max
 * @default null
 */
Field.prototype.max = null;

/**
 * 最大選択数の設定
 * @method setMax
 * @param  {Number}   value
 * @param  {Function} callback
 */
Field.prototype.setMax = function setMax (value, callback) {
	'use strict';
	var err = null
	  , self = this
	  , vLen = self.values.length;

	if (value === null || value === 0) {
		self.max = null;

	} else if (!is(Number, value) && ~~value !== value) {
		err = new Error('整数を設定してください');

	} else if (value < 1) {
		err = new Error('1以上の値を設定してください');

	} else if (self.min && value < self.min) {
		err = new Error('最小選択数以上の値を設定してください');

	} else if (vLen < self.values) {
		err = new Error('値リストの数以下の値を設定してください');

	} else {
		self.max = value;

	}

	if (is(Function, callback)) {
		callback(err);
	}

	return self;
};

/**
 * 既定値
 * @property {Array} defaultTo
 * @default []
 */
Field.prototype.defaultTo = [];

/**
 * 変換
 * @method convert
 * @param  {Mixed} value
 * @return {Array|Error} value
 */
Field.prototype.convert = function convert (value) {
	'use strict';
	
	var tp = getType(value);

	switch (true) {

	case value === false:
	case value === null:
	case value === undefined:
		return [];

	case tp === String:
		return [value];

	case tp === Array:
		return value;

	default:
		return new Error('配列型ではありません');
	}
};

/**
 * 検証
 * @method  valueValid
 * @param  {Array}  value
 * @param  {Object} options
 * @return {Error}  err
 */
Field.prototype.valueValid = function valueValid (values, options) {
	'use strict';
	var self = this;

	var checkReadonly = true;
	if (is(Object, options)) {
		checkReadonly = options.readonly !== false;
	}

	if (checkReadonly && self.readonly) {
		return new Error('読取専用です');

	} else if (!is(Array, values)) {
		return new Error('値が配列ではありません');

	} else if (!is.allString(values)) {
		return new Error('条件は、文字列の配列を設定してください');

	} else if (values.some(function (x){ return !~self.values.indexOf(x);})) {
		return new Error('値リスト(values)に設定されている値から選択してください');

	} else if (!is.unique(values)) {
		return new Error('重複した値が含まれています');

	}

	return null;
};

/**
 * 条件の変更
 * 条件に渡した値の型で条件が次のように設定されます
 * nullは条件をクリアします
 * 文字列は、その値を選択している
 * 配列を場合はそれらのいずれかを含む (orと同様の結果)
 * Objectの場合は、{ symbol: and/or, values : ['val1', 'val2']}を渡します
 * andの場合はすべてを含む条件となり
 * orの場合はvaluesの配列のいずれかを含む条件となります
 * @method setFilter
 * @param  {String|Array|Object}  condition
 * @param  {Function} callback 
 *                        ({Error} err);
 * @return メソッドチェーン
 */
Field.prototype.setFilter = function setFilter (condition, callback) {
	'use strict';
	var self = this
	  , err = null
	  , symbol = 'or'
	  , values;

	// 未設定にする
	if (condition === null) {
		self.filterTo = null;
		if (is(Function, callback)) {
			callback(null);
		}
		return self;
	}

	// 値変換
	if (is(String, condition)) {
		values = [condition];

	} else if (is(Object, condition)) {
		values = condition.values;
		if (condition.symbol === 'and') {
			symbol = 'and';
		}

	} else if (is(Array, condition)) {
		values = condition;

	}

	// 検証
	err = self.value(values, {readonly: false});

	// 設定
	if (!err) {
		self.filterTo = {symbol: symbol, values: values};
	}

	if (is(Function, callback)) {
		callback(err);
	}

	return self;
};

module.exports = exports = Field;


