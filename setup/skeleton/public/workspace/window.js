/*
 * マルチウインドウを管理
 *
 * ■ワークスペース
 *	Win.createWorkspace()で表示領域を作成します
 *	以下のエレメントが作成されます
 *	<div id="workspace">
 *		<div id="dragLayer"></div>
 *		<div id="dock"></div>
 *	</div>
 *	さらにそれぞれWin.workspaceEl,Win.dragLayerEl,Win.dockElに
 *	設定されます。独自のデザイン等を追加する場合は個別に設定してください
 *	dockは任意のため必要に応じて追加してください
 *
 * ■ウインドウ作成
 *	new Win('タイトル', 'HTMLコード')でウインドウを作成します
 *	またオプションを指定する事で挙動を細かく設定出来ます
 *	オプションについてはウインドウの項を参照
 *
 * ■セッション間同期
 *	Win.setSocket(socket)でセッション間同期を行います
 *	socketにはcocotte.Socketオブジェクトをインスタンス化して設定してください
 *	ウインドウの作成は、ローカルから行うとサーバでは管理されません
 *	Win.requestを使用する事でサーバで管理され同期対象になります
 */
(function (cocotte) {
	'use strict';

	var is = cocotte.tools.is;

	/**
	 * リスナー：ウインドウ作成
	 * @param  {String} err
	 * @param  {Object} options
	 */
	var onCreate = function onCreate (options) {
		Win.emit('toClient', {event: 'create', id: options.id, data: options});
		//ウインドウを作成して同期可能にします
		if (!Win.instances[options.id]) {
			var win = new Win (options.title, options.contents, options);
			win.serverSync = true;
		}
	};

	/**
	 * ウインドウ
	 *
	 * optionsの説明
	 *      id       : {String}	 ウインドウID             (省略時:自動採番)  
	 *                           既にinstancesに存在している場合は自動採番になります
	 *      name     : {String}	 ウインドウ名             (省略時:null)
	 *                           ビルトイン名です
	 *                           予め設定されているコンテンツを表示します
	 *                           指定しない場合は、ビルトインを使用しないで
	 *      mode     : {String}  表示の際の状態           (省略時:normal)
	 *                           normal, maximize, minimize, dialog, infoのいずれか
	 *                           挙動の違いについてはmodeのメンバの項を参照してください
	 *      template : {String}  ウインドウのテンプレート 
	 *                           (省略時:modeがdialogおよびinfo時はそれぞれdialogとinfo、それ以外はdefaultTo)
	 *                           任意のテンプレートを追加する場合はWin.templates, Win.minTemplatesに登録してください
	 *                           存在しないテンプレート名を指定したときはdefaultToが使用されます
	 *      size     : {Array}   サイズ [width, height]   (省略時:[300, 200])
	 *      resizable: {Boolean} サイズ変更をできるかどうか
	 *      position : {Array}   表示位置 [top, left]     (省略時:info, dialog時はセンタリング、その他はランダム)
	 *                           ランダムの表示領域はtop,leftの位置が画面4分割し左上の領域に入るように設定します
	 *      opener   : {Object}  オープナー情報
	 *                           このウインドウを開いたウインドウID/データソースID/行番号を設定します
	 *      closable : {Boolean} イベントから閉じる事ができるかどうかを設定します (省略時: true)
	 *                           closeエレメントからもしくはLayerを
	 *                           closeメソッドを直接呼び出す事で閉じる事は出来ます
	 *                           infoは閉じる手段のないウインドウです
	 *                           必ず代替の方法を用意してください
	 *      container: {String}  コンテンツの配置時に構造を設定する際に使用するHTML
	 *      active   : {Boolean} 表示時にアクティブにします
	 * 
	 * @param  {String}       title    ウインドウのタイトル (省略可能)
	 * @param  {String|Array} contents Htmlの文字列もしくはコンテンツデータです
	 * @param  {Object}       options  (省略可能)
	 */
	var Win = function Win (title, contents, options) {
		/*
		 * 引数判別
		 */
		switch(arguments.length) {
		case 1:
			contents = title;
			options = {};
			break;
		case 2:
			if (is(Object, contents)) {
				options = contents;
				contents = title;
			} else {
				this.title = title;
				options  = {};
			}
			break;
		case 3:
			this.title = title;
			break;
		default:
			options = {};
			break;
		}

		/**
		 * ウインドウIDの設定
		 */
		if (Win.instances[options.id]) {
			throw new Error('同じ名称のウインドウが存在します');
		} else if (options.id) {
			this.id = options.id;
		} else {
			this.id = Win.prefix + (++Win.lastNo);
		}

		/*
		 * ウインドウに任意の変数を設定する
		 */
		this.values = {};
		this.locals = options.locals || {};
		this.localListeners = {};

		/**
		 * ビルトイン名
		 */
		if (options.name) {
			this.name = options.name;
		}

		/**
		 * 状態
		 */
		var mode = 'normal';
		if (is(String, options.mode) && ~['maximize', 'minimize', 'dialog', 'info'].indexOf(options.mode)) {
			mode = options.mode;
		}

		/**
		 * テンプレート
		 * 
		 */
		if (is(String, options.template)) {
			this.template = options.template;
		} else if (mode === 'dialog') {
			this.template = 'dialog';
		} else if (mode === 'info') {
			this.template = 'info';
		}

		/**
		 * 表示サイズ
		 */
		if (is(Array, options.size) && is(Number, options.size[0]) && is(Number, options.size[1])) {
			this.size = [parseInt(options.size[0], 10), parseInt(options.size[1], 10)];
		}

		/**
		 * サイズ変更可能か
		 */
		if (options.resizable === false) {
			this.resizable = false;
		}

		/**
		 * 表示位置
		 */
		if (is(Array, options.position) && is(Number, options.position[0]) && is(Number, options.position[1])) {
			//値を設定
			this.position = [parseInt(options.position[0], 10), parseInt(options.position[1], 10)];
		} else if (~['dialog', 'info'].indexOf(mode)) {
			//中央に設定
			var area = $('#workspace')
			  , top  = Math.floor((area.height() - this.size[1]) / 2)
			  , left = Math.floor((area.width()  - this.size[0] ) / 2);
			this.position = [20 < top  ? top : 20, 20 < left ? left : 20];
		} else {
			//ランダムに設定
			var area2 = $(window.document.body);
			this.position = [Math.floor(Math.random() * area2.height() / 2) + 20,
							 Math.floor(Math.random() * area2.width()  / 2) + 20];
		}

		/**
		 * オープナーウインドウID
		 */
		if (is(Object, options.opener)) {
			this.opener = options.opener;
		}

		/** 
		 * イベントから閉じる事を制限
		 */
		if (options.closable === false) {
			this.closable = false;
		}

		/**
		 * ハンドラの設定
		 */
		this.dragStartHandler   = this.dragStartHandler.bind(this);
		this.dragStopHandler    = this.dragStopHandler.bind(this);
		this.resizeStartHandler = this.resizeStartHandler.bind(this);
		this.resizeStopHandler  = this.resizeStopHandler.bind(this);

		/** 
		 * メソッドの設定
		 */
		this.active          = this.active.bind(this);
		this.toggle          = this.toggle.bind(this);
		this.minimize        = this.minimize.bind(this);
		this.close           = this.close.bind(this);
		this.showChangeBoard = this.showChangeBoard.bind(this);
		this.showHelp        = this.showHelp.bind(this);

		/**
		 * インスタンスを保存
		 */
		Win.instances[this.id] = this;

		/**
		 * dock
		 */
		if (Win.dockEl && ~['normal', 'maximize', 'minimize'].indexOf(mode)) {
			var templateMin = Win.minTemplates[this.template] || Win.minTemplates.defaultTo;
			this.minWinEl = $(templateMin);
			this.putIn = this.putIn.bind(this);
			/**
			 * 最小化時
			 */
			if (mode === 'minimize') {
				this.minWinEl.addClass('winMinimize');
			}
			/**
			 * タイトル
			 */
			this.minTitleEl = $('.minTitle', this.minWinEl);
			this.minTitleEl.click(this.putIn);
			this.minTitleEl.text(title || this.id);
			/**
			 * 閉じるボタン
			 */
			this.minClose = $('.minClose', this.minWinEl);
			this.minClose.click(this.close);
			/**
			 * 追加
			 */
			Win.dockEl.append(this.minWinEl);
		}

		/**
		 * コンテンツのコンテナを作成
		 */
		this.container = new cocotte.Container(this, contents, options.container);

		if (cocotte.Script) {
			cocotte.Script.onCreate(this);
		}

		/**
		 * イベント発生
		 */
		Win.emit('create', this);

		/**
		 * 表示
		 */
		if (mode === 'minimize') {
			this.mode = 'minimize';
		} else {
			//表示
			this.sync(false).show(mode);
		}
	};

	/**
	 * ウインドウをサーバにリクエストします
	 * 既に開いている場合はアクティブにします
	 * 開いていない場合は表示します
	 *
	 * このメソッドはイベントハンドラに設定する事が出来ます
	 *
	 * @param  {Object|Event} options
	 *
	 * オプション
	 *  オプションはnew Win(title, contents, options)のoptionと同じ項目を設定します
	 *  またoptionはイベントを発生させたエレメントの属性に設定した場合も同様の動作をします
	 *  属性のprefixはdata-winです。data-winnameは必須です。指定がない場合は動作しません
	 *  requestだけに存在するオプションは以下の通りです。
	 *      addForce: 同じビルトインのウインドウが存在しても新しくリクエストします
	 *      field   : addForceの指定がない場合にfieldを指定した場合は同じfieldから開かれたウインドウで
	 *                ある場合にアクティブにし、それ以外はリクエストします。
	 */
	Win.request = function request (options) {
		/**
		 * エレメントからの発動
		 */
		if (this instanceof Element) {
			//エレメントからのイベント発生の場合は属性から取得
			options.stopPropagation();
			var ob        = $(this)
			  , name      = ob.data('winname')
			  , template  = ob.data('wintemplate')
			  , reg       = /^([0-9]{1,5}),([0-9]{1,5})$/
			  , size      = ob.data('winsize')
			  , position  = ob.data('winposition')
			  , mode      = ob.data('winmode')
			  , addForce  = ob.data('winaddforce')
			  , closable  = ob.data('winclosable');

			options = {};
			if (name) {
				//ビルトイン名のみ必須
				options.name = name;
			} else {
				//リクエスト中断
				return;
			}
			if (template) {
				options.template = template;
			}
			if (size) {
				var s = size.match(reg);
				if (s) {
					options.size = [parseInt(s[1], 10), parseInt(s[2], 10)];
				}
			}
			if (position) {
				var p = position.match(reg);
				if (p) {
					options.position = [parseInt(p[1], 10), parseInt(p[2], 10)];
				}
			}
			if (mode) {
				options.mode = mode;
			}

			//オープナー
			var opener = {}
			  , winEl  = ob.closest('.win')
			  , dsEl   = ob.closest('.datasource')
			  , rowEl  = ob.closest('.row')
			  , cellEl = ob.closest('.cell');

			if (winEl.length) {
				opener.winId = winEl.attr('id');
			}
			if (dsEl.length) {
				opener.datasource = dsEl.data('datasource');
			}
			if (rowEl.length) {
				opener.rowno = rowEl.data('rowno');
			}
			if (cellEl.length) {
				opener.field = cellEl.data('field');
			}
			options.opener = opener;

			if (addForce) {
				options.addForce = true;
			}
			if (closable === 'false') {
				options.closable = false;
			}
		} else if (is(String, options)) {
			/**
			 * 通常
			 */
			options = {name: options};
		} else if (!is(Object, options) || !is(String, options.name)) {
			return;
		}

		if (!options.addForce) {
			// 既に同じウインドウが存在する場合はputIn
			var win = Win.find(options.name, options.field);
			if (is(Win, win)) {
				win.putIn();
				return;
			}
		}

		/**
		 * 位置の指定がない場合は予めワークスペースサイズに合わせて設定します
		 */
		if (!options.position) {
			var area = $(window.document.body)
			  , top = Math.floor(Math.random() * area.height() / 2) + 20
			  , left= Math.floor(Math.random() * area.width()  / 2) + 20;
			options.position = [top, left];
		}

		//表示時の処理
		if (cocotte.Script) {
			cocotte.Script.onCreate(this);
		}

		// 同期発動
		Win.sync('request', options);
	};

	cocotte.tools.extendEvent(Win);

	/**
	 * リスナー：表示
	 * @param  {Object} data
	 */
	var onShow = function onShow (id) {
		Win.emit('toClient', {event: 'show', id: id});
		Win.instances[id].sync(false).show();
	};

	/**
	 * 表示
	 * @param {String} mode  初期値:normal, modeは初期化以外では指定しても無視されます
	 * @param {Function} callback ({Error} err, {Win} win) 省略可能
	 * @return メソッドチェーン
	 */
	Win.prototype.show = function show (mode, callback) {
		var err = null
		  , sync = this.sync();

		if (is(Function, mode)) {
			callback = mode;
			mode = 'normal';
		} else if (!mode) {
			mode = 'normal';
		}

		if (!Win.workspaceEl) {
			err = new Error('ワークスペースが存在しません');

		} else if (~['normal', 'maximize', 'dialog', 'info'].indexOf(this.mode)) {
			err = new Error('既に表示されています');

		} else  if (this.mode === 'minimize' && !~['normal', 'maximize'].indexOf(mode)) {
			err = new Error('最小表示時に選択出来るモードは通常表示もしくは最大表示です');

		} else {
			/**
			 * ウインドウ
			 */
			var win = $(Win.templates[this.template] || Win.templates.defaultTo);
			this.winEl = win;
			win.click(this.active);
			win.attr('id', this.id);

			/**
			 * タイトル
			 */
			this.titleEl = $('.winTitle', win);
			if (this.titleEl.length) {
				this.titleEl.text(this.title || this.id);
			} else {
				this.titleEl = null;
			}

			/**
			 * ステータス
			 */
			this.statusEl = $('.winStatus', win);

			/**
			 * 最大化ボタン
			 */
			this.maximizeEl = $('.winMaximize', win);
			if (this.maximizeEl.length) {
				this.maximizeEl.click(this.toggle);
			} else {
				this.maximizeEl = null;
			}

			/**
			 * 最小化ボタン
			 */
			this.minimizeEl = $('.winMinimize', win);
			if (this.minimizeEl.length) {
				this.minimizeEl.click(this.minimize);
			} else {
				this.minimizeEl = null;
			}

			/**
			 * 閉じるボタン
			 */
			this.closeEl = $('.winClose', win);
			if (this.closeEl.length) {
				if (this.closable) {
					this.closeEl.click(this.close);
				} else {
					this.closeEl.remove();
				}
			} else {
				this.closeEl = null;
			}

			/**
			 * チェンジボード
			 */
			this.changeBoardEl = $('.winChangeBoard', win);
			if (this.changeBoardEl.length){
				this.changeBoardEl.click(this.showChangeBoard);
			} else {
				this.changeBoardEl = null;
			}

			/**
			 * ヘルプ
			 */
			this.helpEl = $('.winHelp', win);
			if (this.helpEl.length) {
				this.helpEl.click(this.showHelp);
			} else {
				this.helpEl = null;
			}

			/**
			 * ドラッグ用レイヤー
			 */
			this.dragLayerEl = $('<div class="winDragLayer"><div>');
			win.append(this.dragLayerEl);

			/**
			 * コンテンツの設定
			 */
			this.contentsEl = $('.winContents', win);
			this.container.show(this);
			if (is(String, this.name)) {
				this.contentsEl.addClass(this.name + 'Win');
			}

			/**
			 * ダイアログもしくは情報ウインドウの場合は
			 * モーダルレイヤーを追加する
			 */
			if (~['dialog', 'info'].indexOf(mode)) {
				this.modalLayerHandler = this.modalLayerHandler.bind(this);
				this.modalLayerEl = $('<div class="modalLayer"></div>');
				this.modalLayerEl.css('zIndex', Win.zIndex + 1);
				this.modalLayerEl.click(this.modalLayerHandler);
				Win.workspaceEl.append(this.modalLayerEl);
			}

			/**
			 * 要素を追加し表示
			 */
			Win.workspaceEl.append(win);

			/**
			 * 追加後にポートレットShowメソッドを実行
			 */
			this.container.afterShow(this);

			/**
			 * コントロール出来るウインドウ
			 */
			switch (mode) {
			case 'normal':
			case 'dialog':
			case 'info':
				/**
				 * ドラッグ移動
				 * normal、dialog、infoのみ
				 * handleクラスが追加されたエレメントが存在する場合はハンドラに設定する
				 */
				win.draggable({handle: '.winHandle', start: this.dragStartHandler, stop: this.dragStopHandler});
				/**
				 * サイズ変更
				 */
				if (this.resizable) {
					win.resizable({handles: 'all', start: this.resizeStartHandler, stop:this.resizeStopHandler});
				}
				/**
				 * サイズ、表示位置の設定
				 */
				win.animate({top : this.position[0], left  : this.position[1]
						   , width: this.size[0]    , height: this.size[1]});
				/**
				 * dock
				 */
				if (this.minWinEl) {
					this.minWinEl.removeClass('winMinimize');
				}
				/**
				 * 同期
				 */
				if (sync) {
					Win.sync('show', this.id);
				}
				break;
			case 'minimize':
				throw new Error('未到達コード');
			case 'maximize':
				/**
				 * 最大化実行
				 */
				win.addClass('winMax');
				break;
			}

			this.mode = mode;

			this.sync(false).active();

			//表示時の処理
			if (cocotte.Script) {
				cocotte.Script.onShow(this);
			}

			Win.emit('show', this);
			if (this.name) {
				Win.emit('show ' + this.name);
			}
		}

		return this;
	};

	/**
	 * エレメントを取得する
	 * @method  el
	 * @param  {String} selector
	 * @return {jQUery} elements
	 */
	Win.prototype.el = function el (selector) {
		if (this.contentsEl) {
			return $(selector, this.contentsEl);
		} else {
			return null;
		}
	};

	/**
	 * ウインドウID
	 * @type {String}
	 */
	Win.prototype.id = null;

	/**
	 * タイトル
	 * @type {String}
	 */
	Win.prototype.title = 'New Window';

	/**
	 * タイトルエレメント
	 * @type {Element}
	 */
	Win.prototype.titleEl = null;

	/**
	 * リスナー：タイトルを設定
	 * @param  {Object} data
	 */
	var onSetTitle = function onSetTitle (data) {
		Win.emit('toClient', {event: 'setTitle', id: data.id, data: data});
		Win.instances[data.id].sync(false).setTitle(data.title);
	};

	/**
	 * タイトルを変更する
	 * @param {String}   title
	 * @param {Function} callback ({Error} err, {Win} win)
	 * @return メソッドチェーン
	 */
	Win.prototype.setTitle = function setTitle (title, callback) {
		var sync = this.sync()
		  , err  = null
		  , data = {id: this.id, title: title};
		if (is(String, title)) {
			this.title = title;
			if (this.titleEl) {
				this.titleEl.text(title);
			}
			if (this.minTitleEl) {
				this.minTitleEl.text(title);
			}
			//
			Win.emit('setTitle', this);
			if (sync) {
				Win.sync('setTitle', data, callbackSetTitle);
			}
		} else {
			err = new Error('タイトルが文字列ではありません');
		}
		if (is(Function, callback)) {
			callback(err, this);
		}
		return this;
	};

	/**
	 * コールバック
	 * @param  {String} err
	 * @param  {Object} data
	 */
	var callbackSetTitle = function callbakSetTitle(err, data) {
		if (err && is(Object, data) && is(String, data.id) && is(String, data.title)) {
			//設定に失敗した場合は戻す
			Win.instances[data.id].sync(false).setTitle(data.title);
			new Win('Error:タイトル設定', err, {mode: 'info'});
		}
	};

	/**
	 * 状態
	 *  null    : 初期化時
	 *              optionに指定がない場合は、normalになる
	 *              初期化が終わった後はnullに戻る事はない
	 *  normal  : 通常の大きさ
	 *              ・移動およびサイズ変更を行う事が出来る
	 *              ・dockにリストされる
	 *  maximize: 最大化
	 *              ・ワークスペースの領域いっぱいに表示する事が出来る
	 *              ・dockにリストされる
	 *              ・ドラッグ移動およびリサイズは出来ない
	 *  minimize: 最小化
	 *              ・ワークスペースからは非表示になる
	 *              ・dockにリストされる
	 *              ・dockから選択する事でnormalに戻す事が出来る
	 *  info    : 情報 
	 *              ・レイヤーが追加され、手前に表示される
	 *              ・レイヤーをクリックするとウインドウは閉じる (closable=falseで制御可能)
	 *              ・dockにはリストされない
	 *              ・minimizeを呼び出すと代わりにcloseする
	 *  dialog  : ダイアログ
	 *              ・レイヤーが追加され、手前に表示される
	 *              ・レイヤーをクリックしてもウインドウは閉じない
	 *              ・dockにはリストされない
	 *              ・minimizeを呼び出すと代わりにcloseする
	 * @type {String}
	 */
	Win.prototype.mode = null;

	/**
	 * テンプレート名
	 * @type {String}
	 */
	Win.prototype.template = 'defaultTo';

	/**
	 * 位置
	 * @type {Array}
	 */
	Win.prototype.position = [0, 0];

	/**
	 * サイズ
	 * @type {Array}
	 */
	Win.prototype.size = [600, 400];

	/**
	 * サイズ変更可能か
	 * @type {Boolean}
	 */
	Win.prototype.resizable = true;

	/**
	 * オープナー
	 * このウインドウを開いたウインドウID/データソースID/行番号/フィールド
	 * @type {Object}
	 */
	Win.prototype.opener = null;

	/**
	 * ウインドウエレメント
	 * @type {Element}
	 */
	Win.prototype.winEl = null;

	/**
	 * ウインドウのアクティブが発生
	 * @param  {Object} id
	 */
	var onActive = function onActive (id) {
		Win.emit('toClient', {event: 'active', id: id});
		Win.instances[id].sync(false).active();
	};

	/**
	 * アクティブ
	 * active
	 * @type   {Function} 
	 * @param  {Object}   e
	 * @return メソッドチェーン
	 */
	Win.prototype.active = function active (callback) {
		if(callback && callback.stopPropagation) {
			callback.stopPropagation();
			callback = null;
		}
		var self = this
		  , sync = self.sync()
		  , err  = null;
		if (Win.active === self) {
			err = new Error('既にアクティブです');
		} else if (self.mode === 'minimize') {
			err = new Error('最小化状態のウインドウはアクティブには出来ません');
		} else {
			// 新しくアクティブになったウインドウのクラス追加
			self.winEl.addClass('winActive');
			if (self.minWinEl) {
				self.minWinEl.addClass('winActive');
			}
			// 今までアクティブだったウインドウのクラス削除
			if (Win.active) {
				Win.active.winEl.removeClass('winActive');
				if (Win.active.minWinEl) {
					Win.active.minWinEl.removeClass('winActive');
				}
			}
			// アクティブ変更
			Win.active = self;
			// レイヤーを最前面に表示
			if (self.modalLayerEl) {
				self.modalLayerEl.css('zIndex', Win.zIndex + 1);
			}
			// ウインドウを最前面に表示
			Win.zIndex += 2;
			self.winEl.css('zIndex', Win.zIndex);
			// イベント発動および同期
			Win.emit('active', self);
			if (sync) {
				Win.sync('active', self.id);
			}
		}
		if (is(Function, callback)) {
			callback(err, self);
		}
		return self;
	};

	/**
	 * ステータスエレメント
	 * ウインドウへのメッセージはすべてここにに表示されます
	 * @type {Element}
	 */
	Win.prototype.statusEl = null;

	/**
	 * ステータス変更が発生
	 * @param  {Object} id ウインドウID
	 */
	var onChangeStatus = function onChangeStatus (data) {
		Win.emit('toClient', {event: 'changeStatus', id: data.id, data: data});
		Win.instances[data.id].sync(false).changeStatus(data.message, data.level);
	};

	/**
	 * メッセージをステータスに追加します
	 * levelはメッセージのspanエレメントにクラスを付加します
	 * 標準クラスはinfo, alert, errorです
	 * @param {String} message
	 * @param {String} level   省略時はinfo
	 * @return メソッドチェーン
	 */
	Win.prototype.changeStatus = function changeStatus (message, level) {
		var sync = this.sync();
		if (!is(String, level)) {
			level = 'info';
		}
		if (this.statusEl) {
			this.statusEl.empty()
				.append($('<span></span>').addClass(level).text(message));
			if (sync) {
				Win.sync('changeStatus', {id: this.id, message: message, level: level});
			}
		}
		return this;
	};

	/**
	 * 最小化ボタンエレメント
	 * @type {Element}
	 */
	Win.prototype.maximizeEl = null;

	/**
	 * 最大化と通常表示を切り替える
	 * 表示トグルのイベントハンドラの取得
	 * 最大化時は通常表示に、通常表示時は最大化を行います
	 * maximizeElに設定されるハンドラはmaximizeではなくtoggleになります
	 * @param {Function} callback
	 * @return メソッドチェーン
	 */
	Win.prototype.toggle = function toggle (callback) {
		if(callback && callback.stopPropagation) {
			callback.stopPropagation();
			callback = null;
		}
		var self = this
		  , err  = null;
		if (self.mode === 'normal') {
			// 通常 -> 最大化
			self.maximize();
		} else if (self.mode === 'maximize') {
			// 最大化 -> 通常
			self.normal();
		} else {
			err = new Error('最大化でも通常表示でもありません');
		}
		if (is(Function, callback)) {
			callback(err, this);
		}
		return self;
	};

	/**
	 * ウインドウの通常表示が発生
	 * @param  {String} id
	 */
	var onNormal = function onNormal (id) {
		Win.emit('toClient', {event: 'normal', id: id});
		Win.instances[id].sync(false).normal();
	};

	/**
	 * 通常表示変更します
	 * 最大化表示以外の場合は動作しません
	 * @return メソッドチェーン
	 */
	Win.prototype.normal = function normal () {
		var sync = this.sync()
		  , err  = null;
		if (this.mode === 'maximize') {
			this.mode = 'normal';
			var winEl = this.winEl;
			winEl.removeClass('winMax');
			winEl.css({top: this.position[0], left: this.position[1], width: this.size[0], height: this.size[1]});
			if (this.resizable) {
				winEl.resizable({handles: 'all', start: this.active, stop: this.resizeStopHandler});
			}
			winEl.draggable({handle: '.winHandle', start: this.dragStartHandler, stop: this.dragStopHandler});
			if (sync) {
				Win.sync('normal', this.id);
			}
		} else {
			err = new Error('最大表示である必要があります');
		}
		Win.emit('normal', err, this.id);
		return this;
	};

	/**
	 * ウインドウの最大化が発生
	 * @param  {String} id
	 */
	var onMaximize = function onMaximize (id) {
		Win.emit('toClient', {event: 'maximize', id: id});
		Win.instances[id].sync(false).maximize();
	};

	/**
	 * 最大化
	 * @return メソッドチェーン
	 */
	Win.prototype.maximize = function maximize () {
		var sync = this.sync()
		  , err  = null;
		if (this.mode === 'normal') {
			this.mode = 'maximize';
			var winEl = this.winEl;
			winEl.addClass('winMax');
			winEl.attr('style', 'position: absolute; z-index:' + Win.zIndex);
			if (this.resizable) {
				winEl.resizable('destroy');
			}
			winEl.draggable('destroy');
			if (sync) {
				Win.sync('maximize', this.id);
			}
		} else {
			err = new Error('通常表示である必要があります');
		}
		Win.emit('maximize', err, this.id);
		return this;
	};

	/**
	 * 最小化ウインドウ
	 * @type {Element}
	 */
	Win.prototype.minWinEl = null;

	/**
	 * 最小化ボタンエレメント
	 * @type {Element}
	 */
	Win.prototype.minimizeEl = null;

	/**
	 * ウインドウの最小化が発生
	 * @param  {String} id
	 */
	var onMinimize = function onMinimize (id) {
		Win.emit('toClient', {event: 'minimize', id: id});
		Win.instances[id].sync(false).minimize();
	};

	/**
	 * 最小化
	 * @param  {Function} callback ({Error} err, {Win} win)
	 * @return メソッドチェーン
	 */
	Win.prototype.minimize = function minimize (callback) {
		var self = this
		  , sync = self.sync()
		  , err  = null;
		if(callback && callback.stopPropagation) {
			callback.stopPropagation();
			callback = null;
		}
		if (!self.minWinEl) {
			err = new Error('dockが存在しません');
		} else if (~['normal', 'maximize'].indexOf(self.mode)) {
			winElRemove(self);
			self.minWinEl.removeClass('winActive');
			self.minWinEl.addClass('winMinimize');
			if (Win.active === self) {
				Win.active = null;
			}
			self.mode = 'minimize';
			if (sync) {
				Win.sync('minimize', self.id);
			}
			Win.emit('minimize', self.id);
		} else {
			err = new Error('通常表示もしくは最大表示のウインドウである必要があります');
		}
		if (is(Function, callback)) {
			callback(err, self);
		}
		return self;
	};

	/**
	 * イベントを使用して閉じる事が出来るかどうか
	 * ユーザーが制御できない用にする事が出来ます
	 * @type {Boolean}
	 */
	Win.prototype.closable = true;

	/**
	 * 閉じるボタンエレメント
	 * @type {Element}
	 */
	Win.prototype.closeEl = null;


	/**
	 * ウインドウのクローズが発生
	 * @param  {String} id ウインドウID
	 */
	var onClose = function onClose (id) {
		Win.emit('toClient', {event: 'close', id: id});
		Win.instances[id].sync(false).close();
	};

	/**
	 * 閉じる
	 * @param {Function} callback ({Error} err, {Win} win)
	 * @return メソッドチェーン
	 */
	Win.prototype.close = function close (callback) {
		var self = this
		  , sync = self.sync();
		if (callback && callback.stopPropagation) {
			callback.stopPropagation();
			callback = null;
		}

		if (self.container) {
			self.container.destroy();
		}

		//DOMツリーから削除
		winElRemove(self);

		delete self.active;
		delete self.toggle;
		delete self.minimize;
		delete self.close;
		delete self.showChangeBoard;
		delete self.showHelp;
		delete self.dragStartHandler;
		delete self.dragStopHandler;
		delete self.resizeStartHandler;
		delete self.resizeStopHandler;
		delete self.modalLayerHandler;
		delete self.cutIn;
		delete Win.instances[self.id];
		if (Win.active === self) {
			Win.active = null;
		}
		if (self.minWinEl) {
			self.minWinEl.remove();
			delete self.minWinEl;
		}
		if (sync) {
			Win.sync('close', self.id);
		}
		Win.emit('close', self.id);
		if (is(Function, callback)) {
			callback(null, self);
		}
		return self;
	};

	/**
	 * チェンジボードエレメント
	 * @type {Element}
	 */
	Win.prototype.changeBoardEl = null;

	var onShowChangeBoard = function onShowChangeBoard (id) {
		Win.emit('toClient', {event: 'showChangeBoard', id: id});
		Win.instances[id].sync(false).showChangeBoard();
	};

	/**
	 * チェンジボードの表示
	 * @param {Object} e
	 * @return メソッドチェーン
	 */
	Win.prototype.showChangeBoard = function showChangeBoard (callback) {
		var self = this
		  , sync = self.sync()
		  , err = null;
		if (callback && callback.stopPropagation) {
			callback.stopPropagation();
			callback = null;
		}
		new Win('チェンジボード', 'チェンジボードのイベント発生');
		Win.emit('showChangeBoard', self);
		if (sync) {
			Win.sync('showChangeBoard', self.id);
		}
		if (is(Function, callback)) {
			callback(err, self);
		}
		return self;
	};

	/**
	 * ヘルプボタンエレメント
	 * @type {Element}
	 */
	Win.prototype.helpEl = null;

	/**
	 * ヘルプの表示
	 * @type {Function}
	 */
	Win.prototype.showHelp = function showHelp (callback) {
		var self = this
		  , err = null;
		new Win('ヘルプ', 'ヘルプのイベント発生');
		Win.emit('showHelp', self);
		if (is(Function, callback)) {
			callback(err, self);
		}
		return self;
	};

	/**
	 * ウインドウの移動が発生
	 * @param  {String} err
	 * @param  {String} data {id: id, position:[top, left]}
	 */
	var onMove = function onMove (data) {
		Win.emit('toClient', {event: 'move', id: data.id, data: data});
		Win.instances[data.id].sync(false).move(data.position[0], data.position[1]);
	};

	/**
	 * 移動
	 * 移動で表示が変更されるのは、normal,dialog,infoのみです
	 * maximize,minimizeは通常表示に変更になった際の位置を変更します
	 * 引数が２つ以上ない場合はランダムに移動します
	 * 明示的にtop,heightにnullを指定した場合はそれぞれは現在の値を使用します。
	 * @param  {Number} top  座標px 省略可能
	 * @param  {Number} left 座標px 省略可能
	 * @param  {Function} callback ({Error} err, {Win} win) 省略可能
	 * @return メソッドチェーン
	 */
	Win.prototype.move = function move (top, left, callback) {
		var err = null
		  , sync = this.sync();
		/**
		 * 引数チェック
		 */
		if (is(Function, top)) {
			callback = top;
		}
		if (arguments.length <= 1) {
			//ランダム
			var area = $(window.document.body)
			  , h = area.height() / 2
			  , w = area.width()  / 2;
			top = Math.floor(Math.random() * h) + 20;
			left= Math.floor(Math.random() * w) + 20;
		} else {
			// nullの場合は
			if (top === null) {
				top = this.position[0];
			}
			if (left === null) {
				left = this.position[1];
			}
		}
		if (is(Number, top) && is(Number, left)) {
			// 正常処理
			top = ~~top;
			left = ~~left;
			// 移動
			if (~['normal', 'dialog', 'info'].indexOf(this.mode)) {
				this.winEl.animate({top: top, left: left});
			}
			this.position = [top, left];
			// イベント発動および同期
			Win.emit('move', this);
			if (sync) {
				Win.sync('move', {id: this.id, position: this.position});
			}
		} else {
			err = new Error('引数が不正です');
		}
		if (is(Function, callback)) {
			callback(err, this);
		}
		return this;
	};

	/**
	 * ドラッグ開始時イベントハンドラ
	 * @type {Function}
	 */
	Win.prototype.dragStartHandler = null;

	/**
	 * ドラッグ開始時のイベントハンドラの取得
	 * @param  {Object} self
	 * @return {Function}
	 */
	Win.prototype.dragStartHandler = function dragStartHandler() {
		var self = this;
		if (Win.dragLayerEl) {
			Win.dragLayerEl.css({display: 'block', zIndex: self.winEl.css('zIndex') - 1});
		}
		self.dragLayerEl.css({display: 'block'});
	};

	/**
	 * ドラッグ終了時イベントハンドラ
	 * @type {Function}
	 */
	Win.prototype.dragStopHandler = null;

	/**
	 * ドラッグ終了時イベントハンドラの取得
	 * @param  {Object}   self
	 * @return {Function} handler
	 */
	Win.prototype.dragStopHandler = function dragStopHandler (e, ui) {
		var self = this
		  , sync = self.sync()
		  , css = {}
		  , top, left;
		if (ui.position.top < 20) {
			top = css.top = 20;
		} else {
			top = ui.position.top;
		}
		if (ui.position.left < 20) {
			left = css.left = 20;
		} else {
			left = ui.position.left;
		}
		if (css.top || css.left) {
			self.winEl.css(css);
		}
		if (Win.dragLayerEl) {
			Win.dragLayerEl.css('display', 'none');
		}
		self.dragLayerEl.css('display', 'none');
		self.position = [top, left];
		//イベント発動および同期
		Win.emit('move', this);
		if (sync) {
			Win.sync('move', {id: self.id, position: self.position});
		}
	};

	/**
	 * ウインドウのリサイズが発生
	 * @param  {String} err
	 * @param  {String} data {id:winId, size:[width, height], position:[top, left]}
	 */
	var onResize = function onResize (data) {
		Win.emit('toClient', {event: 'resize', id: data.id, data: data});
		Win.instances[data.id]
			.sync(false).move(data.position[0], data.position[1])
			.sync(false).resize(data.size[0], data.size[1]);
	};

	/**
	 * サイズ変更
	 * 引数が不正の場合は処理しません
	 * 明示的にnullを指定した場合は現在の値を使用します。
	 * @param  {Number}   width
	 * @param  {Number}   height
	 * @param  {Function} callback ({Error} err, {Win} win)
	 * @return メソッドチェーン用
	 */
	Win.prototype.resize = function resize (width, height, callback) {
		var self = this
		  , sync = self.sync()
		  , err  = null;
		if (width === null) {
			width = self.width;
		}
		if (height === null) {
			height = self.height;
		}
		if (is(Number, width) && is(Number, height)) {
			width  = ~~width;
			height = ~~height;
			if (~['normal', 'dialog', 'info'].indexOf(self.mode)) {
				self.winEl.animate({width: width, height: height});
			}
			self.size = [width, height];
			var data = {id: self.id, size: self.size, position: self.position};
			// イベント発動および同期
			Win.emit('resize', self);
			if (sync) {
				Win.sync('resize', data);
			}
		} else {
			err = new Error('引数が不正です');
		}
		if (is(Function, callback)) {
			callback(err, self);
		}
		return self;
	};

	/**
	 * リサイズ開始時イベントハンドラ
	 * @param  {Object}   self
	 * @return {Function} handler
	 */
	Win.prototype.resizeStartHandler = function resizeStartHandler () {
		var self = this;
		if (Win.dragLayerEl) {
			Win.dragLayerEl.css({display: 'block', zIndex: self.winEl.css('zIndex') - 1});
		}
		self.dragLayerEl.css({display: 'block'});
	};

	/**
	 * リサイズ終了時イベントハンドラ
	 * @type {Function}
	 */
	Win.prototype.resizeStopHandler = function resizeStopHandler (e, ui) {
		var self = this
		  , sync = self.sync()
		  , top, left, width, height;
		if (ui.position.top < 20 || ui.position.left < 20) {
			top  = ui.position.top < 20  ? 20 : ui.position.top;
			left = ui.position.left < 20 ? 20 : ui.position.left;
			self.winEl.animate({top: top, left: left});
		} else {
			top  = ui.position.top;
			left = ui.position.left;
		}
		this.position = [top, left];
		width  = ui.size.width;
		height = ui.size.height;
		this.size = [width, height];
		if (Win.dragLayerEl) {
			Win.dragLayerEl.css('display', 'none');
		}
		self.dragLayerEl.css('display', 'none');
		//イベント発動および同期
		Win.emit('resize', this);
		if (sync) {
			Win.sync('resize', {id: self.id, position:[top, left], size: [width, height]});
		}
	};

	/**
	 * modeがdialogもしくはinfoの場合にウインドウの後ろに表示するレイヤー
	 * @type {Element}
	 */
	Win.prototype.modalLayerEl = null;

	/**
	 * modalLayerElをクリック時にウインドウを閉じたり移動させたりする事が出来ます
	 * @param  {Event} e
	 */
	Win.prototype.modalLayerHandler = function modalLayerHandler (e) {
		var self = this;
		if (e && e.stopPropagation) {
			e.stopPropagation();
		}
		switch(self.mode) {
		case 'normal':
		case 'minimize':
		case 'maximize':
			break;
		case 'dialog':
			self.move();
			break;
		case 'info':
			if (self.closable) {
				self.close();
			}
			break;
		}
		return self;
	};

	/**
	 * ウインドウを使用しやすいように動作します
	 *  mode:
	 *      normal   アクティブ化、画面外にある場合は画面内に移動、画面内にある場合は微動
	 *      dialog   同上
	 *      info     同上
	 *      minimize 表示
	 *      maximize アクティブ
	 * 
	 */
	Win.prototype.putIn = function putIn (e) {
		var self = this
		  , area, h, w, top, left;
		if (e && e.stopPropagation) {
			e.stopPropagation();
		}
		switch (self.mode) {
		case 'normal':
		case 'dialog':
		case 'info'  :
			area = $(window.document.body);
			h = area.height();
			w = area.width();
			if (self.position[0] < 0 || h < self.position[0] + 40 ||
				self.position[1] < 0 || w < self.position[1] + 40) {
				//画面外にある場合は移動
				top  = Math.floor(Math.random() * h / 2) + 20;
				left = Math.floor(Math.random() * w / 2) + 20;
				self.active().move(top, left);
			} else {
				//画面内の場合は微動して元の位置
				self.active().attention();
			}
			break;
		case 'minimize':
			area = $(window.document.body);
			h = area.height();
			w = area.width();
			if (self.position[0] < 0 || h < self.position[0] + 40 ||
				self.position[1] < 0 || w < self.position[1] + 40) {
				//画面外にある場合は移動
				top  = Math.floor(Math.random() * h / 2) + 20;
				left = Math.floor(Math.random() * w / 2) + 20;
				self.show().move(top, left);
			} else {
				self.show();
			}
			break;
		case 'maximize':
			self.active();
			break;
		}
		return self;
	};

	/**
	 * アテンション
	 * @return メソッドチェーン
	 */
	Win.prototype.attention = function attention () {
		if (this.winEl) {
			var duration = 20
			  , top      = this.position[0]
			  , left     = this.position[1];
			this.winEl
				.animate({top: top    , left: left + 5}, duration)
				.animate({top: top + 5, left: left + 5}, duration)
				.animate({top: top + 5, left: left    }, duration)
				.animate({top: top + 5, left: left - 5}, duration)
				.animate({top: top    , left: left - 5}, duration)
				.animate({top: top - 5, left: left - 5}, duration)
				.animate({top: top - 5, left: left    }, duration)
				.animate({top: top - 5, left: left + 5}, duration);
		}
		return this;
	};


	/**
	 * ウインドウのスクリプトを実行する
	 * @method sever
	 * @param  {String} script
	 * @param  {Object} data
	 * @return {[type]}        [description]
	 */
	Win.prototype.server = function server (script, data, callback) {
		if (is(Function, data)) {
			callback = data;
			data = null;
		}
		var param = {id: this.id, script: script, data: data};
		Win.sync('script', param, callback);
		return this;
	};

	/**
	 * サーバからスクリプトの実行される
	 * @param  {String} err
	 */
	var onCall = function onCall (param) {
		var win    = Win.instances[param.id]
		  , script = param.script
		  , data   = param.data;
		if (cocotte.Script) {
			cocotte.Script.onCall(win, script, data);
		}
	};

	/**
	 * ドラッグ用エレメント
	 * contentsエリアを覆う事でifram内でもドラッグをスムーズに行う事が出来ます
	 * @type {Element}
	 */
	Win.prototype.dragLayerEl = null;

	/**
	 * サーバ同期可能
	 * @type {Boolean}
	 */
	Win.prototype.serverSync = false;

	/**
	 * 次の処理を同期しないフラグ
	 * @type {Boolean}
	 */
	Win.prototype.nextSync = true;

	/**
	 * 同期可能かどうかを返します
	 * 通常はserverSyncの値を返します
	 * 引数に真偽値を渡した場合は、次のこの関数の呼び出しで同期を手動で行うかどうか設定しメソッドチェーンを可能にします。
	 * ただし、もともとserverSyncがfalseの場合は常にfalseを返します
	 * 次回のみの設定で以降はserverSyncの値を返します
	 * @param  {Boolean} nextSync 省略可能
	 * @return {Boolean|メソッドチェーン}
	 */
	Win.prototype.sync = function sync (nextSync) {
		if (is(Boolean, nextSync)) {
			this.nextSync = nextSync;
			return this;
		} else if (!this.nextSync) {
			this.nextSync = true;
			return false;
		} else {
			return this.serverSync;
		}
	};

	/**
	 * ローカル変数（同期対象外)
	 * @property {Object} values
	 */
	Win.prototype.values = {};

	/**
	 * ローカル変数 (同期対象)
	 * @property {Object} locals
	 */
	Win.prototype.locals = {};

	/**
	 * ローカル変数を設定して同期する
	 * @param {String} key
	 * @param {Mixed} data
	 */
	Win.prototype.setLocal = function setLocal (key, data) {
		var param = {id: this.id, key: key, data: data};
		Win.sync('local', param);
		return this;
	};

	/**
	 * ローカル変数リスナー
	 * onLocal, removeListenerLocalで登録・削除してください
	 * @type {Object}
	 */
	Win.prototype.localListeners = {};

	/**
	 * ローカル変数が変更を監視する
	 * @param  {String}   key
	 * @param  {Function} callback
	 * @return メソッドチェーン
	 */
	Win.prototype.onLocal = function onLocal (key, callback) {
		if (is(String, key) && is(Function, callback)) {
			if (!this.localListeners[key]) {
				this.localListeners[key] = [];
			}
			this.localListeners[key].push(callback);
		}
		return this;
	};

	/**
	 * ローカル変数が変更の監視を取り消す
	 * @param  {String}   key
	 * @param  {Function} callback
	 * @return メソッドチェーン
	 */
	Win.prototype.removeListenerLocal = function removeListenerLocal(key, callback) {
		if (is(String, key) && is(Function, callback) && this.localListeners[key]) {
			var idx = this.localListeners[key].indexOf(callback);
			if (~idx) {
				this.localListeners[key].splice(idx, 1);
				if (!this.localListeners[key].length) {
					delete this.localListeners[key];
				}
			}
		}
		return this;
	};

	/**
	 * ローカル変数同期
	 * @param  {Object} param
	 */
	var onLocal = function onLocal (param) {
		var win    = Win.instances[param.id]
		  , key    = param.key
		  , data   = param.data
		  , err    = param.err;
		if (!win) {
			return;
		}
		if (!err) {
			win.locals[key] = data;
		}
		var listeners = win.localListeners[key];
		if (is(Array, listeners)) {
			listeners.forEach(function (listener) {
				listener(win, key, data, err);
			});
		}
	};

	// ---------------------------------------------------------------クラスメンバ

	/**
	 * ワークスペース
	 * @type {Element}
	 */
	Win.workspaceEl = null;

	/**
	 * ドラッグレイヤー 
	 * @type {Element}
	 */
	Win.dragLayerEl = null;

	/**
	 * ドック
	 * @type {Element}
	 */
	Win.dockEl = null;

	/**
	 * ドックのz-index
	 * @type {Number}
	 */
	Win.dockZIndex = 0;

	/**
	 * ドックが最前面の場合は最背面に設定する
	 * それ以外の場合は最前面に設定する
	 * @return メソッドチェーン
	 */
	Win.toggleDock = function toggleDock (e) {
		//バブリング抑止
		if(e && e.stopPropagation) {
			e.stopPropagation();
		}
		//ドックが存在しない場合は処理しない
		if (!Win.dockEl) {
			return this;
		}
		//既に最前面なら最背面にする
		if (Win.dockZIndex === Win.zIndex) {
			Win.inactiveDock();
		} else {
			Win.activeDock();
		}

		return this;
	};

	/**
	 * ドックのアクティブが発生
	 */
	var onDockActive = function onDockActive () {
		Win.emit('toClient', {event: 'dockActive'});
		Win.activeDock(false);
	};

	/**
	 * ドックをアクティブ化
	 * @param {Boolean} unsync サーバ同期しない（指定しないでください）
	 */
	Win.activeDock = function activeDock (sync) {
		var el = Win.dockEl;
		if (!el) {
			return;
		}
		//最前面にする
		Win.zIndex += 2;
		Win.dockZIndex = Win.zIndex;
		el.css('zIndex', Win.dockZIndex);
		// 今までアクティブだったウインドウのクラス削除
		if (Win.active) {
			Win.active.winEl.removeClass('winActive');
			if (Win.active.minWinEl) {
				Win.active.minWinEl.removeClass('winActive');
			}
			Win.active = null;
		}
		//イベント発動および同期
		Win.emit('dockActive');
		if (sync !== false) {
			Win.sync('dockActive');
		}
	};

	/**
	 * ドックの非アクティブが発生
	 */
	var onDockInactive = function onDockInactive () {
		Win.emit('toClient', {event: 'dockActive'});
		Win.inactiveDock(false);
	};

	/**
	 * ドックを非アクティブ化
	 * @param {Boolean} unsync
	 */
	Win.inactiveDock = function inactiveDock (sync) {
		var el = Win.dockEl;
		if (!el) {
			return;
		}
		el.css('zIndex', 0);
		Win.dockZIndex = 0;
		Win.emit('dockInactive');
		if (sync !== false) {
			Win.sync('dockInactive');
		}
	};

	/**
	 * ドックのテンプレート
	 */
	Win.dockTemplate =
		'<div id="dock">' +
		' <div class="winMin defaultUI">' +
		'  <div class="minContainer">' +
		'   <div id="startTitle" data-winname="start">start</div>' +
		'  </div>' +
		' </div>' +
		'</div>';

	/**
	 * 各コンテナエレメントを設定
	 * 最初に呼び出すWindow名とメニューのタイトルを指定する事が出来ます
	 * 文字列以外を渡した場合は、メニューを追加しません
	 * Win.minTemplates.startWinがメニューのHTMLです
	 * @param  {String} startTitle
	 * @return メソッドチェーン
	 */
	Win.createWorkspace = function createWorkspace (startTitle) {
		//ワークスペースの作成
		Win.workspaceEl = $('#workspace');
		if (Win.workspaceEl.length === 0) {
			Win.workspaceEl = $('<div id="workspace"></div>');
			$(window.document.body).append(Win.workspaceEl);
		}

		//ドラッグ用のレイヤーの作成
		Win.dragLayerEl = $('<div id="dragLayer"></div>');
		Win.workspaceEl.append(Win.dragLayerEl);

		//ドックの追加
		Win.dockEl = $('#dock');
		if (Win.dockEl.length === 0) {
			Win.dockEl = $(Win.dockTemplate);
			Win.workspaceEl.append(Win.dockEl);
		}

		/**
		 * タイトルの変更
		 */
		var startTitleEl = $('#startTitle');
		if (is(String, startTitle)) {
			startTitleEl.text(startTitle);
		}

		/**
		 * イベント追加
		 */
		Win.workspaceEl.click(Win.toggleDock);

		return this;
	};

	/**
	 * ウインドウを検索する
	 * @param  {String} name
	 * @param  {Object} row
	 * @return {Win}
	 */
	Win.find = function find (name, field) {
		var self = this
		  , wins = Object.keys(self.instances).filter(function (id) {
					var w = self.instances[id];
					return  w.name !== name ? false :
							!field          ? true  :
							field.datasource === w.datasource && field.rowNo === w.rowNo;
				})
		  , id   = wins.length > 0 ? wins[0] : null;
		return id ? self.instances[id] : null;
	};

	/**
	 * ウインドウIDの接頭語
	 * @type {String}
	 */
	Win.prefix = 'cwin';

	/**
	 * 最終ウインドウ番号
	 * @type {Number}
	 */
	Win.lastNo = 0;

	/**
	 * ウインドウオブジェクト
	 * @type {Object}
	 */
	Win.instances = {};

	/**
	 * アクティブウインドウ
	 * @type {Object} Win
	 */
	Win.active = null;

	/**
	 * 最新のz-index
	 * ウインドウがactiveになるたびに2のインクリメントが実行される
	 * @type {Number}
	 */
	Win.zIndex = 0;

	/**
	 * ウインドウのテンプレート
	 * @type {Array}
	 */
	Win.templates = {
		// 通常のウインドウ
		defaultTo: '<div class="win defaultUI" style="position: absolute;">' +
					'<div class="winContainer defaultUIContainer">' +
					'    <div class="winContents"></div>' +
					'    <div class="winTitle winHandle"></div>' +
					'    <div class="winStatus winHandle"></div>' +
					'    <ul class="tools1">' +
					'         <li class="winMaximize">■</li>' +
					'         <li class="winMinimize">＿</li>' +
					'         <li class="winClose">×</li>' +
					'    </ul>' +
					'    <ul class="tools2">' +
					'         <li class="winChangeBoard">!</li>' +
					'         <li class="winHelp">?</li>' +
					'    </ul>' +
					'</div>' +
					'</div>'

		// ダイアログ用のウインドウ
	  , dialog   : '<div class="win defaultUI" style="position: absolute;">' +
					'<div class="winContainer defaultUIContainer">' +
					'    <div class="winContents"></div>' +
					'    <div class="winTitle winHandle">New Window</div>' +
					'    <div class="winStatus winHandle"></div>' +
					'    <ul class="tools1">' +
					'         <li class="winClose">×</li>' +
					'    </ul>' +
					'</div>' +
					'</div>'

		// 情報ボックス用のウインドウ
	  , info     : '<div class="win defaultUI defaultUIInfo" style="position: absolute;">' +
					'<div class="winContainer defaultUIContainer">' +
					'    <div class="winContents"></div>' +
					'    <div class="winTitle winHandle"></div>' +
					'    <ul class="tools1">' +
					'         <li class="winClose">×</li>' +
					'    </ul>' +
					'</div>' +
					'</div>'
	};

	/**
	 * 最小化したウインドウのテンプレート
	 * @type {Object}
	 */
	Win.minTemplates = {
		//通常のミニバー
		defaultTo: '<div class="winMin defaultUI">' +
					'<div class="minContainer">' +
					'    <div class="minTitle">New Window</div>' +
					'    <div class="minClose">×</div>' +
					'</div>' +
					'</div>'
	};

	// ---------------------------------------------------------------同期サーバ

	/**
	 * 同期サーバ
	 * cocotte.Messageを設定します
	 * 設定されている場合は
	 * @type {Object}
	 */
	Win.socket = null;

	/**
	 * 同期サーバを設定する
	 * 既に開いているウインドウはすべて閉じられます
	 * 前回の状態でウインドウを開きます
	 * @param {Object} socket cocotte.Messageオブジェクト
	 */
	Win.setSocket = function setSocket(socket) {
		//現在サーバが設定されている場合は通知を切る
		Win.socket = null;
		/**
		 * 現在のウインドウをすべて閉じます
		 */
		Object.keys(Win.instances).forEach(function(id) {
			Win.instances[id].close();
		});
		Win.active = null;

		/**
		 * ウインドウを取得して表示させます
		 */
		socket.server.emit('winLoad', null, function(err, data) {
			if (!err) {
				Win.socket = socket;
				if (is(Array, data)) {
					var activeId = null;
					data.forEach(function (prop) {
						if (is(Object, prop)) {
							//ウインドウの作成
							var win = new Win(prop.title, prop.contents, prop);
							win.serverSync = true;
							activeId = win.id;
						} else if (prop === 'dock') {
							Win.activeDock(false);
							activeId = 'dock';
						}
					});
					var activeWin = Win.instances[activeId];
					if (activeWin) {
						activeWin.sync(false).active();
					}
				}
				/**
				 * イベントの監視
				 */
				socket.server
					.on('winCreate'           , onCreate)
					.on('winShow'             , onShow)
					.on('winSetTitle'         , onSetTitle)
					.on('winActive'           , onActive)
					.on('winClose'            , onClose)
					.on('winChangeStatus'     , onChangeStatus)
					.on('winShowChangeBoard'  , onShowChangeBoard)
					.on('winNormal'           , onNormal)
					.on('winMaximize'         , onMaximize)
					.on('winMinimize'         , onMinimize)
					.on('winMove'             , onMove)
					.on('winResize'           , onResize)
					.on('winDockActive'     , onDockActive)
					.on('winDockInactive'   , onDockInactive)
					.on('winCall'             , onCall)
					.on('winLocal'            , onLocal);
			}
			Win.emit('load', data);
		});
	};

	/**
	 * 同期する
	 * @param  {String}   event
	 * @param  {Mixed}    data     省略可能
	 * @param  {Function} callback 省略可能
	 * @return メソッドチェーン
	 */
	Win.sync = function winSync (event, data, callback) {
		if (Win.socket) {
			Win.emit('toServer', {event: event, id: is(Object, data) ? data.id : null, data: data});
			var evt = 'win' + (event.charAt(0).toUpperCase() + event.slice(1));
			if (is(Function, data)) {
				Win.socket.server.emit(evt, null, data);
			} else if (is(Function, callback)) {
				Win.socket.server.emit(evt, data, callback);
			} else {
				Win.socket.server.emit(evt, data);
			}
		}
	};

	// --------------- ローカル

	/**
	 * ウインドウをワークスペースから非表示にする
	 * closeとminimizeで使用
	 * @param  {Object} self Winオブジェクト
	 */
	var winElRemove = function winElRemove (self) {
		var win = self.winEl;
		if (!win) {
			return;
		}
		//win.draggable('destroy');
		//win.resizable('destroy');
		win.unbind();
		delete self.winEl;
		delete self.titleEl;
		delete self.contentsEl;
		if (self.maximizeEl) {
			self.maximizeEl.unbind();
			delete self.maximizeEl;
		}
		if (self.minimizeEl) {
			self.minimizeEl.unbind();
			delete self.minimizeEl;
		}
		if (self.closeEl) {
			self.closeEl.unbind();
			delete self.closeEl;
		}
		delete self.statusEl;
		if (self.changeBoardEl) {
			self.changeBoardEl.unbind();
			delete self.changeBoardEl;
		}
		delete self.showHelp;
		if (self.helpEl) {
			self.helpEl.unbind();
			delete self.helpEl;
		}
		delete self.dragLayerEl;
		win.remove();

		if (self.modalLayerEl) {
			self.modalLayerEl.unbind();
			self.modalLayerEl.remove();
			delete self.modalLayerEl;
		}
	};

	/**
	 * グローバルオブジェクトに設定
	 */
	cocotte.Win = Win;
})(cocotte);
