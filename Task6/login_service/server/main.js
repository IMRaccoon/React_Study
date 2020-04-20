import express from 'express';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import morgan from 'morgan'; // HTTP REQUEST LOGGER
import bodyParser from 'body-parser'; // PARSE HTML BODY
import session from 'express-session';

import api from './routes';

const app = express();
const port = 3000;
const devPort = 4000;

app.use(
  session({
    secret: 'CodeLab1$1$234',
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api', api);
app.use('/', express.static(path.join(__dirname, './../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './../dist/index.html'));
});

app.get('/hello', (req, res) => {
  return res.send('Hello Memo_App');
});

app.listen(port, () => {
  console.log('Express is listening on port', port);
});

if (process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');
  const config = require('../webpack.dev.config');
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, config.devServer);
  devServer.listen(devPort, () => {
    console.log('webpack-dev-server is listening on port', devPort);
  });
}
