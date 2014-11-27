'use strict';

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongodb: {
        port: 27017
    },
    mongo: {
        uri: 'mongodb://localhost/demo-dev'
    },
    express: {
        appKey: "cb13cb34-1d70-424c-b235-003998b38ec4",
        baseUrl: process.env.EXPRESS_BASE_URL || null
    },

    seedDB: true
};
