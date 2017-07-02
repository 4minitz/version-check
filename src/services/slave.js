const db = require('../db');

const SlaveSchema = new db.Schema({
    timeStamp: Date,
    slaveUID: {type: String, index: {unique: true, dropDups: true}},
    slaveVersion: String,
    remoteAddress: String,
    remoteName: String
});

// will use `updatechecks` collection
const Slave = db.model('UpdateCheck', SlaveSchema);

const slave = {
    updateSlave(slaveUID, slaveVersion, remoteAddress, remoteName) {
        const query = {"slaveUID": slaveUID},
            updatedData = {
                timeStamp: new Date(),
                slaveUID,
                slaveVersion,
                remoteAddress,
                remoteName
            },
            upsert = {upsert: true};

        return Slave.findOneAndUpdate(query, updatedData, upsert).exec();
    }
};

module.exports = slave;