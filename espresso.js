// REQUIREMENTS
var x = require("xtra");
var _ = require("underscore");
var p = require("path");
var express = require("express");
var logger = require("./libs/logger.js");

// DEFINE ESPRESSO
var server = function(config){

    // GLOBALIZE
    espresso = this;

    this.config = _.extend(require("./defaults/server.config.json"), config || {});
    this.log = logger(this.config);

    this.createRoot = function(){

        // CREATE ROOT APPLICATION
        this.root = server.application();

        // CREATE ROOT LOGGER
        this.root.setConfig(this.config.root);
        this.root.log = logger(root.getConfig());

        return this;

    };
    this.loadMain = function(){

        var self = this;

        // SET ENTRY POINT
        var wd = process.cwd();
        if(this.config.main) wd = p.normalize(p.resolve(wd, this.config.main));

        // USE MAIN APPLICATION
        this.root.deploy("/", server.application(wd), function(){

            if(self.config.listen) self.listen();

        });

        return this;

    };
    this.listen = function(p){

        var self = this;

        root.listen(p || this.config.port, function(){

            root.log.info("listen to port " + self.config.port);

        });

        return this;

    };
    this.clusterize = function(w){

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
                if(self.config.forever) cluster.fork();

            });

            // SET NUMBER OF WORKERS
            if(w) workers = w;
            else if(self.config.workers) workers = self.config.workers;
            else workers = require('os').cpus().length - 1;

            // CREATE WORKERS
            for(var i = 0; i < workers; i++) cluster.fork();

        }else{

            this.createRoot().loadMain();

        }

    };
    this.init = function(){

        if(this.config.cluster){

            this.clusterize();

        }else{

            this.createRoot().loadMain();

        }

        return this;

    };

    return this.init();

};

// LOAD APPLICATION MODULE
server.application = require("./classes/application");

// LOAD ROUTER MODULE
server.router = require("./classes/router");

// EXPORTS ESPRESSO SERVER
module.exports = server;
