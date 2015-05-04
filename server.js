// REQUIREMENTS
var p = require("path");
var server = require(p.resolve(__dirname, "./classes/server"));
var logger = require(p.resolve(__dirname, "./libs/logger"));
var cluster = require('cluster');

if(!cluster.isMaster){

    process.on("message", function(config){

        new server(config);

    });

}

process.on("message", function(config){

    log = logger(config);

    if(config.cluster){

        var self = this;

        if(cluster.isMaster){

            log.info("cluster mode activated");

            var workers;

            // NOTICE CLUSTER FORK
            cluster.on("fork", function(worker){

                log.info("worker " + worker.process.pid + " created");

            });

            // NOTICE WORKER DIE
            cluster.on("exit", function(worker, code, signal){

                log.info("worker " + worker.process.pid + " died");
                if(self.config.forever) cluster.fork();

            });

            // SET NUMBER OF WORKERS
            if(self.config.workers) workers = self.config.workers;
            else workers = require('os').cpus().length - 1;

            // CREATE WORKERS
            for(var i = 0; i < workers; i++) cluster.fork().send(config);

        }

    }else{

        new server(config);

    }

});
