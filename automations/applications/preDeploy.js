module.exports = function(app, preDeploy){
    
    for(var i = 0; i < preDeploy.length; i++){
        
        require(app.get("wd") + "/pre-deploy/" + preDeploy[i])(app);
        
    }
    
}