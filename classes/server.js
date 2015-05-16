// REQUIREMENTS
var x = require("xtra");
var _ = require("underscore");
var p = require("path");
var express = require("express");
var logger = require(p.resolve(__dirname, "../libs/logger.js"));
var bluebird = require("bluebird");

// DEFINE ESPRESSO
var server = function(config){

    // GLOBALIZE
    espresso = this;

    // CONTAINERS TABLE
    this.containersTable = []

    // CONFIGURATIONS
    this.config = _.extend(require(p.resolve(__dirname, "../defaults/server.config.json")), config || {});
    this.log = logger(this.config);

    // NON-CHAINABLE
    this.createRoot = function(){

        // CREATE ROOT APPLICATION
        this.root = require(p.resolve(__dirname, "./application.js"))();

        // SET ROOT NAME
        this.root._setName("root");

        // USE METRICS MIDDLEWARE
        if(this.config.root.metrics){

            this.root.use(require("body-parser")());
            this.root.use(require(p.resolve(__dirname, "../middlewares/metrics.js")))

        };

        // CREATE ROOT LOGGER
        this.root.setConfig(this.config.root);

        return this.root;

    };
    this.createApplication = function(rd){

        return (new server.application(rd));

    };
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

    // PROMISES
    this.loadMain = function(){

        var self = this;

        // SET ENTRY POINT
        var rd = process.cwd();
        if(this.config.main) rd = p.normalize(p.resolve(rd, this.config.main));

        // USE MAIN APPLICATION
        var main = new server.application(rd);

        // PROMISE
        return main.loadDescriptor()
        .then(function(app){

            return app.make();

        }).catch(function(){

            espresso.log.error("I can't load main application");

        });

    };
    this.listen = function(p){

        var self = this;

        var promise = new bluebird.Promise(function(res,rej){

            self.root.listen(p || self.config.port, function(){

                espresso.log.info("listening to port " + self.config.port);
                res();

            }).on("error", function(err){

                espresso.log.error(err);
                rej(err);

            });

        });

        return promise;

    };
    this.init = function(){

        var self = this;

        return this.loadMain()
        .then(function(app){

            return self.createRoot().deploy("/", app);

        }).then(function(){

            if(self.config.listen) return self.listen();

        }).catch(function(){

            espresso.log.error("I can't initialize the espresso server");

        });

    };

    return this.init();

};

server.application = require(p.resolve(__dirname, "./application.js"));
server.router = require(p.resolve(__dirname, "./router.js"));

// EXPORTS ESPRESSO SERVER
module.exports = server;
