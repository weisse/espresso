var p = require("path");

module.exports = function(promise, app, router, path, errorwares){

    promise = promise.then(function(){

        for(var i = 0; i < errorwares.length; i++){

            var path = p.normalize(p.resolve(app.get("wd") + "/errorwares", errorwares[i]))
            espresso.log.info("load router level errorware \"" + path + "\" on \"" + path + "\"");
            var errorware = require(path);

            if(errorware){

                router.use(path, errorware);

            }

        }

    });

    return promise;

};
