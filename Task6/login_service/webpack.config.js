const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['react-hot-loader/patch', './src/index.js', './src/style.css'],

  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js',
  },

  devServer: {
    contentBase: './dist',
    hot: true,
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              {
                plugins: ['@babel/plugin-proposal-class-properties'],
              },
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
};
