angular.module('starvingToday').controller('landingController', ['$scope', '$http', function($scope, $http)
{
	$http.get('http://138.68.22.10:84/stats')
	.then(function (response) {
			$scope.recipeCount = response.data.recipecount;
			$scope.userCount = response.data.usercount;
	},function (response) {
		if (response.status === 500) {
				$scope.responseDetails = "Please double check your username and password!";
		} else if(response.status === 400){
				$scope.responseDetails = "Please double check your username and password!";
		} else if(response.status === 404){
				$scope.responseDetails = "Please double check your username and password!";
		} else {
				$scope.responseDetails = "Oops! Something went wrong! Please try signing in again.";
		}
	});

	$scope.Register = function() {
		var user_data = {
			lastname: $scope.lastname,
			username: $scope.rusername,
			password: $scope.rpassword,
			password2: $scope.password2,
			email: $scope.email
		};

		var data = JSON.stringify(user_data);

		var config = {
  			headers : {
  				'Content-Type': 'application/json;charset=UTF-8'
  			}
  		}

		if($scope.rpassword === $scope.password2){
			$http.post('http://138.68.22.10:84/users', data, config)
			.then(
				function (response) {
					//if(response.data.user.userid > 0){
					$scope.changeAuth(true);
					//}
					$scope.setUserID(response.data.user.userid);
					$scope.setUsername($scope.username);
					$scope.setUserFirstName($scope.firstname);
					$scope.setUserLastName($scope.lastname);
					$scope.setUserEmail($scope.email);
				},
				function (response) {
					if (response.status === 500) {
							$scope.responseDetails = "It seems this user already exists! Please sign in or try a different username.";
					} else if(response.status === 400){
							$scope.responseDetails = "Invalid input. Please retry.";
					}else {
							$scope.responseDetails = "Something went wrong; Please try signing up again.";
					}

			});
		}else{
			$scope.responseDetails = "Your passwords don't match! Please try again!";
		}

	}

	$scope.Login = function() {
		var user_data = {
			username: $scope.username,
			password: $scope.password
		};

		var auth = false;

		var data = JSON.stringify(user_data);

		var config = {
        withCredentials: 'true',
  			headers : {
  				'Content-Type': 'application/json;charset=UTF-8'
  			}
  		}

		$http.post('http://138.68.22.10:84/users/login', data, config)
		.then(
			function (response) {
				if(response.data.user.userid > 0){
					$scope.changeAuth(true);
				}
				$scope.setUserID(response.data.user.userid);
				$scope.setUsername($scope.username);
				$scope.setUserFirstName(response.data.user.firstname);
				$scope.setUserLastName(response.data.user.lastname);
				$scope.setUserEmail(response.data.user.email);
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
