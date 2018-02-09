angular.module('starvingToday').controller('landingController', ['$scope', '$log', function($scope, $log){
	$scope.data = "$scope";
	$log.log("bound and running");
	/*$scope.name = "John Doe";*/
	$scope.username = "";
	$scope.password = "";
	$scope.email = "";
	$scope.recipeCount = 2;
	$scope.userCount = 0;
}]);
