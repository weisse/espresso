var p = require("path");

module.exports = function(promise, app, errorwares){

    promise = promise.then(function(){

        for(var i = 0; i < errorwares.length; i++){

            var errorware = require(p.normalize(p.resolve(app.get("wd") + "/errorwares", errorwares[i])));

            if(errorware){

                app.use(errorware);

            }

        }

    });

    return promise;

};
