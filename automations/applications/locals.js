module.exports = function(app, locals){
       
    for(var key in locals){

        app.set(key, locals[key]);

    }
    
}