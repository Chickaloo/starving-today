angular.module('starvingToday').factory('dataRecipe', ['$http', function ($http) {
    var dataRecipe = {};
    var recipe = [];
    var recipes;
    var recipelen;

    dataRecipe.setRecipes = function(incomingrecipes) {
      if (typeof incomingrecipes !== "undefined"){
        recipes = incomingrecipes;
        recipelen = Object.keys(recipes).length;
      } else {
        recipelen = 0;
      }
      console.log(recipelen);
    }

    dataRecipe.getRecipes = function() {
      return recipes;
    }

    dataRecipe.getRecipeLength = function() {
      return recipelen;
    }

    dataRecipe.getRecipeDump = function () {
        return $http.get('http://138.68.22.10:84/recipes');
    };

    dataRecipe.getRecipe = function () {
        return $http.get('http://138.68.22.10:84/recipes/id/' + recipe);
    };

    dataRecipe.searchRecipe = function () {
        return $http.get('http://138.68.22.10:84/recipe/id/')
    };

    dataRecipe.pushRecipe = function(value) {
        recipe.push(value);
    };

    dataRecipe.popRecipe = function() {
        recipe.pop();
    };

    return dataRecipe;
}]);

angular.module('starvingToday').controller('listRecipesController', ['$scope', '$http', 'dataRecipe', function($scope, $http, dataRecipe)
{
    $scope.recipes = dataRecipe.getRecipes();

    // getRecipeDump();
    // function getRecipeDump(){
    //     dataRecipe.getRecipeDump()
    //         .then(function (response) {
    //             $scope.recipes = response.data.recipes;});
    // }

    $scope.selectRecipe = function(value){
            dataRecipe.popRecipe();
            dataRecipe.pushRecipe(value);
            console.log(value);
    }
}]);
