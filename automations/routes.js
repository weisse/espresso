module.exports = function(espresso, app, routes){
        
    for(var path in routes){

        var routePath = path;
    
        if(routes[path].type && routes[path].type === "regexp") routePath = new RegExp(path);

        // LOAD ROUTER-LEVEL MIDDLEWARES
        if(routes[path].middlewares) require("./routes/middlewares")(espresso, app, routePath, routes[path].middlewares);

        // LOAD ROUTE APPLICATION
        if(routes[path].application) require("./routes/application")(espresso, app, routePath, routes[path].application);

        // LOAD ROUTE SERVICES
        else if(routes[path].methods) require("./routes/methods")(espresso, app, routePath, routes[path].methods);
        
        // LOAD ROUTER-LEVEL ERRORWARES
        if(routes[path].errorwares) require("./routes/errorwares")(espresso, app, routePath, routes[path].errorwares);

    }
    
}
