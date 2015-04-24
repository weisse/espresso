module.exports = function(app, errorwares){
        
    for(var i = 0; i < errorwares.length; i++){

        var errorware = require(app.get("wd") + "/errorwares/" + errorwares[i]);

        if(errorware){

            app.use(errorware);

        }

    }

};