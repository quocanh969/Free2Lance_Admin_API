var db = require('../utils/db');

module.exports = {
    createSkill: (id, skillObj) => {
        return db.query(`insert into skills (skill_tag, skill, status)
                        values('${skillObj.skill_tag}', '${skillObj.skill}', ${1})`);
    },
    readSkill: (id) => {
        return db.query(`select * from skills where id_skill = ${id}`);
    },
    updateSkill: (id, skillObj) => {
        return db.query(`update skills set skill_tag = '${skillObj.skill_tag}', skill = '${skillObj.skill}', isEditting = ${false} where id_skill = ${skillObj.id_skill}`);
    },
    deleteSkill: (id, id_skill) => {
        return db.query(`update skills set status = ${false}, isEditting = ${false} where id_skill = ${id_skill}`);
    },
    recoverSkill: (id, id_skill) => {
        return db.query(`update skills set status = ${true}, isEditting = ${false} where id_skill = ${id_skill}`);
    }
}