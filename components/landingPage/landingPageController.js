

angular.module('starvingToday').controller('landingController', ['$scope', '$http', function($scope, $http)
{
	$scope.SendData = function() {
		var user_data = {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		};

		var data = JSON.stringify(user_data);

		var config = {
			headers : {
				'Content-Type': 'application/json;charset=utf-8'
			}
		}
		if($scope.password === $scope.password2){
		$http.post('http://138.68.22.10:84/users', data, config)
		.then(
			function (response) {
				$scope.successInstructions = "Congratulations! Your sign up was successful. Please sign in now.";

			},
			function (response) {
				if (response.status === 500) {
						$scope.responseDetails = "It seems this user already exists! Please sign in or try a different username.";
				} else if(response.status === 400){
						$scope.responseDetails = "Oops! Something went wrong! Please try signing up again.";
				}else {
						$scope.responseDetails = "Oops! Something went wrong! Please try signing up again.";
				}

		});
	}else{
		$scope.responseDetails = "Your passwords don't match! Please try again!"
	}

	}
}]);

angular.module('starvingToday').controller('loginController', ['$scope', '$http', function($scope, $http)
{
	$scope.SendData = function() {
		var user_data = {
			username: $scope.username,
			password: $scope.password
		};

		var auth = false;

		var data = JSON.stringify(user_data);

		var config = {
			headers : {
				'Content-Type': 'application/json;charset=utf-8'
			}
		}

		$http.post('http://138.68.22.10:84/users/login', data, config)
		.then(
			function (response) {
				if(response.data.user.userid > 0){
					$scope.changeAuth(true);
				}
				$scope.userid = response.data.user.userid;
				$scope.username = response.data.user.username;
			},
			function (response) {
				if (response.status === 500) {
						$scope.responseDetails = "Please double check your username and passord!";
				} else if(response.status === 400){
						$scope.responseDetails = "Please double check your username and passord!";
				} else if(response.status === 404){
						$scope.responseDetails = "Please double check your username and passord!";
				} else {
						$scope.responseDetails = "Oops! Something went wrong! Please try signing in again.";
				}

		});
	}
}]);

angular.module('starvingToday').controller('statsController', ['$scope', '$http', function($scope, $http)
{
    $http.get('http://138.68.22.10:84/stats')
    .then(function (response) {
        $scope.recipeCount = response.data.recipecount;
				$scope.userCount = response.data.usercount;
		});
}]);
