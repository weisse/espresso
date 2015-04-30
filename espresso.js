// REQUIREMENTS
var x = require("xtra");
var _ = require("underscore");
var p = require("path");
var express = require("express");
var logger = require("./libs/logger.js");

// DEFINE ESPRESSO
var espresso = function(opt){

    // SET DEFAULTS
    var options = _.extend(require("./defaults/espresso.config.json"), opt || {});
    var wd = process.cwd();

    // CREATE ESPREESSO LOGGER
    this.log = logger(options);

    // CHECK FOR ENTRY POINT
    if(options.main) wd = p.normalize(p.resolve(wd, options.main));

    // DEFINE HOW TO MAKE AN APP
    var makeApp = function(){

        // CREATE ROOT APPLICATION
        var root = espresso.application();

        // CREATE ROOT LOGGER
        root.setConfig(options.root);
        root.log = logger(root.getConfig());

        // USE MAIN APPLICATION
        root.deploy("/", espresso.application(wd));

        // LISTEN IF IT WAS REQUESTED
        if(options.listen) root.listen(options.listen);

    };

    // CREATE WORKERS IF IT WAS REQUESTED
    if(options.cluster){

        var self = this;
        var cluster = require('cluster');

        if(cluster.isMaster){

            self.log.info("cluster mode activated");

            var workers;

            // NOTICE CLUSTER FORK
            cluster.on("fork", function(worker){

                self.log.info("worker " + worker.process.pid + " created");

            });

            // NOTICE WORKER DIE
            cluster.on("exit", function(worker, code, signal){

                self.log.info("worker " + worker.process.pid + " died");
                if(options.forever) cluster.fork();

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
espresso.application = require("./classes/application");

// LOAD ROUTER MODULE
espresso.router = require("./classes/router");

// EXPORTS ESPRESSO
module.exports = espresso;
