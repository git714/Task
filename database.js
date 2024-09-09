'use strict';
const mongoose = require('mongoose');
const dbConfig =JSON.parse(process.env.dbConfig)

module.exports.configure = function (logger) {
    // const log = logger.start('settings/database:configure');

    mongoose.Promise = global.Promise;

    // Function to connect to the database
    const connect = async () => {
        try {

            console.log('Connecting to', dbConfig.host);
            await mongoose.connect(dbConfig.host, dbConfig.options);
            console.log('DB Connected');
        } catch (error) {
            console.log('Connection error:', error);
        }
    };

    // Initial connection
    connect();

    const db = mongoose.connection;

    // Handle connection events
    db.on('disconnected', () => {
        console.log('DB Disconnected. Reconnecting...');
        connect();
    });

    global.db = require('./models');
    return global.db;
};
