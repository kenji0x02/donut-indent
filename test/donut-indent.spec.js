"use strict";

var assert = require('power-assert');

describe('donut-indent#createID(hObject, headerTagNumbers)', function () {
  afterEach(function(){
    document.body.innerHTML = '';
  });

  it('append donut-indent when static html only for h1', function () {
    document.body.innerHTML = '<h1>header1</h1>';
    $.donutIndent();
    assert($('#donut_indent_100_0_0').width() > 0);
    assert($('#donut_indent_100_0_0').height() > 0);
  });

  it('append donut-indent when static html for h1, h2, h3', function () {
    document.body.innerHTML = '<h1>header1</h1>' +
      '<h2>header2</h2>' +
      '<h3>header3</h3>';
    $.donutIndent();
    assert($('#donut_indent_100_0_0').width() > 0);
    assert($('#donut_indent_100_0_0').height() > 0);
    assert($('#donut_indent_100_100_0').width() > 0);
    assert($('#donut_indent_100_100_0').height() > 0);
    assert($('#donut_indent_100_100_100').width() > 0);
    assert($('#donut_indent_100_100_100').height() > 0);
  });
});
