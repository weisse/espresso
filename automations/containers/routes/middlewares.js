// REQUIREMENTS
var p = require("path");
var x = require("xtra");

module.exports = function(promise, app, container, path, middlewares){

    if(x.isString(middlewares)) middlewares = [middlewares];

    promise = promise.then(function(){

        for(var i = 0; i < middlewares.length; i++){

            var path = p.join(app.getWorkingDirectory(), "./middlewares", middlewares[i]);
            espresso.log.info(container.getName(), "uses container level middleware \"" + path + "\" on \"" + path + "\"");
            var middleware = require(path);

            if(middleware){

                container.use(path, middleware);

            }

        }

    });

    return promise;

};
