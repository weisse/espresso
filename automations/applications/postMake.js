var p = require("path");

module.exports = function(promise, app, postMake){

    for(var i = 0; i < postMake.length; i++){

        promise = promise.then(require(p.normalize(p.resolve(app.get("wd") + "/post-make", postMake[i]))));

    }

    return promise;

}