var p = require("path");

module.exports = function(promise, app, router, path, application){

    var espresso = require("../../../espresso");
    promise = promise.then(function(){

        return router.deploy(path, espresso.application(p.normalize(p.resolve(app.get("wd") + "/applications", application))));

    });

    return promise;

};
