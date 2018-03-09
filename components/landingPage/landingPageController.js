angular.module('starvingToday').controller('landingController', ['$scope', '$http', 'dataUser', function($scope, $http, dataUser)
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
			//firstname: $scope.fullname,
			username: $scope.rusername,
			password: $scope.rpassword,
			password2: $scope.password2,
			//email: $scope.email
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

					$http.post('http://138.68.22.10:84/users/login', data, config)
					.then(
						function (response) {
							if(response.data.user.userid > 0){
								dataUser.setMyUser(response.data.user);
								$scope.changeAuth(true);
							}


						},
						function (response) {
							if (response.status === 500) {
									$scope.responseDetails = "Something went wrong with our servers!";
							} else if(response.status === 400){
									$scope.responseDetails = "Login after signup failed.";
							} else if(response.status === 404){
									$scope.responseDetails = "Account not properly created.";
							} else {
									$scope.responseDetails = "Everything is broken. Please abandon ship.";
							}
					});
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
					dataUser.setMyUser(response.data.user);
					$scope.changeAuth(true);
				}
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
