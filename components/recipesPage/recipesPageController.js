angular.module('starvingToday').controller('recipesController', ['$scope', '$http', function($scope, $http) 
{
    $http.get('http://138.68.22.10:84/recipes')
    .then(function (response) {
        $scope.recipes = response.data.recipes;});
}]);