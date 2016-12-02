var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();

gulp.task('server', function() {
    browserSync.init({
        server: "./"
    });
    gulp.watch("build/jade/**/*.jade", ['jade']);
    // gulp.watch("html/**").on('change', browserSync.reload);

    gulp.watch("build/stylus/*.styl", ['stylus']);
    // gulp.watch("css/**").on('change', browserSync.reload);

    // gulp.watch("script/**").on('change', browserSync.reload);
    // gulp.watch("*.html").on('change', browserSync.reload);
});
gulp.task('default', ['server']);

gulp.task('jade', function() {
  return gulp.src('build/jade/template/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('demo/html'));
});

gulp.task('stylus', function() {
  return gulp.src('build/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('demo/css'));
});