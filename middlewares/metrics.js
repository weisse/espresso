// REQUIREMENTS
var fs = require("fs");
var p = require("path");
var logger = require(p.resolve(__dirname, "../libs/logger.js"));
var write = logger({

    "logName":"metric",
    "filesystemLog":true,
    "filesystemLogPath":"metrics.log",
    "filesystemLogLevel":"info",
    "filesystemLogRotation":true,
    "filesystemLogRotationPeriod":"1d",
    "filesystemLogRotationCount":100

}).info;

module.exports = function(req, res, next){

    // SET REQUEST BEGIN TIME
    var begin = (new Date()).getTime();

    // CREATE METRICS OBJECT
    var metrics = { time: begin, request: {}, response: {} };

    // REQUEST METRICS
    metrics.request.userAgent = req.header("User-Agent");
    metrics.request.contentType = req.header("Content-Type");
    metrics.request.bodyLength = JSON.stringify(req.body).length;

    // OLD REQUEST .end() BACKUP
    res._end = res.end;

    // REQUEST END OVERRIDE
    res.end = function(){

        // SET REPONSE END TIME
        var end = (new Date()).getTime();

        // REAL REQUEST END
        res._end.apply(this, arguments);

        // RESPONSE METRICS
        metrics.response.responseTime = end - begin;
        metrics.response.statusCode = res.statusCode;

        // METRICS PATH
        var mp = p.resolve(p.dirname(GLOBAL.process.mainModule.filename), "../metrics/uptime.json");

        // WRITE TO FILESYSTEM
        fs.appendFile(

            mp,
            JSON.stringify(metrics) + "\n",
            function(err){

                if(err) req.app.log.error(err);

            }

        );

    };

    next();

};
