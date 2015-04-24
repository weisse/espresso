module.exports = function(app, router, path, methods){
    
    for(var method in methods){

        var args = [path];

        if(typeof methods[method] === "string"){

            var service = require(app.get("wd") + "/services/" + methods[method]);

            if(service){

                args.push(service);

            }

        }else{

            for(var service in methods[method]){

                var service = require(app.get("wd") + "/services/" + methods[method][service]);

                if(service){

                    args.push(service);

                }

            }

        }

        router[method].apply(app, args);

    }
    
}