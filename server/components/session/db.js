var client = require('mongodb').MongoClient;
var config = require('../../config/environment/index.js');
var logger = require('../logger');

var db;

function logDB() {

    /* only log messages in debug mode */
    if( config.mongodb.debug == "false") {
        return;
    }

    var collection = db.collection("session");

    collection.find().toArray(function(err, results) {
        logger.info("current state of db: ");
        for(var count in results){
            logger.info(require('util').inspect(results[count], false, null))
        }
    });
}

exports.connect = function(cb) {
    client.connect('mongodb://127.0.0.1:' + config.mongodb.port + '/limestone', function(err, database) {
        if(err) {
            logger.error("Could not connect to db");
            cb();
        }

        /* save db handle for future requests */
        db = database;

        cb();

    })
};

exports.get = function(key, cb) {

    var collection = db.collection("session");

    collection.findOne({sID:key}, function(err, value) {

        if(err) {
            logger.error("error reading session data");
        }

        cb(value);
    })
};

exports.update = function(key, value, cb) {

    var collection = db.collection("session");

    collection.update({sID: key, token: value}, {upsert:true, w: 1}, function(err, result) {
        if(err) {
            logger.error("error updating session data");
        }

        logDB()

        cb();
    });

}

exports.insert = function(key, value, cb) {

    var collection = db.collection("session");

    collection.insert([{sID: key, token: value}], {w:1}, function(err, result) {
        if(err) {
            logger.error("error inserting session data");
        }

        logDB()

        cb();
    });

};

exports.remove = function(key, cb) {
    var collection = db.collection("session");

    collection.remove({sID: key}, {w:1}, function(err, result) {
        if(err) {
            logger.error("error removing session data");
        }

        logDB()

        cb();
    });
};
