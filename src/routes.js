const versionController = require('./controllers/version');

const routes = {
    "/updatecheck/:slaveUID/:slaveVersion": {
        "get"(req, res) {
            versionController.currentVersion(req, res);
        }
    }
};

module.exports = routes;