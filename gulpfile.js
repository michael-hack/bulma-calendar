const pkg = require('./package.json');
const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const camelCase = require('camelcase');
const cleancss = require('gulp-clean-css');
const colors = require('ansi-colors');
const concat = require('gulp-concat');
const del = require('del');
const dependencies = require('./dependencies-injector');
const fs = require('fs');
const log = require('fancy-log');
const nop = require('gulp-nop');
const postcss = require('gulp-postcss');
const run = require('gulp-run');
const uglify = require('gulp-uglify');
const minifycss = require('gulp-minify-css');

const gulpSass = require('gulp-sass');
const dartSass = require('sass');
const sass = gulpSass(dartSass);

/**
 * ----------------------------------------
 *  VARIABLES
 * ----------------------------------------
 */
const paths = {
  src: 'src/',
  dist: 'dist/',
  demo: 'demo/',
  assets: 'assets/',
  bulma: 'node_modules/bulma/sass/utilities/',
  pattern: {
    sass: '**/*.sass',
    js: '**/*.js',
    image: '**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)',
    html: '**/*.html',
    xml: '**/*.xml'
  }
};
const config = {
  sass: {
    input: 'index.sass',
    dependencies: [paths.bulma + '_all.sass'],
    output: {
      filename: pkg.name,
      format: 'expanded'
    },
    source: paths.src + 'sass/',
    destination: paths.dist + 'css/'
  },
  javascript: {
    input: 'index.js',
    output: {
      name: camelCase(pkg.name),
      filename: pkg.name,
      format: 'umd'
    },
    source: paths.src + 'js/',
    destination: paths.dist + 'js/'
  }
};

/**
 * ----------------------------------------
 *  BUILD STYLESHEETS TASKS
 * ----------------------------------------
 */
// Uses Sass compiler to process styles, adds vendor prefixes, minifies, then
// outputs file to the appropriate location.
gulp.task('build:styles', function () {
  if (fs.existsSync(config.sass.source + config.sass.input)) {
    return gulp
      .src(config.sass.dependencies.concat([config.sass.source + config.sass.input]))
      .pipe(concat(config.sass.output.filename + '.sass'))
      .pipe(sass({
        style: config.sass.output.format,
        trace: true,
        loadPath: [config.sass.source],
        includePaths: ['node_modules', paths.bulma]
      }))
      .pipe(postcss([autoprefixer({
        browsers: pkg.browsers
      })]))

      .pipe(concat(config.sass.output.filename + '.css'))
      .pipe(gulp.dest(config.sass.destination))

      .pipe(minifycss())
      .pipe(concat(config.sass.output.filename + '.min.css'))
      .pipe(gulp.dest(config.sass.destination))

  } else {
    return gulp.src('.').pipe(nop());
  }
});

gulp.task('clean:styles', function () {
  return del([
    config.sass.destination + config.sass.output.filename + '.css',
    config.sass.destination + config.sass.output.filename + '.min.css'
  ]);
});

gulp.task('copy:styles', function () {
    return gulp
        .src(config.sass.destination + config.sass.output.filename + '.min.css')
        .pipe(gulp.dest(paths.src + paths.demo + paths.assets + 'css'))
        .pipe(gulp.dest(paths.demo + paths.assets + 'css'));
});

/**
 * ----------------------------------------
 *  BUILD JAVASCRIPT TASKS
 * ----------------------------------------
 */

// Concatenates and uglifies global JS files and outputs result to the
// appropriate location.
gulp.task('build:scripts', function () {
  if (fs.existsSync(config.javascript.source + config.javascript.input)) {
    return gulp
      .src(config.javascript.source + config.javascript.input)
      .pipe(webpackStream({
        output: {
          filename: config.javascript.output.filename + '.js',
          library: config.javascript.output.name,
          libraryTarget: config.javascript.output.format,
          libraryExport: 'default'
        },
        mode: 'production',
        module: {
          rules: [{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            options: {
              babelrc: './babelrc'
            }
          }, ],
        },
        performance: {
          hints: false,
        },
      }), webpack)

      .pipe(concat(config.javascript.output.filename + '.js'))
      .pipe(gulp.dest(config.javascript.destination))

      .pipe(concat(config.javascript.output.filename + '.min.js'))
      .pipe(uglify({
            keep_fnames: true,
            ie8: false,
          }).on('error', function (err) {
        log(colors.red('[Error]'), err.toString());
      }))
      .pipe(gulp.dest(config.javascript.destination)
        .on('error', function (err) {
          log(colors.red('[Error]'), err.toString());
        })
      )
  } else {
    return gulp.src('.').pipe(nop());
  }
});

