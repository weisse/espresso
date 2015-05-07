// REQUIREMENTS
var p = require("path");
var util = require("util");
var metrics = require("metrics-os");
var ipcController = require(p.resolve(__dirname, "../libs/ipcController.js"));

// IPC CONTROLLER
espresso.ipc = new ipcController();


espresso.ipc.handle("echo", function(id, payload){

    espresso.ipc.reply(id, payload);

});

// PROCESS
espresso.ipc.handle("process", function(id, payload){

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
        memoryUsage: process.memoryUsage()

    }

    espresso.ipc.reply(id, JSON.stringify(proc));

});
espresso.ipc.handle("process-short", function(id, payload){

    var proc = {

        pid: process.pid,
        title: process.title,
        arch: process.arch,
        platform: process.platform,
        version: process.version,
        uptime: process.uptime(),
        hrtime: process.hrtime(),
        cwd: process.cwd(),
        memoryUsage: process.memoryUsage()

    }

    espresso.ipc.reply(id, JSON.stringify(proc));

});

// CONSOLE
espresso.ipc.handle("repl", function(id, command){

    var reply = new Object;

    try{

        reply.output = util.format(eval.call(espresso, command));

    }catch(e){

        reply.output = util.format(e.stack);

    }

    espresso.ipc.reply(id, JSON.stringify(reply));

});
espresso.ipc.handle("usage", function(id, payload){

    espresso.ipc.reply(id, JSON.stringify(metrics()));

});
