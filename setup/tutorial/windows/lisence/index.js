console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title   : 'ライセンス'
  , contents: [
        helper.text(__dirname, 'license')
      , helper.html(__dirname, 'menu')
    ]
};

module.exports = exports = win;
