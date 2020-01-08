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
    },
    removeComplain: (id) => {
        return db.query(`update contracts set complain = '' where id = ${id}`);
    },
    getIncomeStatByYear: (year) => {
        return db.query(`
        SELECT
        idMonth,
        MONTHNAME(STR_TO_DATE(idMonth, '%m')) as m,
        IFNULL(sum(contracts.totalPrice), 0) as total
      FROM Contracts
      RIGHT JOIN (
        SELECT 1 as idMonth
        UNION SELECT 2 as idMonth
        UNION SELECT 3 as idMonth
        UNION SELECT 4 as idMonth
        UNION SELECT 5 as idMonth
        UNION SELECT 6 as idMonth
        UNION SELECT 7 as idMonth
        UNION SELECT 8 as idMonth
        UNION SELECT 9 as idMonth
        UNION SELECT 10 as idMonth
        UNION SELECT 11 as idMonth
        UNION SELECT 12 as idMonth
      ) as Month
      ON Month.idMonth = month(EndDate) and year(contracts.EndDate) = ${year} and status = 2
      GROUP BY Month.idMonth order by idMonth    
        `)
    },
    getIncomeStatByWeek: (year) => {
        return db.query(`
        SELECT year(EndDate) as year, weekofyear(EndDate) as week, ifnull(sum(totalPrice), 0) as total
        FROM contracts
        where year(EndDate) = ${year} and status = 2
        GROUP BY YEAR(EndDate), WEEKOFYEAR(EndDate) order by year asc, week asc;
        `);
    },
    getIncomeStatByMonth: (year, month) => {
        return db.query(`
            select year(EndDate) year, month(EndDate) month, day(EndDate) day, sum(totalPrice) as total from contracts where year(EndDate) = ${year} and month(EndDate) = ${month} group by day;
        `)
    },
    getContracts: () => {
        return db.query('select * from contracts');
    },
    getPendingContracts: () => {
        return db.query('select * from contracts where status = 0');
    },
    getActiveContracts: () => {
        return db.query('select * from contracts where status = 1');
    },
    getExpiredContracts: () => {
        return db.query('select * from contracts where status = 3');
    },
    getHistoryContracts: () => {
        return db.query('select * from contracts where status = 2');
    },
}