// Base paths
var paths = {
  vendor        : './bower_components/',
  src           : './'
};

var targets = {
  theme: {
    // Assets of Kiwifruit
    main: {
      styles : paths.src + 'less/kiwifruit.less',
      scripts: [ // The last one will be the name of final concatenated file
        paths.src + 'js/_noconflict.js',
        paths.src + 'js/kiwifruit.js'
      ],
      images : paths.src + 'images/*'
    },

    // Vendor assets
    vendor: {
      styles : paths.vendor + 'animate.css/animate.css',
      scripts: [
        paths.vendor + 'jquery/dist/jquery.js',
        paths.vendor + 'underscore/underscore.js',
        paths.vendor + 'bootstrap/dist/js/bootstrap.js'
      ],
      fonts  : [
        paths.vendor + 'bootstrap/dist/fonts/*',
        paths.vendor + 'font-awesome/fonts/*'
      ]
    },

    dest: './test/skin/frontend/kiwifruit/default/'
  },

  styleGuide: {
    main: {
      styles : paths.src + 'less/style_guide.less',
      scripts: [ // The last one will be the name of final concatenated file
        paths.src + 'js/style_guide.js'
      ],
      images : paths.src + 'images/*'
    },

    vendor: {
      styles : [
        paths.vendor + 'animate.css/animate.css',
        paths.vendor + 'prism/themes/prism.css'
      ],
      scripts: [
        paths.vendor + 'jquery/dist/jquery.js',
        paths.vendor + 'bootstrap/dist/js/bootstrap.js',
        paths.vendor + 'underscore/underscore.js',
        paths.vendor + 'prism/prism.js',
        paths.vendor + 'js-beautify/js/lib/beautify-html.js'
      ],
      fonts  : [
        paths.vendor + 'bootstrap/dist/fonts/*',
        paths.vendor + 'font-awesome/fonts/*'
      ]
    },

    dest: './style_guide/'
  }
};

// Load plugins
var gulp                = require('gulp'),
    util                = require('gulp-util'),
    concat              = require('gulp-concat'),
    notify              = require('gulp-notify'),
    path                = require('path'),
    rimraf              = require('rimraf'),
    sourcemaps          = require('gulp-sourcemaps'),


// CSS plugins
//    sass                = require('gulp-ruby-sass'),
    sass                = require('gulp-sass'),
    autoprefixer        = require('gulp-autoprefixer'),
    combineMediaQueries = require('gulp-combine-media-queries'),
    cssmin              = require('gulp-cssmin'),
    less                = require('gulp-less'),

    // JS plugins
    jshint              = require('gulp-jshint'),
    uglify              = require('gulp-uglify'),

    // Image plugins
    imagemin            = require('gulp-imagemin');

// Allows gulp --dist to be run for production compilation
var isProduction = false;
if (util.env.dist) {
  isProduction = true;
}

function buildVendorCss(target) {
  return gulp.src(target.vendor.styles)
    .pipe(concat('vendor.css'))
    .pipe(autoprefixer('last 2 version'))
    .pipe(isProduction ? combineMediaQueries({log: true}) : util.noop())
    .pipe(isProduction ? cssmin() : util.noop())
    .pipe(gulp.dest(target.dest + 'css'));
}

function buildMainCss(target) {
  return gulp.src(target.main.styles)
    //.pipe(sass({
    //  style         : isProduction ? 'compressed' : 'expanded',
    //  sourcemap     : !isProduction,
    //  sourceComments: 'map',
    //  errLogToConsole: true,
    //}))
    //.pipe(sourcemaps.init())
    .pipe(less())
    //.pipe(sourcemaps.write())
    .on('error', notify.onError(function (error) {
      return 'CSS compiling Error: ' + error.message;
    }))
    .on('error', function (error) {
      new util.PluginError('CSS', error, {showStack: true});
    })
    .pipe(autoprefixer('last 2 version'))
    .pipe(isProduction ? combineMediaQueries({log: true}) : util.noop())
    .pipe(isProduction ? cssmin() : util.noop())
    .pipe(gulp.dest(target.dest + 'css'))
    .pipe(notify('CSS compiled'));
}

// Vender scripts
function buildVendorJs(target) {
  // Modernizr.js
  gulp.src(paths.vendor + 'modernizr/modernizr.js')
    .pipe(isProduction ? uglify() : util.noop())
    .pipe(gulp.dest(target.dest + 'js'));

  return gulp.src(target.vendor.scripts)
    .pipe(concat('vendor.js'))
    .pipe(isProduction ? uglify() : util.noop())
    .pipe(gulp.dest(target.dest + 'js'));
}

