const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

module.exports = {
    HOST: DB_HOST,
    USER: DB_USER,
    PASSWORD: DB_PASSWORD,
    DB: DB_NAME,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};