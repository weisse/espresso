// DEPENDENCIES
var bunyan = require("bunyan");

// DEFINE MODULE
module.exports = function(config){

    var options = {};
    options.name = config.logName;
    options.streams = [];

    if(config.log){

        if(config.filesystemLog){

            var idx = options.streams.length;

            options.streams[idx] = {

                path:config.filesystemLogPath,
                level:config.filesystemLogLevel,

            };

            if(config.filesystemLogRotation === true)
                options.streams[idx].type = "rotating-file";
            else
                options.streams[idx].type = "file";

            if(options.streams[idx].type === "rotating-file"){

                options.streams[idx].period = config.filesystemLogRotatingPeriod;
                options.streams[idx].count = config.filesystemLogRotatingCount;

            }

        }

        if(config.stdoutLog){

            var idx = options.streams.length;

            options.streams[idx] = {

                stream: process.stdout,
                level: config.stdoutLogLevel

            }

        }

    }

    return bunyan.createLogger(options);

};
