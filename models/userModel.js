var db = require('../utils/db');

module.exports = {
    getAll:() => {
        return db.query('SELECT * FROM ADMINs');
    },
    getByUsername:username => {
        return db.query(`SELECT * FROM ADMINs WHERE username = '${username}'`);
    },
    register:user=>{
        return db.add(user);
    },
}