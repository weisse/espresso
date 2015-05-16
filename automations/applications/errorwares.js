// REQUIREMENTS
var p = require("path");
var x = require("xtra");

module.exports = function(promise, app, errorwares){

    if(x.isString(errorwares)) errorwares = [errorwares];

    promise = promise.then(function(){

        for(var i = 0; i < errorwares.length; i++){

            var path = p.normalize(p.resolve(app.getWorkingDirectory() + "/errorwares", errorwares[i]))
            espresso.log.info(app.getName(), "uses application level errorware \"" + path + "\"");
            var errorware = require(path);

            if(errorware){

                app.use(errorware);

            }

        }

    });

    return promise;

};
