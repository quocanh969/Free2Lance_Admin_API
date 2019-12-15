var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var userModel = require('../models/userModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  

  let payload = { id: req.body.id };
  const token = jwt.sign(payload, '1612018_1612175');

  res.json({
    message:"Authorized",
    token,
  })
});

router.post('/getUserList', function(req,res){
  let {id, queryOption} = req.body;
  
  userModel.getUserList(queryOption)
    .then((data) => {

      // Cập nhật token mới nhất
      let payload = { id: id};
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

router.post('/getSkillList', function(req,res){

  let {id, queryOption} = req.body;
  
  userModel.getSkillList(queryOption)
    .then((data) => {

      // Cập nhật token mới nhất
      let payload = { id: id};
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

router.post('/getDetailUser', function(req,res){
  let {id, role} = req.body;
  id = Number.parseInt(id);
  role = Number.parseInt(role);
  userModel.getDetail(id, role)
    .then((data) => {
      console.log('succes');
      // Cập nhật token mới nhất
      let payload = { id: id};
      token = jwt.sign(payload, '1612018_1612175');
      console.log(data);
      res.json({
        code: 1,
        info: {
          message: "Success",
          token,
          data:data[0],
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

module.exports = router;
