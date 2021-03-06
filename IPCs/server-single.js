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
        workers: []

    }

    ipc.reply(id, JSON.stringify(proc));

});
ipc.handle("process-short", function(id, payload){

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
        workers: x.size(cluster.workers)

    }

    ipc.reply(id, JSON.stringify(proc));

});

// CONSOLE
ipc.handle("repl", function(id, obj){

    var reply = new Object;
    var obj = JSON.parse(obj);

    try{

        reply.output = util.format(eval.call(GLOBAL, obj.command));

    }catch(e){

        reply.output = util.format(e.stack);

    }

    ipc.reply(id, JSON.stringify(reply));

});
ipc.handle("usage", function(id, payload){

    ipc.reply(id, JSON.stringify(metrics()));

});
