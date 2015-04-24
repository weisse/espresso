module.exports = function(app, router, routePath, descriptor){
        
    var subrouter = new require("express").Router(descriptor.options || {});
    
    if(descriptor.routes){
        
        for(var path in descriptor.routes){
        
            var subrouterPath = path;

            if(descriptor.routes[path].type && descriptor.routes[path].type === "regexp") subrouterPath = new RegExp(path);

            // LOAD ROUTER-LEVEL MIDDLEWARES
            if(descriptor.routes[path].middlewares) require("./routes/middlewares")(app, subrouter, subrouterPath, descriptor.routes[path].middlewares);

            // LOAD ROUTE APPLICATION
            if(descriptor.routes[path].application) require("./routes/application")(app, subrouter, subrouterPath, descriptor.routes[path].application);

            // LOAD ROUTE SERVICES
            else if(descriptor.routes[path].methods) require("./routes/methods")(app, subrouter, subrouterPath, descriptor.routes[path].methods);

            // LOAD ROUTE ROUTER
            if(descriptor.routes[path].router) require("../automations/router")(app, subrouter, subrouterPath, descriptor.routes[path].router);

            // LOAD ROUTER-LEVEL ERRORWARES
            if(descriptor.routes[path].errorwares) require("./routes/errorwares")(app, subrouter, subrouterPath, descriptor.routes[path].errorwares);

        }
        
    }
    
    return router.use(routePath, subrouter);
    
};
