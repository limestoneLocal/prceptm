var uuid = require('node-uuid');
var url = require("url");
var queryString = require("querystring");
var config = require('../../config/environment');

exports.uuid = function () {
    return uuid.v4();
};

exports.objQueryString = function (req) {
    var theUrl = url.parse(req.url);
    var queryObj = queryString.parse(theUrl.query);
    return queryObj;
};

/* Remove all leading forward slashes 
from req.originalUrl */
exports.httpRemoveSlashes = function(app) {
    app.all('*', function(req, res, next){
        
        while(req.originalUrl.charAt(0) === '/')
            req.url = req.originalUrl = req.originalUrl.substring(1);


        next();
    });
}

/* If it is an options request, 
access-control-allow has already been write,
so just send the response back */
exports.httpOptions = function(app) {
    app.all('*', function(req, res, next){
        if(req.methods == 'OPTIONS') {
            res.end();
        } else {
            next();
        }
    })
}

exports.accessControlAllow = function(app){
    app.all('*', function(req, res, next){

        // check to see if requesting page was loaded from an allowed server
        if(config.access_control_allow.origin.indexOf(req.headers["origin"]) > -1) {
            // allow
            res.setHeader("Access-Control-Allow-Origin", req.headers["origin"]);
        } else {
            // deny
            res.setHeader("Access-Control-Allow-Origin", "");
        }

        res.setHeader("Access-Control-Allow-Methods", config.access_control_allow.methods);
        res.setHeader("Access-Control-Allow-Headers", config.access_control_allow.headers);
        res.setHeader("Access-Control-Allow-Credentials", config.access_control_allow.credentials);

        next();
    })
};

exports.readRaw = function(app) {
    app.use('*', function(req, res, next) {


        next();
/*
        var contentType = req.headers['content-type'] || '';
        var mime = contentType.split(';')[0];

        console.log("mime: " + mime);

        if (mime === 'multipart/form-data') {

            console.log("is csv");

            var form = new multiparty.Form();


            form.parse(req, function (err, fields, files) {
                console.log("files: " + require('util').inspect(files));
            });


            // Parts are emitted when parsing the form
            form.on('part', function(part) {
                // You *must* act on the part by reading it
                // NOTE: if you want to ignore it, just call "part.resume()"

                console.log("part: " + require('util').inspect(part));

                if (part.filename === null) {
                    // filename is "null" when this is a field and not a file
                    console.log('got field named ' + part.name);
                    // ignore field's content
                    part.resume();
                }

                if (part.filename !== null) {
                    // filename is not "null" when this is a file
                    count++;
                    console.log('got file named ' + part.name);
                    // ignore file's content here
                    part.resume();
                }

                part.on('error', function(err) {
                    // decide what to do
                });
            });

            /*
            form.parse(req, function(err, fields, files) {
                Object.keys(fields).forEach(function(name) {
                    console.log('got field named ' + name);
                });

                Object.keys(files).forEach(function(name) {
                    console.log('got file named ' + name);
                });

                console.log('Upload completed!');
            });


            next();
        } else {
            next();
        }





        var contentType = req.headers['content-type'] || '';
        var mime = contentType.split(';')[0];

        req.rawBody = null;

        if (mime != 'text/csv') {
            console.log("moving on");
            return next();
        }
        console.log("not moving on")

        var multiparty = require('multiparty');
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(require('util').inspect({fields: fields, files: files}));
        });





        var data = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            req.rawBody = data;
            next();
        });
        */
    });
}