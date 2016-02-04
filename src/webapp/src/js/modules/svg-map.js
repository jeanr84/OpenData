(function () {
  'use strict';

  angular
    .module('ml.svg-map', [])
    .directive('mlSvgMap', ['$compile', 'mlSvgMapService', mlSvgMap])
    .directive('mlSvgMapRegion', ['$compile', 'mlSvgMapService', 'mlRandomColorService', mlSvgMapRegion])
    .service('mlSvgMapService', ['$http', 'ChartUpdateService', SvgMapService])
    .service('mlRandomColorService', RandomColorService);

  function SvgMapService($http, ChartUpdateService) {
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


        ChartUpdateService.tabReg = detailMode;
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

    this.isInDetailMode = function () {
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

  function mlSvgMapRegion($compile, mlSvgMapService, mlRandomColorService) {
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

      $element.attr('fill', mlRandomColorService.getRandomColor());

      $element.removeAttr('ml-svg-map-region');

      $compile($element)($scope);
    }
  }

  function RandomColorService() {
    var defaultPalette = [
      ['#FFEBEE', '#FCE4EC', '#F3E5F5', '#EDE7F6', '#E8EAF6', '#E3F2FD', '#E1F5FE', '#E0F7FA', '#E0F2F1', '#E8F5E9', '#F1F8E9', '#F9FBE7', '#FFFDE7', '#FFF8E1', '#FFF3E0', '#FBE9E7', '#EFEBE9', '#ECEFF1'],
      ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB', '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9', '#DCEDC8', '#F0F4C3', '#FFF9C4', '#FFECB3', '#FFE0B2', '#FFCCBC', '#D7CCC8', '#CFD8DC'],
      ['#EF9A9A', '#F48FB1', '#CE93D8', '#B39DDB', '#9FA8DA', '#90CAF9', '#81D4FA', '#80DEEA', '#80CBC4', '#A5D6A7', '#C5E1A5', '#E6EE9C', '#FFF59D', '#FFE082', '#FFCC80', '#FFAB91', '#BCAAA4', '#B0BEC5'],
      ['#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784', '#AED581', '#DCE775', '#FFF176', '#FFD54F', '#FFB74D', '#FF8A65', '#A1887F', '#90A4AE'],
      ['#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726', '#FF7043', '#8D6E63', '#78909C'],
      ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#607D8B'],
      ['#E53935', '#D81B60', '#8E24AA', '#5E35B1', '#3949AB', '#1E88E5', '#039BE5', '#00ACC1', '#00897B', '#43A047', '#7CB342', '#C0CA33', '#FDD835', '#FFB300', '#FB8C00', '#F4511E', '#6D4C41', '#546E7A'],
      ['#D32F2F', '#C2185B', '#7B1FA2', '#512DA8', '#303F9F', '#1976D2', '#0288D1', '#0097A7', '#00796B', '#388E3C', '#689F38', '#AFB42B', '#FBC02D', '#FFA000', '#F57C00', '#E64A19', '#5D4037', '#455A64'],
      ['#C62828', '#AD1457', '#6A1B9A', '#4527A0', '#283593', '#1565C0', '#0277BD', '#00838F', '#00695C', '#2E7D32', '#558B2F', '#9E9D24', '#F9A825', '#FF8F00', '#EF6C00', '#D84315', '#4E342E', '#37474F'],
      ['#B71C1C', '#880E4F', '#4A148C', '#311B92', '#1A237E', '#0D47A1', '#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#BF360C', '#3E2723', '#263238'],
      ['#FF8A80', '#FF80AB', '#EA80FC', '#B388FF', '#8C9EFF', '#82B1FF', '#80D8FF', '#84FFFF', '#A7FFEB', '#B9F6CA', '#CCFF90', '#F4FF81', '#FFFF8D', '#FFE57F', '#FFD180', '#FF9E80'],
      ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'],
      ['#FF1744', '#F50057', '#D500F9', '#651FFF', '#3D5AFE', '#2979FF', '#00B0FF', '#00E5FF', '#1DE9B6', '#00E676', '#76FF03', '#C6FF00', '#FFEA00', '#FFC400', '#FF9100', '#FF3D00'],
      ['#D50000', '#C51162', '#AA00FF', '#6200EA', '#304FFE', '#2962FF', '#0091EA', '#00B8D4', '#00BFA5', '#00C853', '#64DD17', '#AEEA00', '#FFD600', '#FFAB00', '#FF6D00', '#DD2C00']
    ];

    this.getRandomColor = function () {
      var r1 = Math.floor(Math.random() * (defaultPalette.length)),
        r2 = Math.floor(Math.random() * (defaultPalette[r1].length));
      return defaultPalette[r1][r2];
    };
  }


}());
