// DEPENDENCIES
var express = require("express");
var _ = require("underscore");
var commons = require("./commons/server.container.methods.js");
var logger = require("../libs/logger");

// DEFINE CLASS
var esrt = function(options){

    // CREATE AN EXPRESS APPLICATION
    var router = express.Router(options);

    // ESPRESSO VARIABLES
    router._espresso = {

        id: process.pid + (new Date()).getTime() + Math.random().toString().substring(2),
        type: "router",
        parent: null,
        mountPath: null,
        childrenTable: [],
        config: _.extend(require("../defaults/router.config.json"), options.config || {})

    };

    // EXTEND WITH ELEMENT COMMON METHODS
    router = _.extend(router, commons);

    // ESPRESSO METHODS
    router.getStack = function(){

        return this.stack;

    };
    router.setStack = function(stack){

        this.stack = stack;
        return this;

    };
    router.getApp = function(){

        var current = this;

        while(current.getType() !== "application"){

            current = current.getParent();

        }

        return current;

    };

    // CREATE LOGGER
    router.log = logger(router.getConfig());

    return router;

};

// EXPORTS MODULE
module.exports = esrt;
