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
        // if (skillObj.skill_tag === '' || skillObj.skill_tag === null || skillObj.skill_tag === undefined) skillObj.skill_tag = skill[0].skill_tag;
        // if (skillObj.skill === '' || skillObj.skill === null || skillObj.skill === undefined) skillObj.skill = skill[0].skill;

        return db.query(`update skills set skill_tag = '${skillObj.skill_tag}', skill = '${skillObj.skill}' where id_skill = ${skillObj.id_skill}`);
    },
    deleteSkill: (id, id_skill) => {
        return db.query(`update skills set status = ${false} where id_skill = ${id_skill}`);
    },
    recoverSkill: (id, id_skill) => {
        return db.query(`update skills set status = ${true} where id_skill = ${id_skill}`);
    }
}