// Custom scripts
function buildMainJs(target) {
  var scripts = target.main.scripts;
  return gulp.src(scripts)
    .pipe(concat(path.basename(scripts[scripts.length - 1])))
    .pipe(isProduction ? uglify() : util.noop())
    .on('error', notify.onError(function (error) {
      return 'Unglify Error: ' + error.message;
    }))
    .pipe(gulp.dest(target.dest + 'js'))
    .pipe(notify({message: 'JS Compiled'}));
}

// Fonts
function buildFont(target) {
  return gulp.src(target.vendor.fonts)
    .pipe(gulp.dest(target.dest + 'fonts'));
}

function buildImg(target) {
  return gulp.src(target.main.images)
    .pipe(imagemin())
    .on('error', notify.onError(function (error) {
      return 'Imagemin Error: ' + error.message;
    }))
    .pipe(gulp.dest(target.dest + 'images'))
    .pipe(notify({message: 'Images optimized'}));
}

function clean(target, cb) {
  rimraf(target.dest, cb);
}

function runJekyll(options, cb) {
  var spawn = require('child_process').spawn,
      jekyll = spawn('jekyll', options);

  jekyll.stdout.on('data', function (data) { process.stdout.write(data); });
  jekyll.stderr.on('data', function (data) { process.stdout.write(data); });
  jekyll.on('close', function() { cb(); })
}

gulp.task('theme:clean', function (cb) {
  clean(targets.theme, cb);
});

gulp.task('theme:vendor:css',  function () { return buildVendorCss(targets.theme); });
gulp.task('theme:vendor:js',   function () { return buildVendorJs(targets.theme); });
gulp.task('theme:vendor:font', function () { return buildFont(targets.theme); });

gulp.task('theme:main:css', function () { return buildMainCss(targets.theme); });
gulp.task('theme:main:js',  function () { return buildMainJs(targets.theme); });
gulp.task('theme:main:img', function () { return buildImg(targets.theme); });

gulp.task('style-guide:clean', function (cb) {
  clean(targets.styleGuide, cb);
});

gulp.task('style-guide:vendor:css',  function () { return buildVendorCss(targets.styleGuide); });
gulp.task('style-guide:vendor:js',   function () { return buildVendorJs(targets.styleGuide); });
gulp.task('style-guide:vendor:font', function () { return buildFont(targets.styleGuide); });

gulp.task('style-guide:main:css', function () { return buildMainCss(targets.styleGuide); });
gulp.task('style-guide:main:js',  function () { return buildMainJs(targets.styleGuide); });
gulp.task('style-guide:main:img', function () { return buildImg(targets.styleGuide); });

// Watch task
gulp.task('watch', ['theme'], function (cb) {
  gulp.watch(paths.src+'less/**/*', ['theme:main:css']);
  gulp.watch(targets.theme.main.scripts, ['theme:main:js']);
  gulp.watch(targets.theme.main.images, ['theme:main:img']);

  // Create LiveReload server
  var server = require('gulp-livereload');
  server.listen();

  gulp.watch([
    targets.theme.dest + '**/*',
    'magento/layout/*.xml',
    'magento/template/**/*.phtml',
  ]).on('change', server.changed);
});

gulp.task('watch:style-guide', ['style-guide'], function (cb) {
  gulp.watch(paths.src+'less/**/*', ['style-guide:main:css']);
  gulp.watch(targets.styleGuide.main.scripts, ['style-guide:main:js']);
  gulp.watch(targets.styleGuide.main.images, ['style-guide:main:img']);

  // Create LiveReload server
  var server = require('gulp-livereload');
  server.listen();

  gulp.watch([
    targets.styleGuide.dest + '_site/**/*'
  ]).on('change', server.changed);

  runJekyll(['serve', '-w', '--skip-initial-build'], cb);
});

// Build the theme
gulp.task('theme', [
  'theme:vendor:css',
  'theme:vendor:js',
  'theme:vendor:font',

  'theme:main:css',
  'theme:main:js',
  'theme:main:img'
]);

// Build the style guide
gulp.task('style-guide', [
  'style-guide:vendor:css',
  'style-guide:vendor:js',
  'style-guide:vendor:font',

  'style-guide:main:css',
  'style-guide:main:js',
  'style-guide:main:img'
], function (cb) {
  runJekyll(['build'], cb);
});

// Default task
gulp.task('default', [
    'theme',
    'style-guide'
]);