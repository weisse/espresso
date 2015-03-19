var espresso = function(awd){
    
    // REQUIREMENTS
    var _ = require("underscore");
    
    // LOAD EXPRESS
    var express = require("express");
    
    // CREATE APPLICATION
    var app = express();
    
    // SET APPLICATION WORKING DIRECTORY
    app.set("awd", awd || process.cwd());
    
    // LOAD APPLICATION JSON
    var application = require(app.get("awd") + "/application") || {};
    
    // LOAD APPLICATION CONFIGURATIONS
    var config = _.extend(require("./defaults/application.config"), application.config || {});
    
    // SET APPLICATION ENGINES
    require("./automations/engines")(espresso, app);
    
    // SET APPLICATION VIEWS DIRECTORY
    app.set("views", app.get("awd") + config.viewsPath);
    
    // USE EXPRESS STATIC (APPLICATION-LEVEL MIDDLEWARE)
    app.use(config.staticRoute, express.static(app.get("awd") + config.staticPath));
    
    // LOAD APPLICATION-LEVEL MIDDLEWARES
    if(application.middlewares) require("./automations/middlewares")(espresso, app, application.middlewares);
    
    // LOAD ROUTES
    if(application.routes) require("./automations/routes")(espresso, app, application.routes);
    
    // LOAD LOCALS
    if(application.locals) require("./automations/locals")(espresso, app, application.locals);
    
    // RETURN APPLICATION
    return app;
    
};

module.exports = espresso;