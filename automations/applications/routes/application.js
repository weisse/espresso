var p = require("path");

module.exports = function(app, router, path, application){
    
    var espresso = require("../../../espresso");
    router.use(path, espresso.application(p.normalize(p.resolve(app.get("wd") + "/applications", application))));
    
}