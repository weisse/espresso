// REQUIREMENTS
var x = require("xtra");
var _ = require("underscore");
var p = require("path");

// DEFINE ESPRESSO
var espresso = function(opt){
    
    // SET DEFAULTS
    var options = _.extend(require("./defaults/espresso.config.json"), opt || {});
    var wd = process.cwd();
    
    // CHECK FOR ENTRY POINT
    if(options.main) wd = p.normalize(p.resolve(wd, options.main));
    
    // LOAD APPLICATION MODULE
    espresso.application = require("./automations/application");
    
    // CREATE MAIN APPLICATION
    var app = espresso.application(wd);
    
    // LISTEN IF IT WAS REQUESTED
    if(options.listen) app.listen(options.listen);
    
    // RETURN APP
    return app;
    
};

module.exports = espresso;