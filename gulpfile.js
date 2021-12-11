const { src, dest, parallel, series, watch } = require('gulp');
const browser = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const less = require('gulp-less');
const postcss = require("gulp-postcss"); //библиотека префиксов
const autoprefixer = require("autoprefixer"); //добавлять префиксы
const csso = require("gulp-csso");
const rename = require("gulp-rename");

function browsersync() {
    browser.init({
        server: { baseDir: 'source/' },
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

function styles() {
    return src(['source/styles/style.less'])
    .pipe(less())
    .pipe(postcss([
        autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(dest('dist/CSS/'))
    .pipe(browser.stream())
}

function watcher() {
    watch([
        'source/**/*.js',
        'source/*.html',
        'source/**/*.less'
    ],scripts, styles)
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;

exports.default = parallel(scripts, styles, browsersync, watcher);