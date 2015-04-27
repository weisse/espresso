// REQUIREMENTS
var express = require("express");
var _ = require("underscore");
var fs = require("fs");
var p = require("path");

// DEFINE MODULE
module.exports = function(parent, mountPath, wd){
    
    // CREATE APPLICATION
    var app = express();
    
    // SET APPLICATION WORKING DIRECTORY
    app.set("wd", wd);
        
    // SET .ESA PATH
    var esa = app.get("wd") + ".esa";
        
    // SEARCH FOR .ESA
    fs.exists(esa, function(exists){
        
        if(exists){
            
            var unzip = require("unzip");
            
            fs.createReadStream(esa)
                .pipe(unzip.Extract({path:app.get("wd")}))
                .on("close", function(){

                    deploy();

                });
            
        }else{
            
            deploy();
            
        }
        
    });
        
    // DEFINE DEPLOY PROCEDURE
    var deploy = function(){
        
        // LOAD APPLICATION JSON
        var application = require(app.get("wd") + "/application.json") || {};

        // LOAD APPLICATION CONFIGURATIONS
        application.config = _.extend(require("../defaults/application.config.json"), application.config || {});

        // LOAD LOCALS
        if(application.locals) require("./applications/locals")(app, application.locals);

        // PRE-DEPLOY EXECUTION
        if(application["pre-deploy"]) require("./applications/preDeploy")(app, application["pre-deploy"]);

        // DEPLOY INIT

            // SET APPLICATION ENGINES
            require("./applications/engines")(app, application.config.engines);

            // SET APPLICATION VIEWS DIRECTORY
            app.set("views", p.normalize(p.resolve(app.get("wd"), application.config.viewsPath)));

            // USE EXPRESS STATIC (APPLICATION-LEVEL MIDDLEWARE)
            for(var path in application.config.staticPaths){

                app.use(application.config.staticRoute, express.static(p.normalize(p.resolve(app.get("wd"), application.config.staticPaths[path]))));

            }

            // LOAD APPLICATION-LEVEL MIDDLEWARES
            if(application.middlewares) require("./applications/middlewares")(app, application.middlewares);

            // LOAD ROUTER
            if(application.router){

                var router = express.Router(application.router.options || {});
                require("./applications/router")(app, router, "/", application.router);
                app.use(router);

            }

            // LOAD APPLICATION-LEVEL ERRORWARES
            if(application.errorwares) require("./applications/errorwares")(app, application.errorwares);

        // DEPLOY ENDS

        // POST-DEPLOY EXECUTION
        if(application["post-deploy"]) require("./applications/postDeploy")(app, application["post-deploy"]);
        
        // USE APP
        parent.use(mountPath, app);
        
    }
    
    // DEFINE UNDEPLOY PROCEDURE
    var undeploy = function(app){

        // CLEAN CACHE
        for(var path in require.cache){
            
            if(path.match(new RegExp(app.get("wd") + "$"))){
                
                delete require.cache[path];
                
            }
            
        }

    };
    
};