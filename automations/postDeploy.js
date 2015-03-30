module.exports = function(espresso, app, postDeploy){
    
    for(var i = 0; i < postDeploy.length; i++){
        
        require(app.get("wd") + "/post-deploy/" + postDeploy[i])(app);
        
    }
    
}