const htmlmin = require('gulp-htmlmin');
const htmlclean = require('gulp-htmlclean');

module.exports = function ({ gulp, hexo, production, config }) {
  gulp.task('minify-html', function() {
    return gulp.src('./public/**/*.html')
      .pipe(htmlclean())
      .pipe(htmlmin({
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }))
      .pipe(gulp.dest('./public'))
  });
};