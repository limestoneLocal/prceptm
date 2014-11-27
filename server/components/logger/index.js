var config = require('../../config/environment')

// load in logger
var winston = require('winston');
var winstonMongodb = require('winston-mongodb').MongoDB;

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.MongoDB)({level: 'info', host: '127.0.0.1', port: 27017, db: 'demo-dev', timestamp: true}),
        new (winston.transports.Console)({level: 'info', timestamp: true, colorize: true})
    ]
});