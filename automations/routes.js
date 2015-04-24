module.exports = function(espresso, app, router, routePath, routes){
        
    var subrouter = new require("express").Router();
        
    for(var path in routes){
        
        var subrouterPath = path;
        
        if(routes[path].type && routes[path].type === "regexp") subrouterPath = new RegExp(path);

        // LOAD ROUTER-LEVEL MIDDLEWARES
        if(routes[path].middlewares) require("./routes/middlewares")(espresso, app, subrouter, subrouterPath, routes[path].middlewares);

        // LOAD ROUTE APPLICATION
        if(routes[path].application) require("./routes/application")(espresso, app, subrouter, subrouterPath, routes[path].application);

        // LOAD ROUTE SERVICES
        else if(routes[path].methods) require("./routes/methods")(espresso, app, subrouter, subrouterPath, routes[path].methods);
        
        // LOAD ROUTE ROUTES
        if(routes[path].routes) require("../automations/routes")(espresso, app, subrouter, subrouterPath, routes[path].routes);
        
        // LOAD ROUTER-LEVEL ERRORWARES
        if(routes[path].errorwares) require("./routes/errorwares")(espresso, app, subrouter, subrouterPath, routes[path].errorwares);

    }
    
    return router.use(routePath, subrouter);
    
    
}
