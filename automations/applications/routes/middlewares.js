var p = require("path");

module.exports = function(promise, app, router, path, middlewares){

    promise = promise.then(function(){

        for(var i = 0; i < middlewares.length; i++){

            var path = p.normalize(p.resolve(app.get("wd") + "/middlewares", middlewares[i]));
            espresso.log.info("load router level middleware \"" + path + "\" on \"" + path + "\"");
            var middleware = require(path);

            if(middleware){

                router.use(path, middleware);

            }

        }

    });

    return promise;

};
