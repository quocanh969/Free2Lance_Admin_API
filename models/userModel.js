var db = require('../utils/db');

module.exports = {
    getAll:() => {
        return db.query('SELECT * FROM ADMINs');
    },
    getByEmail:email => {
        return db.query(`SELECT * FROM ADMINs WHERE email = '${email}'`);
    },
    getById:id => {
        return db.query(`SELECT * FROM ADMINs WHERE id = ${id}`);
    },
    register:user=>{
        return db.add(user);
    },
    getUserList:queryOption=>{
        role = Number.parseInt(queryOption.role);
        if(role === 0 || role === 1)
        {
            console.log("role");
            return db.query(`SELECT * FROM USERs WHERE role = ${queryOption.role} AND (name LIKE '%${queryOption.searchStr}%' OR email LIKE '%${queryOption.searchStr}%' OR phone LIKE '%${queryOption.searchStr}%')`);
        }
        else
        {
            console.log("no role");
            return db.query(`SELECT * FROM USERs WHERE name LIKE '%${queryOption.searchStr}%' OR email LIKE '%${queryOption.searchStr}%' OR phone LIKE '%${queryOption.searchStr}%'`);
        }
    },
    getDetail:(id, role)=>{
        role = Number.parseInt(role);        
        if(role === 0) // learner
        {
            return db.query(`SELECT * FROM USERs WHERE id = ${id} AND role = ${role}`);
        }
        else // tutor
        {
            return db.query(`SELECT * FROM USERs as U, TUTORs as T WHERE U.id = ${id} AND U.id = T.id_user AND U.role = ${role}`);
        }
    },
    getSkillList: queryOption => {
        return db.query(`SELECT * FROM SKILLs WHERE skill_tag LIKE '%${queryOption.searchStr}%' OR skill LIKE '%${queryOption.searchStr}%'`);
    }
}