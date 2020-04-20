import express from 'express';
import bkfd2Password from 'pbkdf2-password';
import mysql from 'mysql';
import config from '../models/config';

const hasher = bkfd2Password();

const router = express.Router();

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const usernameRegex = /^[a-z0-9]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: 'BAD USERNAME',
      code: 1,
    });
  }

  if (password.length < 4 || typeof password !== 'string') {
    return res.status(400).json({
      error: 'BAD PASSWORD',
      code: 2,
    });
  }

  const connection = mysql.createConnection(config);

  return connection.query(
    'select * from Account where username = ?',
    username,
    (err, result) => {
      if (result.length !== 0) {
        connection.destroy();
        return res.status(409).json({
          error: 'USERNAME EXISTS',
          code: 3,
        });
      }
      if (err) throw error;

      hasher({ password }, (err, pass, salt, hash) => {
        connection.query(
          'insert into Account(username, password, salt) values (?, ?, ?)',
          [username, hash, salt],
          (err, result) => {
            connection.destroy();
            if (err) throw error;
            return res.json({ success: true });
          },
        );
      });
    },
  );
});

/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: PASSWORD IS NOT STRING
        2: THERE IS NO USER
        3: PASSWORD IS NOT CORRECT
*/
router.post('/signin', (req, res) => {
  const { username, password } = req.body;
  if (typeof password !== 'string') {
    return res.status(401).json({
      error: 'PASSWORD IS NOT STRING',
      code: 1,
    });
  }

  const connection = mysql.createConnection(config);

  connection.query(
    'select * from Account where username = ?',
    username,
    (err, result) => {
      if (err) throw err;

      if (!result || result.length === 0) {
        connection.destroy();
        return res.status(401).json({
          error: 'THERE IS NO USER',
          code: 2,
        });
      }

      connection.destroy();
      hasher({ password, salt: result[0].salt }, (err, pass, salt, hash) => {
        if (hash === result[0].password) {
          let session = req.session;
          session.loginInfo = {
            _id: result[0].id,
            username: result[0].username,
          };

          return res.json({
            success: true,
          });
        }
        return res.status(401).json({
          error: 'PASSWORD IS NOT CORRECT',
          code: 3,
        });
      });
    },
  );
});

/*
    GET CURRENT USER INFO GET /api/account/getInfo
    ERROR CODES:
        1: THERE IS NO LOGIN DATA
*/
router.get('/getinfo', (req, res) => {
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(401).json({
      error: 'THERE IS NO LOGIN DATA',
      code: 1,
    });
  }
  return res.json({ info: req.session.loginInfo });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
  });
  return res.json({ success: true });
});

/**
 * SEARCH USER: GET /api/account/search/:username
 */
router.get('/search/:username', (req, res) => {
  // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
  const connection = mysql.createConnection(config);

  return connection.query(
    'select username from Account where username like ? order by username limit 5',
    req.params.username + '%',
    (err, result) => {
      if (err) throw err;
      connection.destroy();
      return res.json(JSON.parse(JSON.stringify(result)));
    },
  );
});

// EMPTY SEARCH REQUEST: GET /api/account/search
router.get('/search', (req, res) => {
  return res.json([]);
});

export default router;
