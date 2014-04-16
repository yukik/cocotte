console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title: 'Function API'
  , contents: [
		helper.html(__dirname, '00.fx')
	  , helper.html(__dirname, '01.create')
	  , helper.html(__dirname, '02.preset')
	]
  , container: helper.container(__dirname)
};

module.exports = exports = win;