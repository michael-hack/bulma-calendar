var package                     = require('./package.json')
var gulp                        = require('gulp');

// Define variables.
var autoprefixer                = require('autoprefixer');
var babel                       = require('gulp-babel');
var bump                        = require('gulp-bump');
var camelCase                   = require('camelcase');
var cleancss                    = require('gulp-clean-css');
var concat                      = require('gulp-concat');
var conventionalChangelog       = require('gulp-conventional-changelog');
var del                         = require('del');
var fs                          = require('fs');
var git                         = require('gulp-git');
var gutil                       = require('gulp-util');
var postcss                     = require('gulp-postcss');
var rollup                      = require('gulp-better-rollup');
var runSequence                 = require('run-sequence');
var sass                        = require('gulp-sass');
var sourcemaps                  = require('gulp-sourcemaps');
var spawn                       = require('child_process').spawn;
var minify                      = require('gulp-babel-minify');

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
var bulmaSassFile  = '_all.sass';
var globalSassFile = package.name + '.sass';
var globalJsFile   = package.name + '.js';
var mainSassFile   = 'extension.sass';
var mainJsFile     = 'extension.js';
var distCssFile    = package.name + '.min.css';
var distJsFile     = package.name + '.min.js';

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
     .pipe(concat(distCssFile))
     .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
     .pipe(cleancss())
     .pipe(gulp.dest(paths.dest));
 });

 // Copy original sass file to dist
 gulp.task('build:styles:copy', function() {
   return gulp.src(paths.src + mainSassFile)
     .pipe(concat(globalSassFile))
     .pipe(gulp.dest(paths.dest));
 });

gulp.task('clean:styles', function(callback) {
  del([
    paths.dest + mainSassFile,
    paths.dest + distCssFile
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
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(rollup({
        plugins: [babel({
          babelrc: false,
          sourceMaps: true,
          exclude: 'node_modules/**',
          presets: [
            ["@babel/preset-env",  {
              "modules": false,
              "targets": {
                "browsers": gutil.env.babelTarget ? gutil.env.babelTarget : ["last 2 versions"]
              }
            }]
          ]
        })]
      }, {
        format: gutil.env.jsFormat ? gutil.env.jsFormat : 'umd',
        name: camelCase(package.name)
      }
    ))
    .pipe(concat(globalJsFile))
    .pipe(gulp.dest(paths.dest))
    .pipe(concat(distJsFile))
    .pipe(minify().on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString())
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('clean:scripts', function(callback) {
  del([
    paths.dest + mainJsFile,
    paths.dest + distJsFile
  ]);
  callback();
});

// Deletes the entire dist directory.
gulp.task('clean', ['clean:scripts', 'clean:styles'], function(callback) {
  del(paths.dest);
  callback();
});

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

/**
 * ----------------------------------------
 *  GITHUB TASKS
 * ----------------------------------------
 */
gulp.task('github:checkout:master', function (callback) {
 git.checkout('master', {}, callback);
});

gulp.task('github:pull:master', ['github:checkout:master'], function(done) {
  git.pull('origin', 'master', {}, done);
});

gulp.task('github:checkout:source', ['github:pull:master'], function(done) {
  if (gutil.env.b) {
    git.checkout(gutil.env.b, {}, done);
  } else {
    git.checkout('develop', {}, done);
  }
});

gulp.task('github:pull:source', ['github:checkout:source'], function(done) {
  if (!gutil.env.b) {
    git.pull('origin', 'develop', {args: '--ff-only'}, done);
  } else {
    done();
  }
});

gulp.task('github:commit', function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'));
});

gulp.task('github:checkout:develop', function (callback) {
  git.checkout('develop', {}, callback);
});

gulp.task('github:merge:master', function (callback) {
  if (gutil.env.b) {
    git.merge(gutil.env.b, {args: '--no-ff'}, callback);
  } else {
    git.merge('release/newRelease', {args: '--no-ff'}, callback);
  }
});

gulp.task('github:merge:develop', function (callback) {
  git.merge('master', {args: '--no-ff'}, callback);
});

gulp.task('github:branch:create', ['bump-version'], function(callback) {
  if (!gutil.env.b) {
    git.checkout('release/newRelease', {args: '-b'}, callback);
  } else {
    callback();
  }
});

gulp.task('github:branch:delete', function (callback) {
  if (gutil.env.b) {
    git.branch(gutil.env.b, {args: '-d'}, callback);
  } else {
    git.branch('release/newRelease', {args: '-d'}, callback);
  }
});

gulp.task('github:push', function (callback) {
  git.push('origin', ['develop', 'master'], {args: " --tags"}, callback);
});

gulp.task('github:create-new-tag', function(callback) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return callback(error);
    }
    git.push('origin', 'master', {args: '--tags'}, callback);
  });

  function getPackageJsonVersion () {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

gulp.task('github:commit', ['bump-version', 'changelog', 'github:branch:create'], function() {
  var files = ['./package.json', './bower.json'].concat('./CHANGELOG.md');
  return gulp.src(files)
    .pipe(git.commit('bump version number ' + gutil.env.v));
});

/**
 * ----------------------------------------
 *  BUMP CODE VERSION
 * ----------------------------------------
 */
gulp.task('bump-version', ['github:pull:source'], function () {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type: gutil.env.type ? gutil.env.type : 'patch' })
    .on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

/**
 * ----------------------------------------
 *  GENERATE CHANGELOG
 * ----------------------------------------
 */
gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', {
      buffer: false
    })
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});

/**
 * ----------------------------------------
 *  PUBLISH ON NPM
 * ----------------------------------------
 */
gulp.task('npm:publish', function(done) {
  spawn('npm', ['publish'], { stdio: 'inherit' }).on('close', done);
});

/**
 * ----------------------------------------
 *  GENERATE A NEW GITHUB RELEASE
 *  FOLLOWING GIT-FLOW
 * ----------------------------------------
 */
gulp.task('release', ['build'], function(callback) {
  runSequence(
    'github:commit',
    'github:checkout:master',
    'github:merge:master',
    'github:create-new-tag',
    'github:checkout:develop',
    'github:merge:develop',
    'github:branch:delete',
    'github:push',
    // 'github:release',
    'npm:publish',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});
