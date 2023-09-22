const Sequelize = require('sequelize');

module.exports = sequelize => sequelize.define('Password', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'user_id'
    }
}, {
    tableName: 'passwords',
    underscored: true
});
