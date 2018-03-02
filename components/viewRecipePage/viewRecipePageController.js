angular.module('starvingToday').controller('viewRecipeController', ['$scope', '$http', '$state', 'dataRecipe', 'dataUser', function($scope, $http, $state, dataRecipe, dataUser)
{
<<<<<<< HEAD
    $scope.recipe;
    $scope.user = dataUser.user;

    getRecipe();
    function getRecipe() {
        dataRecipe.getRecipe()
            .then(
              function (response) {
                console.log(response.data);
                $scope.recipe = response.data;
              },function (response) {
              		if (response.status === 500) {
              				$scope.responseDetails = "Please double check your username and password!";
              		} else if(response.status === 400){
              				$scope.responseDetails = "Please double check your username and password!";
              		} else if(response.status === 404){
              				$scope.responseDetails = "Please double check your username and password!";
              		} else {
              				$scope.responseDetails = "Oops! Something went wrong! Please try signing in again.";
              		}
              	});
    }
=======

    $scope.recipe = dataRecipe.getCurrRecipe();
    $scope.user = dataUser.user;

    // getRecipe();
    // function getRecipe() {
    //     dataRecipe.getRecipe()
    //         .then(
    //           function (response) {
    //             console.log(response.data);
    //             $scope.recipe = response.data;
    //           },function (response) {
    //           		if (response.status === 500) {
    //           				$scope.responseDetails = "Please double check your username and password!";
    //           		} else if(response.status === 400){
    //           				$scope.responseDetails = "Please double check your username and password!";
    //           		} else if(response.status === 404){
    //           				$scope.responseDetails = "Please double check your username and password!";
    //           		} else {
    //           				$scope.responseDetails = "Oops! Something went wrong! Please try signing in again.";
    //           		}
    //           	});
    // }

>>>>>>> 015937ff7adb07baf54611a3aad111db380ea4ad
}]);
