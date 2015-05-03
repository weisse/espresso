var p = require("path");

module.exports = function(promise, app, router, path, application){

    var App = require("../../../classes/application");
    promise = promise.then(function(){

        return App(p.normalize(p.resolve(app.get("wd") + "/applications", application))).make().then(function(app){

            router.deploy(path, app);

        });

    });

    return promise;

};
