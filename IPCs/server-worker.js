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

// CONSOLE
ipc.handle("repl", function(id, obj){

    var reply = new Object;

    try{

        reply.output = util.format(eval.call(GLOBAL, obj.command));

    }catch(e){

        reply.output = util.format(e.stack);

    }

    ipc.reply(id, JSON.stringify(reply));

});
