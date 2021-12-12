const { src, dest, parallel, series, watch } = require('gulp');
const plumber = require('gulp-plumber'); //обработчик на ошибки
const sourcemaps = require('gulp-sourcemaps');
const browser = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const less = require('gulp-less');
const postcss = require("gulp-postcss"); //библиотека префиксов
const autoprefixer = require("gulp-autoprefixer"); //добавлять префиксы
const cleancss = require('gulp-clean-css')
const csso = require('gulp-csso');
const newer = require('gulp-newer');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
 


function browsersync() {
    browser.init({
        server: { baseDir: 'dist/' },
        notify: false,
        online: true
    })
}

function scripts() {
    return src(['source/js/**/*.js'])
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/scripts/'))
    .pipe(browser.stream())
}

function minify() {
    return src('source/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(dest('dist/'))
      .pipe(browser.stream())
  }

function styles() {
    return src('source/styles/style.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())  
    .pipe(less())
    .pipe(autoprefixer({ overrideBrowserlist: ['last 10 versions'], grid: true }))
    .pipe(cleancss(( { level:{ 1: { specialComments: 0 } } } )))
    .pipe(csso())
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/CSS/'))
    .pipe(browser.stream())
}

function imgcopy() {
    return src(['source/img/**/*.{jpg,png,svg,webp}'])
    .pipe(newer('dist/img/'))
    .pipe(dest('dist/img/'))
    .pipe(browser.stream())
}

function cleanbuild() {
    return del('build/**/*', { force: true })
}

function buildcopy() {
    return src([
        'dist/CSS/**/*.min.css',
        'dist/scripts/**/*.min.js',
        'dist/img/**/*',
        'dist/**/*html'
    ], { base: 'dist' })
    .pipe(dest('build'));
}

function watcher() {
    watch('source/**/*.js', scripts);
    watch('source/styles/**/*.less', styles);
    watch('source/img/**/*', imgcopy);
    watch('source/*.html').on('change', browser.reload);
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.imgcopy = imgcopy;
exports.del = del;
exports.minify = minify;
exports.build = series(cleanbuild, styles, scripts, buildcopy)

exports.default = parallel(imgcopy, minify, styles, scripts, browsersync, watcher);