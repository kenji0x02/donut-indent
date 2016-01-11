"use strict";

var assert = require('power-assert');
var utils = require('../src/utils.js')

describe('utils', function () {
  describe('#headingNumber(hObject)', function () {
    it('heading number for heading object', function () {
      var h1Object = document.createElement('h1');
      assert(utils.headingNumber(h1Object) === 1);
    });
  });
});