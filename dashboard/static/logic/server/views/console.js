define([

    "text!./server/templates/console.template"

], function(template){

    return Marionette.ItemView.extend({

        template:template,
        onRender: function(){

            var self = this;

            setTimeout(function(){

                self.$el.find("#command-input").focus();

            }, 100);

        },
        events: {

            "keyup #command-input": function(e){

                if(e.which === 13){

                    this.sendCommand($(e.currentTarget).val())

                }

            },
            /*"click #console": function(){

                this.$el.find("#command-input").focus();

            }*/

        },
        sendCommand: function(command){

            var self = this;

            $.ajax({

                method:"post",
                url: "./api/exec",
                data: JSON.stringify({command:command}),
                contentType: "application/json",
                dataType: "json",
                success: function(data){

                    self.$el.find("#outputs-container").append("<div class=\"executed\"><strong>espresso: </strong>&nbsp;" + command + "</div>");
                    self.$el.find("#outputs-container").append(data.output.replace(/\n/g, "<br>").replace(/\s/g, "&nbsp;"));
                    self.$el.find("#command-input").val("");
                    self.$el.find("#console").scrollTop(self.$el.find("#console")[0].scrollHeight);

                },
                error: function(){

                    self.$el.find("#outputs-container").append("<div class=\"executed\"><strong>espresso: </strong>&nbsp;" + command + "</div>");
                    self.$el.find("#outputs-container").append("command not executed due to a connection error");
                    self.$el.find("#command-input").val("");
                    self.$el.find("#console").scrollTop(self.$el.find("#console")[0].scrollHeight);

                }

            });

        }

    });

});
