// REQUIREMENTS
var p = require("path");
var x = require("xtra");

module.exports = function(promise, app, middlewares){

    if(x.isString(middlewares)) middlewares = [middlewares];

    promise = promise.then(function(){

        for(var i = 0; i < middlewares.length; i++){

            var path = p.normalize(p.resolve(app.getWorkingDirectory() + "/middlewares", middlewares[i]))
            espresso.log.info(app.getName(), "uses application level middleware \"" + path + "\"");
            var middleware = require(path);

            if(middleware){

                app.use(middleware);

            }

        }

    });

    return promise;

};
