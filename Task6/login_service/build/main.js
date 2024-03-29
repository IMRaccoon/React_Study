'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// PARSE HTML BODY
var app = (0, _express2.default)(); // HTTP REQUEST LOGGER

var port = 3000;
var devPort = 4000;

app.use((0, _expressSession2.default)({
  secret: 'CodeLab1$1$234',
  resave: false,
  saveUninitialized: true
}));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());

app.use('/api', _routes2.default);
app.use('/', _express2.default.static(_path2.default.join(__dirname, './../dist')));
app.get('*', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, './../dist/index.html'));
});

app.get('/hello', function (req, res) {
  return res.send('Hello Memo_App');
});

app.listen(port, function () {
  console.log('Express is listening on port', port);
});

if (process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');
  var config = require('../webpack.dev.config');
  var compiler = (0, _webpack2.default)(config);
  var devServer = new _webpackDevServer2.default(compiler, config.devServer);
  devServer.listen(devPort, function () {
    console.log('webpack-dev-server is listening on port', devPort);
  });
}