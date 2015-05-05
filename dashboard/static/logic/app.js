define(["require"], function(require){

    var app = new Marionette.Application();
    app.addRegions({

        bodyRegion: "body"

    });
    app.addInitializer(function(){

        require(["serverRouter", "serverWrapper"], function(router, wrapper){

            var wrapper = new wrapper();
            app.bodyRegion.show(wrapper);
            router(app, wrapper);
            Backbone.history.start();

        });

    });

    return app;

});
