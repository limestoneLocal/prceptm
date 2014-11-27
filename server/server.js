/**
 * Main application file
 */

'use strict';

// load in config
var config = require('./config/environment');

var logger = require('./components/logger');



// Load in base modules
var express = require('express');

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
