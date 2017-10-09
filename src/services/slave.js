const db = require('../db');

const SlaveSchema = new db.Schema({
    timeCount: {type: Number, default: 0},
    slaveUID: {type: String, index: {unique: true, dropDups: true}},
    slaveVersion: String,
    remoteAddress: String,
    remoteName: String,
    country: String,
},
    { timestamps: { // let mongoose take care of timestamps
        createdAt: 'timeFirst',
        updatedAt: 'timeStamp'
    }}
);

// will use `updatechecks` collection
const Slave = db.model('UpdateCheck', SlaveSchema);

const slave = {
    updateSlave(slaveUID, slaveVersion, remoteAddress, remoteName, country) {
        const query = {"slaveUID": slaveUID},
            updatedData = {
                slaveUID,
                slaveVersion,
                remoteAddress,
                remoteName,
                country,
                $inc: {timeCount: 1}
            },
            upsert = {upsert: true};

        return Slave.findOneAndUpdate(query, updatedData, upsert).exec();
    }
};

module.exports = slave;