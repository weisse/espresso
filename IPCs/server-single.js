// REQUIREMENTS
var p = require("path");
var ipcController = require(p.resolve(__dirname, "../libs/ipcController.js"));

// IPC CONTROLLER
espresso.ipc = new ipcController;
espresso.ipc.handle("test", function(id, payload){

    espresso.ipc.reply("test", id, payload);

});
