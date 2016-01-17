/**
 * donut-indent
 * Copyright (c) 2015, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */

module.exports.darken = function(color, percentage) {
  if((percentage - 0) < 0 || (percentage - 0) > 100) {
    return null;
  }
  var rgb = splitRGB(color);
  var hls = rgbToHls(rgb[0], rgb[1], rgb[2]);
  var darkenRgb = hlsToRgb(hls.h, hls.l - percentage * 0.01, hls.s);
  return rgbCode(darkenRgb.r, darkenRgb.g, darkenRgb.b);
};

function splitRGB(rgbWithSharp) {
  var rgbArray = [];
  var rgb = rgbWithSharp.replace(/^#/, '');
  if(rgb.length === 6){
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
  return '#' + [r, g, b].map(function(el) {
    return el.toString(16).replace(/^[0-9a-f]$/, '0$&');
  }).join('');
}

function rgbToHls(r, g, b) {
  // 0..1 に変換
  r = r / 255;
  g = g / 255;
  b = b / 255;
  var max = Math.max(Math.max(r, g), b);
  var min = Math.min(Math.min(r, g), b);

  var h = calcHueFromRGB(r, g, b, max, min); // 0..360
  var l = calcLightnessFromRGB(r, g, b, max, min); // 0..1
  var s = calcSaturationFromRGB(r, g, b, max, min, l); // 0..1

  return {'h': h, 'l': l, 's': s, 'type': 'HLS'};
}

function calcHueFromRGB(r, g, b, max, min) {
  var h = 0;
  if (max === min) {
    h = 0; // 本来は定義されないが、仮に0を代入
  } else if (max === r) {
    h = 60 * (g - b) / (max - min) + 0;
  } else if (max === g) {
    h = (60 * (b - r) / (max - min)) + 120;
  } else {
    h = (60 * (r - g) / (max - min)) + 240;
  }
  return (h % 360 + 360) % 360;
}

function calcLightnessFromRGB(r, g, b, max, min) {
  return (max + min) / 2;
}

function calcSaturationFromRGB(r, g, b, max, min, l) {
  if (max === min) {
    return 0;
  } else {
    return (l < 0.5)
      ? (max - min) / (max + min)
      : (max - min) / (2.0 - max - min);
  }
}

function hlsToRgb(h, l, s) {
  h = (h % 360 + 360) % 360;// jsでは負の数の時の剰余演算子の結果も負の数

  // 特別な場合 saturation = 0
  if (s === 0) {
    // → RGB は V に等しい
    l = Math.round(l * 255);
    return {'r': l, 'g': l, 'b': l, 'type': 'RGB'};
  }

  var m2 = (l < 0.5) ? l * (1 + s) : l + s - l * s,
    m1 = l * 2 - m2;

  var r = calcRGBElement((h + 120) % 360, m1, m2);
  var g = calcRGBElement(h, m1, m2);
  var b = calcRGBElement((h - 120) % 360, m1, m2);

  return {'r': Math.round(r * 255), 'g': Math.round(g * 255), 'b': Math.round(b * 255), 'type': 'RGB'};
}

function calcRGBElement(tmp, m1, m2) {
  if (tmp < 60) {
    return m1 + (m2 - m1) * tmp / 60;
  } else if (tmp < 180) {
    return m2;
  } else if (tmp < 240) {
    return m1 + (m2 - m1) * (240 - tmp) / 60;
  } else {
    return m1;
  }
}
