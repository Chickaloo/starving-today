angular.module('starvingToday').controller('viewRecipeController', ['$scope', '$http', '$state', 'dataRecipe', 'dataUser', function($scope, $http, $state, dataRecipe, dataUser)
{

    $scope.recipe = dataRecipe.getCurrRecipe();
    $scope.recipelen = dataRecipe.getRecipeLength();
    $scope.user = dataUser.user;

    console.log("recipie from viewRecipiePage: " + $scope.recipe);

    if ($scope.recipelen === 0){
      console.log("redirect?");
      $state.go("myHub");
    }
}]);
