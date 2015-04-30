#!/usr/bin/env node
var program = require("commander");
var path = require("path");
var pkg = require( path.join(__dirname, 'package.json') );

program
    .version(pkg.version)
    .option("-c, --cluster", "it activates cluster mode <default false>")
    .option("-w --workers <workers>", "it defines the number of workers <default 0>")
    .option("-l --listen", "it chooses if listen to a port or not <default true>")
    .option("-p --port <port>", "it defines the port number to listen <default 8080>")
    .option("-m --main <main>", "it defines the position of main application relative to cwd <default \".\">")
    .option("-o --log", "it chooses if log or not <default true>")
    .parse(process.argv);

// GET OPTIONS
var options = require("./defaults/espresso.config.json");

// SET CLUSTER
if(program.cluster) options.cluster = program.cluster;
if(program.workers) options.workers = program.workers;
if(program.listen) options.listen = program.listen;
if(program.port) options.port = program.port;
if(program.main) options.main = program.main;
if(program.log) options.log = false;

require("./espresso.js")(options);
