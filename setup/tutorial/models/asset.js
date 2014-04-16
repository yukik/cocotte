console.log('require ' + __filename);

var helper = require('cocotte/model/helper');
/**
 * 土地
 * @class Models.asset
 */
var model = {
	name: 'asset'
  , caption: '土地'
  , fields: {
		name: {type: 'text', caption: '名称'}
	  , price: {type: 'number', caption: '価格'}
	}
};

module.exports = exports = model;
helper.test(model);
// helper.help();