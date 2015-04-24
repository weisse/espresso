var espresso = function(wd){
    
    // REQUIREMENTS
    var _ = require("underscore");
    
    // LOAD EXPRESS
    var express = require("express");
    
    // CREATE APPLICATION
    var app = express();
    
    // SET APPLICATION WORKING DIRECTORY
    app.set("wd", wd || process.cwd());
    
    // LOAD APPLICATION JSON
    var application = require(app.get("wd") + "/application") || {};
    
    // LOAD APPLICATION CONFIGURATIONS
    application.config = _.extend(require("./defaults/application.config"), application.config || {});
    
    // LOAD LOCALS
    if(application.locals) require("./automations/locals")(espresso, app, application.locals);
    
    // SET APPLICATION ENGINES
    require("./automations/engines")(espresso, app);

    // SET APPLICATION VIEWS DIRECTORY
    app.set("views", app.get("wd") + application.config.viewsPath);
    
    // PRE-DEPLOY EXECUTION
    if(application["pre-deploy"]) require("./automations/preDeploy")(espresso, app, application["pre-deploy"]);
    
    // DEPLOY INIT
    
        // USE EXPRESS STATIC (APPLICATION-LEVEL MIDDLEWARE)
        app.use(application.config.staticRoute, express.static(app.get("wd") + application.config.staticPath));

        // LOAD APPLICATION-LEVEL MIDDLEWARES
        if(application.middlewares) require("./automations/middlewares")(espresso, app, application.middlewares);

        // LOAD ROUTER
        if(application.router){
            
            var router = new express.Router(application.router.options || {});
            app.use(require("./automations/router")(espresso, app, router, "/", application.router));
        
        }
        
        // LOAD APPLICATION-LEVEL ERRORWARES
        if(application.errorwares) require("./automations/errorwares")(espresso, app, application.errorwares);
        
    // DEPLOY ENDS
    
    // POST-DEPLOY EXECUTION
    if(application["post-deploy"]) require("./automations/postDeploy")(espresso, app, application["post-deploy"]);
    
    // RETURN APPLICATION
    return app;
    
};

module.exports = espresso;