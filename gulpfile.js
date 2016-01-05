var gulp = require('gulp');
var uglify = require('gulp-uglify');// $で使用
// for browserify
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
var header = require('gulp-header');// browserifyを使うとuglifyのpreserveCommentsが使えないので
var pkg = require('./package.json');
var sourcemaps = require('gulp-sourcemaps');

var copyright = [
  "/**",
  " * <%= pkg.name %> <%= pkg.version %>",
  " * Copyright (c) 2015, <%= pkg.author %>. <%= pkg.license%> Licensed",
  " * <%= pkg.homepage %> ",
  " */",
  ""
].join('\n');

gulp.task('uglify', function() {
  browserify({
    entries: ['lib/donut-indent.js'],
    debug: true
  })
    .bundle()
    .pipe(source('donut-indent.min.js')) // 出力ファイル名
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // sourcemaps
    .pipe($.uglify())
    .pipe(header(copyright, { // sourcemaps.writeよりも先に!
      pkg: pkg
    }))
    .pipe(sourcemaps.write('./')) // sourcemaps
    .pipe(gulp.dest('.'));
});
gulp.task('default', ['uglify']);
