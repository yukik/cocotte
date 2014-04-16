require('../../../../global.js');

/*
 * 時刻型の計算をテスト
 */

var assert = require('assert')
  , dt = require('../../lib/fieldtype/datetime/time')
  , prop = dt.getProperties();


//console.dir(prop);

/*
 *		String　端数のでない時刻に設定
 *			now    : 行作成日時
 *			hours  : 行作成時の一番近いx時00分。
 *			half   : 行作成時の一番近いx時00分またはx時30分
 *			quarter: 行作成時の一番近いx時00分,x時15分,x時30分,x時45分
 *			ten    : 行作成時の一番近いx時00分,10分,20分,30分,40分,50分
 *			minutes: 行作成時の一番近いx時x分0秒
 *			
 *			文字列の前に数字を入れると計算対象を行作成時から間隔分ずらす事が出来る
 *			例）10:27:30に行を作成し既定値が2tenだった場合、基準10:47:30 => 10:50
 *			
 *			文字列の後ろに追加する記号により次のように既定値がかわる
 *			何も追加しないと前後の一番近い時刻。+では基準時刻より後、-では基準時刻より前
 */

describe ('テスト', function () {



	it ('calcDateTime', function () {

		var test = [
			//hours
			['10:00',   'hours',  '10:00']
		  , ['10:00',   'hours+', '10:00']
		  , ['10:00',   'hours-', '10:00']
		  , ['10:00',  '1hours',  '11:00']
		  , ['10:00',  '1hours+', '11:00']
		  , ['10:00',  '1hours-', '11:00']
		  , ['10:00', '-1hours',   '9:00']
		  , ['10:00', '-1hours+',  '9:00']
		  , ['10:00', '-1hours-',  '9:00']

		  , ['10:10',   'hours',  '10:00']
		  , ['10:10',   'hours+', '11:00']
		  , ['10:10',   'hours-', '10:00']
		  , ['10:10',  '1hours',  '11:00']
		  , ['10:10',  '1hours+', '12:00']
		  , ['10:10',  '1hours-', '11:00']
		  , ['10:10', '-1hours',   '9:00']
		  , ['10:10', '-1hours+', '10:00']
		  , ['10:10', '-1hours-',  '9:00']

		  , ['10:30',   'hours',  '11:00']
		  , ['10:30',   'hours+', '11:00']
		  , ['10:30',   'hours-', '10:00']
		  , ['10:30',  '1hours',  '12:00']
		  , ['10:30',  '1hours+', '12:00']
		  , ['10:30',  '1hours-', '11:00']
		  , ['10:30', '-1hours',  '10:00']
		  , ['10:30', '-1hours+', '10:00']
		  , ['10:30', '-1hours-',  '9:00']

		  , ['10:50',   'hours',  '11:00']
		  , ['10:50',   'hours+', '11:00']
		  , ['10:50',   'hours-', '10:00']
		  , ['10:50',  '1hours',  '12:00']
		  , ['10:50',  '1hours+', '12:00']
		  , ['10:50',  '1hours-', '11:00']
		  , ['10:50', '-1hours',  '10:00']
		  , ['10:50', '-1hours+', '10:00']
		  , ['10:50', '-1hours-',  '9:00']

			//half
		  , ['10:00',   'half',  '10:00']
		  , ['10:00',   'half+', '10:00']
		  , ['10:00',   'half-', '10:00']
		  , ['10:00',  '1half',  '10:30']
		  , ['10:00',  '1half+', '10:30']
		  , ['10:00',  '1half-', '10:30']
		  , ['10:00', '-1half',   '9:30']
		  , ['10:00', '-1half+',  '9:30']
		  , ['10:00', '-1half-',  '9:30']

		  , ['10:10',   'half',  '10:00']
		  , ['10:10',   'half+', '10:30']
		  , ['10:10',   'half-', '10:00']
		  , ['10:10',  '1half',  '10:30']
		  , ['10:10',  '1half+', '11:00']
		  , ['10:10',  '1half-', '10:30']
		  , ['10:10', '-1half',   '9:30']
		  , ['10:10', '-1half+', '10:00']
		  , ['10:10', '-1half-',  '9:30']

		  , ['10:15',   'half',  '10:30']
		  , ['10:15',   'half+', '10:30']
		  , ['10:15',   'half-', '10:00']
		  , ['10:15',  '1half',  '11:00']
		  , ['10:15',  '1half+', '11:00']
		  , ['10:15',  '1half-', '10:30']
		  , ['10:15', '-1half',  '10:00']
		  , ['10:15', '-1half+', '10:00']
		  , ['10:15', '-1half-',  '9:30']

		];

		test.forEach(function(ts) {

			var x = dt.calc(prop, ts[1], ts[0]);
			var y = dt.convertToTime(ts[2]);

			var xx = Array.isArray(x) ? x[0] * 3600 + x[1] * 60 + x[2] : null;
			var yy = Array.isArray(y) ? y[0] * 3600 + y[1] * 60 + y[2] : null;
			if (xx !== yy) {
				console.log(ts);
				console.log(x);
				console.log(y);
			}

			assert.equal(xx, yy);

		});

	});

});