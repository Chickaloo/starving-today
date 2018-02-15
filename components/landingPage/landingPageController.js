angular.module('starvingToday').controller('landingController', ['$scope', '$http', function($scope, $http)
{
	$scope.SendData = function() {
		var user_data = {
			username: $scope.username,
			password: $scope.password,
			email: $scope.email
		};

		var data = JSON.stringify(user_data);

		var config = {
			headers : {
				'Content-Type': 'application/json;charset=utf-8'
			}
		}

		$http.post('http://138.68.22.10:84/users', data, config)
		.then(
			function (response) {
				$scope.responseDetails = "Successful Sign Up!" + response.status;
			},
			function (response) {
				if (response.status === 500) {
						$scope.responseDetails = "internal server error: " + response.status;
				} else if(response.status === 400){
						$scope.responseDetails = "bad request: " + response.status;
				}else {
						$scope.responseDetails = "internal server error: " + response.status;
				}

		});
	}
}]);

angular.module('starvingToday').controller('loginController', ['$scope', '$http', function($scope, $http)
{
	$scope.SendData = function() {
		var user_data = {
			username: $scope.username,
			password: $scope.password
		};

		var data = JSON.stringify(user_data);

		var config = {
			headers : {
				'Content-Type': 'application/json;charset=utf-8'
			}
		}

		$http.post('http://138.68.22.10:84/users', data, config)
		.then(
			function (response) {
				$scope.responseDetails = "Successful Sign Up!" + response.status;
			},
			function (response) {
				if (response.status === 500) {
						$scope.responseDetails = "internal server error: " + response.status;
				} else if(response.status === 400){
						$scope.responseDetails = "bad request: " + response.status;
				} else if(response.status === 404){
						$scope.responseDetails = "not found: " + response.status;
				} else {
						$scope.responseDetails = "internal server error: " + response.status;
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
