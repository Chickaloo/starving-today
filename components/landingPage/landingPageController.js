angular.module('starvingToday').controller('landingController', ['$scope', '$http', function($scope, $http){
	$scope.SendData = function() {
		var user_data = {
			username: $scope.username,
			password: $scope.password,
			email: $scope.email
		};

		var parameter = JSON.stringify(user_data);

		var config = {
			headers : {
				'Content-Type': 'application/json;charset=utf-8'
			}
		}

		$http.post('http://138.68.22.10:84/users', parameter, config)
		.success(function (data, status, headers, config) {
			$scope.postDataResponse = status;
		})
		.error(function (data, status, header, config) {
			$scope.responseDetails = status;
				/*
				"Data: " + data +
				"<hr />status: " + status +
				"<hr />headers: " + header +
				"<hr />config: " + config;*/
		});
	}
}]);
