define(["text!./server/templates/dashboard.template"], function(template){

    return Marionette.LayoutView.extend({

        className:"row",
        template:template,
        onRender: function(){

            var self = this;

            var insertValue = function(chart, dataset, value){

                var points = chart.datasets[dataset].points;
                var newPoints = [];

                for(var i = 1; i < points.length; i++){

                    newPoints.push(points[i].value);

                }

                newPoints.push(value);

                for(var i = 0; i < newPoints.length; i++){

                    points[i].value = newPoints[i];

                }

            }

            setTimeout(function(){

                var ctx = document.getElementById("myChart").getContext("2d");
                var data = {
                    labels: ["+10s", "+9s", "+8s", "+7s", "+6s", "+5s", "+4s", "+3s", "+2s", "+1s", ""],
                    datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: [null,null,null,null,null,null,null,null,null,null,null]
                        },
                        {
                            label: "My Second dataset",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: [null,null,null,null,null,null,null,null,null,null,null]
                        }
                    ]
                };
                var options = {

                    bezierCurve : false,
                    scaleShowVerticalLines: false,

                }
                var myLineChart = new Chart(ctx).Line(data, options);

                self.interval = setInterval(function(){

                    $.get("/api/usage", function(data){

                        var mem = (data.memory * 100) / data.memoryInfo.vsize;
                        var cpu = data.cpu;
                        insertValue(myLineChart, 0, value);
                        insertValue(myLineChart, 1, value);
                        myLineChart.update();

                    }, "json");



                }, 1000);

            }, 500);

        },
        onDestroy: function(){

            clearInterval(this.interval);

        }

    });

});
