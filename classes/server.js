// REQUIREMENTS
var x = require("xtra");
var _ = require("underscore");
var p = require("path");
var express = require("express");
var logger = require("../libs/logger.js");

// DEFINE ESPRESSO
var server = function(config){

    // GLOBALIZE
    espresso = this;

    this.config = _.extend(require("../defaults/server.config.json"), config || {});
    this.log = logger(this.config);

    this.createRoot = function(){

        // CREATE ROOT APPLICATION
        this.root = require("./application.js")();

        // CREATE ROOT LOGGER
        this.root.setConfig(this.config.root);
        this.root.log = logger(this.root.getConfig());

        return this;

    };
    this.loadMain = function(){

        var self = this;

        // SET ENTRY POINT
        var wd = process.cwd();
        if(this.config.main) wd = p.normalize(p.resolve(wd, this.config.main));

        // USE MAIN APPLICATION
        require("./application")(wd).make().then(function(app){

            self.root.deploy("/", app);

        }).then(function(){

            if(self.config.listen) self.listen();

        });

        return this;

    };
    this.listen = function(p){

        var self = this;

        this.root.listen(p || this.config.port, function(){

            self.root.log.info("listen to port " + self.config.port);

        });

        return this;

    };
    this.init = function(){

        this.createRoot().loadMain();
        return this;

    };

    return this.init();

};

// EXPORTS ESPRESSO SERVER
module.exports = server;
