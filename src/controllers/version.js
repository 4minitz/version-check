const slaveService = require('../services/slave');
const versionService = require('../services/version');

const version = {
    currentVersion(req, res) {
        const {slaveUID, slaveVersion} = req.params,
            remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            tag = versionService.getCurrent();

        const respondWithTag = () => {
            res.json(200, {tag});
        };

        console.log("Request from: ",slaveUID, slaveVersion, remoteAddress);
        slaveService.updateSlave(slaveUID, slaveVersion, remoteAddress)
            .catch(error => {
                console.error(`An error occurred when updating ${slaveUID}: ${error}`);
            });

        // send back current version regardless of success or failure of db entry
        respondWithTag();
    }
};

module.exports = version;