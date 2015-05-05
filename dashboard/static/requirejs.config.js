requirejs.config({

    baseUrl: "./logic",
    paths: {

        app: "app",
        text: "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",

        // SERVER
        serverRouter: "./server/router",
        serverWrapper: "./server/views/wrapper",
        serverDashboard: "./server/views/dashboard",
        serverConsole: "./server/views/console"

    }

});

_init();
