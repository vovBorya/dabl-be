const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../../db/db');
const verifySignUp = require('../../middlewares/verify-sign-up');

const {getParsedUserToApi} = require('./parsing');

const Op = db.Sequelize.Op;

const Users = db.users;
const Passwords = db.passwords;

const signIn = async (req, res) => {
    const { login, password } = req.body;

    if (!(login && password)) {
        res.send(400);

        return;
    }

    const user = await Users.findOne({
        where: {
            [Op.or]: {
                nickName: login,
                email: login
            }
        }
    });

    if (!user) {
        return res.status(404).send({
            message: 'User not found'
        });
    }

    const passwordDB = await Passwords.findOne({
        where: {
            userId: user.id
        }
    });

    const isPasswordValid = bcrypt.compareSync(password, passwordDB.password);

    if (!isPasswordValid) {
        return res.status(401).send({
            accessToken: null,
            message: 'Invalid Password!'
        });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
        ...getParsedUserToApi(user),
        accessToken: token
    });
};

const signUp = async (req, res) => {
    console.log('req.body > ', req.body);
    const nickName = req.body.nickName;
    const { /*nickName, */firstName, lastName, email, password } = req.body;

    console.log({nickName, firstName, lastName, email, password});

    try {
        const user = await Users.create(req.body);

        await Passwords.create({
            userId: user.id,
            password: bcrypt.hashSync(password, 8)
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: 86400 // 24 hours
        });

        const {
            id,
            nickName,
            firstName,
            lastName,
            email
        } = user;

        res.status(200).send({
            id,
            nickName,
            firstName,
            lastName,
            email,
            accessToken: token
        });
    } catch (e) {
        console.error(e);
    }
};

module.exports = (app) => {
    app.post(
        '/api/sign-up',
        [ verifySignUp.checkDuplicateUsernameOrEmail ],
        signUp
    );

    app.post('/api/sign-in', signIn);

    app.post('/api/token', signIn);
};