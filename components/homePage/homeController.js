angular.module('starvingToday').controller('homeController', ['$scope', '$http', '$state', 'dataUser', function($scope, $http, $state, dataUser)
{
  $scope.getYourHub = function(value) {
    $http.get('http://138.68.22.10:84/users/id/' + value).then(
      function(response){
        dataUser.user = response.data.user;
      },
      function(response){
        dataUser.user = {};
      });
    $state.go('yourHub','',{reload:true});
  }


    $http.get('http://138.68.22.10:84/recipes/id/20').then(
      function(response){
          $scope.Favorite = response.data;
      }
    )

    $http.get('http://138.68.22.10:84/recipes/id/9').then(
      function(response){
          $scope.Highest = response.data;
      }
    )

    $http.get('http://138.68.22.10:84/recipes/id/184').then(
      function(response){
          $scope.TeamFav = response.data;
      }
    )

}]);
