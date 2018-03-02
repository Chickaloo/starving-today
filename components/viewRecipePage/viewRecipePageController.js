angular.module('starvingToday').controller('viewRecipeController', ['$scope', '$http', '$state', '$sce', 'dataRecipe', 'dataUser', function($scope, $http, $state, $sce, dataRecipe, dataUser)
{

    console.log("Loaded into view");

    $scope.recipe = dataRecipe.getCurrRecipe();
    $scope.recipe.recipeinstructions = $sce.trustAsHtml($scope.recipe.recipeinstructions);
    $scope.recipelen = dataRecipe.getRecipeLength();
    $scope.user = dataUser.user;
    console.log($scope.recipe);

    $http.get('http://138.68.22.10:84/comments/recipe/' + $scope.recipe.recipeid).then(
      function (response) {
          var temp = [];
          if (typeof response.data.comments !== "undefined") {
            Object.keys(response.data.comments).forEach(function(key) {
              $http.get('http://138.68.22.10:84/users/id/' + response.data.comments[key].userid).then(
                function (res) {
                  console.log(res.data.user.firstname + " " + res.data.user.lastname);
                  response.data.comments[key].authorname = res.data.user.firstname + " " + res.data.user.lastname;
                },
                function (res) {
                    $scope.comments = 0;
              });
              temp.push(response.data.comments[key]);
            });
            $scope.comments = temp.reverse();
          }
      },
      function (response) {
          $scope.comments = 0;
    });

    $scope.Comment = function() {
        var comment_data = {
            comment: $scope.comment.body,
            recipeid: $scope.recipe.recipeid,
            userid: $scope.user.userid,
            posterid: $scope.user.userid
        };

        var data = JSON.stringify(comment_data);

  		var config = {
              withCredentials: 'true',
    			headers : {
    				'Content-Type': 'application/json;charset=UTF-8'
    			}
    		}

        $http.post('http://138.68.22.10:84/comments', data, config)
        .then(function(response) {
          $http.get('http://138.68.22.10:84/comments/recipe/' + $scope.recipe.recipeid).then(
            function (response) {
              console.log(response.data);
                var temp = [];
                Object.keys(response.data.comments).forEach(function(key) {
                  $http.get('http://138.68.22.10:84/users/id/' + response.data.comments[key].userid).then(
                    function (res) {
                      console.log(res.data.user.firstname + " " + res.data.user.lastname);
                      response.data.comments[key].authorname = res.data.user.firstname + " " + res.data.user.lastname;
                    },
                    function (res) {
                        $scope.comments = 0;
                  });
                    temp.push(response.data.comments[key]);
                });
                $scope.comments = temp.reverse();
            },
            function (response) {
                $scope.comments = 0;
          });
        });
    }

    $scope.DeleteComment = function(value) {


      $http.delete('http://138.68.22.10:84/comments/' + value)
      .then(function(response) {
        $http.get('http://138.68.22.10:84/comments/recipe/' + $scope.recipe.recipeid).then(
          function (response) {
            console.log(response.data);
              var temp = [];
              Object.keys(response.data.comments).forEach(function(key) {
                $http.get('http://138.68.22.10:84/users/id/' + response.data.comments[key].userid).then(
                  function (res) {
                    console.log(res.data.user.firstname + " " + res.data.user.lastname);
                    response.data.comments[key].authorname = res.data.user.firstname + " " + res.data.user.lastname;
                  },
                  function (res) {
                      $scope.comments = 0;
                });
                  temp.push(response.data.comments[key]);
              });
              $scope.comments = temp.reverse();
          },
          function (response) {
              $scope.comments = 0;
        });
      });
    }

}]);
