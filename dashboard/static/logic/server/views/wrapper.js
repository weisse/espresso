define(["text!./server/templates/wrapper.template"], function(template){

    return Marionette.LayoutView.extend({

        template:template,
        regions: {

            pageRegion: "#page-container"

        }

    });

});
