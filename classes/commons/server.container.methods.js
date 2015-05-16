// DEPENDENCIES
var p = require("path");
var fs = require("fs");
var _ = require("underscore");
var x = require("xtra");
var bluebird = require("bluebird");

// DEFINE MODULE
module.exports = {

    _unmount: function(child){

        var route = _.find(this.getStack(), function(route){

            return route.id === child.getId();

        });

        var stack = this.getStack();

        stack = _.reject(this.getStack(), function(item){

            return item === route;

        });

        this._setStack(stack);

        return this;

    },
    _addChild: function(mountPath, child){

        this._espresso.childrenTable.push({mountPath:mountPath,child:child});
        return this;

    },
    _removeChild: function(child){

        this._espresso.childrenTable = _.reject(this.getChildren(), function(item){

            return item.child === child;

        });

        return this;

    },
    _setParent: function(parent){

        this._espresso.parent = parent;
        return this;

    },
    _setMountPath: function(mountPath){

        this._espresso.mountPath = mountPath;
        return this;

    },
    _setDescriptor: function(descriptor){

        if(x.isObject(descriptor))
            this._espresso.descriptor = descriptor;

        return this;

    },
    _emptyStack: function(){

        var stack = this.getStack();

        for(var i = stack.length - 1; i >= 0; i--){

            if(stack[i].espresso){

                stack.splice(i, 1);

            }

        }

        this._setStack(stack);
        return this;

    },

    // NON-CHAINABLE
    getParent: function(){

        return this._espresso.parent;

    },
    getType: function(){

        return this._espresso.type;

    },
    getDescriptor: function(){

        return this._espresso.descriptor;

    },
    getId: function(){

        return this._espresso.id;

    },
    getMountPath: function(){

        return this._espresso.mountPath;

    },
    getChildren: function(){

        return this._espresso.childrenTable;

    },
    getConfig: function(attr){

        if(attr) return this._espresso.config[attr];
        else return this._espresso.config;

    },
    hasChild: function(child){

        var children = this.getChildren();

        for(var i = 0; i < children.length; i++){

            if(children[i].child === child){

                return true;
                break;

            }

        }

        return false;

    },
    isDeployed: function(){

        if(x.isFalsy(this.getParent()))
            return false;
        else
            return true;

    },
    getHierarchy: function(){

        var hierarchy = {};

        var recursive = function(entity){

            var obj = {};
            obj.type = entity.getType();
            if(obj.type == "application") obj.name = entity.getName();
            var children = entity.getChildren()

            if(children.length){

                obj.children = {};
                for(var i = 0; i < children.length; i++){

                    obj.children[children[i].mountPath] = recursive(children[i].child);

                }

            }

            return obj;

        }

        return JSON.stringify(recursive(this));

    },

    // CHAINABLE
    use: function(){

        this._use.apply(this, arguments);
        var stack = this.getStack();
        stack[stack.length - 1].espresso = true;

        return this;

    },
    setid: function(id){

        this._espresso.id = id;
        return this;

    },
    deploy: function(mountPath, child){

        if(!child.isDeployed()){

            var children = this.getChildren();
            for(var i = 0; i < children.length; i++){

                if(children[i].path === mountPath){

                    throw "there is already a container deployed in this path";
                    return this;

                }

            }

            var self = this;

            if(child.getType() === "application"){

                espresso.log.info(this.getName(), "deploys", child.getName(), "on", '"' + mountPath + '"', "route");

                // WATCHER
                if(child.getConfig("watch")){

                    this.watch(child);

                }

            }

            // USE CHILD
            self.use(mountPath, child);

            // SET REFERENCES
            self.getStack()[self.getStack().length - 1].id = child.getId();
            child._setParent(self)._setMountPath(mountPath);
            self._addChild(mountPath, child);

        }else{

            espresso.log.error(child.getName(), "already deployed");
            throw "container already deployed";

        }

        return this;

    },
    undeploy: function(child){

        if(this.hasChild(child)){

            if(child.getType() === "application"){

                espresso.log.info(this.getName(), "undeploys", child.getName());

                // CLEAN CACHE
                for(var path in require.cache){

                    if(path.match("^" + child.getWorkingDirectory())){

                        delete require.cache[path];

                    }

                }

            }

            // GET id
            var id = child._espresso.id;

            // REMOVE FROM PARENT ROUTER
            this._unmount(child);

            // REMOVE REFERENCES
            child._setParent(null)._setMountPath(null);
            this._removeChild(child);


        }else{

            espresso.log.error(this.getName(), "doesn't have this child");

        }

        return this;

    },
    undeployAll: function(){

        var children = this.getChildren();

        for(var i = children.length - 1; i >= 0; i--){

            this.undeploy(children[i].child);

        }

        return this;

    },
    switch: function(current, candidate){

        if(this.hasChild(current) && !candidate.isDeployed()){

            mountPath = current.getMountPath();
            this.undeploy(current).deploy(mountPath, candidate);

        }else{

            espresso.log.error(this.getName(), "can't switch these containers");
            throw "I can't switch these containers";

        }

        return this;

    },
    empty: function(){

        espresso.log.info("empty", this.getName());

        try{

            this.init();

        }catch(e){

            // DO NOTHING

        }finally{

            this.undeployAll()._emptyStack();

        }

        return this;

    },
    setConfig: function(){

        if(arguments.length > 1 && x.isString(arguments[0])){

            this._espresso.config[arguments[0]] = arguments[1];

        }else if(arguments.length === 1 && x.isObject(arguments[0])){

            this._espresso.config = arguments[0];

        }

        return this;

    },
    watch: function(child){

        var self = this;

        setTimeout(function(){

            fs.watchFile(child.getEsaPath(), function(curr, prev){

                fs.unwatchFile(child.getEsaPath());

                require(p.resolve(__dirname, "../application"))(child.getRoot())
                .loadDescriptor()
                .then(function(app){

                    return app.make()

                }).then(function(app){

                    self.switch(child, app);
                    return app;

                }).catch(function(err){

                    espresso.log.error(self.getName(), "fails", child.getName(), "automatic deploy");
                    self.watch(child);

                });

            });

        }, child.getConfig("watchDelay"));

        return this;

    }

};
