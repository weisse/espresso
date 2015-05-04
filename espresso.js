// REQUIREMENTS
var p = require("path");

// DEFINE ESPRESSO
var espresso = {

    server: function(config){

        var cp = require("child_process");
        var server = cp.fork(p.resolve(__dirname, "./server.js")).send(config);

    }

}

module.exports = espresso;
