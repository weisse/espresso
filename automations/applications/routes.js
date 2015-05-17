// REQUIREMENTS
var p = require("path");

module.exports = function(promise, app, container, descriptor){

    return promise.then(function(){

        for(var path in descriptor.routes){

            var routerPath = path;

            if(descriptor.routes[path].type && descriptor.routes[path].type === "regexp") routerPath = new RegExp(path);

            // LOAD ROUTER-LEVEL MIDDLEWARES
            if(descriptor.routes[path].middlewares) promise = require(p.resolve(__dirname, "./routes/middlewares"))(promise, app, container, routerPath, descriptor.routes[path].middlewares);

            // LOAD ROUTE APPLICATION
            if(descriptor.routes[path].application) promise = require(p.resolve(__dirname, "./routes/application"))(promise, app, container, routerPath, descriptor.routes[path].application);

            // LOAD ROUTE ROUTER
            if(descriptor.routes[path].router) promise = require(p.resolve(__dirname, "./router"))(promise, app, container, routerPath, descriptor.routes[path].router);

            // LOAD ROUTE SERVICES
            if(descriptor.routes[path].methods) promise = require(p.resolve(__dirname, "./routes/methods"))(promise, app, container, routerPath, descriptor.routes[path].methods);

            // LOAD ROUTER-LEVEL ERRORWARES
            if(descriptor.routes[path].errorwares) promise = require(p.resolve(__dirname, "./routes/errorwares"))(promise, app, container, routerPath, descriptor.routes[path].errorwares);

        }

    });

}
