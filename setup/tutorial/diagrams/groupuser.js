console.log('require ' + __filename);

var helper = require('cocotte/diagram/helper');

/**
 * 所属ユーザーの確認
 * @class BuiltInDiagram.groupuser
 */
var diagram = {
	name : 'groupuser'
  , datasources: {
		user: true
	  , group: true
	  , role: true
	}
  , relations: [
		'user.name = role.user'
	]
};

module.exports = exports = diagram;
helper.test(diagram);