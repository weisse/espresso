module.exports = function(espresso, app){
    
    var cons = require("consolidate");
    
    // SET ENGINES
    app.engine('jade', cons.jade);
    app.engine('ejs', cons.ejs);
    app.engine('_', cons.underscore);
    app.engine("han", cons.handlebars);
    app.engine("mus", cons.mustache);
    app.engine('dot', cons.dot);
    
    // SET PUBLIC AS VIEW DIRECTORY
    app.set('views', app.get("wd") + '/public');
    
}