// DEPENDENCIES
var express = require("express");
var _ = require("underscore");
var p = require("path");
var commons = require(p.resolve(__dirname, "./commons/server.container.methods.js"));

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
        config: _.extend(require(p.resolve(__dirname, "../defaults/router.config.json")), options.config || {})

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

    return router;

};

// EXPORTS MODULE
module.exports = esrt;
