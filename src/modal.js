/**
 * donut-indent
 * Copyright (c) 2016, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */

// リファレンス
// https://syncer.jp/jquery-modal-window
// http://coolwebwindow.com/jquery-lab/archives/352

// スクロールバーの横幅を取得
$('html').append('<div class="scrollbar" style="overflow:scroll;"></div>');
var scrollsize = window.innerWidth - $('.scrollbar').prop('clientWidth');
$('.scrollbar').hide();

// 新たに生成した要素でjQueryイベントが有効にならないので
// documentに対してクリックイベントを登録する。ただしパフォーマンスは低下。
// $(".donut-indent").on('click', function() {
$(document).on('click',".donut-indent", function() {
  // html、bodyを固定（cssでoverflow:hiddenにする)
  $('html, body').addClass('lock');

  //新しくモーダルウィンドウを起動しない
  if($("#modal-overlay").length > 0) return false;

  //オーバーレイ用のHTMLコードを、[body]内の最後に生成する
  $("body").append('<div id="modal-overlay"></div>');

  //[$modal-overlay]をフェードインさせる
  $("#modal-overlay").fadeIn("slow");

  $('#modal-content').wrap("<div id='modal-wrap'></div>");
  $('#modal-wrap').show();

  //コンテンツをセンタリングする
  centeringModalSyncer();

  //[$modal-content]をフェードインさせる
  $("#modal-content").fadeIn("slow");

  $("#modal-wrap, .overlay_anchor").off().on('click', function() {
    //[#modal-overlay]と[#modal-close]をフェードアウトする
    $("#modal-content,#modal-overlay").fadeOut("slow",function() {
      // html、bodyの固定解除
      $('html, body').removeClass('lock');
      //フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
      $("#modal-overlay").remove();
      $("#modal-content").unwrap("<div id='modal-wrap'></div>");
    });
  });
});

//センタリングをする関数
function centeringModalSyncer() {

  //画面(ウィンドウ)の幅を取得し、変数[w]に格納
  var w = $(window).width();

  //画面(ウィンドウ)の高さを取得し、変数[h]に格納
  var h = $(window).height();

  //コンテンツ(#modal-content)の幅を取得し、変数[cw]に格納
  var cw = $("#modal-content").outerWidth();

  //コンテンツ(#modal-content)の高さを取得し、変数[ch]に格納
  var ch = $("#modal-content").outerHeight();

  if ((ch > h) && (cw > w)) {
    $('#modal-content').css({'left': 0 + 'px','top': 0 + 'px'});
  } else if ((ch > h) && (cw < w)) {
    var x = (w - scrollsize - cw) / 2;
    $('#modal-content').css({'left': x + 'px','top': 0 + 'px'});
  } else if ((ch < h) && (cw > w)) {
    var y = (h - scrollsize - ch) / 2;
    $('#modal-content').css({'left': 0 + 'px','top': y + 'px'});
  } else {
    var x = (w - cw) / 2;
    var y = (h - ch) / 2;
    $('#modal-content').css({'left': x + 'px','top': y + 'px'});
  }
};

//リサイズされたら、センタリングをする関数[centeringModalSyncer()]を実行する
$( window ).resize( centeringModalSyncer ) ;
