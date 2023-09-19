const Sequelize = require('sequelize');

module.exports = sequelize => sequelize.define('Chat', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    isGroup: {
        type: Sequelize.INTEGER,
        field: 'is_group',
        allowNull: false,
        defaultValue: 0
    }
},{
    tableName: 'chats',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
