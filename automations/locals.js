module.exports = function(espresso, app, locals){
       
    for(var key in locals){

        app.set(key, locals[key]);

    }
    
}