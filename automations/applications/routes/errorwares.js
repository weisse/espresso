// REQUIREMENTS
var p = require("path");
var x = require("xtra");

module.exports = function(promise, app, router, path, errorwares){

    if(x.isString(errorwares)) errorwares = [errorwares];

    promise = promise.then(function(){

        for(var i = 0; i < errorwares.length; i++){

            var path = p.join(app.getWorkingDirectory(), "./errorwares", errorwares[i]);
            espresso.log.info(app.getName(), "uses router level errorware \"" + path + "\" on \"" + path + "\"");
            var errorware = require(path);

            if(errorware){

                router.use(path, errorware);

            }

        }

    });

    return promise;

};
