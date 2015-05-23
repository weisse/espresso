// DEPENDENCIES
var p = require("path");
var routes = require(p.resolve(__dirname, "./routes.js"));

module.exports = function(promise, app, container, routePath, descriptor){

    var router = require(p.resolve(__dirname, "../../classes/router"))(descriptor.options || {});
    if(descriptor.routes) promise = routes(promise, app, router, descriptor);

    promise = promise.then(function(){

        return container.deploy(routePath, router);

    });

    return promise;

};
