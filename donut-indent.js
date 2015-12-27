/**
 * donut-indent
 * Copyright (c) 2015, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */

var DonutIndent = (function($){
  "use strict";

  var HEADER_TAG_PREFIX = 'donut_indent_';
  var HEADER_TAG_DEPTH = 3;
  var HEADER_TAG_NUMBERS = Array.apply(null, Array(HEADER_TAG_DEPTH)).map(function (_, i) {return i+1;});
  var RADIUS_RADIO = $.extend(true, [], HEADER_TAG_NUMBERS).reverse().map(function(el) {
    return Math.pow(1.0 * el / HEADER_TAG_NUMBERS.length, 1 / 1.8);
  });

  function getHeaderFontSize(headerNumber) {
    return $(headerNumber + ":header").css('fontSize').replace("px", "") - 0;
  }

  function getHeaderLineHeight(headerNumber) {
    return $(headerNumber + ":header").css('line-height').replace("px", "") - 0;
  }

  function calcIconHalfSize(fontSize) {
    return Math.round(fontSize * 0.45);
  }

  function calcMarginTop(lineHeight, fontSize) {
    return Math.round(fontSize * 0.05 + (lineHeight - fontSize) * 0.5);
  }

  function calcCenter(fontSize) {
    return Math.round(fontSize * 0.45);
  }

  function initializeCanvasSize(iconSize, marginTop, canvas) {
    $(canvas).css('margin-top', marginTop)
    $(canvas).css('margin-right', marginTop)
    canvas.width = iconSize;
    canvas.height = iconSize;
  }

  function renderDonut(redius, center, percentage, colorCode, canvas) {
    var ctx = canvas.getContext("2d");
    var ninetyDegree = 1.5707963267948966; // 90*Math.PI/180;
    var startRadian = -ninetyDegree;
    var endRadian = ninetyDegree * (percentage * 0.04 - 1);
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, redius, startRadian, endRadian, false);
    ctx.fillStyle = colorCode;
    ctx.fill();
  }

  function renderDonutIndent(canvasID) {
    var indentArray = canvasID.replace("donut_indent_", "").split("_").map(function(el){
      return el - 0;
    });
    var headerTag = "h" + indentArray.filter(function(el, index, array){return (el != 0);}).length;
    var fontSize = getHeaderFontSize(headerTag);
    var lineHeight = getHeaderLineHeight(headerTag);
    var iconHalfSize = calcIconHalfSize(fontSize);
    var marginTop = calcMarginTop(lineHeight, fontSize);
    var center = calcCenter(fontSize);
    var canvas = document.getElementById(canvasID);

    // canvasの設定
    initializeCanvasSize(iconHalfSize * 2, marginTop, canvas);

    // 外側の円から描画していく
    indentArray.forEach(function(el, index, array) {
      var radius = Math.round(iconHalfSize * RADIUS_RADIO[index]);
      // 100%の円
      renderDonut(radius - 1, center, 100, "#fff", canvas);
      // 扇型
      var color = "#59bb0c";
      if(index == 1) {
        color = "#40A200";
      } else if (index == 2) {
        color = "#268800";
      }
      renderDonut(radius, center, el, color, canvas);
    });
  }

  // hタグを連番に変換
  function createSequentilNo(hObject) {
    var initialTag = {};
    HEADER_TAG_NUMBERS.forEach(function(el) {
      initialTag[el] = 0;
    });

    var sequentialNo = [];

    $.each(hObject, function(index, value) {
      var headers = $.extend(true, {}, initialTag);
      if(index > 0) {
        headers = $.extend(true, {}, sequentialNo[index - 1]);
      }

      var headerNumber = value.tagName.replace("H", "") - 0;

      // set tagNumber
      headers['headerNumber'] = headerNumber;

      // count up
      headers[headerNumber] += 1;

      // reset
      HEADER_TAG_NUMBERS.forEach(function(el) {
        if(el > headerNumber) {
          headers[el] = 0;
        }
      });
      sequentialNo.push(headers);
    });
    return sequentialNo;
  }

  function createPercentage(sequentialNo) {
    // 進捗率に変換
    for(var i = 1; i < sequentialNo.length; i++) {
      // ヘッダ階層が浅くなった時(例: h3からh2へ移った時)
      if(sequentialNo[i]['headerNumber'] < sequentialNo[i-1]['headerNumber']) {
        var normalizeHeder = HEADER_TAG_NUMBERS.filter(function(el) {
          return (el > sequentialNo[i]['headerNumber']);
        });

        normalizeHeder.forEach(function(el, index, array) {
          var max = sequentialNo[i-1][el];
          for(var j = i - 1; j > 0; j--) {
            if(sequentialNo[j][el] == 0) {
              break;
            }
            sequentialNo[j][el] = Math.round(sequentialNo[j][el] / max * 100);
          }
        });
      }
      // ラストのとき
      // この時は全部の要素について規格化しちゃえばいい
      if(i == (sequentialNo.length - 1)) {
        HEADER_TAG_NUMBERS.forEach(function(el, index, array) {
          var max = sequentialNo[i][el];
          for(var j = i; j >= 0; j--) {
            if(sequentialNo[j][el] == 0) {
              break;
            }
            sequentialNo[j][el] = Math.round(sequentialNo[j][el] / max * 100);
          }
        });
      }
    }
    return sequentialNo;
  }

  function createID(hObject) {
    var tag = createPercentage(createSequentilNo(hObject));

    // IDに変換(_で結合)
    return tag.map(function(el, index, array) {
      return HEADER_TAG_PREFIX + HEADER_TAG_NUMBERS.map(function(e) {return el[e];}).join('_');
    });
  }

  // ヘッダの先頭にcanvasを挿入
  function appendCanvas(hObject, headerIDs) {
    $.each(hObject, function(index, value) {
      $(value).wrap('<div></div>');
      var canvasHTML = '<div style="float:left;"><canvas id="' + headerIDs[index] + '"></div>';
      $(value).before(canvasHTML);
    });
  }

  function appendDonutIndent() {
    var hObject = $(":header");
    var headerIDs = createID(hObject);
    appendCanvas(hObject,headerIDs);
    headerIDs.forEach(function(el) {
      renderDonutIndent(el);
    });
  }

  // べた書きのHTMLを書き換えるために読み込み時にも実行
  appendDonutIndent();

  // marked等利用してmarkdownを読み込む時のためにエクスポート
  return appendDonutIndent;

})(jQuery);
