const slaveService = require('../services/slave');
const versionService = require('../services/version');

const version = {
    currentVersion(req, res) {
        const {slaveUID, slaveVersion} = req.params,
            remoteAddress = req.connection.remoteAddress,
            tag = versionService.getCurrent();

        const respondWithTag = () => {
            res.json(200, {tag});
        };

        slaveService.updateSlave(slaveUID, slaveVersion, remoteAddress)
            .then(respondWithTag)
            .catch(error => {
                console.error(`An error occurred when updating ${slaveUID}: ${error}`);

                // send back current version regardless
                respondWithTag();
            });
    }
}

module.exports = version;