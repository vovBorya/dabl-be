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
db.chats = require('./models/Chat.model')(sequelize);
db.chatParticipants = require('./models/ChatParticipants.model')(sequelize);
db.messages = require('./models/Message.model')(sequelize);

// db.chats.hasMany(db.messages, {
//     foreignKey: 'chat_id'
// });
// db.messages.belongsTo(db.chats);
//
// db.chats.hasMany(db.chatParticipants, {
//     foreignKey: 'chat_id'
// });
// db.chatParticipants.belongsTo(db.chats);
//
// db.users.hasMany(db.chatParticipants, {
//     foreignKey: 'user_id'
// });
// db.chatParticipants.belongsTo(db.users);

module.exports = db;
