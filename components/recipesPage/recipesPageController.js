angular.module('starvingToday').factory('dataRecipe', ['$http', function ($http) {
    var dataRecipe = {};
    var recipe = [];
    
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

angular.module('starvingToday').controller('recipesController', ['$scope', '$http', 'dataRecipe', function($scope, $http, dataRecipe) 
{
    $scope.recipes;
    
    getRecipeDump();
    function getRecipeDump(){
        dataRecipe.getRecipeDump()
            .then(function (response) {
                $scope.recipes = response.data.recipes;});
    }
    
    $scope.selectRecipe = function(value){
            dataRecipe.popRecipe();
            dataRecipe.pushRecipe(value);
            console.log(value);
    }
}]);