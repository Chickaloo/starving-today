angular.module('starvingToday').controller('yourHubController', ['$scope', '$http', '$state', 'dataUser', 'dataRecipe', function($scope, $http, $state, dataUser, dataRecipe)
{
    $scope.user = dataUser.getUser();
    $scope.myUser = dataUser.getMyUser();
    $scope.followcount = 0;
    $scope.recipecount = 0;
    $scope.reciperating = 0;

    $http.get('http://138.68.22.10:84/subscriptions/' + $scope.user.userid , config)
    .then(
      function(response){
        if (!angular.isObject(response.data)) {
          $scope.followcount = response.data.length;
          console.log(response.data.length);
        }
      },
      function(response){
        if (response.status === 500) {
            $scope.responseDetails = "Something went wrong with our servers!";
        } else if(response.status === 400){
            $scope.responseDetails = "The input was invalid. Please try again.";
        } else if(response.status === 404){
            $scope.responseDetails = "No recipes were found.";
        } else {
            $scope.responseDetails = "Something broke!";
        }
      }
    );

    $http.get('http://138.68.22.10:84/posts/' + $scope.user.userid).then(
      function (response) {
          var temp = [];
          Object.keys(response.data).forEach(function(key) {
            $http.get('http://138.68.22.10:84/users/id/' + response.data[key].posterid).then(
              function (res) {
                // console.log(res.data.user.firstname + " " + res.data.user.lastname);
                response.data[key].authorname = res.data.user.firstname + " " + res.data.user.lastname;
              },
              function (res) {
                $scope.comments = 0;
            });
            temp.push(response.data[key]);
          });
          $scope.userPosts = temp.reverse();
      },
      function (response) {
        userPosts = 0;
    });

		var config = {
        withCredentials: 'true',
  			headers : {
  				'Content-Type': 'application/json;charset=UTF-8'
  			}
  		}

		$http.get('http://138.68.22.10:84/recipes/user/'+$scope.user.userid, config)
		.then(
			function (response) {
          if(typeof response.data.recipes !== "undefined"){
            $scope.userrecipes = response.data.recipes;
            $scope.recipecount = Object.keys($scope.userrecipes).length;
            angular.forEach($scope.userrecipes, function(value, key){
              $scope.reciperating = $scope.reciperating + value.upvotes - value.downvotes;
            });
          }
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

    $scope.selectRecipe = function(value){
      $http.get('http://138.68.22.10:84/recipes/id/' + value).then(
        function (response) {
          currRecipe = response.data;
          console.log("retrieved this recipe:");
          console.log(currRecipe);
          dataRecipe.setCurrRecipe(currRecipe);
          dataRecipe.recipelen = 1;
            $state.go('viewRecipesState', {}, {reload: true});
        },
        function (response) {
          dataRecipe.recipelen = 0;
      });
    }

    $scope.MakePost = function(){

      var post_data = {
        posterid: $scope.myUser.userid,
        userid: $scope.user.userid,
        title: $scope.posttitle,
        content: $scope.postcontent
      };

      var data = JSON.stringify(post_data);

      var config = {
          withCredentials: 'true',
          headers : {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }

      $http.post('http://138.68.22.10:84/posts', data, config)
      .then(
        function (response) {
          $http.get('http://138.68.22.10:84/posts/' + $scope.user.userid).then(
            function (response) {
              var temp = [];
              Object.keys(response.data).forEach(function(key) {
                $http.get('http://138.68.22.10:84/users/id/' + response.data[key].posterid).then(
                  function (res) {
                    // console.log(res.data.user.firstname + " " + res.data.user.lastname);
                    response.data[key].authorname = res.data.user.firstname + " " + res.data.user.lastname;
                  },
                  function (res) {
                    $scope.comments = 0;
                });
                temp.push(response.data[key]);
              });
              $scope.userPosts = temp.reverse();
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
    }

    $scope.DeletePost = function(value){

      var config = {
          withCredentials: 'true',
          headers : {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }

      $http.delete('http://138.68.22.10:84/posts/' + value, config)
      .then(
        function (response) {
          $http.get('http://138.68.22.10:84/posts/' + $scope.user.userid).then(
            function (response) {
              var temp = [];
              Object.keys(response.data).forEach(function(key) {
                  temp.push(response.data[key]);
              });
              $scope.userPosts = temp.reverse();
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
    }

    $scope.AddFriend = function(){

      var post_data = {
        subid: $scope.myUser.userid,
        followid: $scope.user.userid
      };

      var data = JSON.stringify(post_data);

      var config = {
          withCredentials: 'true',
          headers : {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }

      $http.post('http://138.68.22.10:84/subscriptions', data, config)
      .then(
        function (response) {
            alert("Subscription successful");
        },
        function (response) {
            alert("User is already your friend");
      });

    }
}]);
