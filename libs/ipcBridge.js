module.exports = function(main){

    this.main = main;
    this.processes = [];
    this.addProcess = function(proc){

        this.processes.push(proc);
        return this;

    };
    this.removeProcess = function(proc){

        for(var i = 0; i < this.processes.length; i++){

            if(this.processes[i] === proc){

                this.processes.splice(i, 1);

            }

        }

        return this;

    };

    var self = this;

    this.main.on("message", function(message){

        for(var i = 0; i < self.processes.length; i++){

            self.processes[i].send(message);

        }

    });

    return this;

};
