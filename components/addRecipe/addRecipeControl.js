
angular.module('starvingToday').controller("addRecipeController", function ($scope, $http) {
	$scope.SendData = function () {
	// use $.param jQuery function to serialize data from JSON

		var data = {
			//authorid: parseInt($scope.authorid),
			recipename: $scope.recipename,
			recipedescription: $scope.recipedescription,
			recipeinstructions: $scope.recipeinstructions,
			calories: parseInt($scope.calories),
			preptime: parseInt($scope.preptime),
			cooktime: parseInt($scope.cooktime),
			servings: parseInt($scope.servings)
		};

		var parameter = JSON.stringify(data);

		var config = {
			headers : {
				'Content-Type': 'application/json;charset=utf-8'
			}
		}

		$http.post('http://138.68.22.10:84/api/recipes', parameter, config)
		.then(
			function (response) {
				$scope.responseDetails = "You entered a recipe! Eww!";
			},
			function (response) {
				$scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
		});
	};
});
