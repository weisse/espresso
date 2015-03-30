module.exports = function(espresso, app, path, application){
    
    var subapp = require(app.get("wd") + "/applications/" + application + "/application");

    if(subapp){

        app.use(path, espresso(app.get("wd") + "/applications/" + application));

    }
    
}