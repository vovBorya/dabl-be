const Sequelize = require('sequelize');

module.exports = sequelize => sequelize.define('ChatParticipants', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    chatId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'chat_id'
    },
    userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'user_id'
    }
},{
    tableName: 'chat_participants',
    underscored: true
});
