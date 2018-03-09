angular.module('starvingToday').controller('viewRecipeController', ['$scope', '$http', '$state', '$sce', 'dataRecipe', 'dataUser', function($scope, $http, $state, $sce, dataRecipe, dataUser)
{
    $scope.recipe = dataRecipe.getCurrRecipe();
    //console.log($scope.recipe);
    //console.log($scope.recipe.tags);
    $scope.recipe.recipeinstructions = $sce.trustAsHtml($scope.recipe.recipeinstructions);
    $scope.recipelen = dataRecipe.getRecipeLength();
    $scope.user = dataUser.user;
    //console.log($scope.recipe);

    $http.get('http://138.68.22.10:84/comments/recipe/' + $scope.recipe.recipeid).then(
      function (response) {
          var temp = [];
          if (typeof response.data.comments !== "undefined") {
            Object.keys(response.data.comments).forEach(function(key) {
              $http.get('http://138.68.22.10:84/users/id/' + response.data.comments[key].userid).then(
                function (res) {
                  //console.log(res.data.user.firstname + " " + res.data.user.lastname);
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

    $scope.DeleteRecipe = function() {

      $http.delete('http://138.68.22.10:84/recipes/' + $scope.recipe.recipeid)
      .then(function(response) {
        $state.go('myHub',{},{reload:true});
      });
    }

    $scope.Search = function(tag) {

        var query = {
          keywords: tag,
          bytag: true,
          byname: false,
          byingredient: false,
          byuser: false
        };

        var data = JSON.stringify(query);

  		var config = {
          withCredentials: 'true',
    			headers : {
    				'Content-Type': 'application/json;charset=UTF-8'
    			}
    		}

  		$http.post('http://138.68.22.10:84/search', query, config)
  		.then(
  			function (response) {
            if (typeof response.data.recipes !== "undefined") {
              Object.keys(response.data.recipes).forEach(function(key) {
                $http.get('http://138.68.22.10:84/users/id/' + response.data.recipes[key].userid).then(
                  function (res) {
                    response.data.recipes[key].authorname = res.data.user.firstname + " " + res.data.user.lastname;
                  },
                  function (res) {
                    response.data.recipes[key].authorname = "Unknown";
                });
              });
            }
            dataRecipe.setRecipes(response.data.recipes);
            $scope.recipecount = dataRecipe.getRecipeLength();
            $scope.search = $scope.searchquery;
            $state.go('recipes', {}, {reload:true});
  			},
  			function (response) {
  				if (response.status === 500) {
  						$scope.responseDetails = "Something went wrong with our servers!";
  				} else if(response.status === 400){
  						$scope.responseDetails = "The input was invalid. Please try again.";
  				} else if(response.status === 404){
  						$scope.responseDetails = "No recipes were found.";
  				} else {
  						$scope.responseDetails = "Something broke!";
  				}
  		});
  	}
}]);
