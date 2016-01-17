"use strict";

var assert = require('power-assert');
var color = require('../src/color.js')

describe('color', function () {
  describe('#darken()', function () {
    it('correct color code when 90%', function () {
      assert(color.darken("#FFF", 90) === "#191919");
    });
  });

  describe('#darken()', function () {
    it('correct color code when 0%', function () {
      assert(color.darken("#FFF", 0) === "#ffffff");
    });
  });
  
  describe('#darken()', function () {
    it('correct color code when 100%', function () {
      assert(color.darken("#FFF", 100) === "#000000");
    });
  });

  describe('#darken()', function () {
    it('null when minus percentage', function () {
      assert(color.darken("#FFF", -10) === null);
    });
  });

  describe('#darken()', function () {
    it('null when larger than 100 percentage', function () {
      assert(color.darken("#FFF", 150) === null);
    });
  });
});
