angular.module('starvingToday').controller('userController' , ['$scope' , '$http' , function($scope,$http)
{

  $scope.setUserFirstName = function(firstname){
    $scope.firstname = firstname;
  };
  $scope.setUserLastName = function(lastname){
    $scope.lastname = lastname;
  };
  $scope.setUsername = function(username){
    $scope.username = username;
  };
  $scope.setUserID = function(userid){
    $scope.userid = userid;
  };
  $scope.setUserEmail = function(useremail){
    $scope.useremail = useremail;
  };

}]);
