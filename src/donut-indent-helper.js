/**
 * donut-indent
 * Copyright (c) 2016, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */

'use strict';

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
  if(sequentialNo.length === 1) {
    headerTagNumbers.forEach(function(e) {
      if(e === sequentialNo[0][e]) {
        sequentialNo[0][e] = 100;
      } else {
        sequentialNo[0][e] = 0;
      }
    });
  }
  // 進捗率に変換
  for(var i = 1; i < sequentialNo.length; i++) {
    // ヘッダ階層が浅くなった時(例: h3からh2へ移った時)
    if(sequentialNo[i]['headerNumber'] < sequentialNo[i-1]['headerNumber']) {
      var normalizeHeader = headerTagNumbers.filter(isLarge, {headerNumber: sequentialNo[i]['headerNumber']});
      normalizeHeader.forEach(normalizeSeqNo, {maxIndex: i - 1, sequentialNo: sequentialNo});
    }
    // ラストのとき
    // この時は全部の要素について規格化しちゃえばいい
    if(i === (sequentialNo.length - 1)) {
      headerTagNumbers.forEach(normalizeSeqNo, {maxIndex: i, sequentialNo: sequentialNo});
    }
  }
  return sequentialNo;
}

function isLarge(el) { return el > this.headerNumber;}

function normalizeSeqNo(el) {
  var max = this.sequentialNo[this.maxIndex][el];
  for(var j = this.maxIndex; j >= 0; j--) {
    if(this.sequentialNo[j][el] === 0) {
      break;
    }
    this.sequentialNo[j][el] = Math.round(this.sequentialNo[j][el] / max * 100);
  }
}

function createID(hObject, headerTagNumbers) {
  var tag = createPercentage(createSequentialNo(hObject, headerTagNumbers), headerTagNumbers);

  // IDに変換(_で結合)
  return tag.map(function(el) {
    return HEADER_TAG_PREFIX + headerTagNumbers.map(function(e) {return el[e];}).join('_');
  });
}

function getHeaderFontSize(headerNumber) {
  return $(headerNumber + ':header').css('fontSize').replace('px', '') - 0;
}

function getHeaderLineHeight(headerNumber) {
  return $(headerNumber + ':header').css('line-height').replace('px', '') - 0;
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

module.exports = {
  createSequentialNo: createSequentialNo,
  createPercentage: createPercentage,
  createID: createID,
  getHeaderFontSize: getHeaderFontSize,
  getHeaderLineHeight: getHeaderLineHeight,
  calcIconHalfSize: calcIconHalfSize,
  calcMarginTop: calcMarginTop,
  calcCenter: calcCenter
};
