// DEPENDENCIES
var bunyan = require("bunyan");
var p = require("path");

// DEFINE MODULE
module.exports = function(config){

    var options = {};
    options.name = config.logName;
    options.streams = [];

    if(config.log){

        if(config.filesystemLog){

            var idx = options.streams.length;

            options.streams[idx] = {

                path:p.resolve(p.dirname(GLOBAL.process.mainModule.filename), "../logs/" + config.logName),
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

    var log = bunyan.createLogger(options);

    var caller = function(name){

        return function(){

            log[name].apply(log, arguments);

        }

    };

    return {

        fatal:caller("fatal"),
        error:caller("error"),
        warn:caller("warn"),
        info:caller("info"),
        debug:caller("debug"),
        trace:caller("trace")

    }

};
