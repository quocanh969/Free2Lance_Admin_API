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
            return db.query(`SELECT U.*, T.*, M.id as id_major, M.name as major_name, S.id_skill, S.skill, S.skill_tag, A.id_area, A.area
            FROM USERs as U, TUTORs as T, SKILLs as S, SKILL_TABLE as SC, MAJORS as M, AREAs as A
            WHERE U.id = ${id} AND U.id = T.id_user AND U.role = ${role} and M.id = T.major and A.id_area = T.areaCode
            and SC.id_teacher = T.id_user and S.id_skill = SC.skill_code`);
        }
    },
    changeAccountStatus: (body) => {
        return db.query(`update users set status = ${body.status} where id = ${body.id}`);
    },
    deleteTutorSkill: (id_skill) => {
        return db.query(`delete from skill_table where skill_code = ${id_skill}`)
    },
    deleteTutorMajor: (id_major) => {
        return db.query(`update tutors set major = ${1} where major = ${id_major}`)
    }
}