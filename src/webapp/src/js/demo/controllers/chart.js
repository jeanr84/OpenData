(function () {
  'use strict';

  angular
    .module('material-lite')
    .controller('ChartController', ['$scope', 'mlSelectCritereService', ChartController]);

  function ChartController($scope, mlSelectCritereService) {
    function x(d) {
      return d.ins;
    }

    function y(d) {
      return d.revenuMed;
    }

    function radius(d) {
      return d.pourcentageIm;
    }

    function color(d) {
      return d.color;
    }

    function key(d) {
      return d.nomR;
    }

    var container =  d3.select("#d3_chart").node().getBoundingClientRect();

    // Chart dimensions.
    var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
      width = container.width - margin.right * 5,
      height = 300;

    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.linear().domain([100000, 8000000]).range([0, width]),//TODO : A CHANGER
      yScale = d3.scale.linear().domain([0, 300000]).range([height, 0]),// TODO: A CHANGER
      radiusScale = d3.scale.sqrt().domain([0, 100]).range([0, 40]),
      colorScale = d3.scale.category10();

    // The x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(8, d3.format(",d")),
      yAxis = d3.svg.axis().scale(yScale).orient("left");

    // Create the SVG container and set the origin.
    var svg = d3.select("#d3_chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the x-axis.
    svg.append("g")
      .attr("class", "x d3_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the y-axis.
    svg.append("g")
      .attr("class", "y d3_axis")
      .call(yAxis);

    // Add an x-axis label.
    svg.append("text")
      .attr("class", "x d3_label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .text("Nombre d'inscrits");

    // Add a y-axis label.
    svg.append("text")
      .attr("class", "y d3_label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("RevenuMed");                       //TODO : A CHANGER

    // Load the data.



      d3.json('http://localhost:3000/region', function(regions) {

        // A bisector since many nation's data is sparsely-defined.
        var bisect = d3.bisector(function (d) {
          return d[0];
        });

        // Add a dot per nation. Initialize the data at 1800, and set the colors.
        var dot = svg.append("g")
          .attr("class", "dots")
          .selectAll(".dot")
          .data(interpolateData())
          .enter().append("circle")
          .attr("class", "d3_dot")
          .style("fill", function (d) {
            return colorScale(color(d));
          })
          .call(position)
          .sort(order);

        // Add a title.
        dot.append("title")
          .text(function (d) {
            return d.nomR;
          });

        // Positions the dots based on data.
        function position(dot) {
          dot.attr("cx", function (d) {
              return xScale(x(d));
            })
            .attr("cy", function (d) {
              return yScale(y(d));
            })
            .attr("r", function (d) {
              return radiusScale(radius(d));
            });
        }

        function interpolateData() {
          return regions.map(function (d) {
            return {
              nomR : d.nomR,
              color : "#333",
              pourcentageIm : d.pourcentageIm,
              revenuMed : d.revenuMed,
              ins : d.ins
            };
          });
        }

        // Defines a sort order so that the smallest dots are drawn on top.
        function order(a, b) {
          return radius(b) - radius(a);
        }


        /*
         var deps = response.data.deps,
         returnValue = [],
         l = deps.length;
         for (var i = 0; i < l; i++) {
         returnValue.push(deps[i].dep);
         }

         return returnValue;
         */
      }, function errorCallback(response) {
        console.error(response);



      });
  }
})();

