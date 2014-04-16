console.log('require ' + __filename);
var helper = require('cocotte/model/helper');

var model = {
	name: 'group'
  , caption: '所属'
  , fields: {
		name: {type: 'text', caption: '名前', primary: true}
//	  , age : {type: 'number', caption: '年齢'}
//	  , star: true
	}
};

module.exports = exports = model;

helper.test(model);
// helper.help();

