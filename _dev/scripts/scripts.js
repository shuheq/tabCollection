(function(){
  $('.tab-start').each(function() {
    // this をjQueryオブジェクトにして変数に格納。
    var $t = $(this);
    
    // 何番目のliをクリックしたかを格納する変数を定義（後半使います。）
    // 初期値で 0 をいれておかないとバグになるのでいれておきます。（１つ目のliがactiveになっているということ。）
    var _clickLiIndex = 0;

    // <li> の .activeを動かす
    // この場合、$t配下の.nav liにしないと、ページ内の全部のタブが同じような挙動をしてしまうので注意。
    $t.find('.nav li').on('click',function(e) {
      // thisをjQueryオブジェクトにして変数に格納。
      var $tLi = $(this);
      // ブラウザの初期動作を消す。この場合だとリンクが飛んじゃうのを消してる。
      e.preventDefault();
      // 一回全部のliからclass="active"を外す。
      $t.find('.nav li').removeClass('active');
      // クリックされた$(this)にだけ.activeを付ける。
      $tLi.addClass('active');
      
      // クリックしたliが何番目だったか居れておきます。
      _clickLiIndex = $t.find('.nav li').index($tLi);
    });

    // １つ目のタブだけ表示する。
    $t.find('.tab-contents div').eq(0).show();
    
    if ( $t.hasClass('hide-mode') ) {
      // show/hide
      // クリック時の動き
      $t.find('[data-tab-trigger]').on('click',function(e) {
        // thisをjQueryオブジェクトにして変数に格納。
        var $tl = $(this);
        // thisのdata-tab-triggerを取得。
        var _ids = $tl.data('tab-trigger');
        // クリックされたら、表示されているタブを一回全部消す。
        $t.find('.tab-contents div').hide();
        // 取得したdata-tab-triggerをIDに置き換えて、それを表示する。
        $('#'+_ids).show();
      });
    } else if ( $t.hasClass('slideDown-mode') ) {
      // slideDown
      // クリック時の動き
      $t.find('[data-tab-trigger]').on('click',function(e) {
        // thisをjQueryオブジェクトにして変数に格納。
        var $tl = $(this);
        // thisのdata-tab-triggerを取得。
        var _ids = $tl.data('tab-trigger');
        // クリックされたら、表示されているタブを一回全部消す。
        $t.find('.tab-contents div').hide();
        // 取得したdata-tab-triggerをIDに置き換えて、それをスライドダウンする。
        $('#'+_ids).slideDown();
      });
    } else if ( $t.hasClass('slideUpAndDown-mode') ) {
      // slideUpからのslideDown
      // クリック時の動き
      $t.find('[data-tab-trigger]').on('click',function(e) {
        // thisをjQueryオブジェクトにして変数に格納。
        var $tl = $(this);
        // thisのdata-tab-triggerを取得。
        var _ids = $tl.data('tab-trigger');
        // この場合、全てスライドアップすると不具合になるので、スライドアップするコンテンツを特定した後にスライドアップさせます。
        var $slideUpContents = $t.find('.tab-contents div').eq(_clickLiIndex);
        // スライドアップします。コールバックにスライドダウンの処理を追加します。
        $slideUpContents.stop().slideUp(function(){
          // 取得したdata-tab-triggerをIDに置き換えて、それをスライドダウンする。
          $('#'+_ids).stop().slideDown();
        });
      });
    } else if ( $t.hasClass('fade-mode') ) {
      // fade
      // クリック時の動き
      $t.find('[data-tab-trigger]').on('click',function(e) {
        // thisをjQueryオブジェクトにして変数に格納。
        var $tl = $(this);
        // thisのdata-tab-triggerを取得。
        var _ids = $tl.data('tab-trigger');
        // クリックされたら、表示されているタブを一回全部消す。
        $t.find('.tab-contents div').hide();
        // 取得したdata-tab-triggerをIDに置き換えて、それを表示する。
        $('#'+_ids).fadeIn();
      });
    } else if ( $t.hasClass('crossFade-mode') ) {
      // crossFade
      // クリック時の動き
      $t.find('[data-tab-trigger]').on('click',function(e) {
        // thisをjQueryオブジェクトにして変数に格納。
        var $tl = $(this);
        // thisのdata-tab-triggerを取得。
        var _ids = $tl.data('tab-trigger');
        // この場合も、出来ればフェードするコンテンツはひとつに絞ったほうが良いと思います。
        var $fadeOutContents = $t.find('.tab-contents div').eq(_clickLiIndex);
        // クリックされたら、表示されているタブを一回全部消す。
        $fadeOutContents.stop().fadeOut();
        // 取得したdata-tab-triggerをIDに置き換えて、それをフェードイン。ただし、クロスフェードの場合、少しcssをいじります。
        $('#'+_ids).css({
          position:'absolute',
          top:0,
          left:0,
          width:'100%'
        }).stop().fadeIn(function(){
          // 完了したらコールバックでcssを元に戻しておきます。たくさんあって面倒くさいので、今回はstyle属性を消します。
          $(this).attr('style','');
          // そのあとdisplayをblockにしないとだ…。
          $(this).show();
        });
      });
    } else if ( $t.hasClass('slideIn-mode') ) {
      // slideIn
      // これに関してはまずcssも調整しないといけないです。本来はcssで書くべきですが、今回は特別にjsでやってしまいます。
      // cssは１行だけの時はこんな書き方も出来ます。
      $t.find('.tab-contents').css('overflow','hidden');
      // heightはheight用のメソッドもあります。(widthもある) outerHeight(true)でpadding、margin、borderなどを含めたbox全ての大きさが取得できます。
      $t.find('.tab-contents').height($t.find('.tab-contents div').eq(0).outerHeight(true));
      
      // あーそうか。leftを動かすboxがないとダメですね。仕方ないのでjsで追加しちゃいましょう。
      // jQueryでDOMを生成することが出来ます。生成してidをつけときます。あとcssをある程度整えます。
      var _tabNumbers = $t.find('.tab-contents div').length;
      var _oneTabWidht = $t.find('.tab-contents div').eq(0).outerWidth(true);
      
      var $wrapBox = $('<div />').attr('id','wrapBox').css({
        position:'absolute',
        left: 0,
        top: 0,
        height: $t.find('.tab-contents').height(),
        width: _oneTabWidht*_tabNumbers,
        display:'block',
        backgroundColor:'#fff',
        padding:0
      });
      // 各タブそれぞれのcssもちょっといじっちゃいます。
      $t.find('.tab-contents div').css({
        float:'left',
        width:_oneTabWidht,
        display:'block'
      })
      
      // 生成したDOMにタブの各divをぶっこみます。
      $wrapBox.append($t.find('.tab-contents div'));
      /* ↓今こうなってます。
       * <div id="wrapBox">
       *  <div id="tab6-tab1">...</div>
       *  <div id="tab6-tab2">...</div>
       *  <div id="tab6-tab3">...</div>
       * </div>
       * ↑この要素が $wrapBox に突っ込まれて、html側からは #tab6-tab1,#tab6-tab2,#tab6-tab3 が削除された状態になってます。
       */
      //というわけで、HTMLにJSで生成したDOMをぶっこみます。
      $t.find('.tab-contents').append($wrapBox);
      
      // さて、ようやく前準備が完了したので、ここからクリックした時の動きを書いていきます。
      // クリック時の動き
      $t.find('[data-tab-trigger]').on('click',function(e) {
        // thisをjQueryオブジェクトにして変数に格納。
        var $tl = $(this);
        // thisのdata-tab-triggerを取得。
        var _ids = $tl.data('tab-trigger');
        // 位置を取得しておきます。
        var _leftPositionNumbers = $('#'+_ids).position().left;
        // 全体のボックス、#wrapBoxをアニメーションさせます。
        $('#wrapBox').stop().animate({
          left: _leftPositionNumbers*-1
        });
        
      });
    };
  });
})();