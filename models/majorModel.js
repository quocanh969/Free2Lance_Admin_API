var db = require('../utils/db');

module.exports = {
    createMajor: (id, majorObj) => {
        return db.query(`insert into majors (name, icoUrl, status)
                        values('${majorObj.name}', '${icoUrl}', ${1})`);
    },
    readMajor: (id) => {
        return db.query(`select * from majors where id = ${id}`);
    },
    updateMajor: (id, majorObj) => {
        return db.query(`update majors set name = '${majorObj.name}', icoUrl = '${majorObj.icoUrl}' where id = ${majorObj.id}`);
    },
    deleteMajor: (id, id_major) => {
        return db.query(`update majors set status = ${false} where id_skill = ${id_major}`);
    },
    recoverMajor: (id, id_major) => {
        return db.query(`update majors set status = ${true} where id_skill = ${id_major}`);
    }
}