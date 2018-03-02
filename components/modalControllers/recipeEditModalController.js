angular.module('starvingToday').controller('recipeEditModalController' , ['$scope' , '$http' , '$state' , 'dataUser' , 'dataRecipe', function($scope , $http , $state, dataUser , dataRecipe)
{
  $scope.user = dataUser.user;
  console.log("recipeModalController: dataUser: " + $scope.user.username);
  $scope.recipename;
  $scope.recipedescription;
  $scope.recipeinstructions;
  $scope.calories;
  $scope.preptime;
  $scope.cooktime;

  // $scope.OpenModal = function(){
    $scope.curRec = dataRecipe.getCurrRecipe();
    console.log("This is being called!!: " + $scope.curRec.recipename);
    $scope.new = false;
    if(typeof $scope.curRec !== "undefined") {

      $scope.recipename = $scope.curRec.recipename;
      $scope.recipedescription = $scope.curRec.recipedescription;
      $scope.recipeinstructions = $scope.curRec.recipeinstructions;
      $scope.servings = $scope.curRec.servings;
      $scope.calories = $scope.curRec.calories;
      $scope.preptime = $scope.curRec.preptime;
      $scope.cooktime = $scope.curRec.cooktime;
      console.log("Recipe already exists, it is: " + $scope.recipename);
      console.log("recipeModalController: user: " + $scope.user.username);
      console.log("recipeModalController: current recipe: typeof: " + typeof $scope.curRec);
    }
  // }

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

      console.log("Editing an OLD recipie");
      $http.put('http://138.68.22.10:84/recipes/'+$scope.curRec.recipeid , data, config)
      .then(
        function (response) {
          $scope.responseDetails = "You entered a recipe! Eww!";
          $state.go('viewRecipesState',{},{reload:true});
        },
        function (response) {
          $scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
      });

  }
}]);
