// REQUIREMENTS
var x = require("xtra");
var _ = require("underscore");
var p = require("path");
var express = require("express");

// DEFINE ESPRESSO
var espresso = function(opt){
    
    // SET DEFAULTS
    var options = _.extend(require("./defaults/espresso.config.json"), opt || {});
    var wd = process.cwd();
    
    // CHECK FOR ENTRY POINT
    if(options.main) wd = p.normalize(p.resolve(wd, options.main));
    
    // LOAD APPLICATION MODULE
    espresso.application = require("./automations/application");
    
    // CREATE ROOT APPLICATION
    var root = express();
    
    // USE MAIN APPLICATION
    espresso.application(root, "/", wd);
    
    // LISTEN IF IT WAS REQUESTED
    if(options.listen) root.listen(options.listen);
    
    // RETURN ROOT
    return root;
    
};

module.exports = espresso;