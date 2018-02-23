angular.module('starvingToday').controller('viewRecipeController', ['$scope', '$http', 'dataRecipe', function($scope, $http, dataRecipe) 
{
    $scope.recipe;
    
    getRecipe();
    function getRecipe() {
        dataRecipe.getRecipe()
            .then(function (response) {
                console.log(response.data);
                $scope.recipe = response.data;});
    }
}]);