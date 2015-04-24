module.exports = function(app, router, path, middlewares){

    for(var i = 0; i < middlewares.length; i++){

        var middleware = require(app.get("wd") + "/middlewares/" + middlewares[i]);

        if(middleware){

            router.use(path, middleware);

        }

    }
  
};