var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var userModel = require('../models/userModel');
var skillModel = require('../models/skillModel');
var majorModel = require('../models/majorModel');

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
      res.json(err);
    })
})

router.put('/deleteMajor', function (req, res) {
  let id = req.body.id;
  majorModel.deleteMajor(id, req.body.id_major)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({ data, token, message: "Delete complete", isEditting: false });
    })
    .catch(err => {
      res.json(err);
    })
})

router.put('/recoverMajor', function (req, res) {
  let id = req.body.id;
  majorModel.recoverMajor(id, req.body.id_major)
    .then(data => {
      const payload = { id: id };
      const token = jwt.sign(payload, '1612018_1612175');
      res.json({ data, token, message: "Recover complete", isEditting: false });
    })
    .catch(err => {
      res.json(err);
    })
})

module.exports = router;
