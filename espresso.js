// REQUIREMENTS

// DEFINE ESPRESSO
var espresso = {

    server: function(config){

        var cp = require("child_process");
        var server = cp.fork("./server.js").send(config);

    }

}

module.exports = espresso;
