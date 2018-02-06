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