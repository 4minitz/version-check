const PORT = process.env.PORT || 8080;

const Server = require('./server');
const routes = require('./routes');

const server = new Server(PORT, routes);