angular.module('starvingToday').controller('listRecipesController', ['$scope', '$state', '$http', 'dataUser', 'dataRecipe', function($scope, $state, $http, dataUser, dataRecipe)
{
    $scope.recipes = dataRecipe.getRecipes();
    $scope.users = dataUser.getUsers();
    $scope.usercount = dataUser.getUserLength();
    $scope.recipecount = dataRecipe.getRecipeLength();

    $scope.selectRecipe = function(value){
      $http.get('http://138.68.22.10:84/recipes/id/' + value).then(
        function (response) {
          currRecipe = response.data;
          console.log("retrieved this recipe:");
          console.log(currRecipe);
          dataRecipe.setCurrRecipe(currRecipe);
          dataRecipe.recipelen = 1;
            $state.go('viewRecipesState', {}, {reload: true});
        },
        function (response) {
          dataRecipe.recipelen = 0;
      });
    }

    $scope.selectUser = function(value){
      $http.get('http://138.68.22.10:84/users/id/' + value).then(
        function(response){
          dataUser.setUser(response.data.user);
          $state.go('yourHub', {}, {reload:true});
        },
        function(response){
          dataRecipe.recipelen = 0;
        });
    }
}]);
