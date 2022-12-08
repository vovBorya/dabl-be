const Sequelize = require('sequelize');

// TODO
module.exports = sequelize => sequelize.define('RefreshToken', {
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});