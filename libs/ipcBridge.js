module.exports = function(main){

    this.main = main;
    this.processes = [];
    this.addProcess = function(proc){

        this.processes.push(proc);

    }

    var self = this;

    this.main.on("message", function(message){

        for(var i = 0; i < self.processes.length; i++){

            self.processes[i].send(message);

        }

    });

    return this;

};
