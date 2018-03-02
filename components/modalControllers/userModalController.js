angular.module('starvingToday').controller('userModalController' , ['$scope' , '$http' , 'dataUser' , function($scope , $http , dataUser)
{
  console.log("IN THIS MODAL");
  //user fields
  $scope.user = dataUser.user;
  $scope.fullname = dataUser.user.firstname + " " + dataUser.user.lastname;
  $scope.bio = dataUser.user.bio + " ";

  //update User
  $scope.UpdateUser = function(){
    var user_data = {
      firstname: $scope.fullname,
      email: $scope.user.email,
      bio: $scope.bio
    };

    var data = JSON.stringify(user_data);

    var config = {
        headers : {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }

    $http.put('http://138.68.22.10:84/users', data, config)
    .then(
      function (response) {
        if (response.status === 200) {
            $scope.responseDetails = "User info updated successfully.";
        }
      },
      function (response) {
        if (response.status === 500) {
            $scope.responseDetails = "Something went wrong with our servers!";
        } else if(response.status === 404){
            $scope.responseDetails = "Account not properly created.";
        } else {
            $scope.responseDetails = "Everything is broken. Please abandon ship.";
        }
    });
  }
}]);
