/**
 * donut-indent
 * Copyright (c) 2015, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */

(function($){
  "use strict";

  var HEADER_TAG_PREFIX = 'donut_indent_';

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
      var radius = Math.round(iconHalfSize * DonutIndent.radiusRatio[index]);
      // 100%の円
      renderDonut(radius - 1, center, 100, "#fff", canvas);
      // 扇型
      renderDonut(radius, center, el, DonutIndent.color[index], canvas);
    });
  }

  function darken(color, percentage) {
    var rgb = splitRGB(color);
    var hls = rgbToHls(rgb[0], rgb[1], rgb[2]);
    var darkenRgb = hlsToRgb(hls.h, hls.l - percentage * 0.01, hls.s);
    return rgbCode(darkenRgb.r, darkenRgb.g, darkenRgb.b)
  }

  function splitRGB(rgb) {
    var rgbArray = [];
    var rgb = rgb.replace(/^#/, "");
    if(rgb.length == 6){
      rgbArray = rgb.match(/.{2}/g).map(function (c) {
        return parseInt(c, 16);
      });
    }else {
      rgbArray = rgb.split('').map(function (c) {
        return parseInt(c + c, 16);
      });
    }
    return rgbArray;
  }

  function rgbCode(r, g, b){
    return "#" + [r, g, b].map(function(el) {
      return el.toString(16).replace(/^[0-9a-f]$/, "0$&");
    }).join("");
  }

  function rgbToHls(r, g, b) {
    var h, // 0..360
        l, s; // 0..1

    // 0..1 に変換
    r = r / 255;
    g = g / 255;
    b = b / 255;
    var max = Math.max(Math.max(r, g), b),
      min = Math.min(Math.min(r, g), b);

    // hue の計算
    if (max == min) {
      h = 0; // 本来は定義されないが、仮に0を代入
    } else if (max == r) {
      h = 60 * (g - b) / (max - min) + 0;
    } else if (max == g) {
      h = (60 * (b - r) / (max - min)) + 120;
    } else {
      h = (60 * (r - g) / (max - min)) + 240;
    }

    while (h < 0) {
      h += 360;
    }

    // Lightness の計算
    l = (max + min) / 2;

    // Saturation の計算
    if (max == min) {
      s = 0;
    } else {
      s = (l < 0.5)
        ? (max - min) / (max + min)
        : (max - min) / (2.0 - max - min);
    }

    return {'h': h, 'l': l, 's': s, 'type': 'HLS'};
  }

  function hlsToRgb(h, l, s) {
    var r, g, b; // 0..255

    while (h < 0) {
      h += 360;
    }
    h = h % 360;

    // 特別な場合 saturation = 0
    if (s == 0) {
      // → RGB は V に等しい
      l = Math.round(l * 255);
      return {'r': l, 'g': l, 'b': l, 'type': 'RGB'};
    }

    var m2 = (l < 0.5) ? l * (1 + s) : l + s - l * s,
        m1 = l * 2 - m2,
        tmp;

    tmp = h + 120;
    if (tmp > 360) {
      tmp = tmp - 360
    }

    if (tmp < 60) {
      r = (m1 + (m2 - m1) * tmp / 60);
    } else if (tmp < 180) {
      r = m2;
    } else if (tmp < 240) {
      r = m1 + (m2 - m1) * (240 - tmp) / 60;
    } else {
      r = m1;
    }

    tmp = h;
    if (tmp < 60) {
      g = m1 + (m2 - m1) * tmp / 60;
    } else if (tmp < 180) {
      g = m2;
    } else if (tmp < 240) {
      g = m1 + (m2 - m1) * (240 - tmp) / 60;
    } else {
      g = m1;
    }

    tmp = h - 120;
    if (tmp < 0) {
      tmp = tmp + 360
    }
    if (tmp < 60) {
      b = m1 + (m2 - m1) * tmp / 60;
    } else if (tmp < 180) {
      b = m2;
    } else if (tmp < 240) {
      b = m1 + (m2 - m1) * (240 - tmp) / 60;
    } else {
      b = m1;
    }

    return {'r': Math.round(r * 255), 'g': Math.round(g * 255), 'b': Math.round(b * 255), 'type': 'RGB'};
  }

  // hタグを連番に変換
  function createSequentilNo(hObject) {
    var initialTag = {};
    DonutIndent.headerTagNumbers.forEach(function(el) {
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
      DonutIndent.headerTagNumbers.forEach(function(el) {
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
        var normalizeHeder = DonutIndent.headerTagNumbers.filter(function(el) {
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
        DonutIndent.headerTagNumbers.forEach(function(el, index, array) {
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
      return HEADER_TAG_PREFIX + DonutIndent.headerTagNumbers.map(function(e) {return el[e];}).join('_');
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

  var DonutIndent = {};

  DonutIndent = {
    defaults: {
      indentDepth: 3,
      color: "#59bb0c",
      gammmaValue: 1.8
    },

    settings: $.extend(true, {}, DonutIndent.defaults),

    init: function(options) {
      DonutIndent.settings = $.extend(DonutIndent.defaults, options);
      DonutIndent.headerTagNumbers = Array.apply(null, Array(DonutIndent.settings.indentDepth)).map(function (_, i) {return i+1;});
      DonutIndent.radiusRatio = $.extend(true, [], DonutIndent.headerTagNumbers).reverse().map(function(el) {
        return Math.pow(1.0 * el / DonutIndent.headerTagNumbers.length, 1 / DonutIndent.settings.gammmaValue);
      });
      DonutIndent.color = DonutIndent.headerTagNumbers.map(function(el) {
        return darken(DonutIndent.settings.color, 15 * (el - 1));
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
