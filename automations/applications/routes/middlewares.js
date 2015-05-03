var p = require("path");

module.exports = function(promise, app, router, path, middlewares){

    promise = promise.then(function(){

        for(var i = 0; i < middlewares.length; i++){

            var middleware = require(p.normalize(p.resolve(app.get("wd") + "/middlewares", middlewares[i])));

            if(middleware){

                router.use(path, middleware);

            }

        }

    });

    return promise;

};
