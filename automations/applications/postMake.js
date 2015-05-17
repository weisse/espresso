var p = require("path");

module.exports = function(promise, app, postMake){

    for(var i = 0; i < postMake.length; i++){

        promise = promise.then(require(p.join(app.getWorkingDirectory(), "./post-make", postMake[i])));

    }

    return promise;

}
