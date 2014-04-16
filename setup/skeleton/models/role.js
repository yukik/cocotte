console.log('require ' + __filename);

var schema = {
	name: 'role'
  , caption: '権限'
  , fields: {
		group: {type: 'text'  , caption: '所属'    }
	  , user : {type: 'text'  , caption: 'ユーザー'}
	  , level: {type: 'number', caption: 'レベル'  , required: true, min: 0, max: 10, defaultTo: 10}
	}
  , primaryFields: ['group', 'user']
};

module.exports = exports = schema;


