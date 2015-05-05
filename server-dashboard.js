// REQUIREMENTS
var express = require("express");
var p = require("path");
var ipcController = require(p.resolve(__dirname, "./libs/ipcController.js"));

process.on("message", function(msg){

    if(msg.type && msg.type === "init"){

        var config = msg.payload;

        var app = express();
        app.set("ipc", new ipcController({timeout:1000}));
        app.get("/test", function(req,res){

            req.app.get("ipc")
                .send("test", "echo")
                .listen(function(payload){

                    res.end(payload);

                })
                .timeout(function(){

                    res.end("fallito!");

                });

        });
        app.listen(config.dashboardPort);

    }

});
