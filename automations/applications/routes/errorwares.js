var p = require("path");

module.exports = function(app, router, path, errorwares){

    for(var i = 0; i < errorwares.length; i++){

        var errorware = require(p.normalize(p.resolve(app.get("wd") + "/errorwares", errorwares[i])));

        if(errorware){

            router.use(path, errorware);

        }

    }
  
};