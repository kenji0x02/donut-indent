"use strict";

var assert = require('power-assert');
var overlayContent = require('../src/overlay-content.js');

describe('overlay-content#create(hObject, headerIDs)', function () {
  var hObject1 = ['h1', 'h1'].map(function(el){
    return document.createElement(el);
  });

  var ids1 = [
    "donut_indent_50_0_0",
    "donut_indent_100_0_0"
  ];

  var hObject2 = ['h1', 'h2', 'h2', 'h3','h3', 'h3', 'h2', 'h3', 'h3', 'h2', 'h3', 'h1'].map(function(el){
    return document.createElement(el);
  });

  var ids2 = [
    "donut_indent_50_0_0",
    "donut_indent_50_25_0",
    "donut_indent_50_50_0",
    "donut_indent_50_50_33",
    "donut_indent_50_50_67",
    "donut_indent_50_50_100",
    "donut_indent_50_75_0",
    "donut_indent_50_75_50",
    "donut_indent_50_75_100",
    "donut_indent_50_100_0",
    "donut_indent_50_100_100",
    "donut_indent_100_0_0"
  ];

  var hObject3 = ['h3', 'h1', 'h2'].map(function(el){
    return document.createElement(el);
  });

  var ids3 = [
    "donut_indent_0_0_100",
    "donut_indent_100_0_0",
    "donut_indent_100_100_0"
  ];

  it('create ul element: simple case', function () {
    var expected =
      '<ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_0_0" id="donut_indent_50_0_0_overlay"></a></li>' +
      '<li><a class="overlay_anchor" href="#donut_indent_100_0_0" id="donut_indent_100_0_0_overlay"></a></li>' +
      '</ul>';
    assert.equal(overlayContent.create(hObject1, ids1), expected);
  });

  it('create ul element: complicated case', function () {
    var expected =
      '<ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_0_0" id="donut_indent_50_0_0_overlay"></a></li>' +
      '<ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_25_0" id="donut_indent_50_25_0_overlay"></a></li>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_50_0" id="donut_indent_50_50_0_overlay"></a></li>' +
      '<ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_50_33" id="donut_indent_50_50_33_overlay"></a></li>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_50_67" id="donut_indent_50_50_67_overlay"></a></li>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_50_100" id="donut_indent_50_50_100_overlay"></a></li>' +
      '</ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_75_0" id="donut_indent_50_75_0_overlay"></a></li>' +
      '<ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_75_50" id="donut_indent_50_75_50_overlay"></a></li>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_75_100" id="donut_indent_50_75_100_overlay"></a></li>' +
      '</ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_100_0" id="donut_indent_50_100_0_overlay"></a></li>' +
      '<ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_50_100_100" id="donut_indent_50_100_100_overlay"></a></li>' +
      '</ul>' +
      '</ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_100_0_0" id="donut_indent_100_0_0_overlay"></a></li>' +
      '</ul>';
    assert.equal(overlayContent.create(hObject2, ids2), expected);
  });

  it('create ul element: first heading tag is not h1', function () {
    var expected =
      '<ul>' +
      '<ul>' +
      '<ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_0_0_100" id="donut_indent_0_0_100_overlay"></a></li>' +
      '</ul>' +
      '</ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_100_0_0" id="donut_indent_100_0_0_overlay"></a></li>' +
      '<ul>' +
      '<li><a class="overlay_anchor" href="#donut_indent_100_100_0" id="donut_indent_100_100_0_overlay"></a></li>' +
      '</ul>' +
      '</ul>';
    assert.equal(overlayContent.create(hObject3, ids3), expected);
  });
});

describe('overlay-content#initialize()', function () {
  beforeEach(function(){
    $('#modal-content').remove();
  });

  afterEach(function() {
    $('#modal-content').remove();
  });

  it('remove content if #modal-content exists', function () {
    var testDom = '<div id="modal-content"><a>exist</a></div>';
    $('body').append(testDom);
    overlayContent.initialize();
    assert.equal($('#modal-content').children().length, 0);
  });

  it('append div if #modal-content does not exist', function () {
    overlayContent.initialize();
    assert.equal($('#modal-content').length, 1);
  });
});
