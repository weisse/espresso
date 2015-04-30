// DEPENDENCIES
var express = require("express");
var _ = require("underscore");
var p = require("path");
var fs = require("fs");
var Router = require("./router.js");
var commons = require("./commons/element.methods.js");

// DEFINE CLASS
var esapp = function(rd){

    // CREATE AN EXPRESS APPLICATION
    var app = express();

    // SET ROOT DIRECTORY IF IT WAS PROVIDED
    if(rd) app.set("rd", rd);

    // ESPRESSO VARIABLES
    app._espresso = {

        type: "application",
        parent: null,
        signature: null,
        mountPath: null,
        childrenTable: []

    };

    // EXTEND WITH ELEMENT COMMON METHODS
    app = _.extend(app, commons);

    // ESPRESSO METHODS
    app.getStack = function(){

        return this._router.stack;

    };
    app.setStack = function(stack){

        this._router.stack = stack;
        return this;

    };
    app.setRD = function(rd){

        this.set("rd", rd);
        return this;

    };
    app.getEP = function(){

        return this.get("rd") + ".esa";

    };
    app.getWD = function(cb){

        // SET ESA VAR
        var esa = this.getEP();

        // SET .ESA TEMP DIRECTORY
        var guid = Math.random().toString().substring(2) + process.pid;
        app.set("ed", p.normalize(p.resolve(p.resolve(app.get("rd"), ".."), guid)));

        // SEARCH FOR .ESA
        fs.exists(this.getEP(), function(exists){

            if(exists){

                var unzip = require("unzip");

                fs.createReadStream(esa)
                    .pipe(unzip.Extract({path:app.get("ed")}))
                    .on("close", function(){

                        app.set("wd", app.get("ed"));
                        cb(app.get("wd"));

                    });

            }else{

                app.set("wd", app.get("rd"));
                cb(app.get("wd"));

            }

        });

        return this;

    };
    app.make = function(cb){

        var app = this;

        this.getWD(function(wd){

            // LOAD APPLICATION JSON
            var application = require(app.get("wd") + "/application.json") || {};

            // SET APP NAME
            app.set("name", application.name);

            // SET CONFIG
            app.set("config", _.extend(require("../defaults/application.config.json"), application.config || {}));

            // LOAD LOCALS
            if(application.locals) require("../automations/applications/locals")(app, application.locals);

            // PRE-MAKE EXECUTION
            if(application["pre-deploy"]) require("../automations/applications/preDeploy")(app, application["pre-deploy"]);

            console.log("make", app.get("name"));

            // MAKE INIT

                // SET APPLICATION ENGINES
                require("../automations/applications/engines")(app, app.get("config").engines);

                // SET APPLICATION VIEWS DIRECTORY
                app.set("views", p.normalize(p.resolve(app.get("wd"), app.get("config").viewsPath)));

                // USE EXPRESS STATIC (APPLICATION-LEVEL MIDDLEWARE)
                for(var path in app.get("config").staticPaths){

                    var absolutePath = p.normalize(p.resolve(app.get("wd"), app.get("config").staticPaths[path]));
                    app.use(app.get("config").staticRoute, express.static(absolutePath, app.get("config").staticOptions));

                }

                // LOAD APPLICATION-LEVEL MIDDLEWARES
                if(application.middlewares) require("../automations/applications/middlewares")(app, application.middlewares);

                // LOAD ROUTER
                if(application.router){

                    var router = Router(application.router.options || {});
                    require("../automations/applications/router")(app, router, "/", application.router);
                    app.deploy("/", router);

                }

                // LOAD APPLICATION-LEVEL ERRORWARES
                if(application.errorwares) require("../automations/applications/errorwares")(app, application.errorwares);

            // MAKE ENDS

            // POST-MAKE EXECUTION
            if(application["post-deploy"]) require("../automations/applications/postDeploy")(app, application["post-deploy"]);

            // CALLBACK
            if(cb) cb();

        });

        return this;

    };

    return app;

};

// EXPORTS MODULE
module.exports = esapp;
