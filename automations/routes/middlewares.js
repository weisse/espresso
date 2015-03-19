module.exports = function(espresso, app, path, middlewares){

    for(var i = 0; i < middlewares.length; i++){

        var middleware = require(app.get("awd") + "/middlewares/" + middlewares[i]);

        if(middleware){

            app.use(path, middleware);

        }

    }
  
};