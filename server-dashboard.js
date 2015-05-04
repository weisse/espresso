// REQUIREMENTS
var express = require("express");
var p = require("path");
var ipcController = require(p.resolve(__dirname, "./libs/ipcController.js"));

process.on("message", function(msg){

    if(msg.type && msg.type === "init"){

        var config = msg.payload;

        var app = express();
        app.set("ipc", new ipcController);
        app.get("/test", function(req,res){

            var id = req.app.get("ipc").send("test", "echo");
            var timeout = setTimeout(function(){

                req.app.get("ipc").unlistenById(id);
                res.end("fallito!");

            }, 10000);
            req.app.get("ipc").listenOnce("test", id, function(payload){

                clearTimeout(timeout);
                res.end(payload);

            });

        });
        app.listen(config.dashboardPort);

    }

});
