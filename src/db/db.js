const { Sequelize } = require('sequelize');

const {
    DB_NAME = '',
    DB_USER = '',
    DB_PASSWORD = ''
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./models/User.model')(sequelize);
db.passwords = require('./models/Password.model')(sequelize);

module.exports = db;
