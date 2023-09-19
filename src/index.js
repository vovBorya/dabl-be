const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');


dotenv.config();

const { initWebSocket } = require('./ws/init');

const db = require('./db/db');
const authController = require('./controllers/Auth/auth.controller');
const userController = require('./controllers/User/user.controller');
const chatController = require('./controllers/Chat/chat.controller');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

db.sequelize.sync();

app.use(function(req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept'
    );
    next();
});

userController(app);
authController(app);
chatController(app);

const server = http.createServer(app);

initWebSocket(server);

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// app.listen(port, () => {
//     console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// });
