const runSequence = require('run-sequence');
const del = require('del');
const webpack = require('webpack');

module.exports = function({ gulp, hexo, production, config }) {

  gulp.task('clean-js', function() {
    return del(['./public/js/**/*']);
  });
  gulp.task('js', function (cb) {
    webpack(require('../webpack.config.js'), cb);
  });

  gulp.task('minify-js', function(cb) {
    runSequence('clean-js', 'js', cb)
  });
};
