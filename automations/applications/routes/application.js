var p = require("path");

module.exports = function(app, router, path, application){
    
    var espresso = require("../../../espresso");
    espresso.application(router, path, p.normalize(p.resolve(app.get("wd") + "/applications", application)));
    
};