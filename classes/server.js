// REQUIREMENTS
var x = require("xtra");
var _ = require("underscore");
var p = require("path");
var express = require("express");
var logger = require(p.resolve(__dirname, "../libs/logger.js"));

// DEFINE ESPRESSO
var server = function(config){

    // GLOBALIZE
    espresso = this;

    // CONTAINERS TABLE
    this.containersTable = []

    // CONFIGURATIONS
    this.config = _.extend(require(p.resolve(__dirname, "../defaults/server.config.json")), config || {});
    this.log = logger(this.config);

    this.createRoot = function(){

        // CREATE ROOT APPLICATION
        this.root = require(p.resolve(__dirname, "./application.js"))();

        // CREATE ROOT LOGGER
        this.root.setConfig(this.config.root);

        return this;

    };
    this.createApplication = function(rd){

        return (new server.application(rd));

    };
    this.loadMain = function(){

        var self = this;

        // SET ENTRY POINT
        var rd = process.cwd();
        if(this.config.main) rd = p.normalize(p.resolve(rd, this.config.main));

        // USE MAIN APPLICATION
        var main = new server.application(rd);
        main.loadDescriptor().then(function(app){

            app.make().then(function(app){

                self.root.deploy("/", app);

            });

        });

        return this;

    };
    this.listen = function(p){

        var self = this;

        this.root.listen(p || this.config.port, function(){

            espresso.log.info("listen to port " + self.config.port);

        });

        return this;

    };
    this.init = function(){

        this.createRoot().loadMain();
        if(this.config.listen) this.listen();
        return this;

    };

    // UTILS
    this.getRoot = function(){

        return this.root;

    };
    this.getContainers = function(){

        return this.containersTable;

    };
    this.getContainerById = function(id){

        var containers = this.getContainers();
        for(var i = 0; i < containers.length; i++){

            if(containers[i].getId() === id) return containers[i];

        }

    }
    this.getApplications = function(){

        var containers = this.getContainers();
        var applications = [];

        for(var i = 0; i < containers.length; i++){

            if(containers[i].getType() === "application") applications.push(containers[i]);

        }

        return applications;

    };
    this.getApplicationById = function(id){

        var applications = this.getApplications();
        for(var i = 0; i < applications.length; i++){

            if(applications[i].getId() === id) return applications[i];

        }

    };
    this.getApplicationByName = function(name){

        var applications = this.getApplications();
        for(var i = 0; i < applications.length; i++){

            if(applications[i].getName() === name) return applications[i];

        }

    }

    return this.init();

};

server.application = require(p.resolve(__dirname, "./application.js"));
server.router = require(p.resolve(__dirname, "./router.js"));

// EXPORTS ESPRESSO SERVER
module.exports = server;
