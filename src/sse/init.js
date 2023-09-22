const jwt = require('jsonwebtoken');

let subscribedSSEUsers = {};

const initSSE = (app) => {
    app.get('/subscribe/:accessToken', (req, res) => {
        const accessToken = req.params.accessToken;

        jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: 'Unauthorized!'
                });
            }
            const headers = {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache'
            };
            res.writeHead(200, headers);

            res.write('CONNECTED\n\n');

            const userId = decoded.id;

            subscribedSSEUsers[userId] = {
                res
            };

            req.on('close', () => {

                delete subscribedSSEUsers[userId];

                res.end('OK');
            });
        });
    });
};

module.exports = {
    initSSE,
    subscribedSSEUsers
};
