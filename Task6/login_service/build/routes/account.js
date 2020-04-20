'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _pbkdf2Password = require('pbkdf2-password');

var _pbkdf2Password2 = _interopRequireDefault(_pbkdf2Password);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _config = require('../models/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasher = (0, _pbkdf2Password2.default)();

var router = _express2.default.Router();

router.post('/signup', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;

  var usernameRegex = /^[a-z0-9]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: 'BAD USERNAME',
      code: 1
    });
  }

  if (password.length < 4 || typeof password !== 'string') {
    return res.status(400).json({
      error: 'BAD PASSWORD',
      code: 2
    });
  }

  var connection = _mysql2.default.createConnection(_config2.default);

  return connection.query('select * from Account where username = ?', username, function (err, result) {
    if (result.length !== 0) {
      connection.destroy();
      return res.status(409).json({
        error: 'USERNAME EXISTS',
        code: 3
      });
    }
    if (err) throw error;

    hasher({ password: password }, function (err, pass, salt, hash) {
      connection.query('insert into Account(username, password, salt) values (?, ?, ?)', [username, hash, salt], function (err, result) {
        connection.destroy();
        if (err) throw error;
        return res.json({ success: true });
      });
    });
  });
});

/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: PASSWORD IS NOT STRING
        2: THERE IS NO USER
        3: PASSWORD IS NOT CORRECT
*/
router.post('/signin', function (req, res) {
  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password;

  if (typeof password !== 'string') {
    return res.status(401).json({
      error: 'PASSWORD IS NOT STRING',
      code: 1
    });
  }

  var connection = _mysql2.default.createConnection(_config2.default);

  connection.query('select * from Account where username = ?', username, function (err, result) {
    if (err) throw err;

    if (!result || result.length === 0) {
      connection.destroy();
      return res.status(401).json({
        error: 'THERE IS NO USER',
        code: 2
      });
    }

    connection.destroy();
    hasher({ password: password, salt: result[0].salt }, function (err, pass, salt, hash) {
      if (hash === result[0].password) {
        var session = req.session;
        session.loginInfo = {
          _id: result[0].id,
          username: result[0].username
        };

        return res.json({
          success: true
        });
      }
      return res.status(401).json({
        error: 'PASSWORD IS NOT CORRECT',
        code: 3
      });
    });
  });
});

/*
    GET CURRENT USER INFO GET /api/account/getInfo
    ERROR CODES:
        1: THERE IS NO LOGIN DATA
*/
router.get('/getinfo', function (req, res) {
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(401).json({
      error: 'THERE IS NO LOGIN DATA',
      code: 1
    });
  }
  return res.json({ info: req.session.loginInfo });
});

router.post('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
  });
  return res.json({ success: true });
});

/**
 * SEARCH USER: GET /api/account/search/:username
 */
router.get('/search/:username', function (req, res) {
  // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
  var connection = _mysql2.default.createConnection(_config2.default);

  return connection.query('select username from Account where username like ? order by username limit 5', req.params.username + '%', function (err, result) {
    if (err) throw err;
    connection.destroy();
    return res.json(JSON.parse(JSON.stringify(result)));
  });
});

// EMPTY SEARCH REQUEST: GET /api/account/search
router.get('/search', function (req, res) {
  return res.json([]);
});

exports.default = router;