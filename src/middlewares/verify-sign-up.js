const db = require('../db/db');

const { users: Users } = db;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    // Username
    let user = await Users.findOne({
        where: {
            nickName: req.body.nickName
        }
    });

    if (user) {
        res.status(400).send({
            message: 'Failed! Nick name is already in use!'
        });
        return;
    }

    user = await Users.findOne({
        where: {
            email: req.body.email
        }
    });

    if (user) {
        res.status(400).send({
            message: 'Failed! Email is already in use!'
        });
        return;
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;