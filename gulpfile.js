const gulp = require("gulp");
const plumber = require("gulp-plumber"); //обработчик на ошибки
const sourcemap = require("gulp-sourcemaps"); //строит карты кода от итогового css к less файлу где это писалось
const less = require("gulp-less");
const postcss = require("gulp-postcss"); //библиотека префиксов
const autoprefixer = require("autoprefixer"); //добавлять префиксы
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("svg-store");
const sync = require("browser-sync").create(); //поднятие локального серва 
const build = require("gulp");
const del = require("del");

var paths = {
    styles: {
      src: 'source/CSS/**/*.less',
      dest: 'build/CSS/'
    },
    scripts: {
      src: 'source/scripts/**/*.js',
      dest: 'build/scripts/'
    }
  }

// Styles
const styles = () => {
    return gulp.src("source/styles/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
        autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("build/CSS"))
    .pipe(gulp.dest("build/CSS"))
    .pipe(sync.stream());
}

const images = () => {
    return gulp.src("source/img/**/*.{jpg,png.svg}")
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("build/img"))
}

const webp = () => {
    return gulp.src("source/img/**/*.{jpg.pmg}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("build/img"))
}


//Server 
const server = (done) => {
    sync.init({
        server: {
            baseDir: 'build'
        },
        
        cors: true,
        notify: false,
        ui: false,
    });
    done();
}


//Watcher
const watcher = () => {
    gulp.watch("source/styles/**/*.less", gulp.series("styles"));
    gulp.watch("source/*.html").on("change", sync.reload);
}


const copy = () => {
    return gulp.src([
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**",
        "source/js/**"
    ], {
        base: "source"
    })
    .pipe(gulp.dest("build"));
}


const clean = () => {
    return del("build");
}


const build = () => gulp.series(
    "clean",
    "copy",
    "css",
    "sprite",
    "html"
)

exports.styles = styles;
exports.images = images;
exports.webp = webp;
exports.server = server;
exports.watcher = watcher;
exports.copy = copy;
exports.clean = clean;
exports.build = build;
