//REQUIREMENTS
var fs = require("fs");
var unzip = require("unzip");
var p = require("path");

process.on("message", function(path){

    // SET .ESA TEMP DIRECTORY
    var guid = process.pid + "_" + (new Date()).getTime() + "_" + Math.random().toString().substring(2);
    var temp = p.join(p.dirname(path), guid);

    fs.createReadStream(path)
      .pipe(unzip.Extract({path:temp}))
      .on("error", function(err){

          process.send(JSON.stringify({error:err}));
          process.kill(process.pid);

      })
      .on("close", function(){

          process.send(JSON.stringify({tempDirectory:temp}));
          process.kill(process.pid);

      });

});
