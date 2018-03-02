angular.module('starvingToday').factory('dataRecipe', ['$http', function ($http) {
    var dataRecipe = {};
    var recipe = [];
    var currRecipe;
    var recipes;
    var recipelen = 0;

    dataRecipe.setRecipes = function(incomingrecipes) {
      if (typeof incomingrecipes !== "undefined"){
        recipes = incomingrecipes;
        recipelen = Object.keys(recipes).length;
      } else {
        recipelen = 0;
      }
      console.log(recipelen);
    };

    dataRecipe.getRecipes = function() {
      return recipes;
    };

    dataRecipe.getRecipeLength = function() {
      return recipelen;
    };

    dataRecipe.getRecipeDump = function () {
        return $http.get('http://138.68.22.10:84/recipes');
    };

    dataRecipe.getRecipe = function (recipeid) {
      $http.get('http://138.68.22.10:84/recipes/id/' + recipeid).then(
  			function (response) {
  				currRecipe = response.data;
          console.log(currRecipe)
  				recipelen = 1;
  			},
  			function (response) {
  				recipelen = 0;
  		});
    };
    
    dataRecipe.getRecipeComments = function(recipeid) {
        $http.get('http://138.68.22.10:84/comments/recipe/' + recipeid).then(
            function (response) {
                console.log(response.data);
                return response.data;
            })
    };

    dataRecipe.getCurrRecipe = function () {
        return currRecipe;
    };

    dataRecipe.pushRecipe = function(value) {
        recipe.push(value);
    };

    dataRecipe.popRecipe = function() {
        recipe.pop();
    };

    return dataRecipe;
}]);

angular.module('starvingToday').controller('listRecipesController', ['$scope', '$state', '$http', 'dataRecipe', function($scope, $state, $http, dataRecipe)
{
    $scope.recipes = dataRecipe.getRecipes();

    // getRecipeDump();
    // function getRecipeDump(){
    //     dataRecipe.getRecipeDump()
    //         .then(function (response) {
    //             $scope.recipes = response.data.recipes;});
    // }

    $scope.selectRecipe = function(value){
        console.log(value);
        dataRecipe.getRecipe(value);
        console.log(dataRecipe.getCurrRecipe());
        $state.go('viewRecipesState', {}, {reload:true});
    }
}]);
