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

        id: process.pid.toString() + (new Date()).getTime().toString() + Math.random().toString().substring(2),
        descriptor: null,
        type: "router",
        parent: null,
        mountPath: null,
        childrenTable: [],
        config: _.extend(require(p.resolve(__dirname, "../defaults/router.config.json")), options.config || {})

    };

    // BACKUP OLD .use()
    router._use = router.use;

    // EXTEND WITH ELEMENT COMMON METHODS
    router = _.extend(router, commons);

    // ESPRESSO METHODS
    router._setStack = function(stack){

        this.stack = stack;
        return this;

    };

    // NON-CHAINABLE
    router.getStack = function(){

        return this.stack;

    };
    router.getApp = function(){

        var current = this;

        while(current.getType() !== "application"){

            current = current.getParent();

        }

        return current;

    };

    // ADD ROUTER ON ESPRESSO CONTAINERS TABLE
    espresso.containersTable.push(router);

    return router;

};

// EXPORTS MODULE
module.exports = esrt;
