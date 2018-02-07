var gulp = require('gulp');

// Define variables.
var autoprefixer  = require('autoprefixer');
var babel         = require('gulp-babel');
var cleancss      = require('gulp-clean-css');
var concat        = require('gulp-concat');
var del           = require('del');
var gulp          = require('gulp');
var postcss       = require('gulp-postcss');
var runSequence   = require('run-sequence');
var sass          = require('gulp-sass');
var uglify        = require('gulp-uglify');

/**
 * ----------------------------------------
 *  VARIABLES
 * ----------------------------------------
 */
var paths = {
  src: 'src/',
  dest: 'dist/',
  bulma: 'node_modules/bulma/sass/utilities/',
  jsPattern: '**/*.js'
}
var mainSassFile   = 'calendar.sass';
var globalSassFile = 'bulma-calendar.sass';
var bulmaSassFile  = '_all.sass';
var mainCssFile    = 'bulma-calendar.min.css';
var mainJsFile     = 'datepicker.min.js';

/**
 * ----------------------------------------
 *  STYLESHEETS
 * ----------------------------------------
 */

// Uses Sass compiler to process styles, adds vendor prefixes, minifies, then
// outputs file to the appropriate location.
gulp.task('build:styles', ['build:styles:copy'], function() {
  return gulp.src([paths.bulma + bulmaSassFile, paths.src + mainSassFile])
    .pipe(concat(globalSassFile))
    .pipe(sass({
      style: 'compressed',
      includePaths: [paths.bulma]
    }))
    .pipe(concat(mainCssFile))
    .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
    .pipe(cleancss())
    .pipe(gulp.dest(paths.dest));
});

// Copy original sass file to dist
gulp.task('build:styles:copy', function() {
  return gulp.src(paths.src + mainSassFile)
    .pipe(gulp.dest(paths.dest));
})

gulp.task('clean:styles', function(callback) {
  del([
    paths.dest + mainSassFile,
    paths.dest + mainCssFile
  ]);
  callback();
});

/**
 * ----------------------------------------
 *  JAVASCRIPT
 * ----------------------------------------
 */

// Concatenates and uglifies global JS files and outputs result to the
// appropriate location.
gulp.task('build:scripts', function() {
  return gulp
    .src([paths.src + paths.jsPattern])
    .pipe(concat(mainJsFile))
    .pipe(babel({
      "presets": [
        ["@babel/preset-env",  {
          "targets": {
            "browsers": ["last 2 versions"]
          }
        }]
      ]
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('clean:scripts', function(callback) {
  del([
    paths.dest + mainJsFile
  ]);
  callback();
});

// Deletes the entire _site directory.
gulp.task('clean', ['clean:scripts', 'clean:styles']);

/**
 * ----------------------------------------
 *  GLOBAL BUILD
 * ----------------------------------------
 */
gulp.task('build', function(callback) {
  runSequence('clean',
    ['build:scripts', 'build:styles'],
    callback);
});

/**
 * ----------------------------------------
 *  DEFAULT TASK
 * ----------------------------------------
 */
gulp.task('default', ['build']);
