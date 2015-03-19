var espresso = function(cad){
    
    // BASE PATH
    if(!cad){
        
        var cad = process.cwd()
        
    }
    
    var express = require("express");
    var app = express();
    var config = require(cad + "/application") || {};
    
    // LOAD GLOBAL MIDDLEWARES
    if(config.middlewares){
        
        for(var i = 0; i < config.middlewares.length; i++){
            
            var middleware = require(cad + "/middlewares/" + config.middlewares[i]);
            
            if(middleware){
                
                app.use(middleware);
                
            }
            
        }
        
    };
    
    // LOAD ROUTES
    if(config.routes){
        
        for(var path in config.routes){
            
            // LOAD ROUTE MIDDLEWARES
            if(config.routes[path].middlewares){
                
                for(var i = 0; i < config.routes[path].middlewares.length; i++){
            
                    var middleware = require(cad + "/middlewares/" + config.routes[path].middlewares[i]);

                    if(middleware){

                        app.use(path, middleware);
                        
                    }

                }
                
            }
            
            // LOAD ROUTE APPLICATION
            if(config.routes[path].application){
                
                var application = require(cad + "/applications/" + config.routes[path].application + "/application");
                
                if(application){
                    
                    app.use(path, espresso(cad + "/applications/" + config.routes[path].application));
                    
                }
                
            // LOAD ROUTE SERVICES
            }else if(config.routes[path].methods){
                
                var services = config.routes[path].methods;
                
                for(var method in services){
                    
                    var args = [path];
                    
                    if(typeof services[method] === "string"){
                        
                        var service = require(cad + "/services/" + services[method]);
                        
                        if(service){

                            args.push(service);

                        }
                        
                    }else{
                        
                        for(var service in services[method]){
                        
                            var service = require(cad + "/services/" + services[method][service]);

                            if(service){

                                args.push(service);

                            }

                        }
                        
                    }
                    
                    app[method].apply(app, args);
                    
                }
                
            }
            
        }
        
    }
    
    // LOAD LOCALS
    if(config.locals){
        
        for(var key in config.locals){
            
            app.set(key, config.locals[key]);
            
        }
        
    }
    
    return app;
    
};

module.exports = espresso;