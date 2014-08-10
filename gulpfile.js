// Base paths
var paths = {
  src   : './',
  vendor: './bower_components/',
  dest  : './test/skin/frontend/kiwifruit/default/'
};

// Assets of Kiwifruit
var appFiles = {
  styles : [
    paths.src + 'scss/kiwifruit.scss'
  ],
  scripts: [
    paths.src + 'js/kiwifruit.js',
    paths.src + 'js/noconflict.js'
  ],
  images : paths.src + 'images/*'
};

// Vendor assets
var vendorFiles = {
  styles : [
    paths.vendor + 'animate.css/animate.css'
  ],
  fonts: [
    paths.vendor + 'bootstrap-sass-official/assets/fonts/bootstrap/*',
    paths.vendor + 'font-awesome/fonts/*',
  ],
  scripts: [
    paths.vendor + 'jquery/dist/jquery.js',
    paths.vendor + 'bootstrap-sass-official/assets/javascripts/bootstrap.js',
    paths.vendor + 'modernizr/modernizr.js',
    paths.vendor + 'underscore/underscore.js'
  ]
};

// Load plugins
var gulp = require('gulp');
var util = require('gulp-util');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var notify = require('gulp-notify');

// Allows gulp --dev to be run for a more verbose output
var isProduction = false;
if(util.env.dist === true) {
  isProduction = true;
}

// CSS
gulp.task('css', function(){
  var sass = require('gulp-ruby-sass');
  var es = require('event-stream');
  var autoprefixer = require('gulp-autoprefixer');
  var combineMediaQueries = require('gulp');
  var cssmin = require('gulp-cssmin');

  var sassFiles = gulp.src(appFiles.styles)
    .pipe(sass({
      style: isProduction ? 'compressed' : 'expanded',
      sourcemap: isProduction ? false : true
    }))
    .on('error', notify.onError(function (error) {
      return 'SASS Error: ' + error.message;
    }))
    .on('error', function(error){
      new util.PluginError('CSS', error, {showStack: true});
    });

  return es.concat(gulp.src(vendorFiles.styles), sassFiles)
    .pipe(concat('kiwifruit.css'))
    .pipe(autoprefixer('last 2 version'))
    .pipe(isProduction ? combineMediaQueries({log: true}) : util.noop())
    .pipe(isProduction ? cssmin() : util.noop())
    .pipe(gulp.dest(paths.dest + 'css'))
    .pipe(notify({ message: 'SASS compiled' }));

});

// JS
gulp.task('js', function() {

  var jshint = require('gulp-jshint');
  var uglify = require('gulp-uglify');

  gulp.src(vendorFiles.scripts)
    .pipe(concat('vendor.js'))
    .pipe(isProduction ? uglify() : util.noop())
    .on('error', notify.onError(function (error) {
      return 'Unglify Error: ' + error.message;
    }))
    .pipe(gulp.dest(paths.dest + 'js'));

  // App scripts
  gulp.src(appFiles.scripts)
    .pipe(concat('kiwifruit.js'))
    .pipe(isProduction ? uglify() : util.noop())
    .on('error', notify.onError(function (error) {
      return 'Unglify Error: ' + error.message;
    }))
    .pipe(gulp.dest(paths.dest + 'js'))
    .pipe(notify({ message: 'JS Compiled' }));

});

// Images
gulp.task('images', function() {
  var imagemin = require('gulp-imagemin');

  return gulp.src(appFiles.images)
    .pipe(imagemin())
    .on('error', notify.onError(function (error) {
      return 'Imagemin Error: ' + error.message;
    }))
    .pipe(gulp.dest(paths.dest + 'images'))
    .pipe(notify({ message: 'Images optimized' }));
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src(vendorFiles.fonts)
    .pipe(gulp.dest(paths.dest + 'fonts'));
});

// Clean
gulp.task('clean', function(cb) {
  require('rimraf')(paths.dest, cb);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('css', 'js', 'images', 'fonts');
});

// Watch
gulp.task('watch', ['css', 'js', 'images', 'fonts'], function(){

  gulp.watch(appFiles.styles, ['css']);
  gulp.watch(appFiles.scripts, ['js']);
  gulp.watch(appFiles.images, ['images']);

  // Create LiveReload server
  var server = require('gulp-livereload');
  server.listen();

  // Watch any files in , reload on change
  gulp.watch(paths.dest + '**/*').on('change', server.changed);

});
