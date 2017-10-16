const webpack = require('webpack');
const target = '/lib/';

function createConfig({name, filename = name, source, path = ''}) {
  return {
    entry: `./src/${source}`,
    output: {
      path: __dirname + target + path,
      filename: `${filename}.js`,
      library: name,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: {
      loaders: [
        {
          test: /(\.jsx|\.js)$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        }
      ]
    },
    watch: true
  };
}

module.exports = [
  createConfig({filename: 'cachier', source: 'index'}),
];