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
    $scope.userid = parseInt(userid);
  };

  $scope.setUserEmail = function(useremail){
    $scope.useremail = useremail;
  };

}]);
angular.module('starvingToday').factory('dataUser', ['$http', function ($http) {
    var dataUser = {};
    var user;

    dataUser.getUser = function (userid) {
        return $http.get('http://138.68.22.10:84/users/id/' + userid);
    };

    dataUser.searchUser = function () {
        return $http.get('http://138.68.22.10:84/recipe/user/' + userid)
    };

    dataUser.pushUser = function(value) {
        dataUser.push(value);
    };

    dataUser.popUser = function() {
        dataUser.pop();
    };

    return {
      setUser: function(user){
          this.user = user;
      }
    }

}]);
