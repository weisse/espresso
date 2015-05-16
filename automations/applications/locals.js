module.exports = function(app, locals){

    for(var key in locals){

        espresso.log.info(app.getName(), "set local \"" + key + "\" as \"" + locals[key] + "\"")
        app.set(key, locals[key]);

    }

}
