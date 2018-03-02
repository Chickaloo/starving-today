angular.module('starvingToday').controller('myHubController', ['$scope', '$http', '$state', 'dataUser', 'dataRecipe', function($scope, $http, $state, dataUser, dataRecipe)
{
    $scope.user = dataUser.user;
    $scope.reciperating = 0;

    //SEARCH BY THIS USER TO POPULATE THEIR RECIPIES

		var config = {
        withCredentials: 'true',
  			headers : {
  				'Content-Type': 'application/json;charset=UTF-8'
  			}
  		}

		$http.get('http://138.68.22.10:84/recipes/user/'+dataUser.user.userid, config)
		.then(
			function (response) {
				$scope.userrecipes = response.data.recipes;
        $scope.recipecount = Object.keys($scope.userrecipes).length;
        angular.forEach($scope.userrecipes, function(value, key){
          $scope.reciperating = $scope.reciperating + value.upvotes - value.downvotes;
        });
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

      $scope.selectRecipe = function(value){
          console.log(value);
          dataRecipe.getRecipe(value);
          console.log(dataRecipe.getCurrRecipe());
          $state.go('viewRecipesState', {}, {reload:true});
      }
}]);
