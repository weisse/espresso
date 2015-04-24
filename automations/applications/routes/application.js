module.exports = function(app, router, path, application){
    
    var espresso = require("../../../espresso");
    router.use(path, espresso.application(app.get("wd") + "/applications/" + application));
    
}