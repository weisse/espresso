// DEPENDENCIES
var express = require("express");
var _ = require("underscore");
var commons = require("./commons/element.methods.js");

// DEFINE CLASS
var esrt = function(options){

    // CREATE AN EXPRESS APPLICATION
    var router = express.Router(options);

    // ESPRESSO VARIABLES
    router._espresso = {

        type: "router",
        parent: null,
        signature: null,
        mountPath: null,
        childrenTable: []

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

    return router;

};

// EXPORTS MODULE
module.exports = esrt;
