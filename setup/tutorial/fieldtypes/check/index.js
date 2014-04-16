console.log('require ' + __filename);
var helper = require('cocotte/fieldtype/helper')
  , is     = require('cocotte/tools/is');

/**
 * チェック型
 *
 * 定義する際はhelper.help()でプロパティを確認してください
 * 
 * @class FieldType.CheckField
 * @constructor 
 * @extends FieldType
 * @param {Object} schema 
 */
var Field = function CheckField (schema) {
	'use strict';
	schema = Field.sanitize(schema);
	schema.__proto__ = this;
	return schema;
};

helper.inherits(Field);

/**
 * 許可定義プロパティ
 * @property {Object} schemaKeys
 */
Field.schemaKeys = {
	type: '         {String}   フィールド型。check固定'
  , caption: '      {String}   表示名'
  , readonly: '     {Boolean}  読取専用'
  , customConvert: '{Function} 変換 ({Mixed} oldValue) => {Boolean} newValue'
  , customValid: '  {Function} 検証 ({Boolean} value) => {Error} err'
  , defaultTo: '    {Boolean}  既定値'
  , filterTo: '     {Boolaan}  条件'
};

/**
 * 定義無害化
 * @param  {Object} schema
 * @param  {Object} blongDatasource
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

	// readonly
	helper.sanitizeReadonly(schema, errs);

	// convert
	helper.sanitizeCustomConvert(schema, errs);

	// valid
	helper.sanitizeCustomValid(schema, errs);

	// defaultTo / filterTo
	helper.sanitizeSet(
		  schema
		, Field
		, ['defaultTo', 'filterTo']
		, errs);

	// 無害化フラグ
	schema.sanitize = true;

	return schema;
};

/**
 * フィールド名
 * @property {String} name
 * @default check1
 */
Field.prototype.name = 'check1';

/**
 * フィールド型
 * @property {String} type
 * @default check
 * @readOnly
 */
Field.prototype.type = 'check';

/**
 * 表示名
 * @property {String} caption
 * @default  チェック1
 */
Field.prototype.caption = 'チェック1';

/**
 * 既定値
 * @property {Boolean} defaultTo
 */
Field.prototype.defaultTo = false;

/**
 * 必須検証
 * チェックは行わない
 * @method requiredValid
 * @return {Number} result
 */
Field.prototype.requiredValid = null;

/**
 * 変換
 * @method convert
 * @param  {Mixed}  value
 * @return {Boolean} value
 */
Field.prototype.convert = function convert (value) {
	'use strict';
	if (is(Boolean, value)) {
		return value;

	} else if (value === null || value === undefined) {
		return false;

	} else {
		return new Error('値が真偽値型ではありません');

	}
};

/**
 * 検証
 * 表示・保存の際は、callbackの第2引数を新しい値として使用する必要があります
 * @method valueValid
 * @param  {Boolean}  value 
 *                        入力データ
 * @return {Error} err
 */
Field.prototype.valueValid = function valueValid (value, options) {
	'use strict';

	var checkReadonly = true;
	if (is(Object, options)) {
		checkReadonly = options.readonly !== false;
	}

	if (checkReadonly && this.readonly) {
		return new Error('読取専用です');

	} else if (!is(Boolean, value)) {
		return new Error('真偽値型ではありません');

	}
	return null;
};

module.exports = exports = Field;


