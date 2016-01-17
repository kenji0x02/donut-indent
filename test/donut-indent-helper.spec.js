"use strict";

var assert = require('power-assert');
var helper = require('../src/donut-indent-helper.js');

describe('helper', function () {
  var hObject1 = ['h1', 'h1'].map(function(el){
    return document.createElement(el);
  });

  var seqNo1 = [
    {1:1, 2:0, 3:0, headerNumber:1},
    {1:2, 2:0, 3:0, headerNumber:1}];

  var percentage1 = [
    {1:50, 2:0, 3:0, headerNumber:1},
    {1:100, 2:0, 3:0, headerNumber:1}
  ];

  var hObject2 = ['h1', 'h2', 'h2', 'h3','h3', 'h3', 'h2', 'h3', 'h3', 'h2', 'h3', 'h1'].map(function(el){
    return document.createElement(el);
  });

  var seqNo2 = [
    {1:1, 2:0, 3:0, headerNumber:1},
    {1:1, 2:1, 3:0, headerNumber:2},
    {1:1, 2:2, 3:0, headerNumber:2},
    {1:1, 2:2, 3:1, headerNumber:3},
    {1:1, 2:2, 3:2, headerNumber:3},
    {1:1, 2:2, 3:3, headerNumber:3},
    {1:1, 2:3, 3:0, headerNumber:2},
    {1:1, 2:3, 3:1, headerNumber:3},
    {1:1, 2:3, 3:2, headerNumber:3},
    {1:1, 2:4, 3:0, headerNumber:2},
    {1:1, 2:4, 3:1, headerNumber:3},
    {1:2, 2:0, 3:0, headerNumber:1}
  ];

  var percentage2 = [
    {1:50, 2:0, 3:0, headerNumber:1},
    {1:50, 2:25, 3:0, headerNumber:2},
    {1:50, 2:50, 3:0, headerNumber:2},
    {1:50, 2:50, 3:33, headerNumber:3},
    {1:50, 2:50, 3:67, headerNumber:3},
    {1:50, 2:50, 3:100, headerNumber:3},
    {1:50, 2:75, 3:0, headerNumber:2},
    {1:50, 2:75, 3:50, headerNumber:3},
    {1:50, 2:75, 3:100, headerNumber:3},
    {1:50, 2:100, 3:0, headerNumber:2},
    {1:50, 2:100, 3:100, headerNumber:3},
    {1:100, 2:0, 3:0, headerNumber:1}
  ];

  var hObject3 = ['h3', 'h1', 'h2'].map(function(el){
    return document.createElement(el);
  });

  var seqNo3 = [
    {1:0, 2:0, 3:1, headerNumber:3},
    {1:1, 2:0, 3:0, headerNumber:1},
    {1:1, 2:1, 3:0, headerNumber:2}
  ];

  var percentage3 = [
    {1:0, 2:0, 3:100, headerNumber:3},
    {1:100, 2:0, 3:0, headerNumber:1},
    {1:100, 2:100, 3:0, headerNumber:2}
  ];

  var hObject4 = ['h1'].map(function(el){
    return document.createElement(el);
  });

  var seqNo4 = [
    {1:1, 2:0, 3:0, headerNumber:1}];

  var percentage4 = [
    {1:100, 2:0, 3:0, headerNumber:1}
  ];

  describe('#createSequentialNo(hObject, headerTagNumbers)', function () {
    it('create sequential number object :simple case', function () {
      assert.deepEqual(helper.createSequentialNo(hObject1, [1, 2, 3]), seqNo1);
    });
  });

  describe('#createSequentialNo(hObject, headerTagNumbers)', function () {
    it('create sequential number object :complicated case', function () {
      assert.deepEqual(helper.createSequentialNo(hObject2, [1, 2, 3]), seqNo2);
    });
  });

  describe('#createSequentialNo(hObject, headerTagNumbers)', function () {
    it('create sequential number object :first heading tag is not h1 case', function () {
      assert.deepEqual(helper.createSequentialNo(hObject3, [1, 2, 3]), seqNo3);
    });
  });

  describe('#createSequentialNo(hObject, headerTagNumbers)', function () {
    it('create sequential number object : only h1', function () {
      assert.deepEqual(helper.createSequentialNo(hObject4, [1, 2, 3]), seqNo4);
    });
  });

  describe('#createPercentage(sequentialNo, headerTagNumbers)', function () {
    it('create percentage object :simple case', function () {
      assert.deepEqual(helper.createPercentage(seqNo1, [1, 2, 3]), percentage1);
    });
  });

  describe('#createPercentage(sequentialNo, headerTagNumbers)', function () {
    it('create percentage object :complicated case', function () {
      assert.deepEqual(helper.createPercentage(seqNo2, [1, 2, 3]), percentage2);
    });
  });

  describe('#createPercentage(sequentialNo, headerTagNumbers)', function () {
    it('create percentage object :first heading tag is not h3 case', function () {
      assert.deepEqual(helper.createPercentage(seqNo3, [1, 2, 3]), percentage3);
    });
  });

  describe('#createPercentage(sequentialNo, headerTagNumbers)', function () {
    it('create percentage object : only h1', function () {
      assert.deepEqual(helper.createPercentage(seqNo4, [1, 2, 3]), percentage4);
    });
  });

  describe('#createID(hObject, headerTagNumbers)', function () {
    it('create heading IDs array :simple case', function () {
      var expected = [
        "donut_indent_50_0_0",
        "donut_indent_100_0_0"
      ];
      assert.deepEqual(helper.createID(hObject1, [1, 2, 3]), expected);
    });
  });

  describe('#createID(hObject, headerTagNumbers)', function () {
    it('create heading IDs array :complicated case', function () {
      var expected = [
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
      assert.deepEqual(helper.createID(hObject2, [1, 2, 3]), expected);
    });
  });

  describe('#createID(hObject, headerTagNumbers)', function () {
    it('create heading IDs array :first heading tag is not h1 case', function () {
      var expected = [
        "donut_indent_0_0_100",
        "donut_indent_100_0_0",
        "donut_indent_100_100_0"
      ];
      assert.deepEqual(helper.createID(hObject3, [1, 2, 3]), expected);
    });
  });

  describe('#createID(hObject, headerTagNumbers)', function () {
    it('create heading IDs array :only h1', function () {
      var expected = [
        "donut_indent_100_0_0"
      ];
      assert.deepEqual(helper.createID(hObject4, [1, 2, 3]), expected);
    });
  });
});
