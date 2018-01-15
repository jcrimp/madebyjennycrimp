const gulp = require('gulp')
const deploy = require('gulp-gh-pages')
const autoprefix = require('gulp-autoprefixer')
const connect = require('gulp-connect')
const bourbon = require('bourbon').includePaths
const neat = require('bourbon-neat').includePaths
const sass = require('gulp-sass')
const opn = require('opn')
const pug = require('gulp-pug')

var paths = {
  scss: ['src/assets/stylesheets/**/*.scss']
}

gulp.task('pug', function() {
  return gulp.src('src/index.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
})

gulp.task('sass', function () {
  return gulp.src(paths.scss)
    .pipe(sass({
        sourcemaps: true,
        includePaths: [bourbon, neat]
    }))
    .pipe(autoprefix('last 2 versions'))
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
