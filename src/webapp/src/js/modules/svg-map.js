(function () {
  'use strict';

  angular
    .module('ml.svg-map', [])
    .directive('mlSvgMap', ['$compile', 'mlSvgMapService', mlSvgMap])
    .directive('mlSvgMapRegion', ['$compile', 'mlSvgMapService', mlSvgMapRegion])
    .service('mlSvgMapService', ['$http', SvgMapService])
    .filter('mlSvgMapColor', mlSvgMapColor);

  function SvgMapService($http) {
    var detailMode = [];
    var regions = {};
    var departements = {};

    this.addClass = function (element, c) {
      var classes = element.attr('class');
      classes += ' ' + c;
      element.attr('class', classes);
    };

    this.removeClass = function (element, c) {
      var classes = element.attr('class');
      classes = classes.replace(c, '');
      element.attr('class', classes);
    };

    this.setRegionDetailMode = function (idRegion, inDetailMode) {
      var index, regions, id;
      // ajout array
      if (inDetailMode) {
        index = detailMode.indexOf(idRegion);
        if (index == -1) {
          detailMode.push(idRegion);
        }

        // if first element
        if (detailMode.length == 1) {
          regions = this.getRegions();
          for (id in regions) {
            if (regions.hasOwnProperty(id)) {
              if (!this.isRegionInDetailMode(id)) {
                this.addClass(regions[id], 'neutral');
              }
            }
          }
        } else {
          this.removeClass(this.getRegion(idRegion), 'neutral');
        }
      } else { // suppression array
        index = detailMode.indexOf(idRegion);
        detailMode.splice(index, 1);
        // if back to region mode
        if (detailMode.length === 0) {
          regions = this.getRegions();
          for (id in regions) {
            if (regions.hasOwnProperty(id)) {
              if (!this.isRegionInDetailMode(id)) {
                this.removeClass(regions[id], 'neutral');
              }
            }
          }
        } else {
          this.addClass(this.getRegion(idRegion), 'neutral');
        }
      }
    };

    this.isRegionInDetailMode = function (idRegion) {
      return detailMode.indexOf(idRegion) != -1;
    };

    this.isInDetailMode = function (idRegion) {
      return detailMode.length !== 0;
    };

    this.addRegion = function (id, region) {
      regions[id] = region;
    };

    this.getRegion = function (id) {
      return regions[id];
    };

    this.getRegions = function () {
      return regions;
    };

    this.addDepartement = function (id, departement) {
      departements[id] = departement;
    };

    this.getDepartement = function (id) {
      return departements[id];
    };

    this.getAssociatedDepartements = function (idRegion) {
      // API request
      $http.get('http://localhost:3000/region/' + idRegion.substring(3))
        .then(function successCallback(response) {

          var deps = response.data.deps,
            returnValue = [],
            l = deps.length;
          for (var i = 0; i < l; i++) {
            returnValue.push(deps[i].dep);
          }

          return returnValue;
        }, function errorCallback(response) {
          console.error(response);
        });

      return [];
    };

    this.showDepartements = function (associatedRegion, departements) {
      var l = departements.length;
      this.addClass(associatedRegion, 'transparent');
      for (var i = 0; i < l; i++) {
        var dep = this.getDepartement('dep' + departements[i]);
      }
    };

    this.hideDepartements = function (associatedRegion) {
      this.removeClass(associatedRegion, 'transparent');
    };
  }

  function mlSvgMap($compile, mlSvgMapService) {
    return {
      restrict: 'EA',
      templateUrl: templateUrl,
      link: link
    };

    function templateUrl($element, $attributes) {
      return $attributes.templateUrl || 'some/path/default.html';
    }

    function link($scope, $element, $attributes) {
      var regions = $element[0].querySelectorAll('path');
      var region_identifier = "reg";

      angular.forEach(regions, function (path, key) {
        var regionElement = angular.element(path);
        var idRegion = path.getAttribute('id');

        // region
        if (idRegion.substring(0, region_identifier.length) === region_identifier) {
          mlSvgMapService.addRegion(idRegion, regionElement);
        } else { // departement
          mlSvgMapService.addDepartement(idRegion, regionElement);
        }
      });

      angular.forEach(regions, function (path, key) {
        var regionElement = angular.element(path);
        regionElement.attr('ml-svg-map-region', '');
        regionElement.attr('hover-region', 'hoverRegion');
        $compile(regionElement)($scope);
      });
    }
  }

  function mlSvgMapRegion($compile, mlSvgMapService) {
    return {
      restrict: 'A',
      scope: {
        hoverRegion: '='
      },
      link: link
    };

    function link($scope, $element, $attributes) {
      $scope.elementId = $element.attr('id');

      var region_identifier = "reg";

      // region
      if ($element.attr('id').substring(0, region_identifier.length) === region_identifier) {

        $scope.regionClick = function () {
          var departements = mlSvgMapService.getAssociatedDepartements($scope.elementId);
          if (!mlSvgMapService.isRegionInDetailMode($scope.elementId)) {
            mlSvgMapService.setRegionDetailMode($scope.elementId, true);
            mlSvgMapService.showDepartements($element, departements);
          } else {
            mlSvgMapService.setRegionDetailMode($scope.elementId, false);
            mlSvgMapService.hideDepartements($element);
          }
        };

        $scope.regionMouseOver = function () {
          $scope.hoverRegion = $scope.elementId;
          $element[0].parentNode.appendChild($element[0]);
        };

        $element.attr('ng-click', 'regionClick()');
        $element.attr('ng-mouseover', 'regionMouseOver()');
        $element.attr('ng-class', '{ active:hoverRegion == elementId }');
      }

      $element.attr('ng-attr-fill', '{{ elementId | mlSvgMapColor }}');

      $element.removeAttr('ml-svg-map-region');

      $compile($element)($scope);
    }
  }

  function mlSvgMapColor() {
    return filter;

    function filter() {
      var r = Math.floor((Math.random() * 200) + 50);
      var g = Math.floor((Math.random() * 200) + 50);
      var b = Math.floor((Math.random() * 200) + 50);

      return 'rgba(' + r + ',' + g + ',' + b + ',1)';
    }
  }

}());
