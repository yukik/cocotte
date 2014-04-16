console.log('require ' + __filename);

var is      = require('cocotte/tools/is')
  , getType = require('cocotte/tools/getType')
  , helper  = require('cocotte/fieldtype/helper')
  , crypto  = require('crypto');

/**
 * 文字列型
 *
 * 定義する際はhelper.help()でプロパティを確認してください
 *
 * @class FieldType.TextField
 * @extends FieldType
 * @constructor
 * @param {Object}  schema
 */
var Field = function TextField (schema) {
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
	type: '          {String}   フィールド型。text固定'
  , caption: '       {String}   表示名'
  , primary: '       {Boolean}  主フィールド'
  , index: '         {Boolean}  インデックス'
  , readonly: '      {Boolean}  読取専用'
  , required: '      {Boolean}  必須項目'
  , customConvert: ' {Function} 変換 ({String} oldValue) => {String} newValue'
  , customValid: '   {Function} 検証 ({String} value) => {Error} err'
  , defaultTo: '     {String}   既定値'
  , filterTo: '      {String}   条件'

  , min: '           {Number}   最小文字長 (0-65535)'
  , max: '           {Number}   最大文字長 (1-65535)'
  , trim: '          {Boolean}  自動トリム'
  , multiLine: '     {Boolean}  改行許可'
  , values: '        {Array}    値リスト'
  , crypto: '        {String}   暗号化・ハッシュ化。md5/sha1/aes256のいずれか'
  , key: '           {String}   暗号化キー・ハッシュ化キー'
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

	// customValid
	helper.sanitizeCustomValid(schema, errs);

	// その他
	helper.sanitizeSet(
		schema
	  , Field
	  , ['min', 'max', 'trim', 'multiLine', 'crypto', 'key',
	     'values', 'defaultTo', 'filterTo']
	  , errs);

	// 無害化フラグ
	schema.sanitize = true;

	return schema;
};

/**
 * フィールド名
 * @property {String} name
 * @default text1
 */
Field.prototype.name = 'text1';

/*
 * フィールド型
 * @property {String} type
 * @default text
 * @readOnly
 */
Field.prototype.type = 'text';

/**
 * 表示名
 * @property {String} caption
 * @default 文字列1
 */
Field.prototype.caption = '文字列1';

/**
 * 最小文字長
 * 0-65535の間
 * @property {Number} min
 * @default 0
 */
Field.prototype.min = 0;


/**
 * 最小文字長の設定
 * @method setMin
 * @param {Number}   value
 * @param {Function} callback
 * @return メソッドチェーン
 */
Field.prototype.setMin = function setMin (value, callback) {
	'use strict';
	var err = null
	  , self = this;

	if (value === null || value === undefined || value === 0) {
		value = null;

	} else if (!is(Number, value) && ~~value !== value) {
		err = new Error('整数を設定してください');

	} else if (value < 1 || 65535 < value) {
		err = new Error('1-65535の間で設定してください');

	} else if (self.max !== null && self.max < value) {
		err = new Error('最大文字長(max)以下の値で設定してください');

	}

	if (!err) {
		self.min = value;
	}
	
	if (is(Function, callback)) {
		callback(err);
	}
	return self;
};

/**
 * 最大文字長
 * 1-65535の間かつ最小文字長以上
 * @property {Number} max
 * @default 100
 */
Field.prototype.max = 65535;

/**
 * 最大文字長の設定
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
		err = new Error('整数を設定してください');

	} else if (value < 1 || 65535 < value) {
		err = new Error('1-65535の間で設定してください');

	} else if (self.min !== null && value < self.min) {
		err = new Error('最小文字長(min)以上の値で設定してください');

	} else if (~~value !== value) {
		err = new Error('整数を設定してください');

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
 * トリム
 * trueに設定した場合は前後のスペース・改行・タブを削除します
 * @property {Boolean} trim
 * @default true
 */
Field.prototype.trim = true;

/**
 * トリムの設定
 * @method setTrim
 * @param  {Boolean}   value
 * @param  {Function}  callback
 */
Field.prototype.setTrim = function setTrim (value, callback) {
	'use strict';
	var err = null;
	if (value === null) {
		delete this.trim;
	} else if (is(Boolean, value)) {
		this.trim = value;
	} else if (value !== undefined) {
		err = new Error('true/falseを設定してください。');
	}
	if (is(Function, callback)) {
		callback(err);
	}
};

/**
 * 複数行
 * 改行・タブを許可します
 * @property {Boolean} multiLine
 * @default false
 */
Field.prototype.multiLine = false;

/**
 * 複数行の設定
 * @method setMultiLine
 * @param  {Boolean}     value
 * @param  {Function}   callback
 */
Field.prototype.setMultiLine = function setMultiLine (value, callback) {
	'use strict';
	var err = null;
	if (value === null) {
		delete this.multiLine;
	} else if (is(Boolean, value)) {
		if (!value) {
			this.multiLine = false;
		} else if (this.primary) {
			err = new Error('主フィールド(primary)は複数行(multiLine)に' +
							'する事ができません');
		} else if (this.index) {
			err = new Error('インデックス(index)を設定時は複数行(multiLine)に' +
							'する事ができません');
		} else {
			this.multiLine = true;
		}
	} else if (value !== undefined) {
		err = new Error('true/falseを設定してください');
	}
	if (is(Function, callback)) {
		callback(err);
	}
};

/**
 * 値リスト
 * 設定された場合はリストからのみ選択出来ます。
 * @property {Array} values
 */
Field.prototype.values = null;

/**
 * 暗号化・ハッシュ化
 * md5,sha1,aes256のいずれを設定
 * 暗号化すると、保存時に値が読めない状態になります
 * ハッシュ化すると、元の値は取得出来ません
 * @property {String} crypto
 */
