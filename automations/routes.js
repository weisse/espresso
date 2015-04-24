module.exports = function(espresso, app, routes, context){
        
    for(var path in routes){

        var routePath = (context || "") + path;
        
        if(routes[path].type && routes[path].type === "regexp") routePath = new RegExp(path);

        // LOAD ROUTER-LEVEL MIDDLEWARES
        if(routes[path].middlewares) require("./routes/middlewares")(espresso, app, routePath, routes[path].middlewares);

        // LOAD ROUTE APPLICATION
        if(routes[path].application) require("./routes/application")(espresso, app, routePath, routes[path].application);

        // LOAD ROUTE SERVICES
        else if(routes[path].methods) require("./routes/methods")(espresso, app, routePath, routes[path].methods);
        
        // LOAD ROUTE ROUTES
        if(routes[path].routes) require("../automations/routes")(espresso, app, routes[path].routes, routePath);
        
        // LOAD ROUTER-LEVEL ERRORWARES
        if(routes[path].errorwares) require("./routes/errorwares")(espresso, app, routePath, routes[path].errorwares);

    }
    
}
