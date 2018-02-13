const slaveService = require('../services/slave');
const versionService = require('../services/version');
const messageService = require('../services/message');
const dns = require('dns');
const http = require('http');


function loggingAndPersistence(slaveUID, timestamp, remoteAddress, slaveVersion, remoteName, country) {
    if (slaveUID !== "landingpage") {
        console.log(`${timestamp}: ${slaveUID}/${remoteAddress}@${slaveVersion} - ${remoteName} (${country})`);
    }
    slaveService.updateSlave(slaveUID, slaveVersion, remoteAddress, remoteName, country)
        .catch(error => {
            console.error(`An error occurred when updating ${slaveUID}: ${error}`);
        });
}


const version = {
    currentVersion(req, res) {
        const {slaveUID, slaveVersion} = req.params,
            remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            tag = versionService.getCurrent();
            message = messageService.getForVersion(tag);

        const respondWithTag = () => {
            res.json(200, {tag, message});
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
                const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                const timestamp = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-5);
                let country = "";

                // convert IP Address to country name
                http.get('http://ip2c.org/'+remoteAddress, (resp) => {
                    let data = '';
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    resp.on('end', () => {
                        country = data.split(";")[3];
                        if (country === "WRONG INPUT") {
                            country = "";
                        }
                        loggingAndPersistence(slaveUID, timestamp, remoteAddress, slaveVersion, remoteName, country);
                    });
                }).on("error", (err) => {
                    console.log("HTTP Error: " + err.message);
                    loggingAndPersistence(slaveUID, timestamp, remoteAddress, slaveVersion, remoteName, "");
                });
            });

        // send back current version regardless of success or failure of db entry
        respondWithTag();
    }
};

module.exports = version;