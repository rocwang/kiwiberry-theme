// Load plugins
var gulp                = require('gulp'),

    // Utility plugins
    util                = require('gulp-util'),
    del                 = require('del'),
    sourcemaps          = require('gulp-sourcemaps'),
    merge               = require('merge-stream'),
    livereload          = require('gulp-livereload'),
    plumber             = require('gulp-plumber'),
    notify              = require('gulp-notify'),
    path                = require('path'),

    // CSS plugins
    less                = require('gulp-less'),
    minifyCss           = require('gulp-minify-css'),
    autoprefixer        = require('gulp-autoprefixer'),
    combineMediaQueries = require('gulp-combine-media-queries'),

    // JS plugins
    jshint              = require('gulp-jshint'),
    uglify              = require('gulp-uglify'),
    concat              = require('gulp-concat'),

    // Image plugins
    imagemin            = require('gulp-imagemin'),
    svgSprite           = require('gulp-svg-sprite');

// Allows gulp --dist to be run for production compilation
var isProduction = util.env.dist ? true : false;

// Base paths
var paths = {
  vendor: './bower_components/',
  src   : './skin/frontend/kiwiberry/default/'
};

// Target definitions
var targets = {
  theme: {
    less: [
      'less/vendor.less',
      'less/app.less'
    ],
    js  : [
      'js/vendor.js',
      'js/app.js'
    ],
    img : 'images/*',
    icon: 'icons/*.svg',
    font: [
      'bootstrap/dist/fonts/*',
      'font-awesome/fonts/*'
    ],
    dest: (isProduction ? './dist/' : './test/') + 'skin/frontend/kiwiberry/default/'
  },

  styleGuide: {
    less: [
      'less/style-guide-vendor.less',
      'less/style-guide.less'
    ],
    js  : [
      'js/style-guide-vendor.js',
      'js/style-guide.js'
    ],
    img : 'images/*',
    font: [
      'bootstrap/dist/fonts/*',
      'font-awesome/fonts/*'
    ],
    dest: './style-guide/'
  }
};

var onError = notify.onError("Error: <%= error.message %>");

function buildCss(target) {
  return gulp.src(target.less, {cwd: paths.src})

    .pipe(plumber({errorHandler: onError}))
    .on('error', console.error.bind(console))

    .pipe(isProduction ? util.noop() : sourcemaps.init())
    .pipe(less({
      paths: [
        paths.vendor
      ]
    }))
    .pipe(isProduction ? combineMediaQueries({log: true}) : util.noop())
    .pipe(isProduction ? minifyCss() : util.noop())

      // These 2 lines is for working around the source map issue with autoprefixer
      .pipe(sourcemaps.write())
      .pipe(sourcemaps.init({loadMaps: true}))

      .pipe(autoprefixer({
          browsers: 'last 2 version',
          cascade : false
      }))

    .pipe(isProduction ? util.noop() : sourcemaps.write('.'))

    .pipe(gulp.dest(target.dest + 'css'));
}

function buildJs(target) {
  // Modernizr.js
  var modernizr = gulp.src(paths.vendor + 'modernizr/modernizr.js')

    .pipe(plumber({errorHandler: onError}))
    .on('error', console.error.bind(console))

    .pipe(isProduction ? uglify() : util.noop())
    .pipe(gulp.dest(target.dest + 'js'));

  var mergedStream = merge(modernizr);

  target.js.forEach(function (val) {
    var src = require(paths.src + val);

    if (val === 'js/vendor.js' && !isProduction) {
      src.push('./_livereload.js');
      src.push('../../../../../bower_components/livereload/dist/livereload.js');
    }


    var stream = gulp.src(src, {cwd: paths.src + 'js'})

      .pipe(plumber({errorHandler: onError}))
      .on('error', console.error.bind(console))

      .pipe(isProduction ? util.noop() : sourcemaps.init())
      .pipe(concat(path.basename(val)))
      .pipe(isProduction ? uglify() : util.noop())
      .pipe(isProduction ? util.noop() : sourcemaps.write('./'))
      .pipe(gulp.dest(target.dest + 'js'));

    mergedStream.add(stream);
  });

  return mergedStream;
}

// Fonts
function buildFont(target) {
  return gulp.src(target.font, {cwd: paths.vendor})

    .pipe(plumber({errorHandler: onError}))
    .on('error', console.error.bind(console))

    .pipe(gulp.dest(target.dest + 'fonts'));
}

