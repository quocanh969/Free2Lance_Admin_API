var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var userModel = require('../models/userModel');
var skillModel = require('../models/skillModel');
const majorModel = require('./models/majorModel');

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
          res.json({ data, token, message: "Edit completed", isEditting: false });
        })
        .catch(err => {
          res.json(err);
        })
    })
    .catch(err => {
      console.log(err);
      res.json(err);
    })
})

router.put('/deleteSkill', function (req, res) {
  let id = req.body.id;
  skillModel.deleteSkill(id, req.body.id_skill)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({ data, token, message: "Delete complete", isEditting: false });
    })
    .catch(err => {
      res.json(err);
    })
})

router.put('/recoverSkill', function (req, res) {
  let id = req.body.id;
  skillModel.recoverSkill(id, req.body.id_skill)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({ data, token, message: "Recover complete", isEditting: false });
    })
    .catch(err => {
      res.json(err);
    })
})

router.post('/addSkill', function (req, res) {
  let id = req.body.id;
  if (!req.body.skill_tag.includes("#")) req.body.skill_tag = "#" + req.body.skill_tag;
  skillModel.createSkill(id, req.body)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({ data, token, message: "Create successfully" });
    })
    .catch(err => {
      res.json(err);
    })
})
module.exports = router;
