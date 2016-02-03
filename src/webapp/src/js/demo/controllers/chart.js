(function () {
  'use strict';

  angular
    .module('material-lite')
    .controller('ChartController', ['$scope', 'mlSelectCritereService', ChartController]);

  function ChartController($scope, mlSelectCritereService) {
    function x(d) {
      return d.income;
    }

    function y(d) {
      return d.lifeExpectancy;
    }

    function radius(d) {
      return d.population;
    }

    function color(d) {
      return d.region;
    }

    function key(d) {
      return d.name;
    }

    var container =  d3.select("#d3_chart").node().getBoundingClientRect();

    // Chart dimensions.
    var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
      width = container.width - margin.right * 5,
      height = 300;

    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.log().domain([300, 1e5]).range([0, width]),
      yScale = d3.scale.linear().domain([10, 85]).range([height, 0]),
      radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]),
      colorScale = d3.scale.category10();

    // The x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
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
      .text("income per capita, inflation-adjusted (dollars)");

    // Add a y-axis label.
    svg.append("text")
      .attr("class", "y d3_label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("life expectancy (years)");

    // Load the data.
    d3.json("nations.json", function (nations) {

      // A bisector since many nation's data is sparsely-defined.
      var bisect = d3.bisector(function (d) {
        return d[0];
      });

      // Add a dot per nation. Initialize the data at 1800, and set the colors.
      var dot = svg.append("g")
        .attr("class", "dots")
        .selectAll(".dot")
        .data(interpolateData(2005))
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
          return d.name;
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

      // Defines a sort order so that the smallest dots are drawn on top.
      function order(a, b) {
        return radius(b) - radius(a);
      }

      // Interpolates the dataset for the given (fractional) year.
      function interpolateData(year) {
        return nations.map(function (d) {
          return {
            name: d.name,
            region: d.region,
            income: interpolateValues(d.income, year),
            population: interpolateValues(d.population, year),
            lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
          };
        });
      }

      // Finds (and possibly interpolates) the value for the specified year.
      function interpolateValues(values, year) {
        var i = bisect.left(values, year, 0, values.length - 1),
          a = values[i];
        if (i > 0) {
          var b = values[i - 1],
            t = (year - a[0]) / (b[0] - a[0]);
          return a[1] * (1 - t) + b[1] * t;
        }
        return a[1];
      }
    });
  }
})();

