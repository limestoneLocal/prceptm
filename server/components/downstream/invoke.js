//var config = require('../../config/environment/index');
var request = require("request");
//var db = require("../session/db.js");
var config = require('../../config/environment');
var util = require("../util/util.js");
var logger = require('../logger');


exports.invoke = function(method, url, qs, headers, json, req, res, callback) {
    headers['app_key'] = config.express.appKey;

    request({
        method: method,
        uri: url,
        qs: qs,
        headers: headers,
        json: json,
        rejectUnauthorized: false
    }, function(error, response, body) {
        callback(error, response, body, req, res);
    });
};



function downstream(args, token) {

    // if this api needs a token, pass it
    if(token) {
        args.header["authorization"] = token;
    }

    //add in app_key
    args.header["app_key"] = config.express.appKey;

    // add in if-match, it may not be needed for this api
    args.header["if-match"] = args.req.headers["if-match"];
    args.header["Content-Type"] = args.req.headers['content-type'];

    // merge additional query vars
    var queries = util.objQueryString(args.req)
    for (var query in queries) { args.query[query] = queries[query]}

    // if multipart/form-data, do not parse body
    var contentType = args.req.headers['content-type'] || '';
    var mime = contentType.split(';')[0];
    if(mime === 'multipart/form-data') {

        request({
            method: args.method,
            uri: args.url,
            qs: args.query,
            headers: args.header,
            multipart: [
                {
                    'content-type': args.req.files.file.mimetype,
                    body: args.req.files.file.buffer
                }
            ],
            rejectUnauthorized: false
        }, requestCBMultipart);

    } else {
        // merge additional body vars
        for (var body in args.body) { args.req.body[body] = args.body[body]}

        request({
            method: args.method,
            uri: args.url,
            qs: args.query,
            headers: args.header,
            json: args.req.body,
            rejectUnauthorized: false
        }, requestCB);
    }

    function requestCBMultipart(error, response, body) {

        if(body) {
            body = JSON.parse(body);
        }

        requestCB(error, response, body);
    }

    function requestCB (error, response, body) {

        if (error) {
            // received a fatal error from request module, this is
            // truly an exception. Send back 500 status

            logger.error(args.name + ": Fatal Error - %s", error);

            args.cbFatalError(error, function () {
                args.res.status(500);
                args.res.end();
            });

        } else {

            if (response.statusCode == args.expectedStatus) {
                logger.info(args.name + ": Success");

                // some apis return an etag
                if (response.headers['etag']) {
                    args.res.setHeader('etag', response.headers['etag']);
                }

                args.cbSuccess(response, body, write);
            } else {
                if (body && body.messages && body.messages.length > 0 && body.messages[0].messageType === "ERROR") {
                    logger.warn(args.name + ": Failure - %s", body.messages[0].message);
                }
                else {
                    logger.warn(args.name + ": Failure - unknown");
                }

                args.cbNonFatalError(response, body, write);
            }

            function write() {
                args.res.status(response.statusCode);
                args.res.send(body);
                args.res.end();
            }

        }
    }

}



exports.api  = function api( args ) {

    /*if(args.requireAuth) {
        // this api requires authorization

        var token = args.req.headers['authorization'] || args.req.query["authorization"];

        db.get(token, function (result) {

            if (!result) {
                // could not find a valid token from sID,
                // send back a 400 response prompting login

                logger.warn(args.name + ": not authorized");

                args.res.status(400);
                args.res.send({"promptLogin": true});
                args.res.end();

            } else {

                // make downstream call with token
                downstream(args, result.token);

            }

        });
    } else {*/

        // this api does not require authorization,
        // make downstream call without token
        downstream(args, null);
    /*}*/

};