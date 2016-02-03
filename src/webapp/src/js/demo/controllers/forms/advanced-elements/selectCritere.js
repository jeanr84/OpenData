(function() {
  'use strict';

  angular
    .module('material-lite')
    .service('mlSelectCritereService', SelectCritereService)
    .controller('SelectCritereController', ['$scope', 'mlSelectCritereService', SelectCritereController]);

  function SelectCritereService() {
    var critere = "";

    this.getCritere = function () {
      return critere;
    }

    this.setCritere = function (val) {
      critere = val;
    }


  }

  function SelectCritereController($scope, mlSelectCritereService) {
    $scope.choixCritere = {};
    $scope.criteres = [
      { name: 'Taux de chomage', nomMongo: 'tauxChom'},
      { name: 'Revenu median', nomMongo: 'revenuMed'},
      { name: "Taux d'immigration", nomMongo: 'pourcentageIm'},
      { name: 'Nombre de naissance',    nomMongo: 'nbrNais'},
    ];
    $scope.selectedState = '';


    $scope.selectCritere = function (choixCritere) {
      mlSelectCritereService.setCritere(choixCritere.selected.name);
    }
  }

})();
