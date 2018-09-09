const config = {
  mode: process.env.NODE_ENV || 'development',
  entry: process.cwd() + '/themes/landscape/source/js/index.js',
  output: {
    path: process.cwd() + '/public/js',
    filename: `index${process.env.NODE_ENV === 'production' ? '-min' : ''}.js`
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  },
};

module.exports = process.env.NODE_ENV === 'production' ? config : Object.assign(config, { devtool: "source-map" });