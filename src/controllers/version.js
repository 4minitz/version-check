const slaveService = require('../services/slave');
const versionService = require('../services/version');
const dns = require('dns');

const version = {
    currentVersion(req, res) {
        const {slaveUID, slaveVersion} = req.params,
            remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            tag = versionService.getCurrent();

        const respondWithTag = () => {
            res.json(200, {tag});
        };

        dns.reverse(remoteAddress, function (err, remoteNames) {
                if (err) {
                    console.log(`dns.reverse Error: ${err}`);
                }
                if (!remoteNames || !remoteNames[0]) {
                    remoteNames = [];
                    remoteNames[0] = '-unknown-';
                }
                const remoteName = remoteNames[0];
                console.log(`Request from: ${slaveUID}/${remoteAddress}@${slaveVersion} - ${remoteName}`);
                slaveService.updateSlave(slaveUID, slaveVersion, remoteAddress, remoteName)
                    .catch(error => {
                        console.error(`An error occurred when updating ${slaveUID}: ${error}`);
                    });
            });

        // send back current version regardless of success or failure of db entry
        respondWithTag();
    }
};

module.exports = version;