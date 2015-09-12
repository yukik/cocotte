var home = {

	/**
	 * 初期処理
	 */
	setting: function setting () {
		'use strict';
		//フォーカス時文字を全選択
		$('#group,#user,#password').focus(
			function () { $(this).select(); }
		);
		$('#group').focus();
	}

	/**
	 * ログイン処理
	 */
  , login: function login () {
		'use strict';
		var group = $('#group').val()
		  , user = $('#user').val()
		  , password = $('#password').val()
		  , data;

		// 入力チェック
		if(group === '' || user === '' || password === '') {
			$('#message').text('所属/ユーザーID/パスワードのいずれかが入力されていません');
		} else {
			$('#message').text('');
			data = {group: group, user: user, password: password};
			$.post('auth', data, home.login_cb);
		}
	}

	/**
	 * ログイン処理（コールバック）
	 * @param  {Object} data
	 */
  , login_cb: function login_cb (res) {
		'use strict';
		if (res.message) {
			$('#message').text(res.message);
		} else {
			location.href = '/';
		}
	}
};

$(home.setting);