function buildImg(target) {
  return gulp.src(target.img, {cwd: paths.src})

    .pipe(plumber({errorHandler: onError}))
    .on('error', console.error.bind(console))

    .pipe(imagemin())

    .pipe(gulp.dest(target.dest + 'images'));
}

function buildIcon(target) {
  return gulp.src(target.icon, {cwd: paths.src})

    .pipe(plumber({errorHandler: onError}))
    .on('error', console.error.bind(console))

    .pipe(svgSprite({
      mode: {
        symbol: {
          dest   : '.',
          sprite : 'icons.svg',
          example: false
        }
      }
    }))

    .pipe(gulp.dest(target.dest + 'images'));
}

function runJekyll(options, cb) {
  options.push('--config');
  options.push('style-guide/_config.yml');

  var spawn = require('child_process').spawn,
      jekyll = spawn('jekyll', options);

  jekyll.stdout.on('data', function (data) {
    process.stdout.write(data);
  });
  jekyll.stderr.on('data', function (data) {
    process.stdout.write(data);
  });
  jekyll.on('close', function () {
    cb();
  });
}


gulp.task('theme:clean', function (cb) {
  del(targets.theme.dest + '**', cb);
});
gulp.task('theme:css', function () {
  return buildCss(targets.theme);
});
gulp.task('theme:js', function () {
  return buildJs(targets.theme);
});
gulp.task('theme:img', function () {
  return buildImg(targets.theme);
});
// Depending on theme:css to working around error with double soucemap invokings
gulp.task('theme:icon', ['theme:css'], function () {
  return buildIcon(targets.theme);
});
gulp.task('theme:font', function () {
  return buildFont(targets.theme);
});


gulp.task('style-guide:clean', function (cb) {
  del(targets.styleGuide.dest + '**', cb);
});
gulp.task('style-guide:css', function () {
  return buildCss(targets.styleGuide);
});
gulp.task('style-guide:js', function () {
  return buildJs(targets.styleGuide);
});
gulp.task('style-guide:font', function () {
  return buildFont(targets.styleGuide);
});
gulp.task('style-guide:img', function () {
  return buildImg(targets.styleGuide);
});

// Watch task
gulp.task('watch', ['theme'], function () {

  livereload.listen({host: null});

  gulp.watch('less/**', {cwd: paths.src}, ['theme:css']);
  gulp.watch('js/**', {cwd: paths.src}, ['theme:js']);
  gulp.watch('images/**', {cwd: paths.src}, ['theme:img']);
  gulp.watch('icons/**', {cwd: paths.src}, ['theme:icon']);
  gulp.watch([
    targets.theme.dest + 'js/*.js',
    targets.theme.dest + 'css/*.css',
    targets.theme.dest + 'images/**',
    'app/design/frontend/kiwiberry/**',
  ]).on('change', livereload.changed);

});

gulp.task('watch:style-guide', ['style-guide'], function (cb) {

  gulp.watch('less/**', {cwd: paths.src}, ['style-guide:css']);
  gulp.watch('js/**', {cwd: paths.src} ['style-guide:js']);
  gulp.watch('images/**', {cwd: paths.src}, ['style-guide:img']);

  livereload.listen({host: null});

  gulp.watch([
    targets.styleGuide.dest + '_site/**/*'
  ]).on('change', livereload.changed);

  runJekyll(['serve', '-w', '--skip-initial-build'], cb);

});

// Build the theme
gulp.task('theme', ['theme:css', 'theme:js', 'theme:img', 'theme:icon', 'theme:font'], function (cb) {

  if (isProduction) {
    require('child_process').execFile('./packaging.sh', function (error, stdout, stderr) {
      console.log("packaging.sh stdout:\n" + stdout);
      console.log("packaging.sh stderr:\n" + stderr);
      if (error !== null) {
        console.log('execFile error: ' + error);
      }
      cb();
    });
  } else {
    cb();
  }

});

// Build the style guide
gulp.task('style-guide', ['style-guide:css', 'style-guide:js', 'style-guide:font', 'style-guide:img'], function (cb) {

  runJekyll(['build'], cb);

});

// Default task
gulp.task('default', ['theme', 'style-guide']);
