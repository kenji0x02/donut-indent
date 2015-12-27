var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('uglify', function() {
  gulp.src('./lib/donut-indent.js')
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(concat('donut-indent.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['uglify']);
