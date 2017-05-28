const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:3101/meteor';

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL)
    .catch(error => {
        console.error(`Failed to connect to mongodb: ${error}`);
    })

module.exports = mongoose;