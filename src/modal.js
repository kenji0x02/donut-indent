/**
 * donut-indent
 * Copyright (c) 2016, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */

// リファレンス
// https://syncer.jp/jquery-modal-window
// http://coolwebwindow.com/jquery-lab/archives/352


// 新たに生成した要素でjQueryイベントが有効にならないので
// documentに対してクリックイベントを登録する。ただしパフォーマンスは低下。
// $(".donut-indent").on('click', function() {
$(document).on('click','.donut-indent', function() {
  // html、bodyを固定（cssでoverflow:hiddenにする)
  $('html, body').addClass('lock');

  //新しくモーダルウィンドウを起動しない
  if($('#modal-overlay').length > 0) return false;

  //オーバーレイ用のHTMLコードを、[body]内の最後に生成する
  $('body').append('<div id="modal-overlay"></div>');

  //[$modal-overlay]をフェードインさせる
  $('#modal-overlay').fadeIn('slow');

  $('#modal-content').wrap('<div id="modal-wrap"></div>');
  $('#modal-wrap').show();

  //コンテンツをセンタリングする
  centeringModalSyncer();

  //[$modal-content]をフェードインさせる
  $('#modal-content').fadeIn('slow');

  $('#modal-wrap, .overlay_anchor').off().on('click', function() {
    //[#modal-overlay]と[#modal-close]をフェードアウトする
    $('#modal-content,#modal-overlay').fadeOut('slow',function() {
      // html、bodyの固定解除
      $('html, body').removeClass('lock');
      //フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
      $('#modal-overlay').remove();
      $('#modal-content').unwrap('<div id="modal-wrap"></div>');
    });
  });
});

//センタリングをする関数
function centeringModalSyncer() {
  var w = $(window).width();
  var h = $(window).height();
  var cw = $('#modal-content').outerWidth();
  var ch = $('#modal-content').outerHeight();

  var scrollSize = getScrollBarWidth();
  var position = getModalPosition(scrollSize, cw, w, ch, h);
  $('#modal-content').css({'left': position.x + 'px','top': position.y + 'px'});
}

// 最近のブラウザのスクロールバーは非表示なので大抵ゼロですけどね。。
function getScrollBarWidth() {
  $('html').append('<div class="scrollbar" style="overflow:scroll;"></div>');
  var scrollsize = window.innerWidth - $('.scrollbar').prop('clientWidth');
  $('.scrollbar').hide();
  return scrollsize;
}

function getModalPosition(scrollSize, contentWidth, windowWidth, contentHeight, windowHeight) {
  var diffX = contentWidth - windowWidth;
  var diffY = contentHeight - windowHeight;
  if(diffX > 0 && diffY > 0) {
    return {x:0, y:0};
  } else if(diffX < 0 && diffY > 0) {
    return {x:(-diffX - scrollSize)/2, y:0};
  } else if(diffX > 0 && diffY < 0) {
    return {x:0, y:(-diffY - scrollSize)/2};
  } else {
    return {x:-diffX/2, y:-diffY/2};
  }
}

//リサイズされたら、センタリングをする関数[centeringModalSyncer()]を実行する
$(window).resize(centeringModalSyncer);

module.exports = {
  _getScrollBarWidth: getScrollBarWidth,
  _getModalPosition: getModalPosition
};
