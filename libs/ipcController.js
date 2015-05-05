// REQUIREMENTS
var x = require("xtra");

module.exports = function(options){

    this.handlers = [];
    this.listeners = [];
    this.timeout = 10000;
    this.handle = function(name, cb){

        this.handlers.push({name:name,callback:cb});
        return this;

    };
    this.listen = function(name, id, cb){

        var listener = {

            name: name,
            id: id,
            callback: cb

        };

        this.listeners.push(listener);

        var self = this;
        listener.timeout = function(cb, exp){

            setTimeout(function(){

                if(self.unlistenById(id)){

                    cb();

                }

            }, exp || self.timeout);

        }

        return listener;

    };
    this.send = function(name, payload){

        var message = {

            type: "message",
            id: Math.random().toString().substring(2),
            name: name,
            payload: payload

        };

        process.send(message);
        var self = this;

        message.listen = function(cb){

            return self.listen(message.name, message.id, cb);

        };

        return message;

    };
    this.reply = function(name, id, payload){

        var reply = {

            type: "reply",
            name: name,
            id: id,
            payload: payload

        }

        process.send(reply);
        return this;

    };
    this.receive = function(msg){

        if(msg.type === "message"){

            for(var i = 0; i < this.handlers.length; i++){

                if(this.handlers[i].name === msg.name){

                    this.handlers[i].callback(msg.id, msg.payload);

                }

            }

        }else if(msg.type === "reply"){

            for(var i = 0; i < this.listeners.length; i++){

                if(this.listeners[i].name === msg.name && this.listeners[i].id === msg.id){

                    this.listeners[i].callback(msg.payload);
                    this.listeners.splice(i, 1);
                    i--;
                    break;

                }

            }

        }

        return this;

    };
    this.unlistenById = function(id){

        for(var i = 0; i < this.listeners.length; i++){

            if(this.listeners[i].id === id){

                this.listeners.splice(i, 1);
                return true;

            }

        }

        return false;

    };

    // SETTINGS
    if(!x.isUndefined(options)){

        if(!x.isUndefined(options.timeout) && x.isNumber(options.timeout)){

            this.timeout = options.timeout;

        }

        if(!x.isUndefined(options.handlers) && x.isArray(options.handlers)){

            for(var i = 0; i < options.handlers.length; i++){

                if(
                    x.isObject(options.handlers[i]) &&
                    x.isString(options.handlers[i].name) &&
                    x.isFunction(options.handlers[i].callback)
                ){

                    this.handle(options.handlers[i].name, options.handlers[i].callback);

                }

            }

        }

    }

    var self = this;

    process.on("message", function(msg){

        self.receive(msg);

    });

    return this;

};
