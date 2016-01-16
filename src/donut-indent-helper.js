/**
 * donut-indent
 * Copyright (c) 2016, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */

"use strict";

var HEADER_TAG_PREFIX = 'donut_indent_';
var utils = require('./utils.js');

function createSequentialNo(hObject, headerTagNumbers) {
  var initialTag = {};
  headerTagNumbers.forEach(function(el) {
    initialTag[el] = 0;
  });

  var sequentialNo = [];

  $.each(hObject, function(index, value) {
    var headers = $.extend(true, {}, initialTag);
    if(index > 0) {
      headers = $.extend(true, {}, sequentialNo[index - 1]);
    }

    var headerNumber = utils.headingNumber(value);

    // set tagNumber
    headers['headerNumber'] = headerNumber;

    // count up
    headers[headerNumber] += 1;

    // reset
    headerTagNumbers.forEach(function(el) {
      if(el > headerNumber) {
        headers[el] = 0;
      }
    });
    sequentialNo.push(headers);
  });
  return sequentialNo;
}

function createPercentage(sequentialNo, headerTagNumbers) {
  // 進捗率に変換
  for(var i = 1; i < sequentialNo.length; i++) {
    // ヘッダ階層が浅くなった時(例: h3からh2へ移った時)
    if(sequentialNo[i]['headerNumber'] < sequentialNo[i-1]['headerNumber']) {
      var normalizeHeader = headerTagNumbers.filter(function(el) {
        return (el > sequentialNo[i]['headerNumber']);
      });

      normalizeHeader.forEach(function(el) {
        var max = sequentialNo[i-1][el];
        for(var j = i - 1; j >= 0; j--) {
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
      headerTagNumbers.forEach(function(el) {
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

function createID(hObject, headerTagNumbers) {
  var tag = createPercentage(createSequentialNo(hObject, headerTagNumbers), headerTagNumbers);

  // IDに変換(_で結合)
  return tag.map(function(el) {
    return HEADER_TAG_PREFIX + headerTagNumbers.map(function(e) {return el[e];}).join('_');
  });
}

module.exports = {
  createSequentialNo: createSequentialNo,
  createPercentage: createPercentage,
  createID: createID
}
