"use strict";

var assert = require('power-assert');
var modal = require('../src/modal.js')

describe('modal#getScrollBarWidth()', function () {
  it('non negative integer which depend on browser', function () {
    assert(modal._getScrollBarWidth() >= 0);
  });
});

describe('modal#getModalPosition(scrollSize, contentWidth, windowWidth, contentHeight, windowHeight)', function () {
  it('modal position(x, y) when content width & height is larger than window', function () {
    var expected = {x: 0, y: 0};
    assert.deepEqual(modal._getModalPosition(5, 100, 50, 80, 40), expected);
  });
});

describe('modal#getModalPosition(scrollSize, contentWidth, windowWidth, contentHeight, windowHeight)', function () {
  it('modal position(x, y) when content height is larger than window', function () {
    var expected = {x: 2.5, y: 0};
    assert.deepEqual(modal._getModalPosition(5, 40, 50, 80, 40), expected);
  });
});

describe('modal#getModalPosition(scrollSize, contentWidth, windowWidth, contentHeight, windowHeight)', function () {
  it('modal position(x, y) when content width is larger than window', function () {
    var expected = {x: 0, y: 7.5};
    assert.deepEqual(modal._getModalPosition(5, 100, 50, 20, 40), expected);
  });
});

describe('modal#getModalPosition(scrollSize, contentWidth, windowWidth, contentHeight, windowHeight)', function () {
  it('modal position(x, y) when content width & height is smaller than window', function () {
    var expected = {x: 5, y: 10};
    assert.deepEqual(modal._getModalPosition(5, 40, 50, 20, 40), expected);
  });
});
