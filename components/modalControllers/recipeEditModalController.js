angular.module('starvingToday').controller('recipeEditModalController' , ['$scope' , '$http' , '$state' , 'dataUser' , 'dataRecipe', function($scope , $http , $state, dataUser , dataRecipe)
{
  $scope.user = dataUser.user;
  $scope.curRec;
  console.log("recipeModalController: dataUser: " + $scope.user.username);
  // $scope.OpenModal = function(){
    $scope.rec = dataRecipe.getCurrRecipe();
    console.log("print");
    console.log($scope.rec.recipeid);
    $http.get('http://138.68.22.10:84/recipes/id/' + $scope.rec.recipeid).then(
      function (response) {
        $scope.curRec = response.data;
        console.log("print");
        console.log($scope.curRec);
        dataRecipe.recipelen = 1;
      },
      function (response) {
        dataRecipe.recipelen = 0;
    });

  $scope.UpdateRecipe = function() {
    if ($scope.user.userid === 0) {
      $scope.responseDetails = "not logged in!";
      console.log($scope.responseDetails);
      return 1;
    }

    var recipe_data = {
      recipename: $scope.curRec.recipename,
      recipedescription: $scope.curRec.recipedescription,
      recipeinstructions: $scope.curRec.recipeinstructions,
      imageurl: $scope.curRec.imageurl,
      calories: parseInt($scope.curRec.calories),
      preptime: parseInt($scope.curRec.preptime),
      cooktime: parseInt($scope.curRec.cooktime),
      servings: parseInt($scope.curRec.servings),
      tags: $scope.curRec.tags,
      ingredients: $scope.curRec.ingredients
    };

    var data = JSON.stringify(recipe_data);

    var config = {
      headers : {
        'Content-Type': 'application/json;charset=utf-8'
      }
    }

    $http.put('http://138.68.22.10:84/recipes/'+$scope.curRec.recipeid , data, config)
    .then(
      function (response) {
        $scope.responseDetails = "You entered a recipe! Eww!";
        dataRecipe.setCurrRecipe(recipe_data);
        $state.reload()
      },
      function (response) {
        $scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
    });

  }
}]);
