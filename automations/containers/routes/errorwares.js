// REQUIREMENTS
var p = require("path");
var x = require("xtra");

module.exports = function(promise, app, container, path, errorwares){

    if(x.isString(errorwares)) errorwares = [errorwares];

    promise = promise.then(function(){

        for(var i = 0; i < errorwares.length; i++){

            var path = p.join(app.getWorkingDirectory(), "./errorwares", errorwares[i]);
            espresso.log.info(container.getName(), "uses container level errorware \"" + path + "\" on \"" + path + "\"");
            var errorware = require(path);

            if(errorware){

                container.use(path, errorware);

            }

        }

    });

    return promise;

};
