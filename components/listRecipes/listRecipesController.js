angular.module('starvingToday').controller('listRecipesController', ['$scope', '$state', '$http', 'dataRecipe', function($scope, $state, $http, dataRecipe)
{
    $scope.recipes = dataRecipe.getRecipes();

    // getRecipeDump();
    // function getRecipeDump(){
    //     dataRecipe.getRecipeDump()
    //          .then(function (response) {
    //              $scope.recipes = response.data.recipes;});
    // }

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
}]);
