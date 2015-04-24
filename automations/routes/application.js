module.exports = function(espresso, app, router, path, application){
    
    var subapp = require(app.get("wd") + "/applications/" + application + "/application");

    if(subapp){

        router.use(path, espresso(app.get("wd") + "/applications/" + application));

    }
    
}