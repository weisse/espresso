// DEPENDENCIES
var express = require("express");
var x = require("xtra");
var _ = require("underscore");
var p = require("path");
var fs = require("fs");
var bluebird = require("bluebird");
var Router = require(p.resolve(__dirname, "./router.js"));
var commons = require(p.resolve(__dirname, "./commons/server.container.methods.js"));
var logger = require(p.resolve(__dirname, "../libs/logger.js"));

// DEFINE CLASS
var esapp = function(rd){

    // CREATE AN EXPRESS APPLICATION
    var app = express();

    // ESPRESSO VARIABLES
    app._espresso = {

        id: process.pid.toString() + (new Date()).getTime().toString() + Math.random().toString().substring(2),
        name: null,
        version: null,
        descriptor: null,
        type: "application",
        parent: null,
        mountPath: null,
        root: null,
        workingDirectory: null,
        tempDirectory: null,
        childrenTable: [],
        config: {}

    };

    // BACKUP OLD .use()
    app._use = app.use;

    // EXTEND WITH ELEMENT COMMON METHODS
    app = _.extend(app, commons);

    // SET APP PROMISE AS BLUEBIRD PROMISE
    app.promise = bluebird.Promise;

    app._setName = function(name){

        if(x.isString(name))
            this._espresso.name = name;

        return this;

    };
    app._setVersion = function(version){

        if(x.isString(version) || x.isNumber(version))
            this._espresso.version = version.toString();

        return this;

    };
    app._setStack = function(stack){

        this._router.stack = stack;
        return this;

    };
    app.getStack = function(){

        return this._router.stack;

    };
    app.setRoot = function(root){

        this._espresso.root = root;
        return this;

    };

    // NON-CHAINABLE
    app.getRoot = function(){

        return this._espresso.root;

    },
    app.getEsaPath = function(){

        if(this.getRoot().match(/\.esa$/)){

            return this.getRoot();

        }else{

            return this.getRoot() + ".esa";

        }

    };
    app.getName = function(){

        return this._espresso.name;

    },
    app.getTempDirectory = function(){

        return this._espresso.tempDirectory;

    };
    app.getWorkingDirectory = function(){

        return this._espresso.workingDirectory;

    };

    // CHAINABLE
    app.setTempDirectory = function(path){

        this._espresso.tempDirectory = path;
        return this;

    };

    // PROMISES
    app.setWorkingDirectory = function(){

        var self = this;

        var promise = new app.promise(function(res,rej){

            // SET ESA VAR
            var esa = self.getEsaPath();

            // SEARCH FOR .ESA
            fs.exists(esa, function(exists){

                if(exists){

                    // SET .ESA TEMP DIRECTORY
                    var guid = process.pid + "_" + (new Date()).getTime() + "_" + Math.random().toString().substring(2);
                    app.setTempDirectory(p.normalize(p.resolve(p.resolve(app.getRoot(), ".."), guid)));

                    var unzip = require("unzip");

                    fs.createReadStream(esa)
                        .pipe(unzip.Extract({path:app.getTempDirectory()}))
                        .on("error", function(err){

                            throw err;

                        })
                        .on("close", function(){

                            app._espresso.workingDirectory = app.getTempDirectory();
                            res(app);

                        });

                }else{

                    app._espresso.workingDirectory = app.getRoot();
                    res(app);

                }

            });

        });

        return promise;

    };
    app.loadDescriptor = function(){

        var app = this;

        return this.setWorkingDirectory().then(function(wd){

            var promise = new app.promise(function(res,rej){

                // LOAD APPLICATION JSON
                app._setDescriptor(require(app.getWorkingDirectory() + "/application.json") || null);

                // SET APP NAME
                app._setName(app.getDescriptor().name);

                // SET APP VERSION
                app._setVersion(app.getDescriptor().version);

                // SET CONFIG
                app.setConfig(_.extend(require(p.resolve(__dirname, "../defaults/application.config.json")), app.getDescriptor().config || {}));

                // CREATE LOGGER
                if(espresso.config.log){

                    app.setConfig("logName", app.getName());
                    app.log = logger(app.getConfig());

                }

                // LOAD LOCALS
                if(app.getDescriptor().locals) require(p.resolve(__dirname, "../automations/applications/locals"))(app, app.getDescriptor().locals);

                // RESOLVE
                res(app)

            });

            return promise;

        })
        .catch(function(err){

            throw err;

        });

    };
    app.make = function(){

        var app = this;
        var promise = new app.promise(function(res,rej){

            var descriptor = app.getDescriptor();

            if(descriptor){

                espresso.log.info(app.getName(), "make starts");

                var promise = new app.promise(function(res,rej){

                    res();

                });

                // PRE-MAKE EXECUTION
                if(descriptor["pre-make"]) promise = require(p.resolve(__dirname, "../automations/applications/preMake"))(promise, app, descriptor["pre-make"]);

                // MAKE INIT

                    promise = promise.then(function(){

                        // SET APPLICATION ENGINES
                        require(p.resolve(__dirname, "../automations/applications/engines"))(app, app.getConfig("engines"));

                        // SET APPLICATION VIEWS DIRECTORY
                        if(app.getConfig("views")) app.set("views", p.normalize(p.resolve(app.getWorkingDirectory(), app.getConfig("viewsPath"))));

                        // USE EXPRESS STATIC (APPLICATION-LEVEL MIDDLEWARE)
                        if(app.getConfig("static")){

                            for(var path in app.getConfig("staticPaths")){

                                var absolutePath = p.normalize(p.resolve(app.getWorkingDirectory(), app.getConfig("staticPaths")[path]));
                                app.use(app.getConfig("staticRoute"), express.static(absolutePath, app.getConfig("staticOptions")));

                            }

                        }

                    });

                    // LOAD APPLICATION-LEVEL MIDDLEWARES
                    if(descriptor.middlewares) promise = require(p.resolve(__dirname, "../automations/applications/middlewares"))(promise, app, descriptor.middlewares);

                    // LOAD ROUTER
                    if(descriptor.router){

                        promise = promise.then(function(){

                            var promise = new app.promise(function(res,rej){ res() });
                            //var router = new Router(descriptor.router.options || {});

                            promise = require(p.resolve(__dirname, "../automations/applications/router"))(promise, app, app, "/", descriptor.router);

                            /*promise.then(function(){

                                app.deploy("/", router);

                            });*/

                            return promise;

                        });

                    }

                    // LOAD APPLICATION-LEVEL ERRORWARES
                    if(descriptor.errorwares) promise = require(p.resolve(__dirname, "../automations/applications/errorwares"))(promise, app, descriptor.errorwares);

                // MAKE ENDS

                // POST-MAKE EXECUTION
                if(descriptor["post-make"]) promise = require(p.resolve(__dirname, "../automations/applications/postMake"))(promise, app, descriptor["post-make"]);

                // MAKE-PROCESS ENDING
                promise.then(function(){

                    espresso.log.info(app.getName(), "make ends");
                    res(app);

                }).catch(function(err){

                    espresso.log.error(app.getName(), "make failed");
                    throw err;

                });

            }else{

                espresso.log.error(app.getName(), "make failed");
                throw "descriptor not loaded yet";

            }

        });

        return promise;

    };
    app.setLoadMake = function(){

        this.setWorkingDirectory()
        .then(function(app){

            return app.loadDescriptor()

        })
        .then(function(app){

            return app.make();

        });

    }

    // SET ROOT DIRECTORY IF IT WAS PROVIDED
    if(rd) app.setRoot(rd);

    // ADD APPLICATION ON ESPRESSO CONTAINERS TABLE
    espresso.containersTable.push(app);

    return app;

};

// EXPORTS MODULE
module.exports = esapp;
