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
<<<<<<< HEAD
=======

var app = angular.module("add-recipe-app", []);
app.controller("addRecipeController", function ($scope, $http) {
	$scope.SendData = function () {
	// use $.param jQuery function to serialize data from JSON
		var data = {
			authorid: parseInt($scope.authorid),
			title: $scope.title,
			instructions: $scope.instructions
		};

		var parameter = JSON.stringify(data);

		var config = {
			headers : {
				'Content-Type': 'application/json;charset=utf-8'
			}
		}

		$http.post('http://138.68.22.10:81/api/recipes', parameter, config)
		.success(function (data, status, headers, config) {
			$scope.PostDataResponse = data;
		})
		.error(function (data, status, header, config) {
			$scope.ResponseDetails = "Data: " + data +
				"<hr />status: " + status +
				"<hr />headers: " + header +
				"<hr />config: " + config;
		});
	};
});

angular.module('starvingToday').controller('statsController', ['$scope', '$http', function($scope, $http)
{
    $http.get('http://138.68.22.10:84/stats')
    .then(function (response) {
        $scope.recipeCount = response.data.recipecount;
			$scope.userCount = response.data.usercount;});
}]);
>>>>>>> 05146912f24208f88ac4ad5612d661463a0b084f
