const {
    chatParticipants: ChatParticipants
} = require('../db/db');

const {subscribedSSEUsers} = require('./init');
const {SSE_TYPES} = require('./constants');

const sendMessageToChatParticipants = async (req, res, newMessage) => {

    const chatParticipants = await ChatParticipants.findAll({
        where: {
            chatId: newMessage.chatId
        },
        raw: true
    });

    chatParticipants.filter(chatParticipant => chatParticipant.userId !== newMessage.authorId).forEach(chatParticipant => {
        const userConnection = subscribedSSEUsers[chatParticipant.userId];

        if (!userConnection) return;

        userConnection.res.write('event: message\n');
        userConnection.res.write(`data: ${JSON.stringify({
            type: SSE_TYPES.messageSent,
            ...newMessage
        })}\n\n`);
    });
};

module.exports = {
    sendMessageToChatParticipants
};