Field.prototype.crypto = null;

/**
 * 暗号化・ハッシュ化の設定
 * @method setCrypto
 * @param  {Srting}   value
 * @param  {Function} callback ({Error} err)
 */
Field.prototype.setCrypto = function setCrypto (value, callback) {
	'use strict';
	var err = null;
	if (value === null) {
		delete this.crypto;
	} else if (!is(String, value)) {
		if (!~['md5', 'sha1', 'aes256'].indexOf(value)) {
			err = new Error('md5/sha1/aes256のいずれかを設定してください');
		} else if (this.primary) {
			err = new Error('主フィールド(primary)は、暗号化・ハッシュ化' +
							'(crypto)を設定できません');
		} else {
			this.crypto = value;
		}
	} else if (value !== undefined) {
		err = new Error('文字列で指定してください');
	}
	if (Function, callback) {
		callback(err);
	}
};

/**
 * 暗号キー・ハッシュキー
 * @property {String} key
 */
Field.prototype.key = 'cocotte';

/**
 * 暗号キー・ハッシュキーの設定
 * @method setKey
 * @param  {String}   value
 * @param  {Function} callback ({Error} err)
 */
Field.prototype.setKey = function setKey (value, callback) {
	'use strict';
	var err = null;
	if (value === null) {
		delete this.key;
	} else if (is(String, value)) {
		this.key = value;
	} else if (value !== undefined){
		err = new Error('暗号化キー・ハッシュ化キー(key)は文字列を' +
						'設定してください');
	}
	if (is(Function, callback)) {
		callback(err);
	}
};

/**
 * 変換
 * @method  convert
 * @param  {Mixed} value
 * @return {String|Error} value
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
		if (this.trim) {
			value = value.trim();
		}
		return value || null;
	case tp === Number:
		return value.toString();
	default:
		return new Error('値が文字列型ではありません');
	}
};

/**
 * 検証
 * @method valueValid
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

	} else if (!is(String, value)) {
		return new Error('文字列型ではありません');

	} else if (this.values && !~this.values.indexOf(value)) {
		return new Error('リストにない値です');

	} else if (!this.multiLine &&  /(\n|\t)/.test(value)) {
		return new Error('改行・タブの入力は許可されていません');

	} else if (value.length < this.min) {
		return new Error(this.min + '文字以上で入力してください');

	} else if (this.max < value.length) {
		return new Error(this.max + '文字以下で入力してください');

	}
	return null;
};

/**
 * 値リストの設定
 * @method setValues
 * @param  {Array} values
 * @param  {Function} callback ({Error} err)
 * @return メソッドチェーン
 */
Field.prototype.setValues = function setValues (values, callback) {
	'use strict';
	var self = this
	  , err = null
	  , min = self.min || 1
	  , max = self.max || 65535;

	if (values === null) {
		delete this.values;

	} else if (is(Array, values)) {

		if (self.multiLine) {
			err = new Error('複数行(multiLine)が設定時は、値リスト(values)は' +
							'設定できません。');

		} else if (!is.allString(values)) {
			err = new Error('文字列ではない値がリストに含まれています');

		} else if (!is.unique(values)) {
			err = new Error('重複した値がリストに含まれています');

		} else if (values.filter(function (v) { return v.length < min;}).length) {
			err = new Error('最小文字長(min)に違反している値があります');

		} else if (values.filter(function (v) { return max < v.length;}).length) {
			err = new Error('最大文字長(max)に違反している値があります');

		} else if (self.customValid &&
				values.filter(function(v){return self.customValid(v);}).length) {
			err = new Error('検証(valid)に違反している値が存在します');

		} else {
			self.values = values;

		}

	} else if (values !== undefined) {
		err = new Error('値リスト(values)は文字列の配列を設定してください。');

	}

	if (callback) {
		callback(err);
	}
	return self;
};

/**
 * 取得時に値を変換する
 * @method  loadConvert
 * @param  {String} value
 * @return {String} value
 */
Field.prototype.loadConvert = function loadConvert (value) {
	'use strict';
	switch(this.crypto) {
	case 'md5':
	case 'sha1':
		return '*****';
	case 'aes256':
		var decipher = crypto.createDecipher('aes256', this.key);
		var dec = decipher.update(value, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	default:
		return value;
	}
};

/**
 * 保存時に値を変換する
 * @method  loadConvert
 * @param  {String} value
 * @return {String} value
 */
Field.prototype.saveConvert = function saveConvert (value) {
	'use strict';
	if (!this.crypto || !is(String, value)) {
		return value;
	}
	var sum;
	switch(this.crypto) {
	case 'md5':
		sum = crypto.createHash('md5');
		sum.update(value + this.key);
		return sum.digest('hex');
	case 'sha1':
		sum = crypto.createHash('sha1');
		sum.update(value + this.key);
		return sum.digest('hex');
	case 'aes256':
		var cipher = crypto.createCipher('aes256', this.key);
		var crypted = cipher.update(value, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	default:
		return value;
	}
};

/**
 * 検索時に変換する
 * @method  loadConvert
 * @param  {String} value
 * @return {String} value
 */
Field.prototype.conditionConvert = function conditionConvert (value) {
	'use strict';
	if (!this.crypto || !is(String, value)) {
		return value;
	}
	var sum;
	switch(this.crypto) {
	case 'md5':
		sum = crypto.createHash('md5');
		sum.update(value + this.key);
		return sum.digest('hex');
	case 'sha1':
		sum = crypto.createHash('sha1');
		sum.update(value + this.key);
		return sum.digest('hex');
	case 'aes256':
		var cipher = crypto.createCipher('aes256', this.key);
		var crypted = cipher.update(value, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	default:
		return value;
	}
};

//モジュール
module.exports = exports = Field;