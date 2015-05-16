define(["require"], function(require){

    var activateLink = function(name){

        $("li.active").removeClass("active");
        $("li:has([href='#" + name + "'])").addClass("active");

    };

    return function(app, wrapper, options){

        var router = Backbone.Router.extend({

            "routes": {

                "": function(){

                    window.location.hash = "metrics";

                },
                "metrics":function(){

                    activateLink("metrics");
                    require(["serverMetrics"], function(metrics){

                        var view = new metrics;
                        wrapper.pageRegion.show(view);

                    });

                },
                "console":function(){

                    activateLink("console");
                    require(["serverConsole"], function(console){

                        var process = new Backbone.Model();
                        var view = new console({model:process});
                        process.fetch({url:"/api/process-short", success: function(){

                            wrapper.pageRegion.show(view);

                        }});

                    });

                }

            }

        });

        return new router(options);

    };

});
