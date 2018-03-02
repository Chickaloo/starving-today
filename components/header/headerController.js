angular.module('starvingToday').controller('headerController', ['$scope', '$http', '$state', 'dataUser', 'dataRecipe', function($scope, $http, $state, dataUser, dataRecipe)
{
    $scope.user = dataUser.user;
    $scope.recipelength = -1;

    $scope.LoadMyHub = function() {
      $state.go('myHub', {}, {reload:true});
    };

  	$scope.Logout = function() {

  		var config = {
          withCredentials: 'true',
    			headers : {
    				'Content-Type': 'application/json;charset=UTF-8'
    			}
    		}

  		$http.post('http://138.68.22.10:84/users/logout', config)
  		.then(
  			function (response) {
					$scope.changeAuth(false);
  			},
  			function (response) {
  				if (response.status === 500) {
  						$scope.responseDetails = "Something went wrong with our servers!";
  				} else if(response.status === 400){
  						$scope.responseDetails = "The input was invalid. Please try again.";
  				} else if(response.status === 404){
  						$scope.responseDetails = "The entered username and password combination was not found.";
  				} else {
  						$scope.responseDetails = "Oops! Something went wrong! Please try signing in again.";
  				}
  		});
  	}

    $scope.runSearch = function() {

        var query = {
          keywords: $scope.searchquery,
          bytag: true,
          byname: true,
          byingredient: true,
          byuser: false
        };

        var data = JSON.stringify(query);

  		var config = {
          withCredentials: 'true',
    			headers : {
    				'Content-Type': 'application/json;charset=UTF-8'
    			}
    		}

  		$http.post('http://138.68.22.10:84/search', query, config)
  		.then(
  			function (response) {
					  dataRecipe.setRecipes(response.data.recipes);
            $scope.recipecount = dataRecipe.getRecipeLength();
            $scope.search = $scope.searchquery;
            $state.go('recipes', {}, {reload:true});
  			},
  			function (response) {
  				if (response.status === 500) {
  						$scope.responseDetails = "Something went wrong with our servers!";
  				} else if(response.status === 400){
  						$scope.responseDetails = "The input was invalid. Please try again.";
  				} else if(response.status === 404){
  						$scope.responseDetails = "No recipes were found.";
  				} else {
  						$scope.responseDetails = "Something broke!";
  				}
  		});
  	}
}]);
