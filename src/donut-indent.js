/**
 * donut-indent
 * Copyright (c) 2015, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */

(function($){
  "use strict";

  var modal = require('./modal.js');
  var utils = require('./utils.js');
  var helper = require('./donut-indent-helper.js');

  var DARKEN_PERCENTAGE_DIFF = 10;

  function initializeCanvasSize(iconSize, marginTop, canvas) {
    $(canvas).css('margin-top', marginTop);
    $(canvas).css('margin-right', marginTop);
    canvas.width = iconSize;
    canvas.height = iconSize;
  }

  function renderDonut(radius, center, percentage, colorCode, canvas) {
    var ctx = canvas.getContext("2d");
    var ninetyDegree = 1.5707963267948966; // 90*Math.PI/180;
    var startRadian = -ninetyDegree;
    var endRadian = ninetyDegree * (percentage * 0.04 - 1);
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startRadian, endRadian, false);
    ctx.fillStyle = colorCode;
    ctx.fill();
  }

  function renderDonutIndent(canvasID) {
    var indentArray = canvasID.replace("donut_indent_", "").split("_").map(function(el){
      return el - 0;
    });
    var headerTag = "h" + indentArray.filter(function(el, index, array){return (el != 0);}).length;
    var fontSize = helper.getHeaderFontSize(headerTag);
    var lineHeight = helper.getHeaderLineHeight(headerTag);
    var iconHalfSize = helper.calcIconHalfSize(fontSize);
    var marginTop = helper.calcMarginTop(lineHeight, fontSize);
    var center = helper.calcCenter(fontSize);
    var canvas = document.getElementById(canvasID);

    // canvasの設定
    initializeCanvasSize(iconHalfSize * 2, marginTop, canvas);

    // 外側の円から描画していく
    indentArray.forEach(function(el, index, array) {
      var radius = Math.round(iconHalfSize * DonutIndent.radiusRatio[index]);
      // 100%の円
      renderDonut(radius - 1, center, 100, "#fff", canvas);
      // 扇型
      renderDonut(radius, center, el, DonutIndent.color[index], canvas);
    });
  }

  // ヘッダの先頭にcanvasを挿入
  function appendCanvas(hObject, headerIDs) {
    $.each(hObject, function(index, value) {
      $(value).wrap('<div></div>');
      var canvasHTML = '<div class="donut-indent" style="float:left;"><canvas id="' + headerIDs[index] + '"></div>';
      $(value).before(canvasHTML);
    });
  }

  function appendDonutIndent() {
    var hObject = $(":header").filter(function(index, el){return (utils.headingNumber(el) <= DonutIndent.settings.indentDepth)});
    var headerIDs = helper.createID(hObject, DonutIndent.headerTagNumbers);
    appendCanvas(hObject,headerIDs);
    headerIDs.forEach(function(el) {
      renderDonutIndent(el);
    });
    var overlayContent = require('./overlay-content.js');
    var content = overlayContent.create(hObject, headerIDs);
    overlayContent.initialize();
    $('#modal-content').append(content);
  }

  var DonutIndent = {};

  DonutIndent = {
    defaults: {
      indentDepth: 3,
      color: "#59bb0c",
      gammaValue: 1.8
    },

    settings: $.extend(true, {}, DonutIndent.defaults),

    init: function(options) {
      var color = require('./color.js');
      DonutIndent.settings = $.extend(DonutIndent.defaults, options);
      DonutIndent.headerTagNumbers = Array.apply(null, Array(DonutIndent.settings.indentDepth)).map(function (_, i) {return i+1;});
      DonutIndent.radiusRatio = $.extend(true, [], DonutIndent.headerTagNumbers).reverse().map(function(el) {
        return Math.pow(1.0 * el / DonutIndent.headerTagNumbers.length, 1 / DonutIndent.settings.gammaValue);
      });
      DonutIndent.color = DonutIndent.headerTagNumbers.map(function(el) {
        return color.darken(DonutIndent.settings.color, DARKEN_PERCENTAGE_DIFF * (el - 1));
      });
    }
  };

  // export
  $.donutIndent = function(options){
    DonutIndent.init(options);
    appendDonutIndent();
  }

})(jQuery);

// べた書きのHTMLを書き換えるために読み込み時にも実行
$.donutIndent();
