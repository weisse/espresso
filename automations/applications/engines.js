module.exports = function(app, engines){

    var cons = require("consolidate");

    for(var i = 0; i < engines.length; i++){

        espresso.log.info("load \"" + engines[i][0] + "\" engine for \"." + engines[i][1] + "\" files");
        app.engine(engines[i][1], cons[engines[i][0]]);

    }

}
