const { users: Users } = require('../../db/db');
const { verifyToken } = require('../../middlewares/auth-jwt');

const getUsers = async (req, res) => {
    const users = await Users.findAll();

    res.send(users);
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
};