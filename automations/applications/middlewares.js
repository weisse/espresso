module.exports = function(app, middlewares){
        
    for(var i = 0; i < middlewares.length; i++){

        var middleware = require(app.get("wd") + "/middlewares/" + middlewares[i]);

        if(middleware){

            app.use(middleware);

        }

    }

};