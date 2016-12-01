var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var minifycss = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync').create();

gulp.task('server', function() {
    browserSync.init({
        server: "./demo"
    });
    gulp.watch("demo/build/jade/**/*.jade", ['jade']);
    gulp.watch("demo/html/**").on('change', browserSync.reload);

    gulp.watch("demo/build/stylus/*.styl", ['stylus']);
    gulp.watch("demo/css/**").on('change', browserSync.reload);

    gulp.watch("demo/script/**").on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
});
gulp.task('default', ['server']);

gulp.task('jade', function() {
  return gulp.src('demo/build/jade/template/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('demo/html'));
});

gulp.task('stylus', function() {
  return gulp.src('demo/build/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('demo/css'));
});


gulp.task('minifyhtml', function() {
  return gulp.src('demo/build/jade/template/*.jade')
    .pipe(jade())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeSciptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('app/studycenterApp/html'));
});

gulp.task('minifycss', ['stylus'], function() {
  return gulp.src([
    'demo/css/*.css',
    ])
    // .pipe(concat('studycenterapp.css'))
    // .pipe(gulp.dest('app/css/'))
    .pipe(minifycss())
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest('app/studycenterApp/css/'))
});
gulp.task('minifyjs', function() {
  return gulp.src('demo/script/**\/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('app/studycenterApp/script'))
});

gulp.task('minifyLibs', function() {
  return gulp.src([
    'demo/[^bchs]**/**',
    'demo/index.html',
    'demo/config.xml'
    ])
    .pipe(gulpif(['*.html'],htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeSciptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    })))
    .pipe(gulp.dest('app/studycenterApp'))
});
gulp.task('clean',function(){
  //del(['app/**','!app']);
})
gulp.task('build', ['clean'], function(){
  gulp.run(['minifyLibs','minifyhtml','minifycss','minifyjs',]);
})
