angular.module('starvingToday').controller('modalController' , ['$scope' , '$http' , 'dataUser' , 'dataRecipe' , function($scope , $http , dataUser , dataRecipe)
{
  //user fields
  $scope.user = dataUser.user;
  $scope.fullname = dataUser.user.firstname + " " + dataUser.user.lastname;
  $scope.bio = dataUser.user.bio + " ";
  console.log($scope.fullname);

  //update User
  $scope.UpdateUser = function(){
    var user_data = {
      firstname: $scope.fullname,
      email: $scope.user.email,
      bio: $scope.bio
    };

    var data = JSON.stringify(user_data);

    var config = {
        headers : {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }

    $http.put('http://138.68.22.10:84/users', data, config)
    .then(
      function (response) {
        if (response.status === 200) {
            $scope.responseDetails = "User info updated successfully.";
        }
      },
      function (response) {
        if (response.status === 500) {
            $scope.responseDetails = "Something went wrong with our servers!";
        } else if(response.status === 404){
            $scope.responseDetails = "Account not properly created.";
        } else {
            $scope.responseDetails = "Everything is broken. Please abandon ship.";
        }
    });
  }

  //recipe fields
  $scope.recipename = dataRecipe.recipe.recipename + " ";
  $scope.recipedescription = dataRecipe.recipe.recipedescription + " ";
  $scope.recipeinstructions = dataRecipe.recipe.recipeinstructions + " ";
  $scope.calories = dataRecipe.recipe.calories + " ";
  $scope.preptime = dataRecipe.recipe.preptime + " ";
  $scope.cooktime = dataRecipe.recipe.cooktime + " ";

//update Recipes
  $scope.UpdateRecipe = function() {
    if ($scope.user.userid === 0) {
      $scope.responseDetails = "not logged in!";
      console.log($scope.responseDetails);
      return 1
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

    $http.post('http://138.68.22.10:84/recipes', data, config)
    .then(
      function (response) {
        $scope.responseDetails = "You entered a recipe! Eww!";
      },
      function (response) {
        $scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
    });
  }
}]);
