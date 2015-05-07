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
                url: "./api/repl",
                data: JSON.stringify({command:command}),
                contentType: "application/json",
                dataType: "json",
                success: function(data){

                    self.updateView(command, data.output.replace(/\n/g, "<br>").replace(/\s/g, "&nbsp;"));

                },
                error: function(){

                    self.updateView(command, "command not executed due to a connection error");

                }

            });

        },
        updateView: function(command, text){

            this.$el.find("#outputs-container").append("<div class=\"executed\"><strong>espresso: </strong>&nbsp;" + command + "</div>");
            this.$el.find("#command-input").val("");
            this.$el.find("#outputs-container").append(text);
            this.$el.find("#console").scrollTop(this.$el.find("#console")[0].scrollHeight);

        }

    });

});
