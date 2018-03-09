angular.module('starvingToday').controller('friendViewerModalController',['$scope' , '$http' , 'dataUser' , function($scope , $http , dataUser){

  var config = {
      withCredentials: 'true',
      headers : {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }

  $http.get('http://138.68.22.10:84/subscriptions/' + dataUser.user.userid , config)
  .then(
    function(response){
      $scope.userfriends = response.data;
      console.log($scope.userfriends);
    },
    function(response){
      if (response.status === 500) {
          $scope.responseDetails = "Something went wrong with our servers!";
      } else if(response.status === 400){
          $scope.responseDetails = "The input was invalid. Please try again.";
      } else if(response.status === 404){
          $scope.responseDetails = "No recipes were found.";
      } else {
          $scope.responseDetails = "Something broke!";
      }
    }
  );

  $scope.searchForUser = function(value){
    $http.get('http://138.68.22.10:84/users/username/'+value)
    .then(
      function(response){

      },
      function(response){

      }
    )
  }
}]);
