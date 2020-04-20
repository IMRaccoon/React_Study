import express from 'express';
import mysql from 'mysql';
import config from '../models/config';

const router = express.Router();
// WRITE MEMO
/*
    WRITE MEMO: POST /api/memo
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: NOT LOGGED IN
        2: CONTENTS IS NOT STRING
        3: EMPTY CONTENTS
*/
router.post('/', (req, res) => {
  // CHECK LOGIN STATUS
  // 세션확인 (로그인 여부 확인)
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: 'NOT LOGGED IN',
      code: 1,
    });
  }

  // CHECK CONTENTS VALID
  // 입력받은 콘텐츠의 데이터 타입이 문자열이 아닐 경우
  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      error: 'CONTENTS IS NOT STRING',
      code: 2,
    });
  }

  // 입력받은 콘텐츠가 비어있는 경우
  if (req.body.contents === '') {
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 3,
    });
  }

  // CREATE NEW MEMO
  // 위의 결격사항이 없을 경우 DB에 저장
  const connection = mysql.createConnection(config);
  connection.query(
    'insert into Models(writer, contents) values (?, ?)',
    [req.session.loginInfo.username, req.body.contents],
    (err, result) => {
      if (err) throw err;
      connection.destroy();
      res.json({ success: true });
    },
  );
});

// MODIFY MEMO
/*
    MODIFY MEMO: PUT /api/memo/:id
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: INVALID ID,
        2: CONTENTS IS NOT STRING
        3: EMPTY CONTENTS
        4: NOT LOGGED IN
        5: NO RESOURCE
        6: PERMISSION FAILURE
*/
router.put('/:id', (req, res) => {
  // CHECK CONTENTS VALID
  // 수정할 내용이 문자열이 아닌 경우
  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      error: 'CONTENTS IS NOT STRING',
      code: 2,
    });
  }
  // 수정할 내용이 비어있는 경우
  if (req.body.contents === '') {
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 3,
    });
  }
  // CHECK LOGIN STATUS
  // 세션을 통해 로그인 여부 확인
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: 'NOT LOGGED IN',
      code: 4,
    });
  }
  // FIND MEMO
  // id 로 도큐먼트 조회
  const connection = mysql.createConnection(config);
  connection.query(
    'select * from Models where id=?',
    req.params.id,
    (err, result) => {
      // IF MEMO DOES NOT EXIST
      // id로 조회시 없을 경우
      if (!result || result.length === 0) {
        connection.destroy();
        return res.status(404).json({
          error: 'NO RESOURCE',
          code: 5,
        });
      }

      // IF EXISTS, CHECK WRITER
      // 검색된 메모의 작성자와 로그인된 데이터가 다른 경우 - 권한 없음
      if (result[0].writer != req.session.loginInfo.username) {
        connection.destroy();
        return res.status(403).json({
          error: 'PERMISSION FAILURE',
          code: 6,
        });
      }

      // MODIFY AND SAVE IN DATABASE
      // 결격사항이 없을 경우 메모를 수정하고 DB 에 저장
      return connection.query(
        'update Models set contents=?, edited=?, is_edited=1 where id=?',
        [req.body.contents, new Date(), req.params.id],
        (err, result) => {
          if (err) throw err;
          return connection.query(
            'select * from Models where id=?',
            req.params.id,
            (err, result) => {
              connection.destroy();
              return res.json({
                success: true,
                memo: JSON.parse(JSON.stringify(result[0])),
              });
            },
          );
        },
      );
    },
  );
});

// DELETE MEMO
/*
  DELETE MEMO: DELETE /api/memo/:id
  ERROR CODES
    1: INVALID ID
    2: NOT LOGGED IN
    3: NO RESOURCE
    4: PERMISSION FAILURE
*/
router.delete('/:id', (req, res) => {
  // CHECK LOGIN STATUS
  // 세션을 통해 로그인 여부 확인
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: 'NOT LOGGED IN',
      code: 2,
    });
  }

  const connection = mysql.createConnection(config);
  connection.query(
    'select * from Models where id=?',
    req.params.id,
    (err, result) => {
      if (err) throw err;
      // 해당하는 메모가 없을 경우
      if (!result || result.length === 0) {
        connection.destroy();
        return res.status(404).json({
          error: 'NO RESOURCE',
          code: 3,
        });
      }
      // 해당 메모의 작성자와 세션에 로그인된 유저가 다를 경우
      if (result[0].writer != req.session.loginInfo.username) {
        connection.destroy();
        return res.status(403).json({
          error: 'PERMISSION FAILURE',
          code: 4,
        });
      }

      // REMOVE THE MEMO
      // 위의 모든 결격사항이 없을 경우 메모를 삭제
      return connection.query(
        'delete from Models where id=?',
        req.params.id,
        (err) => {
          if (err) throw err;
          connection.destroy();
          return res.json({ success: true });
        },
      );
    },
  );
});

