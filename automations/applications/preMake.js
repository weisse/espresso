var p = require("path");

module.exports = function(promise, app, preMake){

    for(var i = 0; i < preMake.length; i++){

        promise = promise.then(require(p.normalize(p.resolve(app.getWorkingPath() + "/pre-make", preMake[i]))));

    }

    return promise;

}