gulp.task('clean:scripts', function () {
  return del([
    config.javascript.destination + config.javascript.output.filename + '.js',
    config.javascript.destination + config.javascript.output.filename + '.min.js'
  ]);
});

gulp.task('copy:scripts', function () {
    return gulp
        .src(config.javascript.destination + config.javascript.output.filename + '.min.js')
        .pipe(gulp.dest(paths.src + paths.demo + paths.assets + 'js'))
        .pipe(gulp.dest(paths.demo + paths.assets + 'js'));
});

/**
 * ----------------------------------------
 *  GLOBAL TASKS
 * ----------------------------------------
 */

gulp.task('clean', function () {
    return del(paths.dist);
});

gulp.task('build', gulp.series('clean', 'build:styles', 'build:scripts', 'copy:styles', 'copy:scripts'));

gulp.task('sync', function(callback) {
    browserSync.reload();
    callback();
})

gulp.task('watch', gulp.series('build', function() {

    browserSync.init({
        server: paths.demo,
        ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
        logFileChanges: true,
        logLevel: 'debug',
        open: true // Toggle to automatically open page when starting.
    });

    gulp.watch(config.javascript.source + paths.pattern.js, gulp.series('build:scripts', 'copy:scripts', 'sync'));
    gulp.watch(config.sass.source + paths.pattern.sass, gulp.series('build:styles', 'copy:styles', 'sync'));

}));

/**
 * ----------------------------------------
 *  DEFAULT TASK
 * ----------------------------------------
 */
gulp.task('default', gulp.series('build', function (done) {
  done();
}));

gulp.task('build:demo', function () {
  browserSync.notify('Compiling Demo');

  var shellCommand = `bundle exec jekyll build --source=${paths.src + paths.demo} --destination=${paths.demo} --config _config.yml`;
  return gulp.src('.')
    .pipe(run(shellCommand));
});

gulp.task('clean:demo', function (callback) {
  browserSync.notify('Cleaning Demo');
  return del(paths.demo);
  // callback();
});

gulp.task('demo:dependencies', gulp.series('build:demo', function () {
  browserSync.notify('Updating Demo dependencies');
  return gulp.src(paths.demo + paths.pattern.html)
    .pipe(dependencies({
      src: paths.demo,
      dest: 'assets/js',
      dependenciesPath: './'
    }))
    .pipe(gulp.dest(paths.demo));
}));

/**
 * ----------------------------------------
 *  WATCH TASKS
 * ----------------------------------------
 */
gulp.task('build:scripts:watch', gulp.series('build:scripts', function (callback) {
  browserSync.reload();
  callback();
}));

gulp.task('build:styles:watch', gulp.series('build:styles', function (callback) {
  browserSync.reload();
  callback();
}));

gulp.task('build:demo:watch', gulp.series('demo:dependencies', function (callback) {
  browserSync.reload();
  callback();
}));

/**
 * ----------------------------------------
 *  DEMO
 * ----------------------------------------
 */

// Static Server + watching files.
// Note: passing anything besides hard-coded literal paths with globs doesn't
// seem to work with gulp.watch().
gulp.task('launch:demo', gulp.series('demo:dependencies', function () {
  browserSync.init({
    server: paths.demo,
    ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
    logFileChanges: true,
    logLevel: 'debug',
    open: true // Toggle to automatically open page when starting.
  });

  // Watch site settings.
  gulp.watch('_config.yml', gulp.series('build:demo:watch'));

  // Watch .sass files; changes are piped to browserSync.
  gulp.watch('src/sass/**/*.sass', gulp.series('build:styles:watch'));
  gulp.watch('src/demo/**/*.css', gulp.series('copy:styles'));

  // Watch .js files.
  gulp.watch('src/js/**/*.js', gulp.series('build:scripts:watch'));
  gulp.watch('src/demo/**/*.js', gulp.series('copy:scripts'));

  // Watch html and markdown files.
  gulp.watch('src/demo/**/*.+(html|md|markdown|MD)', gulp.series('build:demo:watch'));

  // Watch favicon.png.
  gulp.watch('favicon.png', gulp.series('build:demo:watch'));
  return gulp.src('.').pipe(nop());
}));

// Build and Launch Demo site
gulp.task('demo', gulp.series(
  'clean:demo',
  gulp.parallel('build:scripts', 'build:styles'),
  'build:demo',
  'launch:demo',
  function () {

  }
));
