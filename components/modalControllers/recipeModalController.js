angular.module('starvingToday').controller('recipeModalController' , ['$scope' , '$http' , 'dataUser' , 'dataRecipe', function($scope , $http , dataUser , dataRecipe)
{
  $scope.user = dataUser.user;
  //recipe fields
  $scope.recipename;
  $scope.recipedescription;
  $scope.recipeinstructions;
  $scope.calories;
  $scope.preptime;
  $scope.cooktime;
  $scope.new = true;

  dataRecipe.getCurrRecipe();
  if(typeof dataRecipe.recipe !== "undefined"){
    $scope.new = false;
    $scope.recipename = dataRecipe.recipe.recipename + " ";
    $scope.recipedescription = dataRecipe.recipe.recipedescription + " ";
    $scope.recipeinstructions =dataRecipe.recipe.recipeinstructions + " ";
    $scope.calories = dataRecipe.recipe.calories + " ";
    $scope.preptime = dataRecipe.recipe.preptime + " ";
    $scope.cooktime = dataRecipe.recipe.cooktime + " ";
    console.log("Recipie already exists, it is: " + $scope.recipename);
  }

  $scope.UpdateRecipe = function() {
    if ($scope.user.userid === 0) {
      $scope.responseDetails = "not logged in!";
      console.log($scope.responseDetails);
      return 1;
    }

    var recipe_data = {
      userid: parseInt($scope.user.userid),
      recipename: $scope.recipename,
      recipedescription: $scope.recipedescription,
      recipeinstructions: $scope.recipeinstructions,
      calories: parseInt($scope.calories),
      preptime: parseInt($scope.preptime),
      cooktime: parseInt($scope.cooktime),
      servings: parseInt($scope.servings)
    };

    var data = JSON.stringify(recipe_data);

    var config = {
      headers : {
        'Content-Type': 'application/json;charset=utf-8'
      }
    }

    if($scope.new == true){
      $http.post('http://138.68.22.10:84/recipes', data, config)
      .then(
        function (response) {
          $scope.responseDetails = "You entered a recipe! Eww!";
        },
        function (response) {
          $scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
      });
    }else{
      $http.put('http://138.68.22.10:84/recipes', data, config)
      .then(
        function (response) {
          $scope.responseDetails = "You entered a recipe! Eww!";
        },
        function (response) {
          $scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
      });
    }

  }
}]);
