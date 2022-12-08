const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const db = require('./db/db');
const authController = require('./controllers/Auth/auth.controller');
const userController = require('./controllers/User/user.controller');

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

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});