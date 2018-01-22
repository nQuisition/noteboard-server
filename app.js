const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const noteRoutes = require('./api/routes/note');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://nQuisition:' + process.env.MONGO_PW + '@note-board-shard-00-00-ojxib.mongodb.net:27017,note-board-shard-00-01-ojxib.mongodb.net:27017,note-board-shard-00-02-ojxib.mongodb.net:27017/test?ssl=true&replicaSet=note-board-shard-0&authSource=admin');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/note', noteRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;