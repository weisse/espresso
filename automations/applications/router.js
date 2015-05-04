// DEPENDENCIES
var p = require("path");

module.exports = function(promise, app, router, routePath, descriptor){

    var subrouter = require(p.resolve(__dirname, "../../classes/router"))(descriptor.options || {});

    if(descriptor.routes){

        for(var path in descriptor.routes){

            var subrouterPath = path;

            if(descriptor.routes[path].type && descriptor.routes[path].type === "regexp") subrouterPath = new RegExp(path);

            // LOAD ROUTER-LEVEL MIDDLEWARES
            if(descriptor.routes[path].middlewares) promise = require(p.resolve(__dirname, "./routes/middlewares"))(promise, app, subrouter, subrouterPath, descriptor.routes[path].middlewares);

            // LOAD ROUTE APPLICATION
            if(descriptor.routes[path].application) promise = require(p.resolve(__dirname, "./routes/application"))(promise, app, subrouter, subrouterPath, descriptor.routes[path].application);

            // LOAD ROUTE ROUTER
            if(descriptor.routes[path].router) promise = require(p.resolve(__dirname, "./router"))(promise, app, subrouter, subrouterPath, descriptor.routes[path].router);

            // LOAD ROUTE SERVICES
            if(descriptor.routes[path].methods) promise = require(p.resolve(__dirname, "./routes/methods"))(promise, app, subrouter, subrouterPath, descriptor.routes[path].methods);

            // LOAD ROUTER-LEVEL ERRORWARES
            if(descriptor.routes[path].errorwares) promise = require(p.resolve(__dirname, "./routes/errorwares"))(promise, app, subrouter, subrouterPath, descriptor.routes[path].errorwares);

        }

    }

    promise = promise.then(function(){

        return router.deploy(routePath, subrouter);

    });

    return promise;

};
