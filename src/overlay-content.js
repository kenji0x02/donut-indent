/**
 * donut-indent
 * Copyright (c) 2016, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */
var utils = require('./utils.js');

function ulElement(hObject, headerIDs) {
  var content = braUl(1);
  var ulCount = 0;

  // pre(最初の要素のヘッダーインデントが最小とは限らない)
  var preHeadingDiff = utils.headingNumber(hObject[0]) - minHeadingNumber(hObject);
  content += braUl(preHeadingDiff);
  ulCount += preHeadingDiff;

  // main
  for(var i = 0; i < hObject.length - 1; i++) {
    var value = hObject[i];
    content += listElement($(value).text(), headerIDs[i]);

    var headingDiff = utils.headingNumber(hObject[i+1]) - utils.headingNumber(hObject[i]);
    content += braUl(headingDiff);
    content += ketUl(headingDiff);

    ulCount += headingDiff;
  }

  var lastValue = hObject[hObject.length - 1];
  content += listElement($(lastValue).text(), headerIDs[hObject.length - 1]);

  // post
  content += ketUl(-ulCount - 1);

  return content;
}

function listElement(text, id) {
  var anchorID = toOverlayAnchorID(id);
  return '<li><a class="overlay_anchor" href="#' + id + '" id="' + anchorID + '">' + text + '</a></li>';
}

// header numberが減った時は<ul>を増やす
function braUl(headingDiff){
  var bra = '';
  if(headingDiff > 0){
    for(var j = 0; j < headingDiff; j++) {
      bra += '<ul>';
    }
  }
  return bra;
}

// header numberが増えた時は</ul>を増やす
function ketUl(headingDiff){
  var ket = '';
  if(headingDiff < 0){
    for(var j = 0; j < -headingDiff; j++) {
      ket += '</ul>';
    }
  }
  return ket;
}

function minHeadingNumber(hObject) {
  var min = 6;
  $.each(hObject, function(index, value) {
    var hNo = utils.headingNumber(value);
    if(hNo < min) {
      min = hNo;
    }
  });
  return min;
}

function initializeOverlayContent() {
  if($('#modal-content').length > 0) {
    $('#modal-content').children().remove();
  } else {
    $('body').append('<div id="modal-content"></div>');
  }
}

$(document).on('click','.donut-indent', function() {
  var id = '#' + toOverlayAnchorID($(this).children('canvas').attr('id'));
  $(id).css('font-weight', 'bold');
  $('#modal-wrap, .overlay_anchor').on('click', function() {
    $(id).css('font-weight', '');
  });
});

function toOverlayAnchorID(id) {
  return id + '_overlay';
}

module.exports = {
  create: ulElement,
  initialize: initializeOverlayContent
};
