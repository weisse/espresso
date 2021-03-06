// REQUIREMENTS
var express = require("express");
var p = require("path");
var bodyParser = require("body-parser");
var ipcController = require(p.resolve(__dirname, "../libs/ipcController.js"));

process.on("message", function(msg){

    if(msg.type && msg.type === "init"){

        var config = msg.payload;

        var app = express();
        app.set("ipc", new ipcController());
        app.use("/", express.static(p.resolve(__dirname, "../dashboard/static")));
        app.use(bodyParser());
        app.use("/api", require(p.resolve(__dirname, "../dashboard/apis.js"))(app));
        app.listen(config.dashboardPort);

    }

});
