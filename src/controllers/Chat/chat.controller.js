const {
    chats: Chats,
    users: Users,
    chatParticipants: ChatParticipants,
    messages: Messages
} = require('../../db/db');
const {verifyToken} = require('../../middlewares/auth-jwt');
const {sendInternalError} = require('../../helpers');
const {sendMessageToChatParticipants} = require('../../sse/functions');
const db = require('../../db/db');

const Op = db.Sequelize.Op;

const createChat = async (req, res) => {

    const {participantsIds} = req.body;

    try {

        const users = await Users.findAll({
            where: {
                [Op.or]: participantsIds.map(id => ({ id }))
            }
        });

        if (users.length < participantsIds.length) {
            res.status(400).send({
                message: 'Some of provided participants ids are invalid'
            });
        }

        const chat = await Chats.create({
            name: '',
            isGroup: participantsIds.length === 2 ? 0 : 1
        });

        for (const participantsId of participantsIds) {
            await ChatParticipants.create({
                chatId: chat.id,
                userId: participantsId,
                raw: true,
            });
        }

        res.send({
            ...chat.dataValues,
            participants: users,
            messages: []
        });
    } catch (e) {
        sendInternalError(res, {
            message: 'Ooops... '
        });
    }
};

const getChats = async (req, res) => {
    const chatParticipants = await ChatParticipants.findAll({
        attributes: ['chatId', 'userId'],
        raw: true,
        where: {
            userId: req.userId
        }
    });

    const chats = await Chats.findAll({
        raw: true,
        where: {
            [Op.or]: chatParticipants.map(chatParticipant => {
                return {
                    id: chatParticipant.chatId
                };
            })
        }
    });

    const resultChats = [];

    for (const chat of chats) {
        let chatName = chat.name;

        if (!chatName) {
            const chatParticipantNotMe = await ChatParticipants.findOne({
                attributes: ['chatId', 'userId'],
                raw: true,
                where: {
                    chatId: chat.id,
                    userId: {
                        [Op.not]: req.userId
                    }
                }
            });

            const user = await Users.findByPk(chatParticipantNotMe.userId, {raw: true});

            chatName = user.nickName;
        }

        resultChats.push({
            ...chat,
            name: chatName
        });
    }

    res.send(resultChats);
};

const getChat = async (req, res) => {
    const chatId = req.params.id;

    try {

        const messages = await Messages.findAll({
            where: {
                chatId
            },
            limit: 100,
            offset: 0,
            order: [
                ['created_at', 'ASC']
            ],
            // plain: true
        });

        const chatParticipants = await ChatParticipants.findAll({
            where: {
                chatId,
                userId: {
                    [Op.not]: req.userId
                }
            }
        });

        const users = await Users.findAll({
            where: {
                [Op.or]: chatParticipants.map(chatParticipant => {
                    return {
                        id: chatParticipant.dataValues.userId
                    };
                })
            }
        });

        const chat = await Chats.findOne({
            where: {
                id: chatId
            }
        });

        if (!chat) {
            res.status(404).send();

            return;
        }

        res.send({
            ...chat.dataValues,
            participants: users,
            messages: messages
        });

    } catch (e) {
        console.error(e);
        sendInternalError(res, {
            message: 'Ooops... '
        });
    }
};

const saveMessage = async (req, res) => {

    const { text, authorId, chatId } = req.body;

    const message = await Messages.create({
        text,
        authorId,
        chatId,
        raw: true
    });

    res.status(200).send(message);

    return message.dataValues;
};

const onMessageSent = async (req, res) => {
    const newMessage = await saveMessage(req, res);

    await sendMessageToChatParticipants(req, res, newMessage);
};

module.exports = app => {
    app.use(function(req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    app.post(
        '/api/chats',
        [verifyToken],
        createChat
    );

    app.get(
        '/api/chats',
        [verifyToken],
        getChats
    );

    app.get(
        '/api/chats/:id',
        [verifyToken],
        getChat
    );

    app.post(
        '/api/sendMessage',
        [verifyToken],
        onMessageSent
    );
};
