// REQUIREMENTS
var p = require("path");
var x = require("xtra");

module.exports = function(promise, app, router, path, middlewares){

    if(x.isString(middlewares)) middlewares = [middlewares];

    promise = promise.then(function(){

        for(var i = 0; i < middlewares.length; i++){

            var path = p.join(app.getWorkingDirectory(), "./middlewares", middlewares[i]);
            espresso.log.info(app.getName(), "uses router level middleware \"" + path + "\" on \"" + path + "\"");
            var middleware = require(path);

            if(middleware){

                router.use(path, middleware);

            }

        }

    });

    return promise;

};
