var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var userModel = require('../models/userModel');
var skillModel = require('../models/skillModel');
var majorModel = require('../models/majorModel');
var nodemailer = require('nodemailer');
const EMAIL_USERNAME = "ubertutor018175";
const EMAIL_PASSWORD = "Ubertutor123";
/* GET users listing. */
router.get('/', function (req, res, next) {


  let payload = { id: req.body.id };
  const token = jwt.sign(payload, '1612018_1612175');

  res.json({
    message: "Authorized",
    token,
  })
});

router.post('/getUserList', function (req, res) {
  let { id, queryOption } = req.body;

  userModel.getUserList(queryOption)
    .then((data) => {

      // Cập nhật token mới nhất
      let payload = { id: id };
      token = jwt.sign(payload, '1612018_1612175');

      res.json({
        code: 1,
        info: {
          message: "Success",
          token,
          data,
        }
      })
    })
    .catch((error) => {
      res.json({
        code: 0,
        info: {
          message: "Error",
          token: null,
          data: [],
        }
      })
    });
});

router.post('/getSkillList', function (req, res) {

  let { id, queryOption } = req.body;

  userModel.getSkillList(queryOption)
    .then((data) => {

      // Cập nhật token mới nhất
      let payload = { id: id };
      token = jwt.sign(payload, '1612018_1612175');

      res.json({
        code: 1,
        info: {
          message: "Success",
          token,
          data,
        }
      })
    })
    .catch((error) => {
      res.json({
        code: 0,
        info: {
          message: "Error",
          token: null,
          data: [],
        }
      })
    });
});

router.post('/getDetailUser', function (req, res) {
  let { id, role } = req.body;
  id = Number.parseInt(id);
  role = Number.parseInt(role);
  userModel.getDetail(id, role)
    .then((data) => {
      console.log('succes');
      // Cập nhật token mới nhất
      let payload = { id: id };
      token = jwt.sign(payload, '1612018_1612175');
      console.log(data);
      res.json({
        code: 1,
        info: {
          message: "Success",
          token,
          data: data[0],
        }
      })
    })
    .catch((error) => {
      console.log('error');
      res.json({
        code: 0,
        info: {
          message: "Error",
          token: null,
          data: null,
        }
      })
    });
});

router.put('/editSkill', function (req, res) {
  let id = req.body.id;
  skillModel.readSkill(req.body.id_skill)
    .then(responseData => {
      if (req.body.skill_tag === '' || req.body.skill_tag === undefined || req.body.skill_tag === null) req.body.skill_tag = responseData[0].skill_tag;
      if (req.body.skill === '' || req.body.skill === undefined || req.body.skill === null) req.body.skill = responseData[0].skill;
      if (!req.body.skill_tag.includes("#")) req.body.skill_tag = "#" + req.body.skill_tag;
      skillModel.updateSkill(id, req.body)
        .then(data => {
          const payload = { id: id };
          let token = jwt.sign(payload, '1612018_1612175');
          res.json({
            code: 1,
            info: {
              data,
              token,
              message: "Edit completed",
            }
          });
        })
        .catch(err => {
          res.json({
            code: 0,
            info: {
              data: null,
              token: null,
              message: err,
            }
          });
        })
    })
    .catch(err => {
      console.log(err);
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      });
    })
})

router.put('/deleteSkill', function (req, res) {
  let id = req.body.id;
  skillModel.deleteSkill(id, req.body.id_skill)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({
        code: 1,
        info: {
          data,
          token,
          message: "Delete completed",
        }
      });
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      });
    })
})

router.put('/recoverSkill', function (req, res) {
  let id = req.body.id;
  skillModel.recoverSkill(id, req.body.id_skill)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({
        code: 1,
        info: {
          data,
          token,
          message: "Recover complete",
        }
      });
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      });
    })
})

router.post('/addSkill', function (req, res) {
  let id = req.body.id;
  if (!req.body.skill_tag.includes("#")) req.body.skill_tag = "#" + req.body.skill_tag;
  skillModel.createSkill(id, req.body)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({
        code: 1,
        info: {
          data,
          token,
          message: "Create successfully"
        }
      });
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      });
    })
})

router.put('/editMajor', function (req, res) {
  let id = req.body.id;
  majorModel.readMajor(req.body.id_major)
    .then(responseData => {
      if (req.body.name === '' || req.body.name === undefined || req.body.name === null) req.body.name = responseData[0].name;
      if (req.body.icoUrl === '' || req.body.icoUrl === undefined || req.body.icoUrl === null) req.body.icoUrl = responseData[0].icoUrl;

      majorModel.updateMajor(id, req.body)
        .then(data => {
          const payload = { id: id };
          let token = jwt.sign(payload, '1612018_1612175');
          res.json({
            code: 1,
            info: {
              data,
              token,
              message: "Edit completed",
            }
          });
        })
        .catch(err => {
          res.json({
            code: 0,
            info: {
              data: null,
              token: null,
              message: err,
            }
          });
        })
    })
    .catch(err => {
      console.log(err);
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      });
    })
})

router.post('/addMajor', function (req, res) {
  let id = req.body.id;
  // if (req.body.icoUrl === '' || req.body.icoUrl === undefined || req.body.icoUrl === null) req.body.icoUrl = 'https://cdn4.iconfinder.com/data/icons/school-subjects/256/Literature-512.png';
  majorModel.createMajor(id, req.body)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({ data, token, message: "Create successfully" });
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      });
    })
})

router.put('/deleteMajor', function (req, res) {
  let id = req.body.id;
  majorModel.deleteMajor(id, req.body.id_major)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({ data, token, message: "Delete complete", });
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      });
    })
})

router.put('/recoverMajor', function (req, res) {
  let id = req.body.id;
  majorModel.recoverMajor(id, req.body.id_major)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({ code: 1, info: { data, token, message: "Recover complete", } });
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      });
    })
})

router.put('/banAccount', function (req, res) {
  let body = req.body
  console.log(body.status);
  userModel.changeAccountStatus(body)
    .then(data => {
      const payload = { id: body.id };
      const token = jwt.sign(payload, '1612018_1612175')

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${EMAIL_USERNAME}`,
          pass: `${EMAIL_PASSWORD}`,
        },
      });
      let mailOptions;
      if (body.status === 'true') {
        mailOptions = {
          from: EMAIL_USERNAME,
          to: `${body.email}`,
          subject: 'Your account has been restored',
          text:
            'Your account has been restored and you can now login to use the site as usual.\n\n'
        };
      }
      else {
        mailOptions = {
          from: EMAIL_USERNAME,
          to: `${body.email}`,
          subject: 'Your account has been suspended',
          text:
            'Your account is currently banned because of negative reports.\n\n'
            + 'This state will be pernament until you have provided enough evidence to convince us to restore your account.\n\n'
            + 'If you have any questions, please reply this mail thread.\n',
        };
      }
      console.log(mailOptions);
      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          res.json({
            code: 0,
            info: {
              data: null,
              token: null,
              message: err,
            }
          })
        } else {
          res.json({
            code: 1,
            info: {
              data,
              token: token,
              message: "User status changed to" + body.status,
              response,
            }
          })
        }
      });

    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          token: null,
          message: err,
        }
      })
    })
})

module.exports = router;
