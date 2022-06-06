const gulp = require('gulp');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const gcmq = require('gulp-group-css-media-queries');
const gulpif = require('gulp-if');
const less = require('gulp-less');
const rigger = require('gulp-rigger');
const sourcemaps = require('gulp-sourcemaps');
const terser = require("gulp-terser");
const smartgrid = require('smart-grid');
const browserSync = require('browser-sync').create();

const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);


function styles(){
	return gulp.src('./source/less/style.less')
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(less())
    .pipe(gcmq())
    .pipe(autoprefixer())
    .pipe(gulpif(isProd, cleanCSS({
      level: 0
    })))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulpif(isDev, concat('style.css')))
    .pipe(gulpif(isProd, concat('style.min.css')))
    .pipe(gulp.dest('./assets/css'))
    .pipe(gulpif(isSync, browserSync.stream()));
}

function scripts() {
  return gulp.src('./source/javascript/main.js')
    .pipe(rigger())
    .pipe(gulpif(isDev, concat('main.js')))
    .pipe(gulpif(isProd, terser()))
    .pipe(gulpif(isProd, concat('main.min.js')))
    .pipe(gulp.dest('./assets/javascript'));
}

function libs() {
  return gulp.src([
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/focus-manager/focusManager.min.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('./assets/javascript'));
}

function watch(){
	if(isSync) {
		browserSync.init({
      notify: false
    });
	}

	gulp.watch('./source/less/**/*.less', styles);
	gulp.watch('./source/javascript/**/*.js', scripts);
}

function clear(){
	return del('./assets/{css,javascript}');
}

function grid(done){
	let settings = {
    filename: "grid",
    tab: "  ",
    mixinNames: {
      row: "row"
    },
		columns: 9,
    offset: "32px",
    container: {
      maxWidth: "1080px",
      fields: "36px"
    },
    breakPoints: {
      md: {
        width: "1152px",
        fields: "24px"
      },
      sm: {
        width: "768px",
        fields: "8px"
      }
    }
	};

	smartgrid('./source/less/core', settings);
	done();
}

let build = gulp.series(clear, 
	gulp.parallel(styles, scripts, libs)
);

gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));
gulp.task('grid', grid);