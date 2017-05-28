const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:3101/meteor';

const db = mongoose.connection;
db.on('error', (error) => {
    console.error(`connection error: ${error}`);
});

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);

module.exports = mongoose;