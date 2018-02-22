angular.module('starvingToday').factory('dataRecipe', ['$http', function ($http) {
    var dataRecipe = {};
    
    dataRecipe.getRecipeDump = function () {
        return $http.get('http://138.68.22.10:84/recipes');
    };
    
    dataRecipe.getRecipe = function (recipeId) {
        return $http.get('http://138.68.22.10:84/recipes/id/' + recipeId)
    };
    
    dataRecipe.searchRecipe = function () {
        return $http.get('http://138.68.22.10:84/recipe/id/')
    };
    
    return dataRecipe;
}]);

angular.module('starvingToday').controller('recipesController', ['$scope', '$http', 'dataRecipe', function($scope, $http, dataRecipe) 
{
    $scope.recipes;
    
    getRecipeDump();
    function getRecipeDump(){
        dataRecipe.getRecipeDump()
            .then(function (response) {
                $scope.recipes = response.data.recipes;});
    }
}]);