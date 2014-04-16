//require('../../../../global.js');

/*
 * 日付型の計算をテスト
 */

var assert = require('assert')
  , dt = require('../../lib/fieldtype/datetime/date')
  , prop = dt.getProperties()
  , cal  = prop.calendar;

cal.setDefault('8 - 21')
cal.openMon();
cal.openTue();
cal.openWed('8-12, 12:30-21:30');
cal.openThu();
cal.openFri('8-12');
cal.close('2013-6-3');
cal.close('2013-6-4');
cal.open( '2013-6-5', '12-18');
cal.open( '2013-6-6', '9-12, 13-22:30');
cal.open( '2013-6-9', null, '感謝祭');
cal.close('2013-6-10', '臨時休業');
cal.open('2013-6-18', '18-26'); //24時以降の入力も可能

console.log(cal.calendar('2013-6-1', '2013-6-15'));


var todayMill = parseInt(new Date().getTime() / 86400000) * 86400000;


describe ('テスト', function () {

	it ('calcDate', function () {

		var test = [
			//[x] day(s)       : [x]日後
			['2013-06-07', 'days',   '2013-06-08']
		  , ['2013-06-07', '3days',  '2013-06-10']
			//[x] week(s)      : [x]週間後
		  , ['2013-06-07', 'weeks',  '2013-06-14']
		  , ['2013-06-07', '3weeks', '2013-06-28']
			//[x] month(s)     : [x]ヶ月後
		  , ['2013-06-07', 'months', '2013-07-07']
		  , ['2013-06-07', '3months','2013-09-07']
			//[x] year(s)      : [x]年後
		  , ['2013-06-07', 'years',  '2014-06-07']
		  , ['2013-06-07', '3years', '2016-06-07']
			// today/now        : 本日 
		  , ['2013-06-07', 'today', new Date(todayMill)]
			// tomorrow         : 翌日
		  , ['2013-06-07', 'tomorrow',new Date(todayMill + 86400000)]
			// yesterday        : 昨日
		  , ['2013-06-07', 'yesterday', new Date(todayMill - 86400000)]
			// [x] business     : 指定日からのx営業日後
		  , ['2013-06-07', 'business', '2013-06-07']
		  , ['2013-06-07', '3business', '2013-06-12']
			// [x] holiday(s)   : 指定日からx番目の休日
		  , ['2013-06-07', 'holidays',  '2013-06-08']
		  , ['2013-06-07', '3holidays', '2013-06-15']
			// [x] date         : 指定日以降の当月もしくは翌月の[x]日
		  , ['2013-06-07', 'date', null]
		  , ['2013-06-07', '3date', '2013-07-03']
			// first (date)     : 指定日以降の月の1日。[x]を指定した場合は指定日以降の[x]月1日
		  , ['2013-06-07', 'first', '2013-07-01']
		  , ['2013-06-07', '3first', '2014-03-01']
			// end/last (date)  : 指定日の月の月末。[x]を指定した場合は指定日以降の[x]月の月末
		  , ['2013-06-07', 'end', '2013-06-30']
		  , ['2013-06-07', '3end', '2014-03-31']
			// [x] sunday/sun   : 指定日以降の月の第[x]日曜日。[x]省略時は指定日以降の一番最初の日曜日
			// [x] monday/mon   : 指定日以降の月の第[x]月曜日。[x]省略時は指定日以降の一番最初の月曜日
			// [x] tuesday/tue  : 指定日以降の月の第[x]火曜日。[x]省略時は指定日以降の一番最初の火曜日
			// [x] wednesday/wed: 指定日以降の月の第[x]水曜日。[x]省略時は指定日以降の一番最初の水曜日
			// [x] thursdaythu  : 指定日以降の月の第[x]木曜日。[x]省略時は指定日以降の一番最初の木曜日
			// [x] friday/fri   : 指定日以降の月の第[x]金曜日。[x]省略時は指定日以降の一番最初の金曜日
			// [x] saturday/sat : 指定日以降の月の第[x]土曜日。[x]省略時は指定日以降の一番最初の土曜日
		  , ['2013-06-07', 'sun', '2013-06-09']
		  , ['2013-06-07', 'mon', '2013-06-10']
		  , ['2013-06-07', 'tue', '2013-06-11']
		  , ['2013-06-07', 'wed', '2013-06-12']
		  , ['2013-06-07', 'thu', '2013-06-13']
		  , ['2013-06-07', 'fri', '2013-06-07']
		  , ['2013-06-07', 'sat', '2013-06-08']

		];

		test.forEach(function(ts) {

			var c = dt.calc(prop, ts[1], ts[0]);
			var x = c ? c.valueOf() : null;
			var y = ts[2] ? new Date(ts[2]).valueOf() - 9 * 3600 * 1000 : null;

			if (x !== y) {
				console.log(ts);
				console.log(c);
			}

			assert.equal(x, y);
		});

	});

});