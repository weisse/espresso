var p = require("path");

module.exports = function(app, router, path, methods){
    
    for(var method in methods){

        var args = [path];

        if(typeof methods[method] === "string"){

            var service = require(p.normalize(p.resolve(app.get("wd") + "/services", methods[method])));

            if(service){

                args.push(service);

            }

        }else{

            for(var service in methods[method]){

                var service = require(p.normalize(p.resolve(app.get("wd") + "/services", methods[method][service])));

                if(service){

                    args.push(service);

                }

            }

        }

        router[method].apply(router, args);

    }
    
}