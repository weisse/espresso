// REQUIREMENTS
var x = require("xtra");
var _ = require("underscore");
var p = require("path");
var express = require("express");

// DEFINE ESPRESSO
var espresso = function(opt){

    // SET DEFAULTS
    var options = _.extend(require("./defaults/espresso.config.json"), opt || {});
    var wd = process.cwd();

    // CHECK FOR ENTRY POINT
    if(options.main) wd = p.normalize(p.resolve(wd, options.main));

    // DEFINE HOW TO MAKE AN APP
    var makeApp = function(){

        // CREATE ROOT APPLICATION
        var root = express();

        // USE MAIN APPLICATION
        espresso.application(root, "/", wd);

        // LISTEN IF IT WAS REQUESTED
        if(options.listen) root.listen(options.listen);

    };

    // CREATE WORKERS IF IT WAS REQUESTED
    if(options.cluster){

        var cluster = require('cluster');

        if(cluster.isMaster){

            var workers;

            // NOTICE CLUSTER FORK
            cluster.on("fork", function(worker){

                console.log("worker " + worker.process.pid + " created.");

            });

            // NOTICE WORKER DIE
            cluster.on("exit", function(worker, code, signal){

                console.log("worker " + worker.process.pid + " died");
                cluster.fork();

            });

            // SET NUMBER OF WORKERS
            if(options.workers) workers = options.workers;
            else workers = require('os').cpus().length - 1;

            // CREATE WORKERS
            for(var i = 0; i < workers; i++) cluster.fork();

        }else{

            makeApp();

        }

    }else{

        makeApp();

    }

    // RETURN ROOT
    return root;

};

// LOAD APPLICATION MODULE
espresso.application = require("./automations/application");

// EXPORTS ESPRESSO
module.exports = espresso;
