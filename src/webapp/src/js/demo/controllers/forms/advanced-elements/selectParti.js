(function () {
  'use strict';

  angular
    .module('material-lite')
    .controller('SelectPartiController', ['$scope', '$http', 'ChartUpdateService', SelectPartiController]);

  function SelectPartiController($scope, $http, ChartUpdateService) {
    $http.get('http://localhost:3000/nomListe')
      .then(function successCallback(response) {
        $scope.parti = {};
        $scope.parti.selected = response.data[9];
        $scope.partis = response.data;
      }, function errorCallback(response) {
        console.error(response);
      });


    $scope.updateParty = function (newParty) {
      ChartUpdateService.party = newParty.selected;
    };
  }

})();
