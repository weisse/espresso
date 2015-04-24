module.exports = function(espresso, app, engines){
    
    var cons = require("consolidate");
    
    for(var i = 0; i < engines.length; i++){
        
        app.engine(engines[i][1], cons[engines[i][0]]);
        
    }
    
}