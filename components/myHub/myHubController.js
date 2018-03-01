angular.module('starvingToday').controller('myHubController', ['$scope', '$http', 'dataUser', function($scope, $http, dataUser)
{
    $scope.user = dataUser.user;
    $scope.fullname = dataUser.user.firstname + " " + dataUser.user.lastname;
    $scope.bio = dataUser.user.bio + " ";

    $scope.updateUser = function(){
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


    //SEARCH BY THIS USER TO POPULATE THEIR RECIPIES


        var query = {
          keywords: "pod",
          bytag: true,
          byname: true,
          byingredient: true,
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
					$scope.usersrecipies = response.data.recipes;
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

}]);
