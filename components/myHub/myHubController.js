angular.module('starvingToday').controller('myHubController', ['$scope', '$http', '$state', 'dataUser', 'dataRecipe', function($scope, $http, $state, dataUser, dataRecipe)
{
    $scope.user = dataUser.getMyUser();
    $scope.myUser = dataUser.getMyUser();
    $scope.reciperating = 0;

    var config = {
      withCredentials: 'true',
  		headers : {
  			'Content-Type': 'application/json;charset=UTF-8'
  		}
  	}

    $http.get('http://138.68.22.10:84/posts/' + $scope.user.userid).then(
      function (response) {
        var temp = [];
        Object.keys(response.data).forEach(function(key) {
          $http.get('http://138.68.22.10:84/users/id/' + response.data[key].posterid).then(
            function (res) {
              //console.log(res.data.user.firstname + " " + res.data.user.lastname);
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

    $http.get('http://138.68.22.10:84/subscriptions/' + $scope.myUser.userid , config)
    .then(
      function(response){
        $scope.currfriends = response.data;
        $scope.followcount = response.data.length;
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

    $scope.searchForUser = function(value){

    var query = {
      keywords: $scope.searchquery,
      bytag: false,
      byname: false,
      byingredient: false,
      byuserid: true
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
          dataUser.setUsers(response.data.users);
          $scope.searchres = dataUser.getUsers();
          $scope.usercount = dataUser.getUserLength();
          $scope.search = $scope.searchquery;
          $scope.$apply();
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

    $scope.selectUser = function(value){
      $http.get('http://138.68.22.10:84/users/id/' + value).then(
        function(response){
          dataUser.setUser(response.data.user);
          $state.go('yourHub', {}, {reload:true});
        },
        function(response){
          dataRecipe.recipelen = 0;
        });
    }

    $scope.selectRecipe = function(value){
      $http.get('http://138.68.22.10:84/recipes/id/' + value).then(
        function (response) {
          currRecipe = response.data;
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
        posterid: $scope.user.userid,
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
}]);
