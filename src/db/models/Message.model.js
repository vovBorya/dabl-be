const Sequelize = require('sequelize');

module.exports = sequelize => sequelize.define('Message', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    authorId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'author_id',
    },
    chatId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'chat_id',
    }
},{
    tableName: 'messages',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
