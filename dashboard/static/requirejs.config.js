requirejs.config({

    baseUrl: "./logic",
    paths: {

        app: "app",
        text: "../vendor/text",

        // SERVER
        serverRouter: "./server/router",
        serverWrapper: "./server/views/wrapper",
        serverMetrics: "./server/views/metrics",
        serverConsole: "./server/views/console"

    }

});

_init();
