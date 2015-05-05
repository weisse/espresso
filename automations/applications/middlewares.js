// REQUIREMENTS
var p = require("path");
var x = require("xtra");

module.exports = function(promise, app, middlewares){

    if(x.isString(middlewares)) middlewares = [middlewares];

    promise = promise.then(function(){

        for(var i = 0; i < middlewares.length; i++){

            var path = p.normalize(p.resolve(app.get("wd") + "/middlewares", middlewares[i]))
            espresso.log.info("load application level middleware \"" + path + "\"");
            var middleware = require(path);

            if(middleware){

                app.use(middleware);

            }

        }

    });

    return promise;

};
