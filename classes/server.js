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

    this.config = _.extend(require(p.resolve(__dirname, "../defaults/server.config.json")), config || {});
    this.log = logger(this.config);

    this.createRoot = function(){

        // CREATE ROOT APPLICATION
        this.root = require(p.resolve(__dirname, "./application.js"))();

        // CREATE ROOT LOGGER
        this.root.setConfig(this.config.root);

        return this;

    };
    this.loadMain = function(){

        var self = this;

        // SET ENTRY POINT
        var wd = process.cwd();
        if(this.config.main) wd = p.normalize(p.resolve(wd, this.config.main));

        // USE MAIN APPLICATION
        require(p.resolve(__dirname, "./application"))(wd).make().then(function(app){

            self.root.deploy("/", app);

        }).then(function(){

            if(self.config.listen) self.listen();

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
        return this;

    };

    // DASHBOARD UTILS
    this.getContainers = function(){

        var containers = [];

        var recursive = function(container){

            var children = container.getChildrenTable();
            for(var i = 0; i < children.length; i++){

                containers.push(children[i].child);
                recursive(children[i].child);

            }

        }

        recursive(this.root);
        return containers;

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

            if(applications[i].get("name") === name) return applications[i];

        }

    }

    return this.init();

};

// EXPORTS ESPRESSO SERVER
module.exports = server;
