module.exports = function(app, router, path, errorwares){

    for(var i = 0; i < errorwares.length; i++){

        var errorware = require(app.get("wd") + "/errorwares/" + errorwares[i]);

        if(errorware){

            router.use(path, errorware);

        }

    }
  
};