// Base paths
var paths = {
  vendor: './bower_components/',
  src   : './skin/frontend/kiwiberry/default/'
};

var targets = {
  theme: {
    styles : [
      paths.src + 'less/vendor.less',
      paths.src + 'less/kiwiberry.less'
    ],
    scripts: require(paths.src + 'js/kiwiberry.json'),
    images : paths.src + 'images/*',
    fonts  : [
      paths.vendor + 'bootstrap/dist/fonts/*',
      paths.vendor + 'font-awesome/fonts/*'
    ],

    basedirDev : './test/',
    basedirDist: './dist/',
    dest       : 'skin/frontend/kiwiberry/default/'
  },

  styleGuide: {
    styles : [
      paths.src + 'less/style_guide_vendor.less',
      paths.src + 'less/style_guide.less'
    ],
    scripts: require(paths.src + 'js/style_guide.json'),
    images : paths.src + 'images/*',
    fonts  : [
      paths.vendor + 'bootstrap/dist/fonts/*',
      paths.vendor + 'font-awesome/fonts/*'
    ],

    dest: './style_guide/'
  }
};

// Load plugins
var gulp                = require('gulp'),
    util                = require('gulp-util'),
    concat              = require('gulp-concat'),
    path                = require('path'),
    rimraf              = require('rimraf'),
    sourcemaps          = require('gulp-sourcemaps'),
    merge               = require('merge-stream'),
    livereload          = require('gulp-livereload'),


    // CSS plugins
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

function buildCss(target) {
  return gulp.src(target.styles)
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [
        paths.vendor
      ]
    }))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer('last 2 version'))
    .pipe(isProduction ? combineMediaQueries({log: true}) : util.noop())
    .pipe(isProduction ? cssmin() : util.noop())
    .pipe(isProduction ? util.noop() : sourcemaps.write('./'))
    .pipe(gulp.dest(target.dest + 'css', {
      cwd: isProduction ? target.basedirDist : target.basedirDev
    }));
}

function buildJs(target) {
  // Modernizr.js
  var modernizr = gulp.src(paths.vendor + 'modernizr/modernizr.js')
    .pipe(isProduction ? uglify() : util.noop())
    .pipe(gulp.dest(target.dest + 'js', {
      cwd: isProduction ? target.basedirDist : target.basedirDev
    }));

  var mergedStream = merge(modernizr);

  for (var filename in target.scripts) {
    var stream = gulp.src(target.scripts[filename])
      .pipe(sourcemaps.init())
      .pipe(concat(filename))
      .pipe(isProduction ? uglify() : util.noop())
      .pipe(isProduction ? util.noop() : sourcemaps.write('./'))
      .pipe(gulp.dest(target.dest + 'js', {
        cwd: isProduction ? target.basedirDist : target.basedirDev
      }));
    mergedStream.add(stream);
  }

  return mergedStream;
}

// Fonts
function buildFont(target) {
  return gulp.src(target.fonts)
    .pipe(gulp.dest(target.dest + 'fonts', {
      cwd: isProduction ? target.basedirDist : target.basedirDev
    }));
}

function buildImg(target) {
  return gulp.src(target.images)
    .pipe(imagemin())
    .pipe(gulp.dest(target.dest + 'images', {
      cwd: isProduction ? target.basedirDist : target.basedirDev
    }));
}

function clean(target, cb) {
  rimraf(target.dest, cb);
}

function runJekyll(options, cb) {
  options.push('--config');
  options.push('style_guide/_config.yml');

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
  clean(targets.theme, cb);
});
gulp.task('theme:css', function () {
  return buildCss(targets.theme);
});
gulp.task('theme:js', function () {
  return buildJs(targets.theme);
});
gulp.task('theme:font', function () {
  return buildFont(targets.theme);
});
gulp.task('theme:img', function () {
  return buildImg(targets.theme);
});


gulp.task('style-guide:clean', function (cb) {
  clean(targets.styleGuide, cb);
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

  gulp.watch(paths.src + 'less/**/*', ['theme:css']);
  gulp.watch(targets.theme.scripts['kiwiberry.js'], ['theme:js']);
  gulp.watch(targets.theme.images, ['theme:img']);
  gulp.watch([
    targets.theme.basedirDev + targets.theme.dest + '**/*.{css,js,jpg,png,gif}',
    'app/design/frontend/kiwiberry/**/*.phtml',
    'app/design/frontend/kiwiberry/**/*.xml'
  ]).on('change', livereload.changed);

});

gulp.task('watch:style-guide', ['style-guide'], function (cb) {

  gulp.watch(paths.src + 'less/**/*', ['style-guide:css']);
  gulp.watch(targets.styleGuide.scripts['vendor.js'], ['style-guide:js']);
  gulp.watch(targets.styleGuide.images, ['style-guide:img']);

  // Create LiveReload server
  var server = require('gulp-livereload');

  gulp.watch([
    targets.styleGuide.dest + '_site/**/*'
  ]).on('change', server.changed);

  server.listen();

  runJekyll(['serve', '-w', '--skip-initial-build'], cb);

});

// Build the theme
gulp.task('theme', ['theme:css', 'theme:js', 'theme:font', 'theme:img'], function (cb) {

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
