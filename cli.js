#!/usr/bin/env node
var program = require("commander");
var path = require("path");
var pkg = require( path.join(__dirname, 'package.json') );

program
    .version(pkg.version)
    .usage("espresso [command] [options]")
    .command("server")
    .description("it runs your awsome web application")
        .option("-c, --cluster", "it activates cluster mode <default false>")
        .option("-w --workers <workers>", "it defines the number of workers <default 0>")
        .option("-l --listen", "it chooses if listen to a port or not <default true>")
        .option("-p --port <port>", "it defines the port number to listen <default 8080>")
        .option("-m --main <main>", "it defines the position of main application relative to cwd <default \".\">")
        .option("-o --log", "it chooses if log or not <default true>")
        .option("-r --repl", "it runs a REPL <default false>")
    .action(function(options){

        // GET DEFAULTS
        var config = require("./defaults/server.config.json");

        // CHECK OPTIONS
        if(options.cluster) config.cluster = options.cluster;
        if(options.workers) config.workers = options.workers;
        if(options.listen) config.listen = options.listen;
        if(options.port) config.port = options.port;
        if(options.main) config.main = options.main;
        if(options.log) config.log = false;
        if(options.repl) config.log = false, require("repl").start("espresso: ");

        // RUN IT
        new require("./espresso.js").server(config);

    });

// PARSE ARGV
program.parse(process.argv);
