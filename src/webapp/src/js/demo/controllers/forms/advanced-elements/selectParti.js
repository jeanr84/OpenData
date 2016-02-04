(function() {
  'use strict';

  angular
    .module('material-lite')
    // Service
    .factory('selectPartiService', ['$http', function($http){
      return $http.get('http://localhost:3000/nomListe');
    }])
    // Controller
    .controller('selectPartiController', ['$scope', 'selectPartiService', function ($scope, selectPartiService) {
      selectPartiService.success(function(data){
        $scope.choixParti = {};
        $scope.partis = data;
        $scope.selectedState = '';
      }).error(function(data, status){
        console.log(data, status);
        $scope.partis = [];
      });
    }]);

})();
