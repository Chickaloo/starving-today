angular.module('starvingToday').controller('headerController', ['$scope', '$http', 'dataUser', function($scope, $http, dataUser)
{
    $scope.user = dataUser.user;

  	$scope.Logout = function() {

        var user_data = {
          username: $scope.username,
          password: $scope.password
        };

        var data = JSON.stringify(user_data);

  		var config = {
          withCredentials: 'true',
    			headers : {
    				'Content-Type': 'application/json;charset=UTF-8'
    			}
    		}

  		$http.post('http://138.68.22.10:84/users/logout', config)
  		.then(
  			function (response) {
					$scope.changeAuth(false);
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
