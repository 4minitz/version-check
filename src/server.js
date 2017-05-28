const restify = require('restify');

class Server {
    constructor(port, routes) {
        this._server = this._initServer();
       
        this._setupRoutes(routes);
        
        this._server.listen(port, () => {
            console.log(`Listening at ${this._server.url}`);
        });
    }

    _initServer() {
        const server = restify.createServer();
        server.use(restify.acceptParser(server.acceptable));
        server.use(restify.queryParser());
        server.use(restify.bodyParser());
        server.use(this._initRateLimiter());

        return server;
    }

    _initRateLimiter() {
        return restify.throttle({
            burst: 2, // max two concurrent connections
            rate: 0.1, // one connection every 10s
            ip: true
        });
    }

    _setupRoutes(routes) {
        for (const route of Object.keys(routes)) {
            const handlers = routes[route];
            this._setupRoute(route, handlers);
        }
    }

    _setupRoute(route, handlers) {
        for (const method of Object.keys(handlers)) {
            const handler = handlers[method];

            this._server[method](route, function (req, res, next) {
                handler(req, res);
                return next();
            });
        }
    }
}

module.exports = Server;