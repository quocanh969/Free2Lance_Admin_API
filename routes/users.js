var express = require('express');
var router = express.Router();
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var userModel = require('../models/userModel');
var skillModel = require('../models/skillModel');
var majorModel = require('../models/majorModel');
var contractModel = require('../models/contractModel');

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
  queryOption.page = Number.parseInt(queryOption.page);
  userModel.getUserList(queryOption)
    .then((data) => {

      // Cập nhật token mới nhất
      let payload = { id: id };
      token = jwt.sign(payload, '1612018_1612175');
      let count = data.length;
      data = data.slice(queryOption.page * 4, queryOption.page * 4 + 4)
      res.json({
        code: 1,
        info: {
          total: count,
          message: "Success",
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
  queryOption.page = Number.parseInt(queryOption.page);
  skillModel.getSkillList(queryOption)
    .then((data) => {
      let count = data.length;
      console.log(count);
      data = data.slice(queryOption.page * 10, queryOption.page * 10 + 10);

      res.json({
        code: 1,
        info: {
          message: "Success",
          total: count,
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
          error,
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
      console.log(data);
      if (role === 1) {
        data = _.groupBy(data, "id");
        _.forEach(data, (value, key) => {
          const skills = _.map(value, item => {
            const { skill, id_skill, skill_tag } = item;
            return { skill, id_skill, skill_tag };
          })
          console.log(skills);
          const temp = {
            id: value[0].id,
            name: value[0].name,
            password: value[0].password,
            email: value[0].email,
            yob: value[0].yob,
            gender: value[0].gender,
            id_area: value[0].areaCode,
            area: value[0].area,
            phone: value[0].phone,
            price: value[0].price,
            evaluation: value[0].evaluation,
            avatarLink: value[0].avatarLink,
            id_major: value[0].major,
            major_name: value[0].major_name,
            skills,
          }
          data = temp;
        })
      }
      console.log("Return: ");
      console.log(data);
      res.json({
        code: 1,
        info: {
          message: "Success",
          token: null,
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
      userModel.deleteTutorSkill(req.body.id_skill)
        .then(data2 => {
          res.json({
            code: 1,
            info: {
              data2,
              message: "Delete completed",
            }
          });
        })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
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
      userModel.deleteTutorMajor(req.body.id_major)
        .then(data2 => {
          res.json({ data2, message: "Delete complete", });
        })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
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

router.put('/changeAccountStatus', function (req, res) {
  // truyền vào body true/ false sẽ tự động chạy ban/ restore tương ứng.
  // xử lí nút trạng thái bằng cách xét {account.status ? nút ban : nút restore} ?
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

router.post('/getMajorList', (req, res) => {
  let { queryOption } = req.body;
  queryOption.page = Number.parseInt(queryOption.page)
  queryOption.page = Number.parseInt(queryOption.page);
  majorModel.getMajorList(queryOption)
    .then(data => {
      let count = data.length;
      data = data.slice(queryOption.page * 10, queryOption.page * 10 + 10);
      res.json({
        code: 1,
        info: {
          total: count,
          data,
          message: "Get list of majors successfully",
        }
      })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          data: null,
          message: err,
        }
      })
    })
})

router.post('/getContractList', (req, res) => {
  let { queryOption } = req.body;
  queryOption.page = Number.parseInt(queryOption.page);
  contractModel.getContractList(queryOption)
    .then(data => {
      let count = data.length;
      data = data.slice(queryOption.page * 4, queryOption.page * 4 + 4);
      res.json({
        code: 1,
        info: {
          total: count,
          data,
          message: "1",
        }
      })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          err,
          message: '0',
        }
      })
    })
})

router.post('/getContractDetail', (req, res) => {
  let id = req.body.id;
  contractModel.getContractDetail(id)
    .then(data => {
      res.json({
        code: 1,
        info: {
          data,
          message: "1",
        }
      })
    })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          err,
          message: "0",
        }
      })
    })
})

router.get('/getIncomeReport', (req, res) => {
  let type = req.body.type;
  let id_tutor = req.body.id;
  type = Number.parseInt(type);
  if (type === 0) {
    contractModel.getIncome(id_tutor)
      .then(data => {
        res.json({
          code: 1,
          info: {
            data,
            message: "Return all income",
          }
        })
      })
      .catch(err => {
        res.json({
          code: 0,
          info: {
            err,
            message: "Failed",
          }
        })
      })
  }
  else if (type === 1) {
    let { month, year } = req.body;
    contractModel.getIncomeByMonth(id_tutor, year, month)
      .then(data => {
        res.json({
          code: 1,
          info: {
            data,
            message: "Return incomes in " + month + "/" + year,
          }
        })
      })
      .catch(err => {
        res.json({
          code: 0,
          info: {
            err,
            message: "Failed",
          }
        })
      })
  }
  else {
    let { days } = req.body;
    contractModel.getIncomeFromLastNDays(id_tutor, days)
      .then(data => {
        res.json({
          code: 1,
          info: {
            data,
            message: "Return incomes from last " + days + " days",
          }
        })
      })
      .catch(err => {
        res.json({
          code: 0,
          info: {
            err,
            message: "Failed",
          }
        })
      })
  }
})

router.get('/getComplainedContracts', (req, res) => {
  contractModel.getActiveContractsWithComplains().then(data => {
    res.json({
      code: 1,
      info: {
        data,
        message: "Complained contracts",
      }
    })
  })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          err,
          message: "Get failed",
        }
      })
    })
})

router.put('/cancelAnActiveContract', (req, res) => {
  let id = req.body.id_contract;
  contractModel.cancelAnActiveContract(id).then(data => {
    res.json({
      code: 1,
      info: {
        data,
        message: "Cancelled",
      }
    })
  })
    .catch(err => {
      res.json({
        code: 0,
        info: {
          err,
          message: "Cancellation failed",
        }
      })
    })
})

router.post('/getStatisticByYear', (req, res) => {
  let { year } = req.body;
  year = Number.parseInt(year);
  contractModel.getIncomeStatByYear(year).then(data => {
    res.json({
      code: 1,
      info: {
        data,
        message: "1",
      }
    })
  }).catch(err => {
    res.json({
      code: 0,
      info: {
        err,
        message: "0",
      }
    })
  })
})

module.exports = router;
