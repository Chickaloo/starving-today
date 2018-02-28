angular.module('starvingToday').controller('viewRecipeController', ['$scope', '$http', 'dataRecipe', function($scope, $http, dataRecipe)
{
    $scope.recipe;

    getRecipe();
    function getRecipe() {
        dataRecipe.getRecipe()
            .then(
              function (response) {
                console.log(response.data);
                $scope.recipe = response.data;
              },function (response) {
              		if (response.status === 500) {
              				$scope.responseDetails = "Please double check your username and password!";
              		} else if(response.status === 400){
              				$scope.responseDetails = "Please double check your username and password!";
              		} else if(response.status === 404){
              				$scope.responseDetails = "Please double check your username and password!";
              		} else {
              				$scope.responseDetails = "Oops! Something went wrong! Please try signing in again.";
              		}
              	});
    }

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
