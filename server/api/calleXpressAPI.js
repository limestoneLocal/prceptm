/**
 * Created by tamilstephen on 10/10/14.
 */

'use strict';

var invoke = require("../components/downstream/invoke.js");
var config = require('../config/apis.js');
var util = require("../components/util/util.js");

/* get all events */
exports.getAll = function(req, res) {

    console.log("JOhn RAJ : sddsfd");

    invoke.api({
        "name": config.apiEvents.GET_Log.name,
        "url": config.apiEvents.GET_Log.url,
        "method": config.apiEvents.GET_Log.method,
        "requireAuth": config.apiEvents.GET_Log.requireAuth,
        "expectedStatus": config.apiEvents.GET_Log.expectedStatus,
        "header": {},
        "query": {},
        "body": {},
        "cbFatalError": function(error, cb){cb()},
        "cbNonFatalError": function(response, body, cb){cb()},
        "cbSuccess": function(response, body, cb){cb()},
        "req": req,
        "res": res
    });
};