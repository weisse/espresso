// REQUIREMENTS
var express = require("express");
var p = require("path");

module.exports = function(app){

    var router = express.Router();

    router.get("/echo", function(req,res){

        req.app.get("ipc")
            .send("echo", "echo")
            .listen(function(payload){

                res.end(payload);

            })
            .timeout(function(){

                res.end("failed");

            });

    });
    router.get("/process", function(req,res){

        req.app.get("ipc")
            .send("process")
            .listen(function(payload){

                res.end(payload);

            })
            .timeout(function(){

                res.end("failed");

            });

    });
    router.get("/process-short", function(req,res){

        req.app.get("ipc")
            .send("process-short")
            .listen(function(payload){

                res.end(payload);

            })
            .timeout(function(){

                res.end("failed");

            });

    });
    router.get("/applications", function(req,res){

        req.app.get("ipc")
            .send("getApplications")
            .listen(function(payload){

                res.end(payload);

            })
            .timeout(function(){

                res.end("failed");

            });

    });
    router.post("/exec", function(req,res){

        req.app.get("ipc")
            .send("exec", req.body.command)
            .listen(function(payload){

                res.end(payload);

            })
            .timeout(function(){

                res.end("failed");

            });

    });
    router.get("/usage", function(req,res){

        req.app.get("ipc")
            .send("usage")
            .listen(function(payload){

                res.end(payload);

            })
            .timeout(function(){

                res.end("failed");

            });

    });

    return router;

};
