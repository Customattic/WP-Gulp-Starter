'use strict';
/**
 * Gulp File.
 *
 * Gulp for Wordpress Theme.
 * 
 * @author  Ahmed Bouhuolia <a.bouhuolia@gmail.com>
 * @version 1.0.0
 * @license The MIT License (MIT)
 * 
 * What is file does.
 *  1. Live reloads browser with BrowserSync.
 *  2. Sass to css conversion, error handles, postcss support, autoprefixing, Auto CSS formating, 
 *     build source maps, convert LTR to RTL, CSS minification, Merge Media
 *     Queries and corrects the line endings.
 *  3. JS: Babel compiler, concatenates, linting & uglifies specific files and corrects
 *     the line endings
 *  4. Minify all different of image types such as PNG, JPEG, SVG etc.
 *  5. Inject CSS instead of browser page reload.
 *  6. Check PHP code for missing or incorrect text-domain.
 *  7. Generate pot file for WP plugins and themes.
 *  8. Flexible configuration, allows to add sources and destination more than one to 
 *     the same build in a standalone file.
 */

/**
 * # Load Plugins
 * ------------------------------------------------------------------
 */
const gulp   = require('gulp');
const grunt  = require('grunt');
const config = require('./gulpconfig.js');

// Style related.
const postcss      = require('gulp-postcss'); // Transforming styles with JS plugins 
const sass         = require('gulp-sass'); // Gulp pluign for Sass compilation.
const cssnano      = require('cssnano'); // Minifies CSS files.
const autoprefixer = require('autoprefixer'); // Autoprefixing magic.
const csscomb      = require('gulp-csscomb'); // CSS coding style formatter
const rtlcss       = require('rtlcss'); // Convert LTR CSS to RTL.
const stylefmt     = require('stylefmt');  // Auto CSS formating.
const cssMqpacker  = require('css-mqpacker'); // Packing same CSS media query rules into one.

// Javascript related.
const concat = require('gulp-concat'); // Concatenates JS files
const jshint = require('gulp-jshint'); // Detect errors and potential problems in JavaScript code
const uglify = require('gulp-uglify'); // Minifies JS files
const babel  = require("gulp-babel"); // JavaScript compiler to write next generation JavaScript.

// Image related.
const imagemin = require('gulp-imagemin');

// Translate related.
const checktextdomain = require('gulp-checktextdomain');
const wpPot           = require('gulp-wp-pot'); // Recommended to prevent unnecessary changes in pot-file.

// Utility related plugins.
const rename      = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
const lineec      = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
const filter      = require('gulp-filter');   // Enables you to work on a subset of the original files by filtering them using globbing.
const sourcemaps  = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
const browserSync = require('browser-sync').create();
const reload      = browserSync.reload;
const sort        = require('gulp-sort'); // Recommended to prevent unnecessary changes in pot-file.
const zip         = require('gulp-zip');  // ZIP compress files
const mergeStream = require('merge-stream'); // Merges a bunch of streams.
const debug       = require('gulp-debug');
const gulpif      = require('gulp-if');
const del         = require('del');
const runSequence = require('run-sequence');
const lazypipe    = require('lazypipe');
runSequence.options.ignoreUndefinedTasks = true;
runSequence.options.showErrorStackTrace = false;


/**
 * # Tasks
 * ------------------------------------------------------------------
 */

/**
 * Task: `serve`
 * 
 * Live reload, CSS injection.
 */
gulp.task('browser-sync', function(){
  browserSync.init(config.browsersync)
});

gulp.task('serve', ['browser-sync']);


// ------------------------ Style Tasks ------------------------

/**
 * Task: `styles-build`
 * 
 * This task does the following:
 *  1. Gets the source scss files.
 *  2. Compile SASS to CSS.
 *  3. Write sourcemaps for it.
 *  4. Autoprefix CSS
 *  5. Combo CSS.
 *  6. Merge Media Queries only for .min.css version.
 *  7. Minify CSS.
 *  8. Inject CSS or reloads the browser via browserSync.
 */
