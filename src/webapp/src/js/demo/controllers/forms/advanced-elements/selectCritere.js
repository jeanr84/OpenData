(function() {
  'use strict';

  angular
    .module('material-lite')
    .service('mlSelectCritereService', SelectCritereService)
    .controller('SelectCritereController', ['$scope', 'mlSelectCritereService', SelectCritereController]);

  function SelectCritereService() {
    var test = "guigui";

    this.getTest = function () {
      return test;
    }

    this.setTest = function (val) {
      test = val;
    }


  }

  function SelectCritereController($scope, mlSelectCritereService) {
    $scope.choixCritere = {};
    $scope.criteres = [
      { name: 'Taux de chomage', nomMongo: 'pourcentageIm'},
      { name: 'Revenu median', nomMongo: 'revenuMed'},
      { name: "Taux d'immigration", nomMongo: 'tauxChom'},
      { name: 'Nombre de naissance',    nomMongo: 'nbrNais'},
    ];
    $scope.selectedState = '';


    $scope.selectCritere = function (choixCritere) {
      console.log(choixCritere);
    }
  }

})();
