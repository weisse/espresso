// REQUIREMENTS
var p = require("path");
var x = require("xtra");

module.exports = function(promise, app, container, path, methods){

    promise = promise.then(function(){

        for(var method in methods){

            var args = [path];

            if(typeof methods[method] === "string"){

                methods[method] = [methods[method]];

                for(var service in methods[method]){

                    var service = require(p.join(app.getWorkingDirectory(), "./services", methods[method][service]));

                    if(service){

                        args.push(service);

                    }

                }

            }

            espresso.log.info(container.getName(), "uses \"" + methods[method] + "\" service when \"" + method + "\" method is called on \"" + path + "\" route")
            container[method].apply(container, args);

        }

    });

    return promise;

}
