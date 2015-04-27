var p = require("path");

module.exports = function(app, postDeploy){
    
    for(var i = 0; i < postDeploy.length; i++){
        
        require(p.normalize(p.resolve(app.get("wd") + "/post-deploy", postDeploy[i])(app)));
        
    }
    
}