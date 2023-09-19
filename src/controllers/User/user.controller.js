const { users: Users } = require('../../db/db');
const { verifyToken } = require('../../middlewares/auth-jwt');

const getUsers = async (req, res) => {
    const users = await Users.findAll();

    res.send(users);
};

const getUser = async (req, res) => {

    const userId = req.userId;

    if (userId) {
        const user = await Users.findOne({
            where: {
                id: userId
            }
        });

        res.send(user);
    } else {
        res.status(400).send({
            message: 'No user id in token'
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

    app.get(
        '/api/users',
        [verifyToken],
        getUsers
    );

    app.get(
        '/api/user',
        [verifyToken],
        getUser
    );
};
