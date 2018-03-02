angular.module('starvingToday').controller('recipeModalController' , ['$scope' , '$http' , '$state' , 'dataUser' , 'dataRecipe', function($scope , $http , $state, dataUser , dataRecipe)
{
  $scope.user = dataUser.user;
  console.log("recipeModalController: dataUser: " + $scope.user.username);
  //console.log("checking user from recipeModal:" + $scope.user);
  //recipe fields
  $scope.recipename;
  $scope.recipedescription;
  $scope.recipeinstructions;
  $scope.calories;
  $scope.preptime;
  $scope.cooktime;
  $scope.new = true;

  $scope.OpenModal = function(){
    $scope.curRec = dataRecipe.getCurrRecipe();
    if(typeof $scope.curRec !== "undefined"){
      $scope.new = false;
      $scope.recipename = dataRecipe.recipe.recipename + " ";
      $scope.recipedescription = dataRecipe.recipe.recipedescription + " ";
      $scope.recipeinstructions =dataRecipe.recipe.recipeinstructions + " ";
      $scope.calories = dataRecipe.recipe.calories + " ";
      $scope.preptime = dataRecipe.recipe.preptime + " ";
      $scope.cooktime = dataRecipe.recipe.cooktime + " ";
      console.log("Recipie already exists, it is: " + $scope.recipename);
    }
    console.log("recipeModalController: user: " + $scope.user.username);
    console.log("recipeModalController: current recipe: typeof: " + typeof $scope.curRec);
    console.log("new: " + $scope.new);
  }

  $scope.UpdateRecipe = function() {
    if ($scope.user.userid === 0) {
      $scope.responseDetails = "not logged in!";
      console.log($scope.responseDetails);
      return 1;
    }

    console.log("recipeModalController: user: " + $scope.user.username);

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

    console.log("new: " + $scope.new);
    console.log("checking user in open Modal:" + $scope.user.username);

    if($scope.new == true){
      console.log("Posting a NEW recipe");
      $http.post('http://138.68.22.10:84/recipes', data, config)
      .then(
        function (response) {
          $scope.responseDetails = "You entered a recipe! Eww!";
        },
        function (response) {
          $scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
      });
    }else{
      console.log("Editing an OLD recipie");
      $http.put('http://138.68.22.10:84/recipes/'+$scope.curRec.recipeid , data, config)
      .then(
        function (response) {
          $scope.responseDetails = "You entered a recipe! Eww!";
        },
        function (response) {
          $scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
      });
    }

    $state.go('myHub',{},{reload:true});

  }
}]);
