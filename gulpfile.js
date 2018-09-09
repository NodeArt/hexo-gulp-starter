const del = require('del');
const runSequence = require('run-sequence');
const Hexo = require('hexo');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const fs = require('fs');
const path = require('path');

const hexo = new Hexo(process.cwd(), {});
const gulp = require('gulp');
const config = require('./build_config');

const production = process.env.NODE_ENV === 'production';
console.log(`Starting ${production ? 'production' : 'development'} build`);

const registerModules = dirPath => {
  fs.readdirSync(dirPath)
    .filter(filePath => path.extname(filePath) === '.js')
    .forEach(filePath => {
      filePath = './' + path.join(dirPath, filePath);
      if (fs.lstatSync(filePath).isFile()) {
        require(filePath)({ gulp, hexo, production, config })
      }
    })
};

registerModules('./gulp');
registerModules('./hexo');

gulp.task('clean', function() {
  return del(['public/**/*']);
});

gulp.task('generate', function(cb) {
  hexo.init()
    .then(() => hexo.call('clean'))
    .then(function() {
    return hexo.call('generate', {
      watch: false
    });
  }).then(function() {
    return hexo.exit();
  }).then(function() {
    return cb()
  }).catch(function(err) {
    console.error(err);
    hexo.exit(err);
    return cb(err);
  })
});

gulp.task('build', function(cb) {
  runSequence('clean', 'generate', 'minify-html', 'minify-css', 'minify-js', 'minify-img', cb)
});

gulp.task('pre-watch', function (cb) {
  runSequence('clean', 'generate', 'minify-css', 'minify-js', 'minify-img', cb)
});

gulp.task('clean-db', function (cb) {
  const path = './db.json';
  fs.stat(path, (err) => {
    if (!err) {
      return fs.unlink(path, cb)
    }
    cb();
  });
});

gulp.task('generate-watch', function (cb) {
  hexo.call('generate', {
    watch: false,
  }).then(cb).catch(cb)
});

gulp.task('watch', ['pre-watch'], function() {

  gulp.watch('themes/landscape/**/*.{yml,ejs}', ['clean-db', 'generate-watch']);
  gulp.watch('themes/landscape/**/*.js', ['clean-db', 'minify-js']);
  gulp.watch('themes/landscape/**/*.scss', ['clean-db', 'minify-css']);

  const serve = serveStatic('public', {'index': ['index.html', 'index.htm']});
  const http = require('http');
  const server = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res))
  });
  server.listen(config.port)
});