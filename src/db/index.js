const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:3101/meteor';

const reconnectIntervalInMs = 1500,
    options = {
        useMongoClient: true,
        keepAlive: 120
    };

const db = mongoose.connection;
mongoose.Promise = global.Promise;

function handleError(error) {
    console.error(`MongoDB connection error: ${error}`);
    setTimeout(connectWithRetry, reconnectIntervalInMs);
}

function connectWithRetry() {
    mongoose.connect(MONGO_URL, options)
        .catch(handleError);
}
connectWithRetry();

db.on('error', handleError);

module.exports = mongoose;