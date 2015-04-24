module.exports = function(espresso, app, router, path, application){
    
    var fs = require("fs");
    var unzip = require("unzip");
    var esa = app.get("wd") + "/applications/" + application + ".esa";
    
    fs.exists(esa, function(exists){
        
        if(exists){
            
                fs.createReadStream(esa)
                    .pipe(unzip.Extract({path:app.get("wd") + "/applications/" + application}))
                    .on("close", function(){

                        useApp();

                    });
            
        }else{
            
            useApp();
            
        }
        
    });
    
    var useApp = function(){
        
        var subapp = require(app.get("wd") + "/applications/" + application + "/application.json");

        if(subapp){

            router.use(path, espresso(app.get("wd") + "/applications/" + application));

        }
        
    }
    
}