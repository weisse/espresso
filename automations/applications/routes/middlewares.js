var p = require("path");

module.exports = function(app, router, path, middlewares){

    for(var i = 0; i < middlewares.length; i++){

        var middleware = require(p.normalize(p.resolve(app.get("wd") + "/middlewares", middlewares[i])));

        if(middleware){

            router.use(path, middleware);

        }

    }
  
};