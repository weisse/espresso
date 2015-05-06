// DEPENDENCIES
var p = require("path");

module.exports = function(promise, app, router, path, application){

    var App = require(p.resolve(__dirname, "../../../classes/application"));
    promise = promise.then(function(){

        var NewApp = new App(p.normalize(p.resolve(app.getWorkingPath() + "/applications", application)));

        return new NewApp.promise(function(res,rej){

            NewApp.loadDescriptor().then(function(app){

                app.make().then(function(app){

                    res(router.deploy(path, app));

                }).catch(function(err){

                    rej(err);

                });

            });

        });

    });

    return promise;

};
