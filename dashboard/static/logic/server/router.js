define(["require"], function(require){

    var activateLink = function(name){

        $("li.active").removeClass("active");
        $("li:has([href='#" + name + "'])").addClass("active");

    };

    return function(app, wrapper, options){

        var router = Backbone.Router.extend({

            "routes": {

                "": function(){

                    window.location.hash = "dashboard";

                },
                "dashboard":function(){

                    activateLink("dashboard");
                    require(["serverDashboard"], function(dashboard){

                        var view = new dashboard;
                        wrapper.pageRegion.show(view);

                    });

                },
                "console":function(){

                    activateLink("console");
                    require(["serverConsole"], function(console){

                        var view = new console;
                        wrapper.pageRegion.show(view);

                    });

                }

            }

        });

        return new router(options);

    };

});