router.get('/', (req, res) => {
  const connection = mysql.createConnection(config);

  connection.query(
    'select * from Models order by id desc limit 6',
    (err, result) => {
      connection.destroy();
      if (!result) {
        return res.json({ memos: [] });
      }
      return res.json(JSON.parse(JSON.stringify(result)));
    },
  );
});

/*
  READ ADDITIONAL (OLD/NEW) MEMO: GET /api/memo/:listType/:id
*/
router.get('/:listType/:id', (req, res) => {
  let listType = req.params.listType;
  let id = req.params.id;

  // CHECK LIST TYPE VALIDITY
  // url 을 통해 들어온 listType 파라메터가 old/new 둘 다 아닐경우
  if (listType !== 'old' && listType !== 'new') {
    return res.status(400).json({
      error: 'INVALID LISTTYPE',
      code: 1,
    });
  }

  const connection = mysql.createConnection(config);

  if (listType === 'new') {
    connection.query(
      `select * from Models where id>${id} order by id desc limit 6`,
      (err, result) => {
        connection.destroy();
        if (err) throw err;
        return res.json(JSON.parse(JSON.stringify(result)));
      },
    );
  } else {
    connection.query(
      `select * from Models where id<${id} order by id desc limit 6`,
      (err, result) => {
        connection.destroy();
        if (err) throw err;
        return res.json(JSON.parse(JSON.stringify(result)));
      },
    );
  }
});

/*
  TOGGLES STAR OF MEMO: POST /api/memo/star/:id
  ERROR CODES
    1: INVALID ID
    2: NOT LOGGED IN
    3: NO RESOURCE
*/
router.post('/star/:id', (req, res) => {
  // CHECK LOGIN STATUS
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: 'NOT LOGGED IN',
      code: 2,
    });
  }

  const connection = mysql.createConnection(config);
  connection.query(
    'select * from Models where id=?',
    req.params.id,
    (err, result) => {
      if (err) throw err;

      if (!result || result.length === 0) {
        connection.destroy();
        return res.status(404).json({
          error: 'NO RESOURCE',
          code: 3,
        });
      }

      // CHECK WHETHER THE USER ALREADY HAS GIVEN A STAR
      // indexOf 메소드의 결과가 없을 경우 -1 이 리턴된다.
      let starred = JSON.parse(result[0].starred) || [];
      let index =
        starred === null ? -1 : starred.indexOf(req.session.loginInfo.username);

      if (index === -1) {
        //결과가 없을 경우
        starred.push(req.session.loginInfo.username);
      } else {
        starred.splice(index, 1);
      }

      return connection.query(
        'update Models set starred=? where id=?',
        [JSON.stringify(starred), req.params.id],
        (err, result) => {
          if (err) throw err;

          return connection.query(
            'select * from Models where id=?',
            req.params.id,
            (err, result) => {
              if (err) throw err;

              return res.json({
                success: true,
                has_starred: index === -1,
                memo: JSON.parse(JSON.stringify(result[0])),
              });
            },
          );
        },
      );
    },
  );
});

router.get('/:username', (req, res) => {
  const connection = mysql.createConnection(config);

  connection.query(
    'select * from Models where writer=? order by id desc limit 6',
    req.params.username,
    (err, result) => {
      if (err) throw err;

      connection.destroy();
      return res.json(JSON.parse(JSON.stringify(result)));
    },
  );
});

router.get('/:username/:listType/:id', (req, res) => {
  const { listType, id } = req.params;

  // CHECK LIST TYPE VALIDITY
  // url 로 들어온 listType 이 new/old 가 아니라면 에러 리스폰스
  if (listType !== 'old' && listType !== 'new') {
    return res.status(400).json({
      error: 'INVALID LISTTYPE',
      code: 1,
    });
  }

  const connection = mysql.createConnection(config);

  if (listType === 'new') {
    return connection.query(
      'select * from Models where id>? order by id desc limit 6',
      id,
      (err, result) => {
        if (err) throw err;
        connection.destroy();
        return res.json(JSON.parse(JSON.stringify(result)));
      },
    );
  } else {
    return connection.query(
      'select * from Models where id<? order by id desc limit 6',
      id,
      (err, result) => {
        if (err) throw err;
        connection.destroy();
        return res.json(JSON.parse(JSON.stringify(result)));
      },
    );
  }
});

export default router;
