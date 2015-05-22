#!/usr/bin/env node
var program = require("commander");
var path = require("path");
var pkg = require(path.join(__dirname, 'package.json'));
var _ = require("underscore");

program
    .version(pkg.version)
    .usage("[command] [options]");

program
    .command("server")
    .description("it runs your awsome web application")
        .option("-c, --cluster", "it activates cluster mode <default false>")
        .option("-w --workers <workers>", "it defines the number of workers <default 0>")
        .option("-l --listen", "it chooses if listen to a port or not <default true>")
        .option("-p --port <port>", "it defines the port number to listen <default 8080>")
        .option("-m --main <main>", "it defines the position of main application relative to cwd <default \".\">")
        .option("-o --log", "it chooses if log or not <default true>")
        .option("-r --repl", "it runs a REPL <default false>")
        .option("-d --dashboard", "it runs a beautiful dashboard <default false>")
        .option("-f --config-file <configFile>", "it defines the location of your configuration file")
        .option("-b --bare", "it chooses if you want to start a bare server or not")
    .action(function(options){

        var config = {};

        // CHECK OPTIONS
        if(options.configFile) config = _.extend(config, require(path.resolve(process.cwd(), options.configFile)) || {});
        if(options.cluster) config.cluster = options.cluster;
        if(options.workers) config.workers = options.workers;
        if(options.listen) config.listen = options.listen;
        if(options.port) config.port = options.port;
        if(options.main) config.main = path.resolve(process.cwd(), options.main);
        if(options.log) config.log = false;
        if(options.repl) config.log = false, require("repl").start("espresso: ");
        if(options.dashboardPort) config.dashboardPort = options.dashboardPort;
        if(options.bare) config.bare = true;

        // RUN IT
        new require("./espresso.js").server(config);

    });
program
    .command("log")
    .description("it shows the chosen log file in pretty style")
        .option("-f --file <file>", "it defines the name of log file <default: espresso>")
    .action(function(options){

        // RUN IT
        new require("./espresso.js").log(options);

    });

// PARSE ARGV
program.parse(process.argv);
