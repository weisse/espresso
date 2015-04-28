// REQUIREMENTS
var express = require("express");
var _ = require("underscore");
var fs = require("fs");
var p = require("path");

// DEFINE MODULE
module.exports = function(parent, mountPath, wd){
    
    var app;
    var esa;
    
    var createApp = function(){
    
        // CREATE APPLICATION
        app = express();

        // SET APPLICATION WORKING DIRECTORY
        app.set("wd", wd);
        
        // GET APPLICATION
        getApp();
        
    };
        
    // GET APPLICATION
    var getApp = function(){
        
        // SET .ESA PATH
        esa = app.get("wd") + ".esa";
        
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
        
    };
    
        
    // DEFINE DEPLOY PROCEDURE
    var deploy = function(){
        
        // LOAD APPLICATION JSON
        var application = require(app.get("wd") + "/application.json") || {};

        // SET APP NAME
        app.set("name", application.name);
        
        // LOAD APPLICATION CONFIGURATIONS
        application.config = _.extend(require("../defaults/application.config.json"), application.config || {});

        // LOAD LOCALS
        if(application.locals) require("./applications/locals")(app, application.locals);

        // PRE-DEPLOY EXECUTION
        if(application["pre-deploy"]) require("./applications/preDeploy")(app, application["pre-deploy"]);

        // DEPLOY INIT
            
            console.log("Deploy: " + app.get("name"));
            
            // SET APPLICATION ENGINES
            require("./applications/engines")(app, application.config.engines);

            // SET APPLICATION VIEWS DIRECTORY
            app.set("views", p.normalize(p.resolve(app.get("wd"), application.config.viewsPath)));

            // USE EXPRESS STATIC (APPLICATION-LEVEL MIDDLEWARE)
            for(var path in application.config.staticPaths){

                var absolutePath = p.normalize(p.resolve(app.get("wd"), application.config.staticPaths[path]));
                app.use(application.config.staticRoute, express.static(absolutePath, application.config.staticOptions));

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
        
        // SET SIGNATURE
        parent._router.stack[parent._router.stack.length - 1].signature = Math.random().toString().substring(2);
        app.set("parent_router_stack_signature", parent._router.stack[parent._router.stack.length - 1].signature);
        
        // WATCHER
        if(application.config.watch){

            setTimeout(function(){
                
                fs.watchFile(esa, function(curr, prev){

                    fs.unwatchFile(esa);
                    fs.rename(wd, wd + "_" + (new Date()).getTime(), function(err){

                        if(!err){

                            undeploy();
                            createApp();

                        }

                    })


                });
                
            }, application.config.watchDelay);

        }
        
    };
    
    // DEFINE UNDEPLOY PROCEDURE
    var undeploy = function(){

        console.log("Undeploy:", app.get("name"));

        // REMOVE FROM PARENT ROUTER
        var route = _.find(parent._router.stack, function(route){
            
            return route.signature === app.get("parent_router_stack_signature");
            
        });
        parent._router.stack = _.reject(parent._router.stack, function(item){
            
            return item === route;
            
        });
        
        // CLEAN CACHE
        for(var path in require.cache){
            
            if(path.match("^" + app.get("wd"))){
                
                delete require.cache[path];
                
            }
            
        }
        
    };
    
    createApp();
    
};