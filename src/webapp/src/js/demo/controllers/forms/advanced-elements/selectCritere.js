(function() {
  'use strict';

  angular
    .module('material-lite')
    .service('mlSelectCritereService', SelectCritereService)
    .controller('SelectCritereController', ['$scope', 'ChartUpdateService', 'mlSelectCritereService', SelectCritereController]);

  function SelectCritereService() {
    var critere = "";

    this.getCritere = function () {
      return critere;
    };

    this.setCritere = function (val) {
      critere = val;
    };
  }

  function SelectCritereController($scope, ChartUpdateService, mlSelectCritereService) {
    $scope.criteria = {};
    $scope.criteria.selected = { name: 'Taux de chômage', nomMongo: 'tauxChom'};
    $scope.criterias = [
      { name: 'Taux de chômage', scale: '(en pourcentage)', nomMongo: 'tauxChom'},
      { name: 'Revenu médian', scale: '(en milliers d\'€/an)', nomMongo: 'revenuMed'},
      { name: "Taux d'immigration", scale: '(en pourcentage)', nomMongo: 'pourcentageIm'},
      { name: 'Nombre de naissances', scale: '(???)', nomMongo: 'nbrNais'}
    ];

    $scope.updateCriteria = function(label) {
      ChartUpdateService.setYAxisLabel(label);
    };

  }

})();
