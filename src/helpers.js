const sendInternalError = (res, err) => {
    res.status(500).send({
        message: err.message
    });
};

const trimBearerFromToken = (token = '') => {
    return token.replace('Bearer ', '');
};

const onUnauthorizedRequest = (res) => {
    res.status(401).send({
        message: 'Unauthorized'
    });
};

module.exports = {
    sendInternalError,
    trimBearerFromToken,
    onUnauthorizedRequest
};