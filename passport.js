const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const userModel = require('./models/userModel');
const skillModel = require('./models/skillModel');



passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
    },
    function (username, password, cb) {
        return userModel.getByEmail(username)
            .then((data) => {
                if (data.length > 0) { // đã tồn tại
                    if (password === data[0].password) {
                        console.log("data 0 ");
                        console.log(data[0]);
                        return cb(null, { loginUser: data[0] }, { message: 'Logged in successfully', code: 2 });
                    }
                    else {
                        cb(null, false, { message: 'Wrong password', code: 1 });
                    }
                }
                else {
                    return cb(null, false, { message: 'Wrong username', code: 0 });
                }
            })
            .catch((error) => {                
                return cb(error)
            });
    }
));

passport.use('GetById', new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: '1612018_1612175',
    },
    function (jwtPayload, cb){              
        return userModel.getById(jwtPayload.id)
            .then(data=>{     
                if(data.length > 0)           
                {
                    user = data[0];
                    return cb(null, user,{message: 'Authorized', code: 1 });
                }                
                else
                {
                    return cb(err, null,{ message: 'Can not authorized', code: 0 });
                }
            })
            .catch(err=>{                
                return cb(err, null,{ message: 'Can not authorized', code: 0 });
            });
    }
));

passport.use('EditSkill', new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: '1612018_1612175',
        passReqToCallback: true,
    },
    function (req, token, done){
        // var info = req.body;
        return skillModel.updateSkill(token.id, req.body)
        .then(result => {
            return done({message: "Edit successfully", code: 1, result});
        }).catch(err => {
            return done({meesage: "Edit failed", code: 0, err});
        })
    }
));

passport.use('DeleteSkill', new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: '1612018_1612175',
    },
    function (req, token, done){
        // var info = req.body;
        return skillModel.deleteSkill(token.id, req.body.id_skill)
        .then(result => {
            return done({message: "Delete successfully", code: 1, result});
        }).catch(err => {
            return done({meesage: "Delete failed", code: 0, err});
        })
    }
));

passport.use('RecoverSkill', new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: '1612018_1612175',
        passReqToCallback: true,
    },
    function (req, token, done){
        // var info = req.body;
        return skillModel.recoverSkill(token.id, req.body.id_skill)
        .then(result => {
            return done({message: "Recover successfully", code: 1, result});
        }).catch(err => {
            return done({meesage: "Recover failed", code: 0, err});
        })
    }
));

passport.use('CreateSkill', new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: '1612018_1612175',

    },
    function (req, token, done){
        // var info = req.body;
        return skillModel.createSkill(token.id, req.body)
        .then(result => {
            return done({message: "Create successfully", code: 1, result});
        }).catch(err => {
            return done({meesage: "Create failed", code: 0, err});
        })
    }
));