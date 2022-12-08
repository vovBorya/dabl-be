const sendInternalError = (res, err) => {
    res.status(500).send({
        message: err.message
    });
};

const trimBearerFromToken = (token = '') => {
    return token.replace('Bearer ', '');
};

module.exports = {
    sendInternalError,
    trimBearerFromToken
};