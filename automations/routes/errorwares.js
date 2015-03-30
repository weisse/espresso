module.exports = function(espresso, app, path, errorwares){

    for(var i = 0; i < errorwares.length; i++){

        var errorware = require(app.get("wd") + "/errorwares/" + errorwares[i]);

        if(errorware){

            app.use(path, errorware);

        }

    }
  
};