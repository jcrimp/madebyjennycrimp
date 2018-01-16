const autoprefix = require('gulp-autoprefixer')
// const bourbon = require('bourbon').includePaths
const connect = require('gulp-connect')
const cssnano = require('gulp-cssnano')
const deploy = require('gulp-gh-pages')
const gulp = require('gulp')
// const neat = require('bourbon-neat').includePaths
const opn = require('opn')
const path = require('path')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')

var paths = {
  scss: ['src/assets/stylesheets/**/*.scss']
}
var prependNodeModules = function(dirPath) {
  return path.join(__dirname, 'node_modules', dirPath)
}
var normalize = [
  'normalize-scss/sass' // import normalize-scss
]
normalize = normalize.map(prependNodeModules)

var skeleton = [
  'skeleton-sass-official' // theme grid styles
]
skeleton = skeleton.map(prependNodeModules)
console.log(skeleton)

gulp.task('pug', function() {
  return gulp.src('src/index.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
})

gulp.task('sass', function () {
  return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
        includePaths: [normalize, skeleton]
    }).on('error', sass.logError))
    .pipe(autoprefix('last 2 versions'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/assets/stylesheets'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('src/*.pug', ['pug']);
  gulp.watch('src/**/*.scss', ['sass']);
});

gulp.task('connect', ['compile'], function(done) {
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: true
  });
  opn('http://localhost:8000', done);
});

gulp.task('compile', ['pug', 'sass'])
gulp.task('default', ['compile', 'watch', 'connect'])

/**
 * Push build to gh-pages
 */
// gulp.task('deploy', ['compile'], function () {
//   return gulp.src('./dist/**/*')
//     .pipe(deploy())
// })
