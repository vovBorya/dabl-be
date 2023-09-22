const Sequelize = require('sequelize');

module.exports = sequelize => sequelize.define('User', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    nickName: {
        type: Sequelize.STRING,
        field: 'nick_name',
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        field: 'last_name'
    },
    firstName: {
        type: Sequelize.STRING,
        field: 'first_name'
    },
    email: Sequelize.STRING,
    birthDate: {
        type: Sequelize.DATEONLY,
        field: 'birth_date'
    }
},{
    tableName: 'users',
    underscored: true
});
