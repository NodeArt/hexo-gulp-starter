const runSequence = require('run-sequence');
const imageResize = require('gulp-image-resize');
const parallel = require('concurrent-transform');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');

const os = require('os');

module.exports = function({ gulp, hexo, production, config }) {
  const imagesPaths = config.imagesPaths;

  gulp.task('clean-images', function() {
    return del([imagesPaths.dist]);
  });

  gulp.task('copy-images', function () {
    return gulp.src(`${imagesPaths.src}.{jpeg,jpg,png,svg}`)
      .pipe(gulp.dest(imagesPaths.dist));
  });

  const minifyImages = (percentage) => function() {
    return gulp.src(`${imagesPaths.src}.{jpeg,jpg,png}`)
      .pipe(parallel(
        imageResize({ percentage }),
        os.cpus().length
      ))
      .pipe(rename(function (path) { path.basename += `-${percentage}`; }))
      .pipe(imagemin())
      .pipe(gulp.dest(imagesPaths.dist))
  };

  const taskNames = Object.keys(config.imageDims).map(dim => {
    const name = `minify-img-${dim}`;
    gulp.task(name, minifyImages(dim));
    return name;
  });

  gulp.task('minify-img', function (cb) {
    return runSequence('clean-images', 'copy-images', ...[taskNames], cb)
  });
};