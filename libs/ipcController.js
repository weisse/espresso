module.exports = function(){

    this.handlers = [];
    this.listeners = [];
    this.handle = function(name, cb){

        this.handlers.push({name:name,callback:cb});
        return this;

    };
    this.listen = function(name, id, cb){

        this.listeners.push({name:name,id:id,callback:cb});
        return this;

    };
    this.listenOnce = function(name, id, cb){

        this.listeners.push({name:name,id:id,callback:cb,once:true});
        return this;

    };
    this.send = function(name, payload){

        var id = Math.random().toString().substring(2);

        process.send({

            type:"request",
            name:name,
            id:id,
            payload:payload

        });

        return id;

    };
    this.reply = function(name, id, payload){

        process.send({

            type:"response",
            name:name,
            id:id,
            payload:payload

        });

        return this;

    };
    this.receive = function(msg){

        if(msg.type === "request"){

            for(var i = 0; i < this.handlers.length; i++){

                if(this.handlers[i].name === msg.name){

                    this.handlers[i].callback(msg.id, msg.payload);

                }

            }

        }else if(msg.type === "response"){

            for(var i = 0; i < this.listeners.length; i++){

                if(this.listeners[i].name === msg.name && this.listeners[i].id === msg.id){

                    this.listeners[i].callback(msg.payload);
                    if(this.listeners[i].once){

                        this.listeners.splice(i, 1);
                        i--;

                    }

                }

            }

        }

        return this;

    };
    this.unlistenById = function(id){

        for(var i = 0; i < this.listeners.length; i++){

            if(this.listeners[i].id === id){

                this.listeners.splice(i, 1);
                return this;

            }

        }

    };

    var self = this;

    process.on("message", function(msg){

        self.receive(msg);

    });

    return this;

};
