/*jshint strict:false, eqeqeq:false*/
var cocotte = {
  tools: {}
, winScripts: {}
};

(function (tools) {
  'use strict';
  /**
   * グローバルオブジェクトcocotteの作成
   * 既存オブジェクトの拡張
   */

  /**
   * エレメント拡張　ウインドウオブジェクトを取得 
   * @return {Object}
   */
  tools.getWin = function getWin (self) {
    var el = $(self).closest('div.win')
      , id = el.length > 0 ? el.attr('id') : null
      , win = id ? cocotte.Win.instances[id] : null;
    return win;
  };

  /**
   * エレメント拡張　ポートレットオブジェクトを取得
   * @return {Object}
   */
  tools.getPortlet = function getPortlet (self) {
    var win = tools.getWin(self)
      , el = $(self).closest('div.portlet')
      , id = el.length > 0 ? el.attr('id') : null;

    if (win && id && win.container.contents) {
      var contents = win.container.contents.filter(function (ctt) { return ctt.id === id; });
      if (contents.length > 0) {
        return contents[0].portlet;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  /**
   * 型を返す
   * 関数・オブジェクトは以外はコアオブジェクトを返します
   * 関数はそのまま参照を返します
   * オブジェクトはconstructorがundefinedの場合はObjectを
   * 設定されている場合は関数の参照を返します
   * 
   * 既定では以下の値はundefinedの参照が返されます。
   * NaN, Infinity, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY
   * Date.toString() === 'Invalid Date'となるもの
   * 
   * @param  {Mixed}   target
   * @param  {Boolean} simple (既定値:false) 省略可能 true時にundefinedではなく、Number, Dateにする事もできます
   * @return {Object}
   */
  tools.getType = function getType (target, simple) {
    if (target === null || target === undefined) {
      return target;
    } else {
      var rtn = target.constructor;
      if (!simple) {
        if (rtn === Number) {
          return isFinite(target) ? Number : undefined;
        } else if (rtn === Date) {
          return isNaN(target.getTime()) ? NaN : Date;
        }
      }
      return rtn;
    }
  };

  /**
   * 型判定を行う
   * instanceofと異なりundefined, nullも判定出来ます
   * ただしプロトタイプチェーンをたどりません
   * 
   * @for tools
   * @method  is
   * @static
   * @param  {String}  type
   * @param  {Mixed}   target
   * @param  {Boolean} simple
   *               既定では以下の値はNumber, Dateと一致しないと判定されますが、
   *               true時にNumber, Dateと一致と見なす事もできます
   *               NaN, Infinity, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY
   *               isNaN(Date.getTime()) === trueとなるもの
   * @return {Boolean} isType
   */
  tools.is = function is (type, target, simple) {
    if(target === undefined || target === null) {
      return type === target || simple === null;
    } else {
      var chk = target.constructor;
      if (simple === false) {
        if (chk === Number) {
          return type === Number && isFinite(target);
        } else if (chk === Date) {
          return type === Date && !isNaN(target.getTime());
        }
      }
      return type === chk;
    }
  };

  /**
   * すべての型が一致するかの判定を行います
   * 
   * @method matches
   * @static
   * @param  {Array}   types
   * @param  {Array}   target
   * @param  {Object}  options 
   *           省略可能
   *               simple     : {Boolean} (既定値:false) true時に有効でない値に対してもNumber, Dateを返します
   *               must       : {Array}   省略出来ないインデックス。設定していない場合はすべて省略不可とします
   *                                          省略可の値はnullとundefinedでも判定をパスします
   *               lengthCheck: {Boolean} (既定値:true) targetの長さが一致するかも確認します
   *                                          長さを確認しない場合はよけいな値が追加されても判定をパスします
   *           オブジェクト以外を渡した場合は次にように設定されます
   *           配列はmustを指定、真偽値はlengthCheckを設定
   * @return {Boolean} match
   */
  tools.matches = function matches (types, target, options) {
    var is = tools.is
      , tp = tools.getType(options);
    switch(true) {
    case tp === Array:
      options = {must: options};
      break;
    case tp === Boolean:
      options = {lengthCheck: options};
      break;
    case tp !== Object:
      options = {};
      break;
    }
    if (Array.isArray(types) && (Array.isArray(target) || is(Object, target) && is(Number, target.length))) {
      if (types.length !== target.length && options.lengthCheck !== false) {
        // 長さチェックエラー
        return false;
      } else if(Array.isArray(options.must)) {
        return types.every(function (tp, i) {
          return (!~options.must.indexOf(i) && (target[i] === undefined || target[i] === null)) ||
              is(tp, target[i], options.simple);
        });
      } else {
        return types.every(function (tp, i) { return is(tp, target[i], options.simple); });
      }
    } else {
      return false;
    }
  };

  /**
   * 値が同じかどうかを比較します。
   * オブジェクトや日付も値で確認します
   * nullとundefinedを同値として考慮する場合はnullEqUndefinedをtrueにします
   * @for tools
   * @method compare
   * @static
   * @param  {Mixed}   target1
   * @param  {Mixed}   target2
   * @param  {Boolean} nullEqUndefined
   * @return {Boolean} success
   */
  tools.compare = function compare (target1, target2, nullEqUndefined) {

    if (nullEqUndefined) {
      if (target1 === undefined) {
        target1 = null;
      }
      if (target2 === undefined) {
        target2 = null;
      }
    }

    if (target1 === target2) {
      return true;
    }

    var getType = tools.getType
      , tp1 = getType(target1, true)
      , tp2 = getType(target2, true);

    if (tp1 !== tp2) {
      return false;
    }

    switch(true) {
    case tp1 === Boolean:
    case tp1 === String:
      return target1 == target2;

    case tp1 === Number:
      return target1 == target2 || isNaN(target1) && isNaN(target2);

    case tp1 === RegExp:
      return target1.toString() === target2.toString();

    case tp1 === Date:
      var t1 = target1.getTime()
        , t2 = target2.getTime();
      return t1 === t2 || isNaN(t1) && isNaN(t2);

    case tp1 === Function:
      return false;

    case target1 instanceof Error:
      return target1.message === target2.message;

    default:
      var keys1 = Object.keys(target1)
        , keys2 = Object.keys(target2);
      if (keys1.length !== keys2.length) {
        return false;
      }
      keys1.sort();
      keys2.sort();
      return keys1.every(function(key, i) {
        return key === keys2[i] && compare(target1[key], target2[key], nullEqUndefined);
      });
    }
  };

  /**
   * メッセージ表示
   */
  tools.message = console.log.bind(console);

  /**
   * extendEventとinheritsEventは次のメソッドを追加します
   * 
   * on                : リスナーの登録
   * once              : リスナーの登録（一回実行)
   * emit              : イベントの発火
   * removeListener    : リスナーの解除
   * removeAllListeners: リスナーの一括解除
   *
   * (使用例)
   * var Example = function Example () {};
   * 
   * cocotte.tools.extendEvent(Example);
   * Example.on('fire', function (data) { console.log('fire event!');});
   * Example.emit('fire');
   *
   * Example.on('*', function (event, data) { console.log (event + ' event!');});
   * Example.emit('fire2');
   *
   * cocotte.tools.inheritsEvent(Example);
   * var ex1 = new Example();
   * ex1.on('fire', function (data) { console.log('fire event!');});
   * ex1.emit('fire');
   *
   * ex1.on('*', function (event, data) { console.log (event + ' event!');});
   * ex1.emit('fire2');
   */

  /**
   * 関数にイベント機能を追加します
   * @return {Object}
   */
  tools.extendEvent = function extendEvent (self) {

    if (self.removeAllListeners) {
      self.removeAllListeners();
    }

    var everyListeners = {}
      , onceListeners  = {}
      , allListeners   = [];
    /**
     * リスナーの登録
     * @param  {string}   event   '*'を指定するとすべてのイベントを監視するリスナーを登録します
     * @param  {Function} callback 通常({Error} err, {Mixed} data) 　'*'({String} event, {Error} err, {Mixed} data) 
     * @return メソッドチェーン
     */
    self.on = function on (event, callback) {
      if (typeof event !== 'string') {
        throw new Error('イベントが文字列ではありません');
      } else if (typeof callback !== 'function') {
        throw new Error('リスナーが関数ではありません');
      }
      if (event === '*') {
        allListeners.push(callback);
      } else if (everyListeners[event]) {
        everyListeners[event].push(callback);
      } else {
        everyListeners[event] = [callback];
      }
      return self;
    };

    /**
     * リスナーの登録（一回実行)
     * イベントが実行された場合はリスナーは解除されます
     * @param  {string}   event    '*'は登録出来ません
     * @param  {Function} callback
     * @return メソッドチェーン
     */
    self.once = function once (event, callback) {
      if (typeof event !== 'string') {
        throw new Error('イベントが文字列ではありません');
      } else if (typeof event === '*') {
        throw new Error('全イベントを監視するリスナーはonceでは登録出来ません');
      } else if (typeof callback !== 'function') {
        throw new Error('リスナーが関数ではありません');
      }
      if (onceListeners[event]) {
        onceListeners[event].push(callback);
      } else {
        onceListeners[event] = [callback];
      }
      return self;
    };

    /**
     * イベントの発火
     * @param  {String} event
     * @param  {Mixed}  data
     * @return メソッドチェーン
     */
    self.emit = function emit (event, data) {
      if (typeof event !== 'string') {
        throw new Error('イベントが文字列ではありません');
      }
      if (everyListeners[event]) {
        everyListeners[event].forEach(function (callback) {
          callback.apply(self, [data]);
        });
      }
      if (onceListeners[event]) {
        onceListeners[event].forEach(function (callback) {
          callback.apply(self, [data]);
        });
        delete onceListeners[event];
      }
      allListeners.forEach(function(callback) {
        callback.apply(self, [event, data]);
      });
      return self;
    };

    /**
     * リスナーの解除
     * @param  {String} event   '*'を指定した場合は、全イベントを監視する特別なリスナーのみ解除します
     * @param  {Function} listener
     * @return メソッドチェーン
     */
    self.removeListener = function removeListener (event, listener) {
      if (typeof event !== 'string') {
        throw new Error('イベントが文字列ではありません');
      } else if (typeof listener !== 'function') {
        throw new Error('リスナーが関数ではありません');
      }
      if (event === '*') {
        allListeners = allListeners.filter(function (fn) {return fn !== listener;});
      } else {
        var every = everyListeners[event]
          , once  = onceListeners[event];
        if (every) {
          var newEvery = every.filter(function (fn) {return fn !== listener;});
          if (newEvery.length > 0) {
            everyListeners[event] = newEvery;
          } else {
            delete everyListeners[event];
          }
        }
        if (once) {
          var newOnce = once.filter(function (fn) {return fn !== listener;});
          if (newOnce.length > 0) {
            onceListeners[event] = newOnce;
          } else {
            delete onceListeners[event];
          }
        }
      }
      return self;
    };

    /**
     * リスナーの一括解除
     * @param  {String} event  省略時はすべてを解除します
     * @return メソッドチェーン
     */
    self.removeAllListeners = function removeAllListeners (event) {
      if (event === '*') {
        allListeners = [];
      } else if (typeof event === 'string') {
        delete everyListeners[event];
        delete onceListeners[event];
      } else {
        everyListeners = {};
        onceListeners = {};
        allListeners = [];
      }
      return self;
    };
    return self;
  };

  /**
   * 関数のプロトタイプにイベント機能を追加します
   * @return {Object}
   */
  tools.inheritsEvent = function inheritsEvent (self) {

    var everyListeners = {}
      , onceListeners  = {}
      , allListeners   = [];
    /**
     * リスナーの登録
     * @param  {string}   event   '*'を指定するとすべてのイベントを監視するリスナーを登録します
     * @param  {Function} callback 通常({Mixed} data) 　'*'({String} event, {Mixed} data) 
     * @return メソッドチェーン
     */
    self.prototype.on = function on (event, callback) {
      if (typeof event !== 'string') {
        throw new Error('イベントが文字列ではありません');
      } else if (typeof callback !== 'function') {
        throw new Error('リスナーが関数ではありません');
      }
      if (event === '*') {
        allListeners.push(callback);
      } else if (everyListeners[event]) {
        everyListeners[event].push(callback);
      } else {
        everyListeners[event] = [callback];
      }
      return self;
    };

    /**
     * リスナーの登録（一回実行)
     * イベントが実行された場合はリスナーは解除されます
     * @param  {string}   event    '*'は登録出来ません
     * @param  {Function} callback
     * @return メソッドチェーン
     */
    self.prototype.once = function once (event, callback) {
      if (typeof event !== 'string') {
        throw new Error('イベントが文字列ではありません');
      } else if (typeof event === '*') {
        throw new Error('全イベントを監視するリスナーはonceでは登録出来ません');
      } else if (typeof callback !== 'function') {
        throw new Error('リスナーが関数ではありません');
      }
      if (onceListeners[event]) {
        onceListeners[event].push(callback);
      } else {
        onceListeners[event] = [callback];
      }
      return self;
    };

    /**
     * イベントの発火
     * @param  {String} event
     * @param  {Mixed}  data
     * @return メソッドチェーン
     */
    self.prototype.emit = function emit (event, data) {
      var self = this;
      if (typeof event !== 'string') {
        throw new Error('イベントが文字列ではありません');
      }
      if (everyListeners[event]) {
        everyListeners[event].forEach(function (callback) {
          callback.apply(self, [data]);
        });
      }
      if (onceListeners[event]) {
        onceListeners[event].forEach(function (callback) {
          callback.apply(self, [data]);
        });
        delete onceListeners[event];
      }
      allListeners.forEach(function (callback) {
        callback.apply(self, [event, data]);
      });
      return self;
    };

    /**
     * リスナーの解除
     * @param  {String}   event
     * @param  {Function} listener
     * @return メソッドチェーン
     */
    self.prototype.removeListener = function removeListener (event, listener) {
      if (typeof event !== 'string') {
        throw new Error('イベントが文字列ではありません');
      } else if (typeof listener !== 'function') {
        throw new Error('リスナーが関数ではありません');
      }
      if (event === '*') {
        allListeners = allListeners.filter(function (fn) {return fn !== listener;});
      } else {
        var every = everyListeners[event]
          , once  = onceListeners[event];
        if (every) {
          var newEvery = every.filter(function (fn) {return fn !== listener;});
          if (newEvery.length > 0) {
            everyListeners[event] = newEvery;
          } else {
            delete everyListeners[event];
          }
        }
        if (once) {
          var newOnce = once.filter(function (fn) {return fn !== listener;});
          if (newOnce.length > 0) {
            onceListeners[event] = newOnce;
          } else {
            delete onceListeners[event];
          }
        }
      }
      return self;
    };

    /**
     * リスナーの一括解除
     * @param  {String} event  省略時はすべてを解除します
     * @return メソッドチェーン
     */
    self.prototype.removeAllListeners = function removeAllListeners (event) {
      if (event === '*') {
        allListeners = [];
      } else if (typeof event === 'string') {
        delete everyListeners[event];
        delete onceListeners[event];
      } else {
        everyListeners = {};
        onceListeners  = {};
        allListeners   = [];
      }
      return self;
    };
  };

})(cocotte.tools);
