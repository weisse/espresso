// REQUIREMENTS
var p = require("path");
var cp = require("child_process");
var ipcBridge = require(p.resolve(__dirname, "./libs/ipcBridge.js"));
var bunyan = require("bunyan");

// DEFINE ESPRESSO
var espresso = {

    server: function(config){

        // CREATE SERVER
        var server = cp.fork(p.resolve(__dirname, "./processes/server.js"));
        server.send({type:"init",payload:config});

        if(config.dashboard){

            // CREATE DASHBOARD
            var dashboard = cp.fork(p.resolve(__dirname, "./processes/dashboard.js"));
            dashboard.send({type:"init",payload:config});
            (new ipcBridge(server)).addProcess(dashboard);
            (new ipcBridge(dashboard)).addProcess(server);

        }

    },
    log: function(options){

        var file = options.file || "espresso";
        var logPath = p.join(p.dirname(GLOBAL.process.mainModule.filename), "logs", file);
        var command = "tail -f ";
        command += logPath + " | bunyan";
        cp.exec(command).stdout.pipe(process.stdout);

    }

};

module.exports = espresso;
