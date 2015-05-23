// DEPENDENCIES
var p = require("path");

module.exports = function(promise, app, container, path, application){

    var App = require(p.resolve(__dirname, "../../../classes/application"));
    promise = promise.then(function(){

        var NewApp = new App(p.join(app.getWorkingDirectory(), "./applications", application));

        return new NewApp.promise(function(res,rej){

            NewApp.loadDescriptor().then(function(app){

                app.make().then(function(app){

                    res(container.deploy(path, app));

                }).catch(function(err){

                    rej(err);

                });

            });

        });

    });

    return promise;

};
