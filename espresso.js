// REQUIREMENTS
var p = require("path");
var cp = require("child_process");
var ipcBridge = require(p.resolve(__dirname, "./libs/ipcBridge.js"));

// DEFINE ESPRESSO
var espresso = {

    server: function(config){

        // CREATE SERVER
        var server = cp.fork(p.resolve(__dirname, "./server.js"));
        server.send({type:"init",payload:config});

        if(config.dashboard){

            // CREATE DASHBOARD
            var dashboard = cp.fork(p.resolve(__dirname, "./dashboard/init.js"));
            dashboard.send({type:"init",payload:config});
            (new ipcBridge(server)).addProcess(dashboard);
            (new ipcBridge(dashboard)).addProcess(server);

        }

    }

};

module.exports = espresso;
