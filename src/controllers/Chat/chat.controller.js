const {
    chats: Chats,
    users: Users,
    chatParticipants: ChatParticipants,
    messages: Messages
} = require('../../db/db');
const {verifyToken} = require('../../middlewares/auth-jwt');
const {sendInternalError} = require('../../helpers');
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

const getChat = async (req, res) => {
    const chatId = req.params.id;

    try {
        const messages = await Messages.findAndCountAll({
            where: {
                chatId
            },
            limit: 100,
            offset: 0,
            order: [
                ['created_at', 'DESC']
            ],
            plain: true
        });

        const chatParticipants = await ChatParticipants.findAll({
            where: {
                chatId
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
            messages: messages.rows
        });

    } catch (e) {
        console.error(e);
        sendInternalError(res, {
            message: 'Ooops... '
        });
    }
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
        '/api/chats/:id',
        [verifyToken],
        getChat
    );
};