gulp.task('styles-build', function(){
  var builds = config.style.build.map(function(build){

    ['sourcemaps', 'minify'].forEach(item => {
      build[item] = 'undefined' === typeof build[item] ? Object() : build[item];
      build[item] = true === build[item] ? Object() : build[item]; 
    }); 

    return gulp.src(build.src)
      .pipe( gulpif(build.sourcemaps, sourcemaps.init(build.sourcemaps)) )
      .pipe( sass(config.style.sass) ) // Sass compilation.
      .on('error', console.error.bind(console))

      .pipe( postcss([
        autoprefixer(config.style.autoprefixer), // Automatically CSS vendor prefixes 
        stylefmt(config.style.stylefmt), // Auto CSS formating.
      ]) )

      .pipe( gulpif(build.sourcemaps, sourcemaps.write('./')) )
      .pipe( lineec() ) // Fix line endings.
      .pipe( browserSync.stream() ) // Reloads `style.css` if that is enqueued.
      .pipe( gulp.dest(build.dest) )
      .pipe( gulpif( build.minify, minifyChannel()()) );

      // Minify channel.
      function minifyChannel(){
        return lazypipe()
        .pipe( rename, {suffix: '.min'}) // Append ".min" to the filename.
        .pipe( filter, '**/*.css') // Filtering stream to only css files
        .pipe( postcss, [
          cssMqpacker(config.style.cssMqpacker), // Combine matching media queries.
          cssnano(config.style.cssnano) // Minify `style.min.css` file.
        ])
        .pipe( browserSync.stream ) // Reloads `style.min.css` if that is enqueued.
        .pipe( gulp.dest, build.dest );
      }
    });

  return mergeStream(builds);
});

/**
 * Task: `styles-rtl`
 * 
 * This task does the following.
 *  1. Gets the source css files.
 *  2. Covert LTR CSS to RTL.
 *  3. Suffix all CSS files to `-rtl`.
 *  4. Reloads css files via browser sync stream.
 *  5. Combine matching media queries for `.min.css` version.
 *  6. Minify all CSS files.
 *  7. Reload minified css files via browser sync stream.
 */
gulp.task('styles-rtl', function(){
  var builds = config.style.rtl.map(function(build){
    return gulp.src(build.src)
      .pipe( postcss([
        rtlcss(config.style.rtlcss), // Convert LTR CSS to RTL.
      ]) )
      .pipe( rename({suffix: '-rtl'}) ) // Append "-rtl" to the filename.
      .pipe( browserSync.stream() ) // Reloads `style-rtl.css` if that is enqueued.
      .pipe( gulp.dest(build.dest) ) 

      .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files.
      .pipe( rename({suffix: '.min'}) ) // Append ".min" to the filename.
      .pipe( postcss([
        cssMqpacker(config.style.cssMqpacker), // Combine matching media queries.
        cssnano(config.style.cssnano) // Minify `style.min.css` file.
      ]) )
      .pipe( browserSync.stream() ) // Reloads `style-rtl.min.css` if that is enqueued.
      .pipe( gulp.dest(build.dest) ); 
  });

  return mergeStream(builds);
});

/**
 * Task: `style` 
 * 
 * This task runs the following tasks sequently:
 *  
 * styles-build > styles-rtl
 */
gulp.task('styles', function(callback){
  runSequence('styles-build', 'styles-rtl',callback);
});


// ------------------------ Script Tasks ------------------------

/**
 * Task: `js-lint`
 * 
 * This task Checks scripts for errors.
 */
