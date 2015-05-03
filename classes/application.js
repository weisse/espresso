// DEPENDENCIES
var express = require("express");
var x = require("xtra");
var _ = require("underscore");
var p = require("path");
var fs = require("fs");
var bluebird = require("bluebird");
var Router = require("./router.js");
var commons = require("./commons/server.container.methods.js");
var logger = require("../libs/logger.js");

// DEFINE CLASS
var esapp = function(rd){

    // CREATE AN EXPRESS APPLICATION
    var app = express();

    // SET ROOT DIRECTORY IF IT WAS PROVIDED
    if(rd) app.set("rd", rd);

    // ESPRESSO VARIABLES
    app._espresso = {

        id: process.pid + (new Date()).getTime() + Math.random().toString().substring(2),
        type: "application",
        parent: null,
        mountPath: null,
        childrenTable: [],
        config: {}

    };

    // EXTEND WITH ELEMENT COMMON METHODS
    app = _.extend(app, commons);

    // SET APP PROMISE AS BLUEBIRD PROMISE
    app.promise = bluebird.Promise;

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

        // SEARCH FOR .ESA
        fs.exists(this.getEP(), function(exists){

            if(exists){

                // SET .ESA TEMP DIRECTORY
                var guid = process.pid + "_" + (new Date()).getTime() + "_" + Math.random().toString().substring(2);
                app.set("ed", p.normalize(p.resolve(p.resolve(app.get("rd"), ".."), guid)));

                var unzip = require("unzip");

                fs.createReadStream(esa)
                    .pipe(unzip.Extract({path:app.get("ed")}))
                    .on("error", function(err){

                        espresso.log.error(err);
                        if(x.isFunction(cb)) cb(err);

                    })
                    .on("close", function(){

                        app.set("wd", app.get("ed"));
                        if(x.isFunction(cb)) cb(null, app.get("wd"));

                    });

            }else{

                app.set("wd", app.get("rd"));
                if(x.isFunction(cb)) cb(null, app.get("wd"));

            }

        });

        return this;

    };
    app.loadDescriptor = function(cb){

        var app = this;

        this.getWD(function(err, wd){

            if(!err){

                try{

                    // LOAD APPLICATION JSON
                    var descriptor = require(app.get("wd") + "/application.json");

                    // SET APP NAME
                    app.set("name", descriptor.name);

                    // SET CONFIG
                    app.setConfig(_.extend(require("../defaults/application.config.json"), descriptor.config || {}));

                    // CREATE LOGGER
                    if(espresso.config.log){

                        app.setConfig("logName", app.get("name"));
                        app.log = logger(app.getConfig());

                    }

                    // LOAD LOCALS
                    if(descriptor.locals) require("../automations/applications/locals")(app, descriptor.locals);

                    // CALLBACK
                    if(x.isFunction(cb)) cb(null, descriptor);

                }catch(e){

                    espresso.log.error(e);

                    // CALLBACK
                    if(x.isFunction(cb)) cb(e);

                }

            }

        });

        return this;

    };
    app.make = function(cb){

        var app = this;
        var promise = new app.promise(function(res,rej){

            app.loadDescriptor(function(err, descriptor){

                if(!err){

                    app.log.info("make initialization");

                    var promise = new app.promise(function(res,rej){

                        res();

                    });

                    // PRE-MAKE EXECUTION
                    if(descriptor["pre-make"]) promise = require("../automations/applications/preMake")(promise, app, descriptor["pre-make"]);

                    // MAKE INIT

                        promise = promise.then(function(){

                            // SET APPLICATION ENGINES
                            require("../automations/applications/engines")(app, app.getConfig("engines"));

                            // SET APPLICATION VIEWS DIRECTORY
                            if(app.getConfig("views")) app.set("views", p.normalize(p.resolve(app.get("wd"), app.getConfig("viewsPath"))));

                            // USE EXPRESS STATIC (APPLICATION-LEVEL MIDDLEWARE)
                            if(app.getConfig("static")){

                                for(var path in app.getConfig("staticPaths")){

                                    var absolutePath = p.normalize(p.resolve(app.get("wd"), app.getConfig("staticPaths")[path]));
                                    app.use(app.getConfig("staticRoute"), express.static(absolutePath, app.getConfig("staticOptions")));

                                }

                            }

                        });

                        // LOAD APPLICATION-LEVEL MIDDLEWARES
                        if(descriptor.middlewares) promise = require("../automations/applications/middlewares")(promise, app, descriptor.middlewares);

                        // LOAD ROUTER
                        if(descriptor.router){

                            promise = promise.then(function(){

                                var promise = new app.promise(function(res,rej){ res() });
                                var router = Router(descriptor.router.options || {});

                                promise = require("../automations/applications/router")(promise, app, router, "/", descriptor.router);

                                promise.then(function(){

                                    app.deploy("/", router);

                                });

                                return promise;

                            });

                        }

                        // LOAD APPLICATION-LEVEL ERRORWARES
                        if(descriptor.errorwares) promise = require("../automations/applications/errorwares")(promise, app, descriptor.errorwares);

                    // MAKE ENDS

                    // POST-MAKE EXECUTION
                    if(descriptor["post-make"]) promise = require("../automations/applications/postMake")(promise, app, descriptor["post-make"]);

                    // MAKE-PROCESS ENDING
                    promise.then(function(){

                        app.log.info("make ends");
                        res(app);
                        if(x.isFunction(cb)) cb(null, app);

                    }).catch(function(err){

                        app.log.error(err);
                        app.log.error("make failed");
                        rej(err);
                        if(x.isFunction(cb)) cb(err);

                    });

                }else{

                    rej(err);

                }

            });

        });

        return promise;

    };

    return app;

};

// EXPORTS MODULE
module.exports = esapp;
