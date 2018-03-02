<<<<<<< HEAD
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
          console.log("listRecipiesController: curr recipe: " + currRecipe.recipename);
  				recipelen = 1;
  			},
  			function (response) {
  				recipelen = 0;
  		});
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

=======
>>>>>>> c5c26008afa388cc2fb7c09eec0dabc2f06147cf
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
