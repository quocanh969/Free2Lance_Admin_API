var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var userModel = require('../models/userModel');
var contractModel = require('../models/contractModel');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json('welcome to my world');
});

router.get('/getList', function (req, res, next) {
  userModel.getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ 'error': 'lỗi rồi !!' })
    });
});

router.post('/login', (req, res, next) => {

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (user === false) {
      res.json({ user, info })
    }
    else {
      if (err || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user,
        });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }


        let payload = { id: user.loginUser.id };
        const token = jwt.sign(payload, '1612018_1612175');
        return res.json({ user, token, info });
      });
    }
  })(req, next);
});


router.post('/register', (req, res) => {
  var user = req.body;

  userModel.getByEmail(user.username)
    .then((data) => {
      console.log("user");
      console.log(user);
      if (data.length > 0) { // đã tồn tại
        res.json({ message: 'Username is existed', code: -1 });
      }
      else {
        userModel.register(user)
          .then(() => {
            res.json({ message: 'Register success !!!', code: 1 });
          })
          .catch((error) => {
            console.log(error);
            res.json({ message: 'Register fail !!!', code: 0 });
          });
      }
    })
    .catch((error) => {
      res.end('Có lỗi');
    });

});


router.post('/getContracts', function (req, res, next) {
  var page = Number.parseInt(req.body.page);
  contractModel.getContracts()
    .then((data) => {
      let count = data.length;
      data = data.slice(page*4,page*4+4);
      res.json({
        code: 1,
        info: {
          data,
          total: count,
        }
      });
    })
    .catch((error) => {
      res.json({
        code: 0,
      })
    });
});

router.post('/getPendingContracts', function (req, res, next) {
  var page = Number.parseInt(req.body.page);
  contractModel.getPendingContracts()
    .then((data) => {
      let count = data.length;
      data=data.slice(page*4, page*4+ 4);
      res.json({
        code: 1,
        info: {
          data,
          total: count,
        }
      });
    })
    .catch((error) => {
      res.json({
        code: 0,
      })
    });
});

router.post('/getActiveContracts', function (req, res, next) {
  var page = Number.parseInt(req.body.page);
  contractModel.getActiveContracts()
    .then((data) => {
      let count = data.length;
      data = data.slice(page*4, page*4 + 4);
      res.json({
        code: 1,
        info: {
          data,
          total: count,
        }
      });
    })
    .catch((error) => {
      res.json({
        code: 0,
      })
    });
});

router.post('/getExpiredContracts', function (req, res, next) {
  var page = Number.parseInt(req.body.page);
  contractModel.getExpiredContracts()
    .then((data) => {
      let count = data.length;
      data = data.slice(page*4, page*4 + 4);
      res.json({
        code: 1,
        info: {
          data,
          total: count,
        }
      });
    })
    .catch((error) => {
      res.json({
        code: 0,
      })
    });
});

router.post('/getHistoryContracts', function (req, res, next) {
  var page = Number.parseInt(req.body.page);
  contractModel.getHistoryContracts()
    .then((data) => {
      let count = data.length;
      data = data.slice(page*4, page*4 + 4);
      res.json({
        code: 1,
        info: {
          data,
          total: count,
        }
      });
    })
    .catch((error) => {
      res.json({
        code: 0,
      })
    });
});

module.exports = router;
