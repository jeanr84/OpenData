(function () {
  'use strict';

  angular
    .module('material-lite')
    .service('ChartUpdateService', ChartUpdateService)
    .controller('ChartController', ['$scope', '$http', 'ChartUpdateService', 'mlSvgMapService', ChartController]);
  function ChartUpdateService() {
    var axis_Y = null;

    this.tabReg = [];

    this.setYAxis = function(axis) {
      axis_Y = axis;
    };

    this.setYAxisLabel = function(label) {
      axis_Y.text(label.selected.name + ' ' + label.selected.unit);
    };

  }

  function ChartController($scope, $http, ChartUpdateService, mlSvgMapService) {
    function x(d) {
      return d.pourcentageParti * 100;
    }

    function y(d) {
      return d.tauxChomage;
    }

    function radius(d) {
      return d.ins;
    }

    function color(d) {
      return d.color;
    }

    function key(d) {
      return d.nom;
    }

    var container = d3.select("#d3_chart").node().getBoundingClientRect();

    // Chart dimensions.
    var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
      width = container.width - margin.right * 5,
      height = 300;

    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.linear().domain([0, 60]).range([0, width]),//TODO : A CHANGER
      yScale = d3.scale.linear().domain([0, 30]).range([height, 0]),// TODO: A CHANGER
      radiusScale = d3.scale.sqrt().domain([0, 8e6]).range([0, 40]),
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
      .text("Pourcentage du parti");

    // Add a y-axis label.
    ChartUpdateService.setYAxis(svg.append("text")
      .attr("class", "y d3_label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)"));

    // Load the data.

    var tabJSON = [];
    $scope.updateService = ChartUpdateService;

    $scope.$watch("updateService.tabReg", function (newV, oldV) {
      if (newV) {
        tabJSON = [];
        if (mlSvgMapService.isInDetailMode()) {
          newV.forEach(createDepJSON);
        } else {
            createRegJSON();
        }
      }
    }, true);

    function createDepJSON(element, index, array) {
      var regJSON = $http.get('http://localhost:3000/departement/' + element.substring(3) + '/LFN')
        .then(function successCallback(response) {
          $scope.response = response;
        }, function errorCallback(response) {
          console.error(response);
        });
    }

    function createRegJSON() {
      var regJSON = $http.get('http://localhost:3000/region/parti/LFN')
        .then(function successCallback(response) {
          console.log(response.data);
          $scope.response = response;
        }, function errorCallback(response) {
          console.error(response);
        });
    }



    $scope.$watch("response", function (newV, oldV) {
      if (newV) {
        tabJSON = tabJSON.concat(newV.data);
        draw(tabJSON);
      }
    });




    function draw(regions) {
      console.log(regions);

      d3.selectAll("svg g.dots").remove();

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
          return d.nom;
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
            nom: d.nom,
            color: "#333",
            pourcentageIm: d.pourcentageIm,
            revenuMed: d.revenuMed,
            tauxChomage: d.tauxChom,
            ins: d.ins,
            pourcentageParti: d.liste[0].pourcentage
          };
        });
      }

      // Defines a sort order so that the smallest dots are drawn on top.
      function order(a, b) {
        return radius(b) - radius(a);
      }

    }

  }
})();

