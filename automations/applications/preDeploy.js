var p = require("path");

module.exports = function(app, preDeploy){
    
    for(var i = 0; i < preDeploy.length; i++){
        
        require(p.normalize(p.resolve(app.get("wd") + "/pre-deploy", preDeploy[i])))(app);
        
    }
    
}