gulp.task( 'js-lint', function(){
  return gulp.src(config.script.lint.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**
 * Task: `js-bundle`
 *  
 * This task does the following.
 *  1. Gets the source JavaScript files.
 *  2. Compiler all JS files on Babel.
 *  3. Concatenates JS files.
 *  4. Corrects the line endings.
 *  5. Writes sourcemaps for it.
 */
gulp.task('js-bundle', function(){
  var bundles = config.script.bundles.map(function(bundle){

    ['sourcemaps', 'babel'].forEach(item => {
      bundle[item] = 'undefined' === typeof bundle[item] ? Object() : bundle[item];
      bundle[item] = true === bundle[item] ? Object() : bundle[item]; 
    });

    return gulp.src(bundle.src)
      .pipe( gulpif(bundle.sourcemaps, sourcemaps.init(bundle.sourcemaps) ))
      .pipe( gulpif(bundle.babel, babel(bundle.babel)) )
      .pipe( concat(bundle.dest.substring( bundle.dest.lastIndexOf('/'), bundle.dest.length ) ) )
      .pipe( lineec() ) // Fix line endings.
      .pipe( gulpif(bundle.sourcemaps, sourcemaps.write('./') ))
      .pipe( filter(['**/*.js.map', '**/*.js']) )
      .pipe( gulp.dest(bundle.dest.substring(0, bundle.dest.lastIndexOf('/'))) );
  });

  return mergeStream(bundles);
});

/**
 * Task: `js-minify`
 * 
 * This task minifies JS files and suffix them to `.min`.
 */
gulp.task('js-minify', function(){
  var builds = config.script.minify.map(function(build){
    return gulp.src(build.src)
      .pipe( uglify() )
      .pipe( rename({suffix: '.min'}) )
      .pipe( filter( '**/*.js' ) ) // Filtering stream to only javascript files
      .pipe( gulp.dest(build.dest) );
  });

  return mergeStream(builds);
});

/**
 * Task: `js`
 * 
 * This task runs the following tasks sequently:
 * 
 * js-lint -> js-bundle -> js-minify
 */
gulp.task('js', function(callback){
  runSequence('js-lint', 'js-bundle', 'js-minify', callback);
});


// ------------------------ Translation Tasks ------------------------

grunt.initConfig({
  pkg: grunt.file.readJSON( 'package.json' ),
  checktextdomain: {
    options: config.translate.checktextdomain.options,
    files: {
        src: config.translate.checktextdomain.src,
        expand: true,
    },
  }
});

grunt.loadNpmTasks('grunt-checktextdomain');

/**
 * Task: `check-text-doamin`
 * 
 * Check PHP code for missing or incorrect text-domain.
 */
gulp.task('check-text-domain', function(done){
  grunt.tasks(['checktextdomain'], {gruntfile: false}, function () {done();});
});

/**
 * Task: `build-pot`
 * 
 * Generate pot file for WP plugins and themes.
 */
gulp.task('build-pot', ['check-text-domain'], function(){
  return gulp.src(config.translate.wpPot.src)
    .pipe(sort())
    .pipe(wpPot(config.translate.wpPot.options))
    .pipe( gulp.dest(config.translate.wpPot.dest) )
});

/**
 * Task: `translate`
 * 
 * This task runs the following tasks sequently:
 * 
 * check-text-doamin > build-pot 
 */
gulp.task('translate', ['build-pot'])

gulp.task('translate', function(callback){
  runSequence('check-text-domain', 'build-pot', callback);
});


// ------------------------ Utilitie Tasks ------------------------ 

/**
 * Task: `image`
 * 
 * This task minifies PNG, JPEG, GIF, and SVG files.
 */
gulp.task('image', function(){
  var builds = config.image.build.map(function(build){
    return gulp.src(build.src)
      .pipe(imagemin(config.image.imagemin))
      .pipe(gulp.dest(build.dest));
  });

  return mergeStream(builds);
});

/**
 * Task: `compress`
 * 
 * Compress all theme files to final zip file.
 */
gulp.task('compress', function(){
	return gulp.src(config.compress.src)
		.pipe(zip(config.compress.filename)) // Zip compress files.
		.pipe(gulp.dest(config.compress.dest));
});

/**
 * Task: `clean`
 * 
 * Clean specific build files of your theme/plugin.
 */
gulp.task('clean', function(){
  return del(config.clean);
});

/**
 * Task: `watch`
 * 
 * Watch css, javascript and images files.
 */
gulp.task('watch', function(){
  gulp.watch(config.watch.css, ['styles']);
  gulp.watch(config.watch.js, ['js']);
  gulp.watch(config.watch.images, ['image', reload]);
});

gulp.task('default', ['styles', 'js', 'image', 'translate', 'compress']);