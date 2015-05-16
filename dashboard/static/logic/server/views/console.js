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

                    var command = $(e.currentTarget).val();

                    if(!this.model.get("workers"))
                        this.sendCommand(command)
                    else
                        this.sendClusterCommand(command);

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
        sendClusterCommand: function(command){

            var self = this;
            var workers = this.model.get("workers");

            for(var i = 0; i < workers.length; i++){

                $.ajax({

                    method:"post",
                    url: "./api/workers/" + workers[i] + "/repl",
                    data: JSON.stringify({command:command}),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(data){

                        self.updateClusterView(data.pid, command, data.output.replace(/\n/g, "<br>").replace(/\s/g, "&nbsp;"));

                    },
                    error: function(){

                        self.updateClusterView(data.pid, command, "command not executed due to a connection error");

                    }

                })

            }

        },
        updateClusterView: function(pid, command, text){

            this.$el.find("#" + pid + " .outputs-container").append("<div class=\"executed\"><strong>espresso: </strong>&nbsp;" + command + "</div>");
            this.$el.find("#command-input").val("");
            this.$el.find("#" + pid + " .outputs-container").append(text);
            this.$el.find("#" + pid + " .console-output").scrollTop(this.$el.find("#" + pid + " .console-output")[0].scrollHeight);

        },
        updateView: function(command, text){

            this.$el.find("#outputs-container").append("<div class=\"executed\"><strong>espresso: </strong>&nbsp;" + command + "</div>");
            this.$el.find("#command-input").val("");
            this.$el.find("#outputs-container").append(text);
            this.$el.find("#console-output").scrollTop(this.$el.find("#console-output")[0].scrollHeight);

        }

    });

});
