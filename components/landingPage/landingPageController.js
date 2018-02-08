angular.module('starvingToday').controller('landingController', ['$scope', '$log', function($scope, $log){
  $scope.data = "$scope";
  $log.log("bound and running");
  $scope.name = "John Doe";
  $scope.recipeCount = 2;
  $scope.userCount = 0;
}]);
