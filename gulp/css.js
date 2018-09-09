const sass = require('gulp-sass');
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require('gulp-if');

module.exports = function ({ gulp, hexo, production, config }) {

  const stylesPaths = config.stylesPaths;

  gulp.task('clean-styles', function() {
    return del([stylesPaths.dist + '/main.css']);
  });

  gulp.task('minify-css', ['clean-styles'], function() {
    return gulp.src('./themes/landscape/source/css/main.scss')
      .pipe(gulpif(!production, sourcemaps.init()))
      .pipe(sass(production ? { outputStyle: 'compressed' } : {}).on('error', sass.logError))
      .pipe(gulpif(!production, sourcemaps.write()))
      .pipe(gulp.dest(stylesPaths.dist));
  });
};