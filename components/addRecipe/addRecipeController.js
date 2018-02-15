angular.module('starvingToday').controller('addRecipeController', ['$scope', '$http', function($scope, $http)
{
	$scope.SendData = function() {
		var recipe_data = {
			//authorid: parseInt($scope.authorid),
			recipename: $scope.recipename,
			recipedescription: $scope.recipedescription,
			recipeinstructions: $scope.recipeinstructions,
			calories: parseInt($scope.calories),
			preptime: parseInt($scope.preptime),
			cooktime: parseInt($scope.cooktime),
			servings: parseInt($scope.servings)
		};

		var data = JSON.stringify(recipe_data);

		var config = {
			headers : {
				'Content-Type': 'application/json;charset=utf-8'
			}
		}

		$http.post('http://138.68.22.10:84/recipes', data, config)
		.then(
			function (response) {
				$scope.responseDetails = "You entered a recipe! Eww!";
			},
			function (response) {
				$scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
		});
	}
}]);
