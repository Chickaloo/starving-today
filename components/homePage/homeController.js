angular.module('starvingToday').controller('homeController', ['$scope', '$http', '$state', 'dataUser', 'dataRecipe', function($scope, $http, $state, dataUser, dataRecipe)
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
          $http.get('http://138.68.22.10:84/recipes/id/184').then(
            function(response){
                $scope.caro1 = response.data;
            }
          )

          $http.get('http://138.68.22.10:84/recipes/id/173').then(
            function(response){
                $scope.caro2 = response.data;
            }
          )

          $http.get('http://138.68.22.10:84/recipes/id/190').then(
            function(response){
                $scope.caro3 = response.data;
            }
          )
          $scope.viewRecipe = function(value){
            $http.get('http://138.68.22.10:84/recipes/id/' + value).then(
              function (response) {
                currRecipe = response.data;
                dataRecipe.setCurrRecipe(currRecipe);
                dataRecipe.recipelen = 1;
                $state.go('viewRecipesState', {}, {reload: true});
              },
              function (response) {
                dataRecipe.recipelen = 0;
            });
          }

}]);
