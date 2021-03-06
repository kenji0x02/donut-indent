![Donut Indent](https://raw.githubusercontent.com/kenji0x02/images/master/donut.png)

# Donut Indent

[![Build Status](https://travis-ci.org/kenji0x02/donut-indent.svg)](https://travis-ci.org/kenji0x02/donut-indent)
[![Code Climate](https://codeclimate.com/repos/569a4945b23bff7a6c00d04a/badges/dc425ef6736572a5df7c/gpa.svg)](https://codeclimate.com/repos/569a4945b23bff7a6c00d04a/feed)

Visualization tool for HTML heading tags(\<h1>...\<h6>) using "donut" chart.

## Demo

https://kenji0x02.github.io/donut-indent/sample.html


## Option

|name|meaning|default|
|:--|:--|:--|
|indentDepth|HTML heading depth|3 (i.e. h1, h2, and h3)|
|color|color of outermost donut|#59bb0c|

## Install

```
bower install donut-indent --save
```

## Usage

Static HTML:

```html
<script src="./jquery.min.js" type="text/javascript"></script>
<script src="./donut-indent.min.js" type="text/javascript"></script>
```

With Markdown Parser (ex. marked.js):

```html
<div id="markdown_content" src="markdown_file.md"></div>

<script src="./jquery.min.js" type="text/javascript"></script>
<script src="./marked.min.js" type="text/javascript"></script>
<script src="./donut-indent.min.js" type="text/javascript"></script>
<script>
$(document).ready(function(){
  var target = $("#markdown_content");

  $.ajax({
    url: target[0].attributes["src"].value,
  }).done(function(data){
    target.append(marked(data));
  }).fail(function(data){
    target.append("This content failed to load.");
  }).always(function(data){
    $.donutIndent({indentDepth: 3});
  });
});
</script>
```

## Test

```
npm test
```

## License

Donut-Indent is available under the [MIT license](https://github.com/kenji0x02/donut-indent/blob/master/LICENSE).
