var db = require('../utils/db');

module.exports = {
    getContractList: (queryOption) => {
        if (queryOption.type === 0) {
            queryOption.type = "c.id_learner";
        } else {
            queryOption.type = "c.id_tutor";
        }
        return db.query(`select c.*, u1.name as learner, u1.avatarLink, u2.name as learner, m.name as major_name
        from contracts as c, tutors as t, users as u1, users as u2, majors as m
        where c.id_learner = u1.id and c.id_tutor = t.id_user and c.id_tutor = u2.id and c.major = m.id and ${queryOption.type} = ${queryOption.id}`);
    },
    getContractDetail: (id) => {
        return db.query(`select c.*, u1.email as learner_email, u2.email as tutor_email from contracts as c, users as u1, users as u2
                        where c.id_learner = u1.id and c.id_tutor = u2.id and c.id = ${id}`);
    },
    getIncome: (id_tutor) => {
        return db.query(`select * from contracts where status = ${2} and id_tutor = ${id_tutor}`);
    },
    getIncomeByMonth: (id_tutor, year, month) => {
        return db.query(`select * from contracts where status = ${2} and Month(EndDate) = ${month} and Year(EndDate) = ${year} and id_tutor = ${id_tutor}`);
    },
    getIncomeFromLastNDays: (id_tutor, days) => {
        return db.query(`select * from contracts where status = ${2} and EndDate between curdate() - interval ${days} day and curdate() and id_tutor = ${id_tutor}`);
    },
    getActiveContractsWithComplains: () => {
        return db.query(`select * from contracts where status = ${1} and complain != ''`);
    },
    cancelAnActiveContract: (id) => {
        return db.query(`update contracts set status = ${4} where id = ${id}`);
    }
}