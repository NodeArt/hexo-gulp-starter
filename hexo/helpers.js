module.exports = function ({ gulp, hexo, production, config }) {
  const dims = config.imageDims;

  hexo.extend.helper.register('imgSrcset', function(name, attrs = {}) {
    const attrsStr = Object.keys(attrs).reduce((acc, key) => acc += ` ${key}='${attrs[key]}'`, '');
    const [path, ext] = name.split('.');
    const srcset = Object.keys(dims).reduce((acc, key) => acc += `,${path}-${key}.${ext} ${dims[key]}`, name + ' 1920w');
    return `<img ${attrsStr} sizes='(max-width: 1920px) 100vw, 1920px' srcset='${srcset}' src='${name}' alt=''>`;
  });
};