// Base paths
var paths = {
  vendor        : './bower_components/',
  src           : './'
};

var targets = {
  theme: {
    // Assets of Kiwifruit
    main: {
      styles : paths.src + 'scss/kiwifruit.scss',
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
        paths.vendor + 'bootstrap-sass-official/assets/javascripts/bootstrap.js'
      ],
      fonts  : [
        paths.vendor + 'bootstrap-sass-official/assets/fonts/bootstrap/*',
        paths.vendor + 'font-awesome/fonts/*'
      ]
    },

    dest: './test/skin/frontend/kiwifruit/default/'
  },

  styleGuide: {
    main: {
      styles : paths.src + 'scss/style_guide.scss',
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
        paths.vendor + 'bootstrap-sass-official/assets/javascripts/bootstrap.js',
        paths.vendor + 'underscore/underscore.js',
        paths.vendor + 'prism/prism.js',
        paths.vendor + 'js-beautify/js/lib/beautify-html.js'
      ],
      fonts  : [
        paths.vendor + 'bootstrap-sass-official/assets/fonts/bootstrap/*',
        paths.vendor + 'font-awesome/fonts/*'
      ]
    },

    dest: './style_guide/'
  }
};

// Load plugins
var gulp                = require('gulp'),
    util                = require('gulp-util'),
    cache               = require('gulp-cache'),
    concat              = require('gulp-concat'),
    notify              = require('gulp-notify'),
    eventStream         = require('event-stream'),
    path                = require('path'),
    rimraf              = require('rimraf'),
    childProcess        = require('child_process');


// CSS plugins
//    sass                = require('gulp-ruby-sass'),
    sass                = require('gulp-sass'),
    autoprefixer        = require('gulp-autoprefixer'),
    combineMediaQueries = require('gulp-combine-media-queries'),
    cssmin              = require('gulp-cssmin'),

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
    .pipe(sass({
      style         : isProduction ? 'compressed' : 'expanded',
      sourcemap     : !isProduction,
      sourceComments: 'map',
    }))
    .on('error', notify.onError(function (error) {
      console.log(error);
      return 'SASS Error: ' + error.message;
    }))
    .on('error', function (error) {
      new util.PluginError('CSS', error, {showStack: true});
    })
    .pipe(autoprefixer('last 2 version'))
    .pipe(isProduction ? combineMediaQueries({log: true}) : util.noop())
    .pipe(isProduction ? cssmin() : util.noop())
    .pipe(gulp.dest(target.dest + 'css'))
    .pipe(notify('SASS compiled'));
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
    .on('error', notify.onError(function (error) {
      return 'Unglify Error: ' + error.message;
    }))
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

gulp.task('theme:clean', function (cb) { clean(targets.theme, cb); });

gulp.task('theme:vendor:css',  ['theme:clean'], function () { return buildVendorCss(targets.theme); });
gulp.task('theme:vendor:js',   ['theme:clean'], function () { return buildVendorJs(targets.theme); });
gulp.task('theme:vendor:font', ['theme:clean'], function () { return buildFont(targets.theme); });

gulp.task('theme:main:css', ['theme:clean'], function () { return buildMainCss(targets.theme); });
gulp.task('theme:main:js',  ['theme:clean'], function () { return buildMainJs(targets.theme); });
gulp.task('theme:main:img', ['theme:clean'], function () { return buildImg(targets.theme); });

gulp.task('style-guide:clean', function (cb) {
  //clean(targets.styleGuide, cb);
  cb();
});

gulp.task('style-guide:vendor:css',  ['style-guide:clean'], function () { return buildVendorCss(targets.styleGuide); });
gulp.task('style-guide:vendor:js',   ['style-guide:clean'], function () { return buildVendorJs(targets.styleGuide); });
gulp.task('style-guide:vendor:font', ['style-guide:clean'], function () { return buildFont(targets.styleGuide); });

gulp.task('style-guide:main:css', ['style-guide:clean'], function () { return buildMainCss(targets.styleGuide); });
gulp.task('style-guide:main:js',  ['style-guide:clean'], function () { return buildMainJs(targets.styleGuide); });
gulp.task('style-guide:main:img', ['style-guide:clean'], function () { return buildImg(targets.styleGuide); });

// Watch task
gulp.task('watch', ['default'], function (cb) {

  gulp.watch(targets.theme.vendor.styles, ['theme:vendor:css']);
  gulp.watch(targets.theme.vendor.scripts, ['theme:vendor:js']);
  gulp.watch(targets.theme.vendor.fonts, ['theme:vendor:font']);

  gulp.watch(targets.theme.main.styles, ['theme:main:css']);
  gulp.watch(targets.theme.main.scripts, ['theme:main:js']);
  gulp.watch(targets.theme.main.images, ['theme:main:img']);


  gulp.watch(targets.styleGuide.vendor.styles, ['style-guide:vendor:css']);
  gulp.watch(targets.styleGuide.vendor.scripts, ['style-guide:vendor:js']);
  gulp.watch(targets.styleGuide.vendor.fonts, ['style-guide:vendor:font']);

  gulp.watch(targets.styleGuide.main.styles, ['style-guide:main:css']);
  gulp.watch(targets.styleGuide.main.scripts, ['style-guide:main:js']);
  gulp.watch(targets.styleGuide.main.images, ['style-guide:main:img']);

  // Create LiveReload server
  var server = require('gulp-livereload');

  // Watch any files in , reload on change
  gulp.watch([
    targets.theme.dest + '**/*',
    targets.styleGuide.dest + '_site/**/*'
  ]).on('change', server.changed);

  server.listen();

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
