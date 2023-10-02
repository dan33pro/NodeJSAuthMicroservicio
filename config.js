require('dotenv').config();

module.exports = {
    api: {
        port: process.env.API_PORT || 3000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'notasecret!',
    },
    mysql: {
        host: process.env.MYSQL_HOST || '',
        user: process.env.MYSQL_USER || '',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DB || '',
        port: process.env.MYSQL_PORT || '',
    },
    sendMail: {
        mail: process.env.SEND_MAIL || '',
        password: process.env.APLICATION_PASSWORD,
    }
};