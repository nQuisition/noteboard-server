const http = require('http');
const app = require('./app');
const models = require('./db/models');

const port = process.env.PORT || 4000;

const server = http.createServer(app);

models.sequelize.sync().then(() => {
    server.listen(port);
});