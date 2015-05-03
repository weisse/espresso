var p = require("path");

module.exports = function(promise, app, router, path, methods){

    for(var method in methods){

        var args = [path];

        if(typeof methods[method] === "string"){

            methods[method] = [methods[method]];

            for(var service in methods[method]){

                var service = require(p.normalize(p.resolve(app.get("wd") + "/services", methods[method][service])));

                if(service){

                    args.push(service);

                }

            }

        }

        promise = promise.then(function(){

            router[method].apply(router, args);

        });

    }

    return promise;

}
