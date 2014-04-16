console.log('require ' + __dirname);

var win = {
	title   : 'ローカル変数'
  , contents: '<input name="val1" data-script="change:local" />' +
              '<input name="val2" data-script="keyup:local" />'
  , valid   : { val1: function () {}
			  , val2: function () {}}
};

module.exports = exports = win;