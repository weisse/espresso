// REQUIREMENTS
var p = require("path");
var server = require(p.resolve(__dirname, "./classes/server"));
var logger = require(p.resolve(__dirname, "./libs/logger"));
var cluster = require("cluster");
var ipcBridge = require(p.resolve(__dirname, "./libs/ipcBridge"));

if(!cluster.isMaster){

    process.on("message", function(msg){

        if(msg.type && msg.type === "init"){

            // START SERVER
            new server(msg.payload);

            // IPC INTERFACE
            require(p.resolve(__dirname, "./IPCs/server-worker.js"));

        }

    });

}

process.on("message", function(msg){

    if(msg.type && msg.type === "init"){

        var config = msg.payload;
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
                    if(config.forever) cluster.fork();

                });

                // SET NUMBER OF WORKERS
                if(config.workers) workers = config.workers;
                else workers = require('os').cpus().length - 1;

                // CREATE WORKERS
                for(var i = 0; i < workers; i++){

                    var worker = cluster.fork();
                    worker.send(msg);

                }

                // IPC INTERFACE
                require(p.resolve(__dirname, "./IPCs/server-master.js"));

            }

        }else{

            // START SERVER
            new server(config);

            // IPC INTERFACE
            require(p.resolve(__dirname, "./IPCs/server-single.js"));

        }

    }

});
