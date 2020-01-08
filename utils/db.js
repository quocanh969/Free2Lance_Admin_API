var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
        
        
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '30111998',
        database: 'uber_tutor_admin',
        dateStrings: true,
        timezone: 'Z',
        
        
        // host: 'remotemysql.com',
        // port: '3306',
        // user: 'LdOe2JLqt9',
        // password: 'cAMxQWpQ7U',
        // database: 'LdOe2JLqt9',
        // dateStrings: true,        
        // timezone: 'Z',
        
        typeCast: function castField(field, useDefaultTypeCasting) {

            if ((field.type === "BIT") && (field.length === 1)) {

                var bytes = field.buffer();

                return (bytes[0] === 1);

            }

            return (useDefaultTypeCasting());

        }
    });
}

module.exports = {
    query: sql => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
                connection.end();
            });
        });
    },
    add: user => {
        return new Promise((resolve, reject) => {
            var sql = `INSERT INTO ADMINs(username, password, name, address, email, phone, yob, gender, avatarLink, status) 
                        VALUES('${user.username}', '${user.password}', '${user.name}', '${user.address}', '${user.email}', '${user.phone}',${user.yob},${user.gender},'',${false})`;            
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
                connection.end();
            });
        });
    },
}
