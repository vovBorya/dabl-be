const jwt = require('jsonwebtoken');
const { trimBearerFromToken} = require('../helpers');

const verifyToken = (req, res, next) => {
    const token = trimBearerFromToken(req.headers['authorization']);

    console.log({token});

    if (!token) {
        return res.status(403).send({
            message: 'No token provided!'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        console.log({err});
        console.log({decoded});
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken,
};

module.exports = authJwt;