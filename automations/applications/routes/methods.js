// REQUIREMENTS
var p = require("path");
var x = require("xtra");

module.exports = function(promise, app, router, path, methods){

    promise = promise.then(function(){

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

            espresso.log.info("load \"" + methods[method] + "\" service when \"" + method + "\" is called on \"" + path + "\" route")
            router[method].apply(router, args);

        }

    });

    return promise;

}
