// REQUIREMENTS
var p = require("path");
var util = require("util");
var metrics = require("metrics-os");
var ipcController = require(p.resolve(__dirname, "../libs/ipcController.js"));
var cluster = require("cluster");
var x = require("xtra");

// IPC CONTROLLER
var ipc = new ipcController();

ipc.handle("echo", function(id, payload){

    ipc.reply(id, payload);

});

// PROCESS
ipc.handle("process", function(id, payload){

    var workers = [];

    for(var proc in cluster.workers)
        workers.push(cluster.workers[proc].process.pid);

    var proc = {

        pid: process.pid,
        title: process.title,
        arch: process.arch,
        platform: process.platform,
        version: process.version,
        config: process.config,
        uptime: process.uptime(),
        hrtime: process.hrtime(),
        cwd: process.cwd(),
        env: process.env,
        argv: process.argv,
        memoryUsage: process.memoryUsage(),
        isMaster: cluster.isMaster,
        workers: workers

    }

    ipc.reply(id, JSON.stringify(proc));

});
ipc.handle("process-short", function(id, payload){

    var workers = [];

    for(var proc in cluster.workers)
        workers.push(cluster.workers[proc].process.pid);

    var proc = {

        pid: process.pid,
        title: process.title,
        arch: process.arch,
        platform: process.platform,
        version: process.version,
        uptime: process.uptime(),
        hrtime: process.hrtime(),
        cwd: process.cwd(),
        memoryUsage: process.memoryUsage(),
        isMaster: cluster.isMaster,
        workers: workers

    }

    ipc.reply(id, JSON.stringify(proc));

});

// CONSOLE
ipc.handle("repl", function(id, obj){

    var worker;
    var obj = JSON.parse(obj);

    for(var proc in cluster.workers){

        if(cluster.workers[proc].process.pid == obj.pid){

            worker = cluster.workers[proc];

        }

    }

    if(worker){

        ipc.send("repl", obj, worker)
            .listen(function(payload){

                var payload = JSON.parse(payload);
                payload.pid = worker.process.pid;
                ipc.reply(id, JSON.stringify(payload));

            })
            .timeout(function(){

                ipc.reply(id, "failed!");

            });

    }else{

        ipc.reply(id, "failed!");

    }

});
