var valid = {};

valid.tab = function tab (subkey, value) {
	if (!subkey || subkey.length > 20) {
		return new Error('サブキー(20字以内)が設定されていません');
	} else if (!is(Number, value)) {
		return new Error('数値ではありません');
	}
};

module.exports = exports = valid;