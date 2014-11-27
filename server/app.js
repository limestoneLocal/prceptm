/*
 @author: Vince Recupito

 This is the entry point for the nodejs application. This file
 forks off a nodejs server for every logical processor on the machine.
 The master will create the workers and restart them if they die. As long
 as at least one worker is alive, the server can process requests.
 */

/* cluster is the module for forking workers */
var cluster = require('cluster');

/* helper module to find the worker file */
var path = require("path");

/* gets the number of logical processors on the machine */
var numCPUs = require('os').cpus().length;

/* filesystem module */
var fs = require('fs');


// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/* config values */
var config = require(path.join(__dirname, './config/environment'));

/* logger */
var logger = require('./components/logger');


/* specifies options for the fork() command -
 every fork will launch a new server instance
 */
cluster.setupMaster({
    exec : path.join(__dirname, "server.js"), // file to fork
    args: [], // don't pass args to workers
    silent : false // do log actions from workers
});

/* fork each worker */
for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
}

/* worker has been forked and is online */
cluster.on('listening', function(worker, address) {
    logWorker('info', worker, "connected to port: " + address.port);
});

/* worker has exited either on purpose or by accident */
cluster.on('exit', function(worker, code, signal) {
    if (worker.suicide === true) {
        logWorker('warn', worker, "exited on purpose");
    } else {
        logWorker('error', worker, "exited unexpectedly. Master will try to restart");

        /* start another worker since one died */
        cluster.fork();
    }
});

/* helper function to log workers in an organized manner */
function logWorker(level, worker, msg) {
    logger.log(level, "server " + worker.id + " (" + worker.process.pid + ") " + msg);
}