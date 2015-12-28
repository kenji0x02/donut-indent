/**
 * donut-indent
 * Copyright (c) 2015, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */

module.exports.darken = function(color, percentage) {
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
