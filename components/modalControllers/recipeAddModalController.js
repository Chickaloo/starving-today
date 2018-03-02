angular.module('starvingToday').controller('recipeAddModalController' , ['$scope' , '$http' , '$state' , 'dataUser' , 'dataRecipe', function($scope , $http , $state, dataUser , dataRecipe)
{
  $scope.user = dataUser.user;

  $scope.UpdateRecipe = function() {
    if ($scope.user.userid === 0) {
      $scope.responseDetails = "not logged in!";
      return 1;
    }

    var recipe_data = {
      userid: parseInt($scope.user.userid),
      recipename: $scope.recipename,
      recipedescription: $scope.recipedescription,
      recipeinstructions: $scope.recipeinstructions,
      imageurl: $scope.imageurl,
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
        var post_data = {
          posterid: $scope.user.userid,
          userid: $scope.user.userid,
          title: "New Recipe! " + recipe_data.recipename,
          content: recipe_data.recipedescription
        };

        var data = JSON.stringify(post_data);

        var config = {
          headers : {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
        $http.post('http://138.68.22.10:84/posts', data, config)
        .then(
          function (response) {
            $http.get('http://138.68.22.10:84/posts/' + $scope.user.userid).then(
              function (response) {
                var temp = [];
                Object.keys(response.data).forEach(function(key) {
                    temp.push(response.data[key]);
                });
                $scope.userPosts = temp.reverse();

                $state.go('myHub',{},{reload:true});
              },
              function (response) {
                userPosts = 0;
            });
          },
          function (response) {
            if (response.status === 500) {
                $scope.responseDetails = "Something went wrong with our servers!";
            } else if(response.status === 400){
                $scope.responseDetails = "The input was invalid. Please try again.";
            } else if(response.status === 404){
                $scope.responseDetails = "The entered username and password combination was not found.";
            } else {
                $scope.responseDetails = "Oops! Something went wrong! Please try signing in again.";
            }
        });
      },
      function (response) {
        $scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
    });
  }
}]);
