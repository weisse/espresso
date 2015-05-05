// REQUIREMENTS
var express = require("express");
var p = require("path");
var ipcController = require(p.resolve(__dirname, "../libs/ipcController.js"));
var bodyParser = require("body-parser");

process.on("message", function(msg){

    if(msg.type && msg.type === "init"){

        var config = msg.payload;

        var app = express();
        app.set("ipc", new ipcController());
        app.use("/", express.static(p.resolve(__dirname, "./static")));
        app.use(bodyParser());
        app.use("/api", require(p.resolve(__dirname, "./apis.js"))(app));
        app.listen(config.dashboardPort);

    }

});
