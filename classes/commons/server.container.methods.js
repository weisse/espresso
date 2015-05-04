// DEPENDENCIES
var p = require("path");
var fs = require("fs");
var _ = require("underscore");
var x = require("xtra");
var bluebird = require("bluebird");

// DEFINE MODULE
module.exports = {

    getType: function(){

        return this._espresso.type;

    },
    getParent: function(){

        return this._espresso.parent;

    },
    setParent: function(parent){

        this._espresso.parent = parent;
        return this;

    },
    getId: function(){

        return this._espresso.id;

    },
    setid: function(id){

        this._espresso.id = id;
        return this;

    },
    getMountPath: function(){

        return this._espresso.mountPath;

    },
    setMountPath: function(mountPath){

        this._espresso.mountPath = mountPath;
        return this;

    },
    getChildrenTable: function(){

        return this._espresso.childrenTable;

    },
    addChild: function(mountPath, child){

        this._espresso.childrenTable.push({mountPath:mountPath,child:child});
        return this;

    },
    removeChild: function(child){

        this._espresso.childrenTable = _.reject(this.getChildrenTable(), function(item){

            return item.child === child;

        });

        return this;

    },
    deploy: function(mountPath, child){

        var self = this;

        if(child.getType() === "application"){

            self.log.info("deploy", child.get("name"));

            // WATCHER
            if(child.getConfig("watch")){

                setTimeout(function(){

                    fs.watchFile(child.getEP(), function(curr, prev){

                        fs.unwatchFile(child.getEP());
                        require(p.resolve(__dirname, "../application"))(child.get("rd")).make().then(function(app){

                            self.undeploy(child);
                            return app;

                        }).then(function(app){

                            self.deploy(child._espresso.mountPath, app);
                            return app;

                        });

                    });

                }, child.getConfig("watchDelay"));

            }

        }

        // USE CHILD
        self.use(mountPath, child);

        // SET REFERENCES
        self.getStack()[self.getStack().length - 1].id = child.getId();
        child.setParent(self).setMountPath(mountPath);
        self.addChild(mountPath, child);

        return this;

    },
    unmount: function(child){

        var route = _.find(this.getStack(), function(route){

            return route.id === child.getId();

        });

        var stack = this.getStack();

        stack = _.reject(this.getStack(), function(item){

            return item === route;

        });

        this.setStack(stack);

        return this;

    },
    undeploy: function(child){

        if(child.getType() === "application"){

            this.log.info("undeploy", child.get("name"));

            // CLEAN CACHE
            for(var path in require.cache){

                if(path.match("^" + child.get("wd"))){

                    delete require.cache[path];

                }

            }

        }

        // GET id
        var id = child._espresso.id;

        // REMOVE FROM PARENT ROUTER
        this.unmount(child);

        // REMOVE FROM PARENT TABLE
        this.removeChild(child);

        return this;

    },
    getConfig: function(attr){

        if(attr) return this._espresso.config[attr];
        else return this._espresso.config;

    },
    setConfig: function(){

        if(arguments.length > 1 && x.isString(arguments[0])){

            this._espresso.config[arguments[0]] = arguments[1];

        }else if(arguments.length === 1 && x.isObject(arguments[0])){

            this._espresso.config = arguments[0];

        }

        return this;

    },
    getRoot: function(){

        var root = this;
        var current = this;

        while(current){

            current = current.getParent();
            if(current) root = current;

        }

        return root;

    },
    getHierarchy: function(){

        var root = this.getRoot();
        var hierarchy = {};

        var recursive = function(entity){

            var obj = {};
            obj.type = entity.getType();
            if(obj.type == "application") obj.name = entity.get("name");
            var children = entity.getChildrenTable()

            if(children.length){

                obj.children = {};
                for(var i = 0; i < children.length; i++){

                    obj.children[children[i].mountPath] = recursive(children[i].child);

                }

            }

            return obj;

        }

        return JSON.stringify(recursive(root));

    }

};
