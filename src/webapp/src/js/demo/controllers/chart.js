(function () {
  'use strict';

  angular
    .module('material-lite')
    .service('ChartUpdateService', ChartUpdateService)
    .controller('ChartController', ['$scope', '$http', 'ChartUpdateService', 'mlSvgMapService', ChartController]);
  function ChartUpdateService() {
    var axis_Y = null;
    var svg = null;
    var h = null;

    this.criteria = { name: 'Taux de chômage', unit: '(en pourcentage)', nomMongo: 'tauxChom'};
    this.tabReg = [];
    this.party = {_id: "LFN", nomL: "Front National"};

    this.setYAxis = function (axis) {
      axis_Y = axis;
    };

    this.setYScale = function (_svg, height) {
      svg = _svg;
      h = height;
    };

    this.yScale = function (d) {
      return this.ys(d);
    };

    this.setYAxisLabel = function (label) {
      this.criteria = label.selected;
      axis_Y.text(label.selected.name + ' ' + label.selected.unit);
    };

    this.changeScale = function (min, max) {
      d3.select("svg .y.d3_axis").remove();
      var ecart = (max - min) * 0.2;
      this.ys = d3.scale.linear().domain([min - ecart, max + ecart]).range([h, 0]);
      var yAxis = d3.svg.axis().scale(this.ys).orient("left");
      svg.append("g").attr("class", "y d3_axis").call(yAxis);
    };
  }

  function ChartController($scope, $http, ChartUpdateService, mlSvgMapService) {
    function x(d) {
      return d.pourcentageParti * 100;
    }

    function y(d) {
      return d[ChartUpdateService.criteria.nomMongo];
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
    var xScale = d3.scale.linear().domain([0, 60]).range([0, width]);
    var radiusScale = d3.scale.sqrt().domain([0, 8e6]).range([0, 40]);

    // Create the SVG container and set the origin.
    var svg = d3.select("#d3_chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // The x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(8, d3.format(",d"));

    // Add the x-axis.
    svg.append("g")
      .attr("class", "x d3_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add an x-axis label.
    svg.append("text")
      .attr("class", "x d3_label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .text("Pourcentage du parti");

    ChartUpdateService.setYScale(svg, height);

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

    $scope.$watch('updateService.criteria', function (newV, oldV) {
      if (newV) {
        draw(tabJSON);
      }
    });

    $scope.$watch('updateService.party', function (newV, oldV) {
      if (newV) {
        tabJSON = [];
        if (mlSvgMapService.isInDetailMode()) {
          newV.forEach(createDepJSON);
        } else {
          createRegJSON();
        }
      }
    });

    $scope.$watch('updateService.tabReg', function (newV, oldV) {
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
      var regJSON = $http.get('http://localhost:3000/departement/' + element.substring(3) + '/' + ChartUpdateService.party._id)
        .then(function successCallback(response) {
          $scope.response = response;
        }, function errorCallback(response) {
          console.error(response);
        });
    }

    function createRegJSON() {
      var regJSON = $http.get('http://localhost:3000/region/parti/' + ChartUpdateService.party._id)
        .then(function successCallback(response) {
          $scope.response = response;
        }, function errorCallback(response) {
          console.error(response);
        });
    }

    $scope.$watch("response", function (newV, oldV) {
      if (newV) {
        tabJSON = tabJSON.concat(newV.data);
        var arrayLength = tabJSON.length;
        var min = tabJSON[0][ChartUpdateService.criteria.nomMongo];
        var max = tabJSON[0][ChartUpdateService.criteria.nomMongo];
        for (var i = 1; i < arrayLength; i++) {
          if (tabJSON[i][ChartUpdateService.criteria.nomMongo] > max) {
            max = tabJSON[i][ChartUpdateService.criteria.nomMongo];
          }
          if (tabJSON[i][ChartUpdateService.criteria.nomMongo] < min) {
            min = tabJSON[i][ChartUpdateService.criteria.nomMongo];
          }
        }
        ChartUpdateService.changeScale(min, max);
        draw(tabJSON);
      }
    });

    function draw(regions) {
      d3.selectAll("svg g.dots").remove();

      // Add a dot per nation. Initialize the data at 1800, and set the colors.
      var dot = svg.append("g")
        .attr("class", "dots")
        .selectAll(".dot")
        .data(interpolateData())
        .enter().append("circle")
        .attr("class", "d3_dot")
        .style("fill", function (d) {
          return d.color;
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
            return ChartUpdateService.yScale(y(d));
          })
          .attr("r", function (d) {
            return radiusScale(radius(d));
          });
      }

      function interpolateData() {
        return regions.map(function (d) {
          var id = d._id < 10 ? '0' + d._id : d._id;
          var fillValue = mlSvgMapService.isInDetailMode() ? mlSvgMapService.getDepartement('dep' + id).attr('fill')
            : mlSvgMapService.getRegion('reg' + id).attr('fill');
          return {
            nom: d.nom,
            color: fillValue,
            tauxChom : d.tauxChom,
            revenuMed: d.revenuMed,
            pourcentageIm: d.pourcentageIm,
            ins: d.ins,
            pourcentageParti: (d.liste.length !== 0 ? d.liste[0].pourcentage : -1)
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

