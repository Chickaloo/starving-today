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
}]);
