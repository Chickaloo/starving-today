angular.module('starvingToday').controller('myHubController', ['$scope', '$http', 'dataUser', function($scope, $http, dataUser)
{
    $scope.user = dataUser.user;
    $scope.tempuser = dataUser.user;
}]);
