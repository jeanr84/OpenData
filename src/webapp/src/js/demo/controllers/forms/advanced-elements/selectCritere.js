(function() {
  'use strict';

  angular
    .module('material-lite')
    .controller('SelectCritereController', ['$scope', 'ChartUpdateService', SelectCritereController]);

  function SelectCritereController($scope, ChartUpdateService) {
    $scope.criteria = {};
    $scope.criterias = [
      { name: 'Taux de chômage', unit: '(en pourcentage)', nomMongo: 'tauxChom'},
      { name: 'Revenu médian', unit: '(en milliers d\'€/an)', nomMongo: 'revenuMed'},
      { name: "Taux d'immigration", unit: '(en pourcentage)', nomMongo: 'pourcentageIm'}
    ];
    $scope.criteria.selected = $scope.criterias[0];

    $scope.updateCriteria = function(label) {
      ChartUpdateService.setYAxisLabel(label);
    };

  }

})();
